// Erros do Python rodado no navegador, traduzidos para português simples (design/MELHORIAS_UX.md, E).
// Só a última linha do erro importa para o aluno; o texto original fica num "ver detalhes".
import { traduzirErro } from "@/modulos/aprendizagem/nomes-de-erro";

export type ErroPython = { tipo: string; mensagem: string; linha: number | null };
export type Traducao = { titulo: string; explicacao: string };

type Regra = [RegExp, (m: RegExpMatchArray) => string];

const SINTAXE: Regra[] = [
  [/Missing parentheses in call to 'print'/, () => "Faltaram os parênteses do print. O jeito certo é print(...)."],
  [/'(.)' was never closed/, (m) => `Um ${m[1]} abriu e não fechou.`],
  [/unterminated (?:triple-quoted )?string literal/, () => "Faltou fechar as aspas do texto."],
  [/unmatched '(.)'/, (m) => `Tem um ${m[1]} fechando sem ter aberto antes.`],
  [/closing parenthesis '(.)' does not match opening parenthesis '(.)'/, (m) => `Abriu com ${m[2]} e fechou com ${m[1]}: eles precisam combinar.`],
  [/expected ':'/, () => "Faltaram os dois-pontos (:) no fim da linha."],
  [/invalid character '(.)'/, (m) => (/[“”‘’]/.test(m[1]) ? `A aspa ${m[1]} é curva, e o Python só entende a reta (" ou ').` : `O Python não entende o caractere ${m[1]}.`)],
  [/Perhaps you forgot a comma/, () => "Parece que faltou uma vírgula entre os valores."],
  [/cannot assign to (?:literal|expression|function call)|cannot assign to .* here/, () => "Do lado esquerdo do = vai o nome de uma variável, e o valor fica do lado direito."],
  [/invalid decimal literal/, () => "Nome de variável não pode começar com número, e número com vírgula usa ponto (2.5)."],
  [/Maybe you meant '==' or ':=' instead of '='/, () => "Para comparar, use == (dois sinais de igual)."],
  [/expected an indented block/, () => "Depois de uma linha que termina com :, a linha de baixo precisa de recuo (4 espaços)."],
  [/unexpected indent/, () => "Tem espaço sobrando no começo da linha."],
  [/unindent does not match/, () => "O recuo desta linha não bate com o das linhas de cima."],
  [/inconsistent use of tabs/, () => "Misturou espaços e Tab no recuo. Use só espaços."],
  [/invalid syntax/, () => "O Python não entendeu a escrita desta linha. Confira aspas, parênteses e vírgulas."],
];

