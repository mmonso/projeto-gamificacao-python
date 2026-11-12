// Perfil do aluno (FL-02, cadastro, passo 4). O identificador vem sempre da sessão verificada,
// nunca da requisição (ESPECIFICACAO_MVP, 6.1: autorização explícita nos serviços).
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { dadosIniciaisDoPerfil } from "@/modulos/conta/conta";
import * as t from "@/servidor/db/esquema";
import { registrarEvento } from "@/servidor/eventos";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type Perfil = typeof t.perfis.$inferSelect;

/**
 * Perfil do aluno autenticado. No primeiro acesso, cria o perfil com nome, meta, fuso e aceite
 * dos termos informados no cadastro. Duas requisições simultâneas criam um único perfil.
 * O visitante (login anônimo) ganha um perfil marcado, que a limpeza apaga depois de alguns dias.
 */
export async function obterOuCriarPerfil(db: Db, alunoId: string, metadadosCadastro: unknown, visitante = false): Promise<Perfil> {
  const [existente] = await db.select().from(t.perfis).where(eq(t.perfis.id, alunoId));
  if (existente) return existente;

  const criado = await db
    .insert(t.perfis)
    .values({ id: alunoId, ...dadosIniciaisDoPerfil(metadadosCadastro), visitante })
    .onConflictDoNothing({ target: t.perfis.id })
    .returning({ id: t.perfis.id });
  if (criado.length > 0) await registrarEvento(db, visitante ? "visitante_entrou" : "conta_criada", alunoId);
  const [perfil] = await db.select().from(t.perfis).where(eq(t.perfis.id, alunoId));
  return perfil;
}
