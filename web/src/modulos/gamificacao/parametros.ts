// Parâmetros iniciais (ESPECIFICACAO_MVP.md, seção 4.10). Alterações valem só para eventos futuros.
export const PARAMETROS = {
  xpPrimeiraConclusao: 20,
  xpPratica: 10,
  praticasRecompensadasPorDia: 3,
  coracoesMaximos: 5,
  itensRecuperacao: 5,
  coracoesPorRecuperacao: 2,
  opcoesMeta: [1, 2, 3] as const,
  metaPadrao: 1,
  intervalosRevisao: [1, 3, 7] as const,
  itensRevisaoMin: 5,
  itensRevisaoMax: 8,
  horasExpiracaoPratica: 24,
  fusoPadrao: "America/Sao_Paulo",
} as const;

/** Nomes da meta diária, com o tempo aproximado de cada uma (uma sessão leva cerca de 5 minutos). */
export const NOMES_META: Record<number, { nome: string; tempo: string }> = {
  1: { nome: "Leve", tempo: "cerca de 5 min" },
  2: { nome: "Firme", tempo: "cerca de 10 min" },
  3: { nome: "Intensa", tempo: "cerca de 20 min" },
};

export type TipoSessao = "principal" | "pratica" | "revisao" | "recuperacao";
