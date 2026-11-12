// Estado de cada aluno no dia (painel diário da pesquisa do Duolingo, ação 2: novo, corrente, reativado, em risco).
// Regra pura: recebe o dia de entrada e os dias com estudo (AAAA-MM-DD, no fuso do aluno) e o dia de referência.
// Dias depois da referência são ignorados, então o mesmo cálculo serve para "hoje" e para "ontem".

import type { AlunoCoorte } from "./retencao";

export type Estado = "novo" | "corrente" | "reativado" | "em_risco" | "inativo";

export const ESTADOS: readonly Estado[] = ["novo", "corrente", "reativado", "em_risco", "inativo"];

/** Quanto tempo sem estudar, em dias, para o aluno deixar de estar em risco. */
export const DIAS_PARA_INATIVO = 7;
/** Uma folga de até um dia dentro da mesma sequência de estudo não conta como pausa. */
const MAX_ENTRE_DIAS_DO_MESMO_CICLO = 2;
/** Pausa mínima antes de voltar para contar como "reativado". */
const PAUSA_PARA_REATIVADO = 7;
/** Conta criada há menos dias que isso ainda é "novo", mesmo sem estudar. */
const DIAS_DE_NOVO = 7;

const DIA_MS = 86_400_000;

/** Diferença em dias entre dois dias AAAA-MM-DD (b − a). */
export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / DIA_MS);
}

export function estadoDoAluno(aluno: AlunoCoorte, hoje: string): Estado {
  if (diasEntre(aluno.dia0, hoje) < DIAS_DE_NOVO) return "novo";
  const ativos = [...new Set(aluno.diasAtivos)].filter((d) => d <= hoje).sort();
  if (ativos.length === 0) return "inativo";

  const falta = diasEntre(ativos[ativos.length - 1], hoje);
  if (falta >= DIAS_PARA_INATIVO) return "inativo";
  if (falta >= 2) return "em_risco";

  // Estudou hoje ou ontem: é corrente, a menos que tenha voltado depois de uma pausa longa.
  let inicio = ativos.length - 1;
  while (inicio > 0 && diasEntre(ativos[inicio - 1], ativos[inicio]) <= MAX_ENTRE_DIAS_DO_MESMO_CICLO) inicio--;
  if (inicio > 0 && diasEntre(ativos[inicio - 1], ativos[inicio]) >= PAUSA_PARA_REATIVADO) return "reativado";
  return "corrente";
}

export type PainelDiario = Record<Estado, number> & { total: number };

export function painelDoDia(alunos: readonly AlunoCoorte[], hoje: string): PainelDiario {
  const painel: PainelDiario = { novo: 0, corrente: 0, reativado: 0, em_risco: 0, inativo: 0, total: alunos.length };
  for (const a of alunos) painel[estadoDoAluno(a, hoje)]++;
  return painel;
}

/**
 * Retenção de correntes: dos alunos ativos ontem (corrente ou reativado), quantos estudaram hoje.
 * Diz se a sequência de estudo está se mantendo no dia a dia.
 */
export function retencaoDeCorrentes(alunos: readonly AlunoCoorte[], hoje: string): { base: number; mantidos: number; taxa: number | null } {
  const ontem = new Date(Date.parse(`${hoje}T00:00:00Z`) - DIA_MS).toISOString().slice(0, 10);
  const base = alunos.filter((a) => {
    const e = estadoDoAluno(a, ontem);
    return e === "corrente" || e === "reativado";
  });
  const mantidos = base.filter((a) => a.diasAtivos.includes(hoje)).length;
  return { base: base.length, mantidos, taxa: base.length ? mantidos / base.length : null };
}
