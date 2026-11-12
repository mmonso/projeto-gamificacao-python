// Retenção D1, D7 e D30 e funil da fase de teste (design/ESTRATEGIA_DE_CRESCIMENTO.md, Roadmap).
// Regras puras: recebem o dia de entrada de cada aluno e os dias em que ele estudou, no fuso do aluno.
// "Voltou no D7" quer dizer que estudou exatamente 7 dias depois do dia de entrada (definição usual da categoria).
// Só entram na conta os alunos cujo dia N já terminou: quem entrou ontem ainda não pode ter D7.

export const MARCOS = [1, 7, 30] as const;
export type Marco = (typeof MARCOS)[number];

/** Metas do roadmap para a fase 2 (D1, D7, D30). A fase 1 pede D7 de 35% ou mais. */
export const METAS: Record<Marco, number> = { 1: 0.35, 7: 0.18, 30: 0.08 };

export type AlunoCoorte = {
  /** Dia de entrada (AAAA-MM-DD) no fuso do aluno. */
  dia0: string;
  /** Dias com estudo (AAAA-MM-DD), em qualquer ordem. */
  diasAtivos: readonly string[];
};

export type LinhaRetencao = { marco: Marco; elegiveis: number; retidos: number; taxa: number | null };

export function somarDias(dia: string, n: number): string {
  const d = new Date(`${dia}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/** Segunda-feira da semana do dia (AAAA-MM-DD). */
export function inicioDaSemana(dia: string): string {
  const semana = new Date(`${dia}T00:00:00Z`).getUTCDay(); // 0 = domingo
  return somarDias(dia, -((semana + 6) % 7));
}

/** O dia N do aluno só conta quando já acabou, ou seja, é anterior a hoje. */
function elegivel(aluno: AlunoCoorte, marco: Marco, hoje: string) {
  return somarDias(aluno.dia0, marco) < hoje;
}

export function retencao(alunos: readonly AlunoCoorte[], hoje: string): LinhaRetencao[] {
  return MARCOS.map((marco) => {
    const base = alunos.filter((a) => elegivel(a, marco, hoje));
    const retidos = base.filter((a) => a.diasAtivos.includes(somarDias(a.dia0, marco))).length;
    return { marco, elegiveis: base.length, retidos, taxa: base.length ? retidos / base.length : null };
  });
}

export type CoorteSemanal = { semana: string; alunos: number; linhas: LinhaRetencao[] };

/** Retenção separada pela semana de entrada, da mais antiga para a mais recente. */
export function retencaoPorSemana(alunos: readonly AlunoCoorte[], hoje: string): CoorteSemanal[] {
  const grupos = new Map<string, AlunoCoorte[]>();
  for (const a of alunos) {
    const s = inicioDaSemana(a.dia0);
    grupos.set(s, [...(grupos.get(s) ?? []), a]);
  }
  return [...grupos.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([semana, grupo]) => ({ semana, alunos: grupo.length, linhas: retencao(grupo, hoje) }));
}

export function formatarTaxa(linha: Pick<LinhaRetencao, "elegiveis" | "retidos" | "taxa">): string {
  if (linha.taxa === null) return "—";
  return `${Math.round(linha.taxa * 100)}% (${linha.retidos}/${linha.elegiveis})`;
}
