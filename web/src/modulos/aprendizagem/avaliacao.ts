// Avaliação da lição pelo aluno, no resultado: substitui a sessão observada na fase de teste com amigos.
// Só opções de toque, nunca texto livre: os eventos de produto não guardam o que o aluno escreve (CA-117).

export const NIVEIS = ["facil", "na_medida", "dificil"] as const;
export type Nivel = (typeof NIVEIS)[number];

export const MOTIVOS = ["enunciado", "explicacao", "codigo", "ritmo"] as const;
export type Motivo = (typeof MOTIVOS)[number];

export const ROTULO_NIVEL: Record<Nivel, string> = { facil: "Fácil", na_medida: "Na medida", dificil: "Difícil" };

export const ROTULO_MOTIVO: Record<Motivo, string> = {
  enunciado: "Não entendi a pergunta",
  explicacao: "A explicação não ajudou",
  codigo: "O código era difícil de ler",
  ritmo: "Foi rápido demais",
};
