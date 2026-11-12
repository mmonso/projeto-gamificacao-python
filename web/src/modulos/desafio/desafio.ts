// Desafio do dia (design/ESTRATEGIA_DE_CRESCIMENTO.md, "Dois loops de crescimento"): 5 perguntas de "qual é a
// saída?", iguais para todos no mesmo dia, jogadas sem conta. No fim, um cartão com quadradinhos para mandar
// no WhatsApp; quem recebe joga na hora. Regras puras: escolha dos itens, numeração e texto compartilhado.
import { embaralhar } from "@/modulos/conteudo/esquema";

/** Dia do desafio #1, no fuso de Brasília. */
export const PRIMEIRO_DIA = "2026-11-12";
export const ITENS_POR_DESAFIO = 5;
export const FUSO_DO_DESAFIO = "America/Sao_Paulo";

const DIA_MS = 86_400_000;
const meiaNoite = (dia: string) => Date.parse(`${dia}T00:00:00Z`);

/** Dia (AAAA-MM-DD) em Brasília no instante dado: o desafio vira à meia-noite de Brasília para todo mundo. */
export function diaDoDesafio(agora = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: FUSO_DO_DESAFIO, year: "numeric", month: "2-digit", day: "2-digit" }).format(agora);
}

export function numeroDoDia(dia: string): number {
  return Math.round((meiaNoite(dia) - meiaNoite(PRIMEIRO_DIA)) / DIA_MS) + 1;
}

export function diaDoNumero(numero: number): string {
  return new Date(meiaNoite(PRIMEIRO_DIA) + (numero - 1) * DIA_MS).toISOString().slice(0, 10);
}

export type Candidato = { id: string; dificuldade: number };

/**
 * Itens do desafio número `numero`. Os candidatos são embaralhados uma vez, com semente fixa, e cada dia pega
 * o bloco seguinte: nenhum item se repete até a lista inteira passar. Dentro do dia, do mais fácil ao mais difícil.
 */
export function itensDoDesafio(candidatos: readonly Candidato[], numero: number, tamanho = ITENS_POR_DESAFIO): Candidato[] {
  if (!candidatos.length || numero < 1) return [];
  const ordem = embaralhar(
    [...candidatos].sort((a, b) => a.id.localeCompare(b.id)),
    "sibi-desafio-do-dia",
  );
  const n = Math.min(tamanho, ordem.length);
  const inicio = ((numero - 1) * n) % ordem.length;
  const bloco = Array.from({ length: n }, (_, i) => ordem[(inicio + i) % ordem.length]);
  return bloco.map((c, i) => ({ c, i })).sort((a, b) => a.c.dificuldade - b.c.dificuldade || a.i - b.i).map(({ c }) => c);
}

/** Como cada pergunta terminou: certa de primeira e sem dica, certa com dica, ou errada. */
export type Marca = "certa" | "dica" | "errada";

const QUADRADO: Record<Marca, string> = { certa: "🟩", dica: "🟨", errada: "🟥" };

export function quadradinhos(marcas: readonly Marca[]): string {
  return marcas.map((m) => QUADRADO[m]).join("");
}

export function acertos(marcas: readonly Marca[]): number {
  return marcas.filter((m) => m !== "errada").length;
}

/** Texto para mandar no WhatsApp: sem as respostas, só o placar e o link para jogar. */
export function textoParaCompartilhar(numero: number, marcas: readonly Marca[], endereco: string): string {
  return [`Sibi #${numero} 🐍 ${acertos(marcas)}/${marcas.length}`, quadradinhos(marcas), "Qual é a saída? Tente o desafio de hoje:", endereco].join("\n");
}

/** Frase do resultado, sem culpar quem errou. */
export function fraseDoPlacar(certas: number, total: number): string {
  if (certas === total) return "Placar perfeito!";
  if (certas >= total - 1) return "Quase perfeito!";
  if (certas >= Math.ceil(total / 2)) return "Bom placar!";
  return "Cada erro de hoje é um acerto amanhã.";
}

/** Tempo até o próximo desafio, em "5 h 12 min". Brasília está em UTC-3 o ano todo desde 2019. */
export function tempoAteOProximo(agora = new Date()): string {
  const proximaMeiaNoite = meiaNoite(diaDoDesafio(agora)) + DIA_MS + 3 * 3_600_000;
  const minutos = Math.max(1, Math.ceil((proximaMeiaNoite - agora.getTime()) / 60_000));
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return h ? `${h} h ${m} min` : `${m} min`;
}
