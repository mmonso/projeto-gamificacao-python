// Conexão do servidor com o PostgreSQL do Supabase. Só pode ser importada em código de servidor.
import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { configuracao } from "@/servidor/config";
import * as esquema from "./esquema";

function conectar() {
  const { bancoUrl, ambiente } = configuracao();
  // Pooler do Supabase em modo sessão (porta 5432). No modo transação (6543), consultas encadeadas pelo
  // postgres.js na mesma conexão às vezes ficavam sem resposta e a página travava. prepare: false mantém
  // a conexão compatível com os dois modos; conexões ociosas são devolvidas ao pooler depois de 20 s.
  // No modo sessão, cada conexão aberta ocupa uma das 15 do pooler do plano gratuito, e elas são divididas
  // entre o site publicado, o servidor local e os scripts, que usam o mesmo banco. Com mais que isso, chega
  // "max clients reached in session mode". Por isso cada processo abre poucas conexões, devolvidas depois
  // de 10 s paradas; consultas a mais esperam na fila do postgres.js.
  const max = ambiente === "desenvolvimento" ? 4 : 3;
  return drizzle({ client: postgres(bancoUrl, { prepare: false, max, idle_timeout: 10 }), schema: esquema });
}

export type Db = ReturnType<typeof conectar>;

let instancia: Db | undefined;

/** Conexão criada no primeiro uso, para que o build não dependa do banco. */
export function banco(): Db {
  instancia ??= conectar();
  return instancia;
}
