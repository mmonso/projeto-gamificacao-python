// Cronômetro da resposta: conta só o tempo com o exercício à vista. Pausa enquanto o cartão do conceito está
// aberto (no começo ou reaberto no meio) e recomeça do zero a cada exercício novo. Regra pura: o tempo vem de fora.

export type Cronometro = { id: string | null; acumulado: number; inicio: number | null };

export const CRONOMETRO_VAZIO: Cronometro = { id: null, acumulado: 0, inicio: null };

/** Novo estado depois de mudar o exercício mostrado ou abrir/fechar o cartão do conceito. */
export function atualizarCronometro(c: Cronometro, id: string | null, cartaoAberto: boolean, agora: number): Cronometro {
  if (c.id !== id) return { id, acumulado: 0, inicio: cartaoAberto ? null : agora };
  if (cartaoAberto && c.inicio !== null) return { ...c, acumulado: c.acumulado + (agora - c.inicio), inicio: null };
  if (!cartaoAberto && c.inicio === null) return { ...c, inicio: agora };
  return c;
}

/** Tempo com o exercício à vista até `agora`, em milissegundos inteiros. */
export function tempoDoCronometro(c: Cronometro, agora: number): number {
  return Math.max(0, Math.round(c.acumulado + (c.inicio !== null ? agora - c.inicio : 0)));
}
