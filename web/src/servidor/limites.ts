// Limites de frequência no servidor (ESPECIFICACAO_MVP, seção 6; CA-06). A contagem fica no PostgreSQL
// para valer entre instâncias; os endpoints de autenticação usam os limites do Supabase Auth.
import { sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

/**
 * Pedidos por minuto de cada tipo. Uma lição tem cerca de dez exercícios, com dicas e novas tentativas,
 * e uma pessoa raramente passa de vinte pedidos por minuto; os limites só cortam repetição automática.
 */
export const LIMITES = {
  /** Correção, dica e início da demonstração, por endereço. */
  demo: 40,
  /** Respostas, dicas, conclusões, estado da sessão e preferências, por aluno. */
  aluno: 90,
  /** Transferência da demonstração e exportação do histórico, por aluno. */
  raro: 6,
} as const;

/** Conta um pedido na janela de um minuto da chave e diz se ainda está dentro do máximo. Janelas antigas são apagadas aos poucos. */
export async function dentroDoLimite(db: Db, chave: string, maximo: number, agora = new Date()): Promise<boolean> {
  const janela = new Date(Math.floor(agora.getTime() / 60_000) * 60_000);
  const [linha] = await db
    .insert(t.limitesFrequencia)
    .values({ chave, janela, contagem: 1 })
    .onConflictDoUpdate({ target: [t.limitesFrequencia.chave, t.limitesFrequencia.janela], set: { contagem: sql`${t.limitesFrequencia.contagem} + 1` } })
    .returning({ contagem: t.limitesFrequencia.contagem });
  if (Math.random() < 0.02) await db.delete(t.limitesFrequencia).where(sql`${t.limitesFrequencia.janela} < ${new Date(agora.getTime() - 3_600_000)}`);
  return linha.contagem <= maximo;
}
