// "Algo errado nesta questão?" (design/MELHORIAS_UX.md, C3): o aluno avisa com um toque, sem texto livre
// (os eventos de produto não guardam o que o aluno escreve, CA-117). Com conta, o evento leva a sessão, e o
// relatório de dificuldade encontra a resposta gravada na submissão.

export const MOTIVOS_REPORTE = ["resposta_certa", "enunciado_confuso", "outro"] as const;
export type MotivoReporte = (typeof MOTIVOS_REPORTE)[number];

export const ROTULO_REPORTE: Record<MotivoReporte, string> = {
  resposta_certa: "Minha resposta estava certa",
  enunciado_confuso: "A pergunta está confusa",
  outro: "Outro problema",
};
