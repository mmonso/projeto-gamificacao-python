// Demonstração anônima e transferência para a conta (E06.6; FL-01, FL-02; D-01 a D-04).
// A demonstração é a primeira lição da trilha. A correção anônima não grava progresso e tem limite de
// frequência (CA-06); o gabarito nunca sai do servidor antes da resposta (CA-02).
// A transferência corrige de novo as respostas guardadas no navegador e só registra a conclusão se todas
// estiverem certas (CA-18), uma única vez por conta (CA-19).
import { and, asc, eq, inArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import { solucaoDoGabarito, type ResultadoConclusao, type Solucao } from "@/modulos/aprendizagem/contrato";
import { corrigir, respostaEsquema } from "@/modulos/aprendizagem/corretor";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";
import { comCartoes } from "@/servidor/licoes/cartoes";
import { efetivarConclusao } from "@/servidor/licoes/estudo";
import { ordemDaTrilha, versaoVigente } from "@/servidor/licoes/servico";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type LicaoDemo = { licaoId: string; titulo: string; versaoLicaoId: number; exercicios: ExercicioPublico[] };

/** Lição da demonstração na versão vigente, só com a parte pública dos exercícios (D-01). */
export async function licaoDemo(db: Db): Promise<LicaoDemo | null> {
  const [licaoId] = await ordemDaTrilha(db);
  if (!licaoId) return null;
  const versao = await versaoVigente(db, licaoId);
  if (!versao) return null;
  const [licao] = await db.select({ titulo: t.licoes.titulo }).from(t.licoes).where(eq(t.licoes.id, licaoId));
  const exercicios = await db
    .select({ publico: t.exercicios.publico })
    .from(t.exercicios)
    .where(and(eq(t.exercicios.versaoLicaoId, versao.id), eq(t.exercicios.uso, "principal")))
    .orderBy(asc(t.exercicios.posicao));
  const publicos = await Promise.all(exercicios.map((e) => comCartoes(db, e.publico as ExercicioPublico, { demo: true })));
  return { licaoId, titulo: licao.titulo, versaoLicaoId: versao.id, exercicios: publicos };
}

/**
 * Versão da demonstração indicada pelo navegador: qualquer versão publicada da primeira lição, mesmo que já
 * não seja a vigente, porque a demonstração termina na versão em que começou (FL-01).
 */
async function versaoDaDemo(db: Pick<Db, "select">, versaoLicaoId: number) {
  const [primeira] = await ordemDaTrilha(db);
  const [v] = await db.select({ licaoId: t.versoesLicao.licaoId }).from(t.versoesLicao).where(eq(t.versoesLicao.id, versaoLicaoId));
  return v && v.licaoId === primeira ? primeira : null;
}

async function exercicioDaDemo(db: Pick<Db, "select">, versaoLicaoId: number, exercicioId: string) {
  const [e] = await db
    .select({ dicas: t.exercicios.dicas, gabarito: t.gabaritos.gabarito, explicacao: t.gabaritos.explicacao })
    .from(t.exercicios)
    .innerJoin(t.gabaritos, and(eq(t.gabaritos.versaoLicaoId, t.exercicios.versaoLicaoId), eq(t.gabaritos.exercicioId, t.exercicios.exercicioId)))
    .where(and(eq(t.exercicios.versaoLicaoId, versaoLicaoId), eq(t.exercicios.exercicioId, exercicioId), eq(t.exercicios.uso, "principal")));
  return e ? { ...e, gabarito: e.gabarito as Gabarito } : null;
}

export const pedidoCorrecaoDemo = z.object({
  versaoLicaoId: z.number().int().positive(),
  exercicioId: z.string().min(1).max(40),
  resposta: respostaEsquema,
});

export type CorrecaoDemo = { correta: boolean; solucao: Solucao; explicacao: string; feedbackOpcao?: string };

/** Corrige uma resposta da demonstração sem gravar nada (D-02). Devolve null para exercício que não é dela. */
export async function corrigirDemo(db: Db, pedido: z.infer<typeof pedidoCorrecaoDemo>): Promise<CorrecaoDemo | null> {
  if (!(await versaoDaDemo(db, pedido.versaoLicaoId))) return null;
  const ex = await exercicioDaDemo(db, pedido.versaoLicaoId, pedido.exercicioId);
  if (!ex || ex.gabarito.tipo !== pedido.resposta.tipo) return null;
  const opcao = pedido.resposta.tipo === "escolher_resultado" ? pedido.resposta.opcao : null;
  return {
    correta: corrigir(ex.gabarito, pedido.resposta),
    solucao: solucaoDoGabarito(ex.gabarito),
    explicacao: ex.explicacao,
    feedbackOpcao: ex.gabarito.tipo === "escolher_resultado" && opcao ? ex.gabarito.feedbackOpcoes[opcao] : undefined,
  };
}

export async function dicaDemo(db: Db, versaoLicaoId: number, exercicioId: string, numero: number): Promise<string | null> {
  if (!(await versaoDaDemo(db, versaoLicaoId))) return null;
  return (await exercicioDaDemo(db, versaoLicaoId, exercicioId))?.dicas[numero - 1] ?? null;
}

export const pedidoTransferencia = z.object({
  versaoLicaoId: z.number().int().positive(),
  itens: z
    .array(
      z.object({
        exercicioId: z.string().min(1).max(40),
        /** Última resposta do item, a que o resolveu. */
        resposta: respostaEsquema,
        errouPrimeira: z.boolean(),
        dicas: z.number().int().min(0).max(3),
      }),
    )
    .min(1)
    .max(30),
});

export type ResultadoTransferencia =
  | { resultado: "registrada"; conclusao: ResultadoConclusao }
  | { resultado: "ja_concluida" | "invalida" | "recusada" | "ja_processada" };

/**
 * Transfere a demonstração concluída para a conta (FL-02): corrige de novo cada resposta com o gabarito da
 * versão registrada e, se todas estiverem certas, registra a conclusão da primeira lição com as recompensas
 * normais, no dia local da transferência. Uma única transferência por conta, qualquer que seja o resultado.
 */
export async function transferirDemo(db: Db, alunoId: string, pedido: z.infer<typeof pedidoTransferencia>, agora = new Date()): Promise<ResultadoTransferencia> {
  return db.transaction(async (tx) => {
    // Serializa transferências simultâneas da mesma conta (CA-19).
    await tx.select({ id: t.perfis.id }).from(t.perfis).where(eq(t.perfis.id, alunoId)).for("update");
    const [anterior] = await tx.select().from(t.transferenciasDemo).where(eq(t.transferenciasDemo.alunoId, alunoId));
    if (anterior) return { resultado: "ja_processada" } as const;

    const registrar = (resultado: "registrada" | "recusada" | "invalida" | "ja_concluida") => tx.insert(t.transferenciasDemo).values({ alunoId, resultado });

    const licaoId = await versaoDaDemo(tx, pedido.versaoLicaoId);
    if (!licaoId) {
      await registrar("invalida");
      return { resultado: "invalida" } as const;
    }
    const [jaConcluida] = await tx.select({ licaoId: t.conclusoesLicao.licaoId }).from(t.conclusoesLicao).where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, licaoId)));
    if (jaConcluida) {
      await registrar("ja_concluida");
      return { resultado: "ja_concluida" } as const;
    }

    const principais = await tx
      .select({ id: t.exercicios.exercicioId, posicao: t.exercicios.posicao, gabarito: t.gabaritos.gabarito })
      .from(t.exercicios)
      .innerJoin(t.gabaritos, and(eq(t.gabaritos.versaoLicaoId, t.exercicios.versaoLicaoId), eq(t.gabaritos.exercicioId, t.exercicios.exercicioId)))
      .where(and(eq(t.exercicios.versaoLicaoId, pedido.versaoLicaoId), eq(t.exercicios.uso, "principal")))
      .orderBy(asc(t.exercicios.posicao));
    const enviados = new Map(pedido.itens.map((i) => [i.exercicioId, i]));
    const valida =
      enviados.size === principais.length &&
      pedido.itens.length === principais.length &&
      principais.every((p) => {
        const item = enviados.get(p.id);
        return item !== undefined && corrigir(p.gabarito as Gabarito, item.resposta);
      });
    if (!valida) {
      await registrar("invalida");
      return { resultado: "invalida" } as const;
    }

    // Uma sessão principal aberta da mesma lição deixa de valer: a lição passa a estar concluída.
    await tx
      .update(t.sessoes)
      .set({ estado: "descartada", atualizadoEm: agora })
      .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.licaoId, licaoId), eq(t.sessoes.tipo, "principal"), inArray(t.sessoes.estado, ["aberta", "pausada"])));

    const ids = principais.map((p) => p.id);
    const errados = ids.filter((id) => enviados.get(id)!.errouPrimeira);
    const fila = { fila: [], errados, resolvidos: ids };
    const [sessao] = await tx
      .insert(t.sessoes)
      .values({ alunoId, tipo: "principal", licaoId, versaoLicaoId: pedido.versaoLicaoId, estado: "aberta", fila, totalItens: ids.length, criadoEm: agora, atualizadoEm: agora })
      .returning({ id: t.sessoes.id });
    await tx.insert(t.itensSessao).values(
      principais.map((p) => {
        const item = enviados.get(p.id)!;
        return {
          sessaoId: sessao.id,
          exercicioId: p.id,
          versaoLicaoId: pedido.versaoLicaoId,
          posicaoOriginal: p.posicao,
          tentativas: item.errouPrimeira ? 2 : 1,
          dicasUsadas: item.dicas,
          errouPrimeira: item.errouPrimeira,
          resolvido: true,
        };
      }),
    );
    const conclusao = await efetivarConclusao(tx, alunoId, { id: sessao.id, tipo: "principal", licaoId, fila, totalItens: ids.length }, agora);
    await registrar("registrada");
    return { resultado: "registrada", conclusao } as const;
  });
}

/** A pessoa não quis salvar a demonstração: a lição 1 continua disponível (FL-02). */
export async function recusarDemo(db: Db, alunoId: string) {
  await db.insert(t.transferenciasDemo).values({ alunoId, resultado: "recusada" }).onConflictDoNothing();
}
