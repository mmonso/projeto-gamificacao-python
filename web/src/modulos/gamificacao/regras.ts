// Regras de gamificação (ESPECIFICACAO_MVP.md, seção 4). Funções puras: o serviço
// lê o estado persistido, aplica estas regras e grava o resultado na mesma transação.
import { PARAMETROS, type TipoSessao } from "./parametros";

/* XP (4.2) */

export type ConcessaoXp = { xp: number; causa: "primeira_conclusao" | "pratica" | "pratica_sem_xp" };

export function xpDaConclusao(tipo: TipoSessao, licaoJaConcluida: boolean, praticasRecompensadasHoje: number): ConcessaoXp {
  if (tipo === "principal" && !licaoJaConcluida) return { xp: PARAMETROS.xpPrimeiraConclusao, causa: "primeira_conclusao" };
  if (praticasRecompensadasHoje < PARAMETROS.praticasRecompensadasPorDia) return { xp: PARAMETROS.xpPratica, causa: "pratica" };
  return { xp: 0, causa: "pratica_sem_xp" };
}

/* Corações (4.3) */

export function coracoesAposResposta(saldo: number, tipo: TipoSessao, correta: boolean, primeiraTentativa: boolean): number {
  if (correta || tipo !== "principal" || !primeiraTentativa) return saldo;
  return Math.max(0, saldo - 1);
}

export function podeIniciarPrincipal(saldo: number): boolean {
  return saldo > 0;
}

export function podeRecuperar(saldo: number): boolean {
  return saldo < PARAMETROS.coracoesMaximos;
}

export function coracoesAposRecuperacao(saldo: number): number {
  return Math.min(PARAMETROS.coracoesMaximos, saldo + PARAMETROS.coracoesPorRecuperacao);
}

/* Meta (4.4) */

export function metaCumprida(sessoesNoDia: number, meta: number): boolean {
  return sessoesNoDia >= meta;
}

/** A celebração da meta aparece só na sessão que a completa. */
export function metaCompletadaAgora(sessoesAntes: number, meta: number): boolean {
  return sessoesAntes < meta && sessoesAntes + 1 >= meta;
}

/* Sequência (4.5) */

export type EstadoSequencia = { atual: number; maior: number; ultimoDia: string | null };

export function somarDias(dia: string, n: number): string {
  const d = new Date(`${dia}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Aplica uma sessão elegível concluída no dia de estudo `dia`.
 * `toleranciaFuso` permite um dia pulado por mudança de fuso sem quebrar a sequência (4.6).
 */
export function sequenciaAposSessao(estado: EstadoSequencia, dia: string, toleranciaFuso = false): EstadoSequencia {
  if (estado.ultimoDia === dia) return estado;
  const continua =
    estado.ultimoDia !== null &&
    (somarDias(estado.ultimoDia, 1) === dia || (toleranciaFuso && somarDias(estado.ultimoDia, 2) === dia));
  const atual = continua ? estado.atual + 1 : 1;
  return { atual, maior: Math.max(estado.maior, atual), ultimoDia: dia };
}

/** Sequência mostrada no perfil: zera quando um dia inteiro passou sem estudo. */
export function sequenciaExibida(estado: EstadoSequencia, hoje: string): number {
  if (!estado.ultimoDia) return 0;
  return estado.ultimoDia >= somarDias(hoje, -1) ? estado.atual : 0;
}

/* Conquistas (4.7) */

export type Conquista = "primeira-licao" | "primeira-unidade" | "sete-dias";

export function novasConquistas(
  existentes: readonly Conquista[],
  dados: { licoesConcluidas: number; unidadeCompleta: boolean; sequencia: number },
): Conquista[] {
  const merecidas: Conquista[] = [];
  if (dados.licoesConcluidas >= 1) merecidas.push("primeira-licao");
  if (dados.unidadeCompleta) merecidas.push("primeira-unidade");
  if (dados.sequencia >= 7) merecidas.push("sete-dias");
  return merecidas.filter((c) => !existentes.includes(c));
}

/* Agenda de revisão (4.8) */

export type EstadoConceito = "iniciado" | "praticando" | "consolidando";

export function proximoIntervalo(intervaloAtual: number | null, acertouDePrimeiraSemDica: boolean): number {
  const [i1, i3, i7] = PARAMETROS.intervalosRevisao;
  if (intervaloAtual === null || !acertouDePrimeiraSemDica) return i1;
  if (intervaloAtual === i1) return i3;
  return i7;
}

/** Estado mostrado depois de uma revisão: consolida após sucesso no intervalo de 7 dias. */
export function estadoAposRevisao(intervaloAnterior: number, acertouDePrimeiraSemDica: boolean): EstadoConceito {
  return acertouDePrimeiraSemDica && intervaloAnterior >= PARAMETROS.intervalosRevisao[2] ? "consolidando" : "praticando";
}
