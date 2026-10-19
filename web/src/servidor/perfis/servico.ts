// Perfil do aluno (FL-02, cadastro, passo 4). O identificador vem sempre da sessão verificada,
// nunca da requisição (ESPECIFICACAO_MVP, 6.1: autorização explícita nos serviços).
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { dadosIniciaisDoPerfil } from "@/modulos/conta/conta";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type Perfil = typeof t.perfis.$inferSelect;

/**
 * Perfil do aluno autenticado. No primeiro acesso, cria o perfil com nome, meta, fuso e aceite
 * dos termos informados no cadastro. Duas requisições simultâneas criam um único perfil.
 */
export async function obterOuCriarPerfil(db: Db, alunoId: string, metadadosCadastro: unknown): Promise<Perfil> {
  const [existente] = await db.select().from(t.perfis).where(eq(t.perfis.id, alunoId));
  if (existente) return existente;

  await db
    .insert(t.perfis)
    .values({ id: alunoId, ...dadosIniciaisDoPerfil(metadadosCadastro) })
    .onConflictDoNothing({ target: t.perfis.id });
  const [criado] = await db.select().from(t.perfis).where(eq(t.perfis.id, alunoId));
  return criado;
}
