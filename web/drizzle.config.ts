import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/servidor/db/esquema.ts",
  out: "./drizzle",
  // Migrações usam a conexão de sessão, não o pooler de transações.
  dbCredentials: { url: process.env.DATABASE_URL_MIGRACOES ?? "" },
});
