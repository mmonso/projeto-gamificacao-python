// "Digite a saída" (design/ESTRATEGIA_DE_CRESCIMENTO.md): lembrar a saída exige mais que reconhecê-la entre opções.
// Não há conteúdo novo: na revisão e na prática, um "escolher a saída" curto vira um campo para digitar,
// com as opções escondidas. A lição principal continua com as opções, porque o primeiro contato pede apoio.
import { hash, type ExercicioPublico, type Gabarito } from "@/modulos/conteudo/esquema";
import type { TipoSessao } from "@/modulos/gamificacao/parametros";

type Escolha = Extract<ExercicioPublico, { tipo: "escolher_resultado" }>;

/** Saídas maiores que isso continuam de escolha: digitar muito no celular cansa mais do que ensina. */
export const MAX_LINHAS = 4;
export const MAX_COLUNAS = 40;

/** Aspas e travessões que teclados de celular trocam sozinhos, e espaço sem quebra. */
const TROCAS: [RegExp, string][] = [
  [/[‘’‚′]/g, "'"],
  [/[“”„″]/g, '"'],
  [/—/g, "--"],
  [/–/g, "-"],
  [/ /g, " "],
];

/**
 * Forma comparável de uma saída: quebras de linha unificadas, sem espaços no fim das linhas e sem linhas
 * vazias no começo e no fim. Espaços no meio, maiúsculas e acentos continuam valendo, como no Python.
 */
export function normalizarSaida(texto: string): string {
  let t = texto.replace(/\r\n?/g, "\n");
  for (const [de, para] of TROCAS) t = t.replace(de, para);
  return t
    .split("\n")
    .map((l) => l.trimEnd())
    .join("\n")
    .replace(/^\n+|\n+$/g, "");
}

/** Só saídas curtas, sem opção de erro e com opções distintas depois de normalizar. */
export function podeDigitar(ex: ExercicioPublico): ex is Escolha {
  if (ex.tipo !== "escolher_resultado" || ex.opcoesSao !== "saida") return false;
  const textos = ex.opcoes.map((o) => (o.erro || !o.texto ? null : normalizarSaida(o.texto)));
  if (textos.some((t) => !t)) return false;
  const linhas = (textos as string[]).map((t) => t.split("\n"));
  if (linhas.some((l) => l.length > MAX_LINHAS || l.some((x) => x.length > MAX_COLUNAS))) return false;
  return new Set(textos).size === textos.length;
}

/**
 * Se o item aparece para digitar nesta sessão. Revisão: sempre que der, porque o conceito já foi visto.
 * Prática: metade dos itens, escolhida de forma estável pela sessão, para variar sem cansar.
 */
export function usaDigitacao(tipo: TipoSessao, sessaoId: string, ex: ExercicioPublico): ex is Escolha {
  if (!podeDigitar(ex)) return false;
  if (tipo === "revisao") return true;
  if (tipo === "pratica") return hash(`${sessaoId}:${ex.id}`) % 2 === 0;
  return false;
}

/** Parte pública do item para digitar: sem as opções, que entregariam a resposta. */
export function paraDigitar(ex: Escolha): ExercicioPublico {
  const { id, versao, enunciado, codigo, totalDicas, cartoes } = ex;
  // Todas as opções de um item costumam ter o mesmo número de linhas; o maior delas não dá pista da certa.
  const linhas = Math.max(...ex.opcoes.map((o) => normalizarSaida(o.texto ?? "").split("\n").length));
  return { id, versao, enunciado, codigo, totalDicas, ...(cartoes ? { cartoes } : {}), tipo: "digitar_saida", linhas };
}

/** Gabarito do item para digitar: o texto da opção certa. */
export function gabaritoParaDigitar(g: Gabarito, ex: Escolha): Gabarito {
  if (g.tipo !== "escolher_resultado") return g;
  const certa = ex.opcoes.find((o) => o.id === g.opcao);
  return { tipo: "digitar_saida", saida: normalizarSaida(certa?.texto ?? "") };
}

/** Parte pública do item como a sessão o mostra. */
export function noModoDaSessao(tipo: TipoSessao, sessaoId: string, ex: ExercicioPublico): ExercicioPublico {
  return usaDigitacao(tipo, sessaoId, ex) ? paraDigitar(ex) : ex;
}

/** Gabarito do item como a sessão o corrige; `ex` é a parte pública original, com as opções. */
export function gabaritoNoModoDaSessao(tipo: TipoSessao, sessaoId: string, ex: ExercicioPublico, g: Gabarito): Gabarito {
  return usaDigitacao(tipo, sessaoId, ex) ? gabaritoParaDigitar(g, ex) : g;
}

/**
 * Comentário para uma resposta quase certa: a diferença é só de maiúsculas, de aspas, de espaços ou de linhas.
 * A resposta continua errada; o comentário mostra o que o Python faz de diferente.
 */
export function comentarioDeQuase(digitada: string, esperada: string): string | undefined {
  const d = normalizarSaida(digitada);
  const e = normalizarSaida(esperada);
  if (d === e || !d) return undefined;
  if (d.toLowerCase() === e.toLowerCase()) return "Quase! Confira as maiúsculas e minúsculas: para o Python, elas fazem diferença.";
  const semAspas = (t: string) => t.replace(/["']/g, "");
  if (semAspas(d) === semAspas(e) && /["']/.test(d)) {
    return /["']/.test(e) ? "Quase! Confira as aspas." : "Quase! O print mostra o texto sem as aspas.";
  }
  const espacos = (t: string) => t.replace(/[ \t]+/g, " ").trim();
  if (espacos(d) === espacos(e)) return "Quase! Confira os espaços entre as palavras e os valores.";
  const juntas = (t: string) => t.split("\n").map((l) => l.trim()).join(" ");
  if (juntas(d) === juntas(e)) return "Quase! Confira as linhas: cada print mostra o seu valor numa linha nova.";
  return undefined;
}
