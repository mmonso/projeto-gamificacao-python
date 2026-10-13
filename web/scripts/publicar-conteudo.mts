// Publica o conteúdo de ../conteudo no banco configurado em DATABASE_URL_MIGRACOES (E04.7).
// Uso: npm run db:publicar
import { join } from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { carregarCurso } from "../src/servidor/conteudo/carregar";
import { publicarCurso } from "../src/servidor/conteudo/publicar";
import * as esquema from "../src/servidor/db/esquema";

const url = process.env.DATABASE_URL_MIGRACOES;
if (!url) throw new Error("DATABASE_URL_MIGRACOES não configurada em .env.local");

const conexao = postgres(url, { max: 1 });
try {
  const curso = carregarCurso(join(import.meta.dirname, "../../conteudo"));
  const relatorio = await publicarCurso(drizzle({ client: conexao, schema: esquema }), curso);
  console.log(`Publicadas: ${relatorio.publicadas.join(", ") || "nenhuma"}`);
  console.log(`Já existentes: ${relatorio.jaExistentes.length}`);
} finally {
  await conexao.end();
}
