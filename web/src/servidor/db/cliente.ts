// Conexão do servidor com o PostgreSQL do Supabase. Só pode ser importada em código de servidor.
import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./esquema";

function conectar() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada (veja web/.env.example)");
  // Pooler do Supabase em modo sessão (porta 5432). No modo transação (6543), consultas encadeadas pelo
  // postgres.js na mesma conexão às vezes ficavam sem resposta e a página travava. prepare: false mantém
  // a conexão compatível com os dois modos; conexões ociosas são devolvidas ao pooler depois de 20 s.
  return drizzle({ client: postgres(url, { prepare: false, max: 10, idle_timeout: 20 }), schema: esquema });
}

export type Db = ReturnType<typeof conectar>;

let instancia: Db | undefined;

/** Conexão criada no primeiro uso, para que o build não dependa do banco. */
export function banco(): Db {
  instancia ??= conectar();
  return instancia;
}
