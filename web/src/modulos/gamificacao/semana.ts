// Calendário da semana e marcos da sequência (design/ANALISE_UX_GAMIFICACAO.md, seção 5). Funções puras.
import { somarDias } from "./regras";

export type DiaSemana = { dia: string; letra: string; estudou: boolean; hoje: boolean; futuro: boolean };

const LETRAS = ["D", "S", "T", "Q", "Q", "S", "S"];
const NOMES = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

/** Nome do dia da semana de uma data AAAA-MM-DD, para leitores de tela. */
export function nomeDoDia(dia: string): string {
  return NOMES[new Date(`${dia}T12:00:00Z`).getUTCDay()];
}

/** A semana de domingo a sábado que contém `hoje`, com os dias em que houve estudo. */
export function semanaDe(hoje: string, estudados: ReadonlySet<string>): DiaSemana[] {
  const inicio = somarDias(hoje, -new Date(`${hoje}T12:00:00Z`).getUTCDay());
  return LETRAS.map((letra, i) => {
    const dia = somarDias(inicio, i);
    return { dia, letra, estudou: estudados.has(dia), hoje: dia === hoje, futuro: dia > hoje };
  });
}

/** Marcos da sequência, cada um com uma celebração própria. */
export const MARCOS_SEQUENCIA = [3, 7, 14, 30] as const;

/** Próximo marco acima da sequência atual; depois do último, null. */
export function proximoMarco(sequencia: number): number | null {
  return MARCOS_SEQUENCIA.find((m) => m > sequencia) ?? null;
}
