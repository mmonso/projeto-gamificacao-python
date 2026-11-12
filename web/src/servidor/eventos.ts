// Eventos mínimos de produto (PLANO, seção 16; F-39; E08.6). Guardam só identificadores de lição, exercício,
// conceito e sessão, e resultados como acerto ou número da dica; nunca respostas, e-mails ou nomes (CA-117).
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type NomeEvento =
  | "demonstracao_iniciada"
  | "conta_criada"
  /** Acesso de visitante criado. Visitantes não contam como contas: as métricas de alunos filtram perfis.visitante. */
  | "visitante_entrou"
  | "licao_iniciada"
  | "sessao_retomada"
  | "exercicio_respondido"
  | "dica_pedida"
  | "conceito_aberto"
  /** "Entenda melhor" aberto no cartão do conceito (com ou sem conta). */
  | "entenda_aberto"
  | "licao_concluida"
  | "revisao_concluida"
  /** Desafio do dia, sempre sem aluno: `compartilhado` diz se veio de um link enviado por alguém. */
  | "desafio_iniciado"
  | "desafio_concluido";

type Valor = string | number | boolean | null;

export async function registrarEvento(db: Pick<Db, "insert">, nome: NomeEvento, alunoId: string | null, dados: Record<string, Valor> = {}) {
  await db.insert(t.eventosProduto).values({ nome, alunoId, dados });
}
