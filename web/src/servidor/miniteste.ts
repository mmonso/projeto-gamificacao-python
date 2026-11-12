// Gabarito, correção e registro do mini-teste da unidade 1 (perguntas em modulos/aprendizagem/miniteste.ts).
// O resultado vai para eventos_produto só como números (acertos e total), sem as respostas (CA-117).
// Vale a primeira vez de cada momento: refazer não muda a medida.
import { and, eq, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { PERGUNTAS_MINITESTE, UNIDADE_MINITESTE, type Momento } from "@/modulos/aprendizagem/miniteste";
import * as t from "@/servidor/db/esquema";
import { registrarEvento } from "@/servidor/eventos";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

/** Índice da opção certa de cada pergunta, na ordem de PERGUNTAS_MINITESTE. */
const GABARITO: readonly number[] = [1, 0, 2, 3, 2];

export function corrigirMiniteste(respostas: readonly number[]): number {
  return GABARITO.reduce((soma, certa, i) => soma + (respostas[i] === certa ? 1 : 0), 0);
}

export type EstadoMiniteste = { antes: number | null; depois: number | null; total: number };

export async function estadoMiniteste(db: Pick<Db, "select">, alunoId: string): Promise<EstadoMiniteste> {
  const linhas = await db
    .select({ momento: sql<string>`${t.eventosProduto.dados}->>'momento'`, acertos: sql<number>`(${t.eventosProduto.dados}->>'acertos')::int` })
    .from(t.eventosProduto)
    .where(and(eq(t.eventosProduto.nome, "miniteste_respondido"), eq(t.eventosProduto.alunoId, alunoId), sql`${t.eventosProduto.dados}->>'unidade' = ${UNIDADE_MINITESTE}`))
    .orderBy(t.eventosProduto.criadoEm);
  const primeiro = (m: Momento) => linhas.find((l) => l.momento === m)?.acertos ?? null;
  return { antes: primeiro("antes"), depois: primeiro("depois"), total: PERGUNTAS_MINITESTE.length };
}

export async function registrarMiniteste(db: Db, alunoId: string, momento: Momento, respostas: readonly number[]): Promise<EstadoMiniteste & { acertos: number }> {
  const acertos = corrigirMiniteste(respostas);
  const atual = await estadoMiniteste(db, alunoId);
  if (atual[momento] !== null) return { ...atual, acertos: atual[momento]! };
  await registrarEvento(db, "miniteste_respondido", alunoId, { unidade: UNIDADE_MINITESTE, momento, acertos, total: PERGUNTAS_MINITESTE.length });
  return { ...atual, [momento]: acertos, acertos };
}