const OUTROS: Record<string, Regra[]> = {
  NameError: [
    [
      /name '(.+?)' is not defined(?:\. Did you mean: '(.+?)'\?)?/,
      (m) => `O Python não conhece o nome ${m[1]}. Você criou essa variável antes? Se era um texto, faltaram as aspas.${m[2] ? ` Você quis dizer ${m[2]}?` : ""}`,
    ],
  ],
  TypeError: [
    [/can only concatenate str \(not "(\w+)"\) to str/, () => "Não dá para juntar texto e número com +. Use vírgula no print, ou transforme o número em texto com str()."],
    [/unsupported operand type\(s\) for (.+?): '(\w+)' and '(\w+)'/, (m) => `A conta ${m[1]} não funciona entre ${nomeTipo(m[2])} e ${nomeTipo(m[3])}.`],
    [/can't multiply sequence by non-int of type '(\w+)'/, () => "Só dá para repetir um texto multiplicando por um número inteiro."],
    [/'(\w+)' object is not callable/, (m) => `Um valor do tipo ${nomeTipo(m[1])} foi usado como se fosse um comando, com parênteses.`],
    [/'(\w+)' object is not subscriptable/, (m) => `Um valor do tipo ${nomeTipo(m[1])} não tem posições para usar com [ ].`],
  ],
  ValueError: [[/invalid literal for int\(\) with base 10: (.+)/, (m) => `O int() só converte texto com algarismos, e recebeu ${m[1]}.`]],
  ZeroDivisionError: [[/./, () => "Não dá para dividir por zero."]],
  IndexError: [[/index out of range/, () => "Essa posição não existe. Lembre: a contagem começa do 0, e o último item fica em len(lista) - 1."]],
  AttributeError: [[/'(\w+)' object has no attribute '(\w+)'/, (m) => `Valores do tipo ${nomeTipo(m[1])} não têm o comando ${m[2]}.`]],
  KeyError: [[/(.+)/, (m) => `A chave ${m[1]} não existe.`]],
};

const TIPOS: Record<string, string> = { str: "texto", int: "número inteiro", float: "número decimal", list: "lista", bool: "verdadeiro ou falso", NoneType: "None (nada)" };
const nomeTipo = (t: string) => TIPOS[t] ?? t;

const ESPECIAIS: Record<string, Traducao> = {
  Tempo: { titulo: "O programa demorou demais", explicacao: "Ele foi parado depois de alguns segundos. Pode ser um laço que nunca termina." },
  SaidaLonga: { titulo: "Saída grande demais", explicacao: "O programa mostrou texto demais e foi parado." },
  Importacao: { titulo: "Importar ainda não vale aqui", explicacao: "O import traz módulos extras do Python. Aqui você usa só o Python básico, que é o que o curso ensina." },
  Falha: { titulo: "O Python parou", explicacao: "Algo deu errado ao rodar. Tente de novo." },
  RecursionError: { titulo: "Repetição sem fim", explicacao: "Uma função chamou a si mesma vezes demais." },
};

/** Título ("Linha 2: NameError (nome que o Python não conhece)") e a explicação em português. */
export function traduzirErroPython(e: ErroPython): Traducao {
  const especial = ESPECIAIS[e.tipo];
  if (especial) return especial;
  const onde = e.linha ? `Linha ${e.linha}: ` : "";
  const traducao = traduzirErro(e.tipo);
  const titulo = `${onde}${e.tipo}${traducao ? ` (${traducao})` : ""}`;
  const regras = e.tipo === "SyntaxError" || e.tipo === "IndentationError" || e.tipo === "TabError" ? SINTAXE : (OUTROS[e.tipo] ?? []);
  for (const [padrao, texto] of regras) {
    const m = e.mensagem.match(padrao);
    if (m) return { titulo, explicacao: texto(m) };
  }
  return { titulo, explicacao: traducao ? `O Python encontrou um problema: ${traducao}.` : "O Python encontrou um problema nesta linha." };
}

/** Aspas e travessões que o teclado do celular troca sozinho viram os que o Python entende. */
export function endireitarAspas(codigo: string): string {
  return codigo.replace(/[“”„]/g, '"').replace(/[‘’‚]/g, "'").replace(/ /g, " ");
}

/** Recursos do Python e a unidade em que o curso os ensina; os que não estão no curso ficam sem unidade. */
const RECURSOS: Record<string, { nome: string; unidade: number | null }> = {
  If: { nome: "if", unidade: 3 },
  For: { nome: "for", unidade: 4 },
  While: { nome: "while", unidade: null },
  FunctionDef: { nome: "def (funções)", unidade: null },
  Lambda: { nome: "lambda", unidade: null },
  ClassDef: { nome: "class", unidade: null },
  Try: { nome: "try", unidade: null },
  With: { nome: "with", unidade: null },
  ListComp: { nome: "listas por compreensão", unidade: null },
  Dict: { nome: "dicionários", unidade: null },
};

/** Aviso amigável (não bloqueia) quando o código usa algo que o aluno ainda não viu no curso. */
export function avisoDeRecursos(recursos: string[], unidadeAtual: number | undefined): string | null {
  if (!unidadeAtual) return null;
  const adiante = recursos.map((r) => RECURSOS[r]).filter((r) => r && (r.unidade === null || r.unidade > unidadeAtual));
  if (!adiante.length) return null;
  const r = adiante[0];
  return r.unidade ? `O ${r.nome} aparece na unidade ${r.unidade}. Funciona, mas talvez dê para fazer com o que você já viu.` : `O ${r.nome} vai além do que o curso ensina por enquanto. Funciona, mas não se preocupe com ele agora.`;
}
