// Eventos mínimos de produto (PLANO, seção 16; F-39; E08.6). Guardam só identificadores de lição, exercício,
// conceito e sessão, e resultados como acerto ou número da dica; nunca respostas, e-mails ou nomes (CA-117).
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type NomeEvento =
  | "demonstracao_iniciada"
  | "conta_criada"
  | "licao_iniciada"
  | "sessao_retomada"
  | "exercicio_respondido"
  | "dica_pedida"
  | "licao_concluida"
  | "revisao_concluida";

type Valor = string | number | boolean | null;

export async function registrarEvento(db: Pick<Db, "insert">, nome: NomeEvento, alunoId: string | null, dados: Record<string, Valor> = {}) {
  await db.insert(t.eventosProduto).values({ nome, alunoId, dados });
}
