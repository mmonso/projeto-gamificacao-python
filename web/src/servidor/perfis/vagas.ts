// Contagem de contas com e-mail para o teto do teste (modulos/conta/vagas.ts). Visitantes ficam de fora.
import { count, eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export async function contarContas(db: Db): Promise<number> {
  const [{ n }] = await db.select({ n: count() }).from(t.perfis).where(eq(t.perfis.visitante, false));
  return n;
}
