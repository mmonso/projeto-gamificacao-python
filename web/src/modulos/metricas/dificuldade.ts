// Relatório de dificuldade dos exercícios (pesquisa do Duolingo, ação 12: fáceis demais ou confusos).
// Regra pura: recebe, por exercício, quantas vezes foi respondido na primeira tentativa, quantas acertaram e o
// tempo mediano de resposta. Sinaliza só com amostra suficiente, para não reagir a dois ou três alunos.

/** Respostas de primeira tentativa mínimas antes de qualquer sinal. */
export const MIN_RESPOSTAS = 10;
/** Taxa de acerto de primeira abaixo da qual o exercício é considerado confuso. */
export const LIMITE_CONFUSO = 0.5;
/** Taxa de acerto de primeira a partir da qual o exercício é considerado fácil demais. */
export const LIMITE_FACIL = 0.95;

export type ResumoExercicio = {
  exercicioId: string;
  respostas: number;
  acertosPrimeira: number;
  /** Mediana do tempo de resposta na primeira tentativa, em ms; nulo quando nenhum envio trouxe tempo. */
  tempoMedianoMs: number | null;
};

export type Sinal = "confuso" | "facil" | null;

export type LinhaDificuldade = ResumoExercicio & { taxa: number; sinal: Sinal };

export function sinalDoExercicio(r: Pick<ResumoExercicio, "respostas" | "acertosPrimeira">): Sinal {
  if (r.respostas < MIN_RESPOSTAS) return null;
  const taxa = r.acertosPrimeira / r.respostas;
  if (taxa < LIMITE_CONFUSO) return "confuso";
  if (taxa >= LIMITE_FACIL) return "facil";
  return null;
}

/** Exercícios com sinal primeiro (confusos, depois fáceis), e os de pior taxa à frente dentro de cada grupo. */
export function ordenarDificuldade(rs: readonly ResumoExercicio[]): LinhaDificuldade[] {
  const ordem: Record<"confuso" | "facil" | "sem", number> = { confuso: 0, facil: 1, sem: 2 };
  return rs
    .map((r) => ({ ...r, taxa: r.respostas ? r.acertosPrimeira / r.respostas : 0, sinal: sinalDoExercicio(r) }))
    .sort((a, b) => ordem[a.sinal ?? "sem"] - ordem[b.sinal ?? "sem"] || a.taxa - b.taxa || a.exercicioId.localeCompare(b.exercicioId));
}
