// Mapa de domínio (design/ANALISE_UX_GAMIFICACAO.md, seção 5): quatro degraus por conceito, sem porcentagem.
// Nunca se diz "dominado": o último degrau é "consolidando", e um conceito vencido ganha o selo "para revisar".
import type { EstadoConceito } from "./regras";

export type Degrau = 1 | 2 | 3 | 4;

export const NOMES_DEGRAU: Record<Degrau, string> = { 1: "Visto", 2: "Praticando", 3: "Firmando", 4: "Consolidando" };

/**
 * Visto (ainda sem revisão); Praticando (voltou para 1 dia, depois de erro ou dica); Firmando (revisão em 3 ou
 * 7 dias ainda por confirmar); Consolidando (acertou a revisão de 7 dias).
 */
export function degrauDoConceito(estado: EstadoConceito, intervaloDias: number): Degrau {
  if (estado === "consolidando") return 4;
  if (estado === "iniciado") return 1;
  return intervaloDias > 1 ? 3 : 2;
}
