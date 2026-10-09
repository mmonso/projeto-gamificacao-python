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

export type TipoSessao = "principal" | "pratica" | "revisao" | "recuperacao";
