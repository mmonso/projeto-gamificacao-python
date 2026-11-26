// Caderno de conceitos (design/MELHORIAS_UX.md, D1): o aluno consulta qualquer cartão de conceito, com o
// "Entenda melhor", fora da lição. Os conceitos que ele já viu ficam abertos; os outros aparecem com a lição
// em que estreiam, como um índice do que vem pela frente.
import { asc, eq, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { CartaoConceito } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";

type Db = Pick<PgDatabase<PgQueryResultHKT, typeof t>, "select">;

export type ItemCaderno = { id: string; nome: string; descricao: string; visto: boolean; licaoTitulo: string | null };
export type UnidadeCaderno = { id: string; ordem: number; titulo: string; conceitos: ItemCaderno[] };

/** Índice do caderno, por unidade, na ordem em que os conceitos estreiam na trilha. */
export async function cadernoDoAluno(db: Db, alunoId: string): Promise<UnidadeCaderno[]> {
  const linhas = await db
    .select({
      id: t.conceitos.id,
      nome: t.conceitos.nome,
      descricao: t.conceitos.descricao,
      primeiro: sql<string | null>`${t.conceitos.cartao}->>'primeiro'`,
      unidadeId: t.unidades.id,
      unidadeOrdem: t.unidades.ordem,
      unidadeTitulo: t.unidades.titulo,
      visto: sql<boolean>`exists (select 1 from ${t.estadoConceitos} e where e.aluno_id = ${alunoId} and e.conceito_id = ${t.conceitos.id})`,
    })
    .from(t.conceitos)
    .innerJoin(t.unidades, eq(t.unidades.id, t.conceitos.unidadeId))
    .orderBy(asc(t.unidades.ordem), sql`${t.conceitos.cartao}->>'primeiro'`);
  const licoes = await db.select({ id: t.licoes.id, titulo: t.licoes.titulo }).from(t.licoes);
  const tituloDa = new Map(licoes.map((l) => [l.id, l.titulo]));

  const unidades = new Map<string, UnidadeCaderno>();
  for (const l of linhas) {
    const u = unidades.get(l.unidadeId) ?? { id: l.unidadeId, ordem: l.unidadeOrdem, titulo: l.unidadeTitulo, conceitos: [] };
    unidades.set(l.unidadeId, u);
    const licaoId = l.primeiro?.replace(/-e\d+$/, "") ?? null;
    u.conceitos.push({ id: l.id, nome: l.nome, descricao: l.descricao, visto: l.visto, licaoTitulo: licaoId ? (tituloDa.get(licaoId) ?? null) : null });
  }
  return [...unidades.values()];
}

/** Cartão de um conceito para consulta, já com a saída à vista. Null se o conceito não existe ou não tem cartão. */
export async function cartaoParaConsulta(db: Db, conceitoId: string): Promise<CartaoConceito | null> {
  const [c] = await db.select({ id: t.conceitos.id, nome: t.conceitos.nome, cartao: t.conceitos.cartao }).from(t.conceitos).where(eq(t.conceitos.id, conceitoId));
  if (!c?.cartao) return null;
  const { regra, exemplo, saida, destaque, repare, entenda } = c.cartao;
  return { conceitoId: c.id, nome: c.nome, regra, exemplo, saida, destaque, repare, entenda, novo: false };
}
