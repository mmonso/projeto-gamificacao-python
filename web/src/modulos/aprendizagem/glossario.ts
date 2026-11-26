// Glossário "O que é isso?" (design/MELHORIAS_UX.md, D5): palavras técnicas que se explicam ao toque, no cartão
// do conceito e no feedback, e a página "Palavras do Python". Definições curtas, em português simples.
import { traduzirErro } from "./nomes-de-erro";

export type Termo = { id: string; nome: string; formas: string[]; definicao: string; exemplo?: string };

export const TERMOS: Termo[] = [
  { id: "programa", nome: "Programa", formas: ["programa", "programas"], definicao: "Uma lista de instruções que o computador segue, uma por uma, como uma receita." },
  { id: "codigo", nome: "Código", formas: ["código"], definicao: "O texto do programa, escrito na língua do Python." },
  { id: "saida", nome: "Saída", formas: ["saída"], definicao: "O que aparece na tela quando o programa roda.", exemplo: 'print("Oi") tem a saída Oi' },
  { id: "comando", nome: "Comando", formas: ["comando", "comandos"], definicao: "Uma palavra que o Python entende e executa, como print." },
  { id: "variavel", nome: "Variável", formas: ["variável", "variáveis"], definicao: "Um nome que guarda um valor para usar depois, como uma etiqueta numa caixa.", exemplo: "idade = 30" },
  { id: "valor", nome: "Valor", formas: ["valor", "valores"], definicao: "Um dado que o programa usa: um número, um texto, True ou False, uma lista." },
  { id: "string", nome: "Texto (string)", formas: ["string", "strings"], definicao: "Texto entre aspas. Em inglês, programadores chamam de string.", exemplo: '"Bom dia"' },
  { id: "inteiro", nome: "Número inteiro (int)", formas: ["inteiro", "inteiros", "int"], definicao: "Número sem casas decimais, como 7 ou -3." },
  { id: "decimal", nome: "Número decimal (float)", formas: ["float", "decimal", "decimais"], definicao: "Número com casas decimais. Em Python, a casa decimal usa ponto: 2.5." },
  { id: "booleano", nome: "Booleano", formas: ["booleano", "booleanos"], definicao: "Valor que só pode ser True (verdadeiro) ou False (falso)." },
  { id: "condicao", nome: "Condição", formas: ["condição", "condições"], definicao: "Uma pergunta de sim ou não que o programa testa, como idade >= 18." },
  { id: "operador", nome: "Operador", formas: ["operador", "operadores"], definicao: "Símbolo que faz uma conta ou uma comparação, como +, * ou ==." },
  { id: "concatenar", nome: "Concatenar", formas: ["concatenar", "concatenação", "concatena"], definicao: "Juntar textos, um colado no outro, com o +.", exemplo: '"Bom" + "dia" vira Bomdia' },
  { id: "recuo", nome: "Recuo (indentação)", formas: ["recuo", "recuada", "recuado", "indentação"], definicao: "Os espaços no começo da linha. Em Python, eles mostram quais linhas fazem parte de um bloco, como o do if." },
  { id: "bloco", nome: "Bloco", formas: ["bloco"], definicao: "Um grupo de linhas recuadas que pertencem a um if, else ou for." },
  { id: "lista", nome: "Lista", formas: ["lista", "listas"], definicao: "Vários valores guardados juntos, entre colchetes e separados por vírgula.", exemplo: '["arroz", "feijão"]' },
  { id: "indice", nome: "Índice (posição)", formas: ["índice", "índices"], definicao: "A posição de um item na lista. A contagem começa do 0.", exemplo: "frutas[0] é o primeiro item" },
  { id: "laco", nome: "Laço (repetição)", formas: ["laço", "loop", "repetição"], definicao: "Um trecho que se repete, como o for, que roda uma vez para cada item de uma lista." },
  { id: "acumulador", nome: "Acumulador", formas: ["acumulador"], definicao: "Uma variável que vai somando a cada volta do laço, como um cofrinho.", exemplo: "total = total + gasto" },
  ...["SyntaxError", "NameError", "TypeError", "ValueError", "IndentationError", "IndexError"].map((nome) => ({
    id: nome.toLowerCase(),
    nome,
    formas: [nome],
    definicao: `Erro do Python: ${traduzirErro(nome)}.`,
  })),
];

export type Pedaco = string | { termo: Termo; texto: string };

const LETRA = "\\p{L}\\p{N}_";

/**
 * Divide o texto marcando a primeira ocorrência de cada termo, no máximo `limite` termos por texto, para não
 * encher a frase de sublinhados. Não diferencia maiúsculas; respeita os limites da palavra (com acentos).
 */
export function marcarTermos(texto: string, limite = 2): Pedaco[] {
  const achados: { inicio: number; fim: number; termo: Termo }[] = [];
  for (const termo of TERMOS) {
    const padrao = new RegExp(`(?<![${LETRA}])(${termo.formas.map((f) => f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?![${LETRA}])`, "iu");
    const m = padrao.exec(texto);
    if (!m) continue;
    const inicio = m.index;
    const fim = inicio + m[0].length;
    if (achados.some((a) => inicio < a.fim && fim > a.inicio)) continue;
    achados.push({ inicio, fim, termo });
  }
  const escolhidos = achados.sort((a, b) => a.inicio - b.inicio).slice(0, limite);
  const pedacos: Pedaco[] = [];
  let pos = 0;
  for (const a of escolhidos) {
    if (a.inicio > pos) pedacos.push(texto.slice(pos, a.inicio));
    pedacos.push({ termo: a.termo, texto: texto.slice(a.inicio, a.fim) });
    pos = a.fim;
  }
  if (pos < texto.length) pedacos.push(texto.slice(pos));
  return pedacos;
}
