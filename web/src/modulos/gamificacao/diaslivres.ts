// Dia livre (design/ANALISE_UX_GAMIFICACAO.md, seção 5): um dia sem estudo que não quebra a sequência.
// Ganha-se estudando (o primeiro aos 3 dias de sequência, depois um a cada 7 dias), guardam-se no máximo 2,
// e o uso é automático: ao voltar a estudar, os dias perdidos são cobertos se houver dias livres suficientes.
import { sequenciaAposSessao, somarDias, type EstadoSequencia } from "./regras";

export const MAX_DIAS_LIVRES = 2;
/** Sequência em que se ganha o primeiro dia livre; depois, um a cada `INTERVALO` dias a mais. */
const PRIMEIRO_GANHO = 3;
const INTERVALO_GANHO = 7;

/** Quantos dias vão de `a` até `b` (positivo quando `b` vem depois). */
export function diasEntre(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

/** A sequência que acaba de ser alcançada rende um dia livre: 3, 10, 17, 24… */
export function ganhaDiaLivre(sequencia: number): boolean {
  return sequencia === PRIMEIRO_GANHO || (sequencia > PRIMEIRO_GANHO && (sequencia - PRIMEIRO_GANHO) % INTERVALO_GANHO === 0);
}

export type ResultadoSequencia = {
  estado: EstadoSequencia;
  /** Dias livres que sobram depois desta sessão. */
  diasLivres: number;
  /** Dias sem estudo cobertos por dias livres nesta sessão, em ordem. */
  usados: string[];
  /** Esta sessão rendeu um dia livre novo. */
  ganhou: boolean;
};

/** Aplica uma sessão elegível concluída no dia `dia`, usando e ganhando dias livres. */
export function sequenciaComDiasLivres(estado: EstadoSequencia, dia: string, toleranciaFuso: boolean, diasLivres: number): ResultadoSequencia {
  const normal = sequenciaAposSessao(estado, dia, toleranciaFuso);
  if (estado.ultimoDia === dia) return { estado: normal, diasLivres, usados: [], ganhou: false };

  let novo = normal;
  let sobra = diasLivres;
  const usados: string[] = [];
  if (estado.ultimoDia !== null && normal.atual === 1) {
    // A sequência recomeçaria: ela continua se os dias perdidos couberem nos dias livres.
    const perdidos = diasEntre(estado.ultimoDia, dia) - 1;
    if (perdidos >= 1 && perdidos <= diasLivres) {
      const atual = estado.atual + 1;
      novo = { atual, maior: Math.max(estado.maior, atual), ultimoDia: dia };
      sobra -= perdidos;
      for (let i = 1; i <= perdidos; i++) usados.push(somarDias(estado.ultimoDia, i));
    }
  }
  const ganhou = ganhaDiaLivre(novo.atual) && sobra < MAX_DIAS_LIVRES;
  return { estado: novo, diasLivres: ganhou ? sobra + 1 : sobra, usados, ganhou };
}

/** Sequência mostrada: segue viva enquanto os dias sem estudo couberem nos dias livres. Zera quando passam. */
export function sequenciaViva(estado: EstadoSequencia, hoje: string, diasLivres: number): number {
  if (!estado.ultimoDia) return 0;
  return estado.ultimoDia >= somarDias(hoje, -(1 + diasLivres)) ? estado.atual : 0;
}
