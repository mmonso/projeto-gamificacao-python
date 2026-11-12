// Texto do resultado de uma lição para compartilhar (WhatsApp ou cópia). Regra pura: não leva nome do aluno,
// nem respostas, nem dados pessoais. Só o título da lição, o placar de primeira e a sequência.

export type ResultadoParaCompartilhar = {
  titulo: string;
  acertosPrimeira: number;
  total: number;
  sequencia: number;
};

export function textoDoResultadoDaLicao(r: ResultadoParaCompartilhar, endereco: string): string {
  const linhas = [`Terminei a lição “${r.titulo}” no Sibi, um curso de Python em português.`];
  linhas.push(`${r.acertosPrimeira} de ${r.total} certas de primeira.`);
  if (r.sequencia > 0) linhas.push(`Sequência de ${r.sequencia} ${r.sequencia === 1 ? "dia" : "dias"}.`);
  linhas.push(`Aprenda também: ${endereco}`);
  return linhas.join("\n");
}
