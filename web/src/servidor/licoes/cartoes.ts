// Cartões "Conceito novo" entregues junto do exercício (design/ANALISE_UX_GAMIFICACAO.md, seção 5).
// Todo exercício de um conceito com cartão leva o cartão, para o botão "Conceito". O cartão abre sozinho
// (novo = true) só na sessão principal e na demonstração, no exercício em que o conceito aparece pela
// primeira vez e enquanto o aluno ainda não tem estado para ele.
import { and, eq, inArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { CartaoConceito, ExercicioPublico } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";

type Db = Pick<PgDatabase<PgQueryResultHKT, typeof t>, "select">;

/** Quem vê o exercício: a demonstração anônima ou uma sessão (que dá o aluno e o tipo). */
export type ContextoCartao = { demo: true } | { sessaoId: string };

export async function comCartoes<E extends ExercicioPublico | null>(db: Db, publico: E, contexto: ContextoCartao): Promise<E> {
  if (!publico) return publico;
  const [item] = await db.select({ conceitos: t.exercicios.conceitos }).from(t.exercicios).where(eq(t.exercicios.exercicioId, publico.id)).limit(1);
  if (!item?.conceitos.length) return publico;
  const conceitos = await db
    .select({ id: t.conceitos.id, nome: t.conceitos.nome, cartao: t.conceitos.cartao })
    .from(t.conceitos)
    .where(inArray(t.conceitos.id, item.conceitos));
  const comCartao = conceitos.filter((c) => c.cartao !== null);
  if (!comCartao.length) return publico;

  let abreSozinho = new Set<string>();
  if ("demo" in contexto) {
    abreSozinho = new Set(comCartao.map((c) => c.id));
  } else {
    const [sessao] = await db.select({ alunoId: t.sessoes.alunoId, tipo: t.sessoes.tipo }).from(t.sessoes).where(eq(t.sessoes.id, contexto.sessaoId));
    if (sessao?.tipo === "principal") {
      const vistos = await db
        .select({ conceitoId: t.estadoConceitos.conceitoId })
        .from(t.estadoConceitos)
        .where(and(eq(t.estadoConceitos.alunoId, sessao.alunoId), inArray(t.estadoConceitos.conceitoId, comCartao.map((c) => c.id))));
      const jaVistos = new Set(vistos.map((v) => v.conceitoId));
      abreSozinho = new Set(comCartao.filter((c) => !jaVistos.has(c.id)).map((c) => c.id));
    }
  }
  const cartoes: CartaoConceito[] = comCartao.map(({ id, nome, cartao }) => {
    const { primeiro, ...resto } = cartao!;
    return { conceitoId: id, nome, ...resto, novo: primeiro === publico.id && abreSozinho.has(id) };
  });
  return { ...publico, cartoes };
}
