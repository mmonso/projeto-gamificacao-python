// Frases do feedback, que variam para não repetir sempre a mesma (design/ANALISE_UX_GAMIFICACAO.md, onda 1).
const ACERTO = ["Mandou bem!", "Isso mesmo!", "Perfeito!", "É isso aí!", "Muito bem!", "Certinho!", "Boa!"];
const ERRO = ["Ainda não.", "Quase!", "Não foi dessa vez.", "Vamos de novo."];

/** A partir de quantas respostas certas seguidas o feedback mostra a contagem. */
export const SEGUIDAS_MINIMAS = 3;

/** Título do feedback; `vez` é a ordem do feedback na sessão, para alternar as frases. */
export function tituloDoFeedback(correta: boolean, vez: number): string {
  const lista = correta ? ACERTO : ERRO;
  return lista[((vez % lista.length) + lista.length) % lista.length];
}

/** Texto da contagem de respostas certas seguidas, ou null abaixo do mínimo. */
export function textoSeguidas(seguidas: number): string | null {
  if (seguidas < SEGUIDAS_MINIMAS) return null;
  if (seguidas >= 10) return `${seguidas} seguidas! Imparável!`;
  return `${seguidas} seguidas!`;
}
