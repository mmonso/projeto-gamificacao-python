// Nomes dos erros do Python em português simples (design/MELHORIAS_UX.md, A5). O nome em inglês continua
// aparecendo, porque é o que a pessoa vai ver no computador; a tradução vem ao lado, entre parênteses.

const NOMES: Record<string, string> = {
  SyntaxError: "o Python não entendeu a escrita",
  NameError: "nome que o Python não conhece",
  TypeError: "tipos que não combinam",
  ValueError: "valor que não serve",
  IndentationError: "recuo errado",
  IndexError: "posição que não existe",
  ZeroDivisionError: "divisão por zero",
  KeyError: "chave que não existe",
  AttributeError: "o valor não tem esse comando",
};

/** Tradução curta do nome de um erro do Python, ou undefined se não for um erro conhecido. */
export function traduzirErro(nome: string): string | undefined {
  return NOMES[nome];
}

/** "NameError (nome que o Python não conhece)"; sem tradução, só o nome. */
export function erroComTraducao(nome: string): string {
  const t = traduzirErro(nome);
  return t ? `${nome} (${t})` : nome;
}
