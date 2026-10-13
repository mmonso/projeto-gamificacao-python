// Conexão do servidor com o PostgreSQL do Supabase. Só pode ser importada em código de servidor.
import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as esquema from "./esquema";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada (veja web/.env.example)");

// O pooler em modo transação não aceita prepared statements.
const conexao = postgres(url, { prepare: false, max: 5 });

export const db = drizzle({ client: conexao, schema: esquema });
export type Db = typeof db;
