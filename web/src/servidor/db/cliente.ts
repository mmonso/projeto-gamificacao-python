// Conexão do servidor com o PostgreSQL do Supabase. Só pode ser importada em código de servidor.
import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./esquema";

function conectar() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada (veja web/.env.example)");
  // O pooler em modo transação não aceita prepared statements.
  return drizzle({ client: postgres(url, { prepare: false, max: 5 }), schema: esquema });
}

export type Db = ReturnType<typeof conectar>;

let instancia: Db | undefined;

/** Conexão criada no primeiro uso, para que o build não dependa do banco. */
export function banco(): Db {
  instancia ??= conectar();
  return instancia;
}
