// Publicação de conteúdo (PLANO, seção 12; E04.7). Etapa explícita e idempotente:
// uma versão de lição já publicada nunca é alterada; mudanças exigem nova versão.
import { and, eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { separarExercicio } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";
import type { Curso } from "./carregar";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type RelatorioPublicacao = { publicadas: string[]; jaExistentes: string[] };

export async function publicarCurso(db: Db, curso: Curso): Promise<RelatorioPublicacao> {
  const relatorio: RelatorioPublicacao = { publicadas: [], jaExistentes: [] };
  await db.transaction(async (tx) => {
    for (const { unidade, licoes } of curso) {
      const dadosUnidade = { ordem: unidade.ordem, titulo: unidade.titulo, descricao: unidade.descricao };
      await tx.insert(t.unidades).values({ id: unidade.id, ...dadosUnidade }).onConflictDoUpdate({ target: t.unidades.id, set: dadosUnidade });
      for (const c of unidade.conceitos) {
        const dados = { unidadeId: unidade.id, nome: c.nome, descricao: c.descricao, cartao: c.cartao ?? null };
        await tx.insert(t.conceitos).values({ id: c.id, ...dados }).onConflictDoUpdate({ target: t.conceitos.id, set: dados });
      }
      for (const licao of licoes) {
        const dadosLicao = { unidadeId: unidade.id, ordem: licao.ordem, titulo: licao.titulo, objetivo: licao.objetivo };
        await tx.insert(t.licoes).values({ id: licao.id, ...dadosLicao }).onConflictDoUpdate({ target: t.licoes.id, set: dadosLicao });

        const existente = await tx
          .select({ id: t.versoesLicao.id })
          .from(t.versoesLicao)
          .where(and(eq(t.versoesLicao.licaoId, licao.id), eq(t.versoesLicao.versao, licao.versao)));
        if (existente.length) {
          relatorio.jaExistentes.push(`${licao.id}@${licao.versao}`);
          continue;
        }
        const [versao] = await tx.insert(t.versoesLicao).values({ licaoId: licao.id, versao: licao.versao }).returning({ id: t.versoesLicao.id });
        const itens = [
          ...licao.exercicios.map((ex, i) => ({ ex, uso: "principal" as const, posicao: i + 1 })),
          ...licao.revisao.map((ex, i) => ({ ex, uso: "revisao" as const, posicao: i + 1 })),
        ];
        for (const { ex, uso, posicao } of itens) {
          const partes = separarExercicio(ex);
          await tx.insert(t.exercicios).values({
            versaoLicaoId: versao.id,
            exercicioId: ex.id,
            versao: ex.versao,
            uso,
            posicao,
            tipo: ex.tipo,
            conceitos: ex.conceitos,
            dificuldade: ex.dificuldade,
            variacaoDe: ex.variacao_de ?? null,
            publico: partes.publico,
            dicas: partes.dicas,
          });
          await tx.insert(t.gabaritos).values({ versaoLicaoId: versao.id, exercicioId: ex.id, gabarito: partes.gabarito, explicacao: partes.explicacao });
        }
        relatorio.publicadas.push(`${licao.id}@${licao.versao}`);
      }
    }
  });
  return relatorio;
}
