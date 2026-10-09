// Dia de estudo e fuso horário (ESPECIFICACAO_MVP.md, seção 4.6).
// Horários são gravados em UTC; o dia de estudo é a data local no fuso IANA da conta.
import { somarDias } from "./regras";

export function fusoValido(fuso: string): boolean {
  try {
    new Intl.DateTimeFormat("en-CA", { timeZone: fuso });
    return true;
  } catch {
    return false;
  }
}

/** Data local (AAAA-MM-DD) de um instante em um fuso IANA. */
export function dataLocal(instante: Date, fuso: string): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: fuso, year: "numeric", month: "2-digit", day: "2-digit" }).format(instante);
}

export type ConfiguracaoFuso = {
  fuso: string;
  /** Novo fuso pedido nas preferências, ainda não vigente. */
  fusoPendente: string | null;
  /** Primeiro dia de estudo, contado no fuso anterior, em que o pendente passa a valer. */
  pendenteAPartirDe: string | null;
};

/** Registra uma mudança de fuso: vale a partir do próximo dia de estudo no fuso atual. Substitui pendências. */
export function pedirMudancaDeFuso(config: ConfiguracaoFuso, novoFuso: string, agora: Date): ConfiguracaoFuso {
  if (!fusoValido(novoFuso)) throw new Error(`Fuso inválido: ${novoFuso}`);
  if (novoFuso === config.fuso) return { ...config, fusoPendente: null, pendenteAPartirDe: null };
  return { fuso: config.fuso, fusoPendente: novoFuso, pendenteAPartirDe: somarDias(dataLocal(agora, config.fuso), 1) };
}

export function fusoVigente(config: ConfiguracaoFuso, instante: Date): { fuso: string; acabouDeMudar: boolean } {
  if (config.fusoPendente && config.pendenteAPartirDe && dataLocal(instante, config.fuso) >= config.pendenteAPartirDe) {
    return { fuso: config.fusoPendente, acabouDeMudar: true };
  }
  return { fuso: config.fuso, acabouDeMudar: false };
}

/**
 * Dia de estudo de uma conclusão. A data nunca recua: se a mudança de fuso fizer a data local
 * voltar para antes do último dia registrado, a sessão conta para esse mesmo último dia.
 */
export function diaDeEstudo(instante: Date, fuso: string, ultimoDiaRegistrado: string | null): string {
  const dia = dataLocal(instante, fuso);
  return ultimoDiaRegistrado && dia < ultimoDiaRegistrado ? ultimoDiaRegistrado : dia;
}
