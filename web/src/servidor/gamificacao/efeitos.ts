// Efeitos de uma sessão concluída sobre a gamificação (E06.3 a E06.5; ESPECIFICACAO_MVP, seção 4):
// atividade diária, meta, sequência, agenda de revisão por conceito e conquistas.
// Rodam na transação da conclusão, com o perfil já travado, para que tudo seja gravado junto (CA-35, CA-36).
import { and, asc, count, eq, gte, inArray, lte, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { diaDeEstudo, fusoVigente } from "@/modulos/gamificacao/dias";
import { semanaDe, type DiaSemana } from "@/modulos/gamificacao/semana";
import type { TipoSessao } from "@/modulos/gamificacao/parametros";
import {
  agendaAposSessao,
  metaCompletadaAgora,
  sequenciaAposSessao,
  sequenciaExibida,
  type AgendaConceito,
} from "@/modulos/gamificacao/regras";
import * as t from "@/servidor/db/esquema";
import type { Conquista } from "@/modulos/gamificacao/conquistas";
import { concederConquistas } from "./conquistas";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type Perfil = typeof t.perfis.$inferSelect;

/**
 * Dia de estudo de uma conclusão (4.6). Uma mudança de fuso pendente que passou a valer é gravada aqui,
 * e só neste caso um dia pulado não quebra a sequência.
 */
export async function diaDaConclusao(tx: Tx, perfil: Perfil, agora: Date) {
  const { fuso, acabouDeMudar } = fusoVigente(perfil, agora);
  if (acabouDeMudar) {
    await tx.update(t.perfis).set({ fuso, fusoPendente: null, pendenteAPartirDe: null }).where(eq(t.perfis.id, perfil.id));
  }
  return { dia: diaDeEstudo(agora, fuso, perfil.ultimoDiaEstudo), toleranciaFuso: acabouDeMudar };
}

export type EfeitosConclusao = {
  sequencia: number;
  sequenciaAumentou: boolean;
  meta: { feitas: number; meta: number; cumpridaAgora: boolean };
  conquistas: Conquista[];
  unidadeConcluida: { id: string; titulo: string } | null;
};

/**
 * Aplica uma sessão elegível concluída (4.1): conta a atividade do dia (uma linha por aluno e data), atualiza
 * meta e sequência, a agenda dos conceitos da sessão e as conquistas.
 */
export async function aplicarEfeitos(
  tx: Tx,
  perfil: Perfil,
  sessao: { id: string; tipo: TipoSessao; licaoId: string | null },
  ctx: { dia: string; toleranciaFuso: boolean; primeiraConclusao: boolean; praticaRecompensada: boolean },
): Promise<EfeitosConclusao> {
  const { dia } = ctx;

  const [atividade] = await tx
    .insert(t.atividadeDiaria)
    .values({ alunoId: perfil.id, dia, sessoes: 1, praticasRecompensadas: ctx.praticaRecompensada ? 1 : 0 })
    .onConflictDoUpdate({
      target: [t.atividadeDiaria.alunoId, t.atividadeDiaria.dia],
      set: {
        sessoes: sql`${t.atividadeDiaria.sessoes} + 1`,
        praticasRecompensadas: sql`${t.atividadeDiaria.praticasRecompensadas} + ${ctx.praticaRecompensada ? 1 : 0}`,
      },
    })
    .returning({ sessoes: t.atividadeDiaria.sessoes });

  const antes = { atual: perfil.sequenciaAtual, maior: perfil.maiorSequencia, ultimoDia: perfil.ultimoDiaEstudo };
  const depois = sequenciaAposSessao(antes, dia, ctx.toleranciaFuso);
  await tx
    .update(t.perfis)
    .set({ sequenciaAtual: depois.atual, maiorSequencia: depois.maior, ultimoDiaEstudo: depois.ultimoDia })
    .where(eq(t.perfis.id, perfil.id));

  await atualizarAgenda(tx, perfil.id, sessao, dia);

  const unidadeConcluida = ctx.primeiraConclusao && sessao.licaoId ? await unidadeCompletada(tx, perfil.id, sessao.licaoId) : null;
  const conquistas = await concederConquistas(tx, perfil.id);

  return {
    sequencia: depois.atual,
    sequenciaAumentou: antes.ultimoDia !== dia,
    meta: { feitas: atividade.sessoes, meta: perfil.metaDiaria, cumpridaAgora: metaCompletadaAgora(atividade.sessoes - 1, perfil.metaDiaria) },
    conquistas,
    unidadeConcluida,
  };
}

/**
 * Agenda de revisão (4.8): um conceito conta como acertado quando todos os itens da sessão que o contêm
 * foram acertados de primeira e sem dica.
 */
async function atualizarAgenda(tx: Tx, alunoId: string, sessao: { id: string; tipo: TipoSessao }, dia: string) {
  const itens = await tx
    .select({ conceitos: t.exercicios.conceitos, errouPrimeira: t.itensSessao.errouPrimeira, dicas: t.itensSessao.dicasUsadas })
    .from(t.itensSessao)
    .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
    .where(eq(t.itensSessao.sessaoId, sessao.id));
  const desempenho = new Map<string, boolean>();
  for (const item of itens) {
    const ok = item.errouPrimeira === false && item.dicas === 0;
    for (const c of item.conceitos) desempenho.set(c, (desempenho.get(c) ?? true) && ok);
  }
  if (desempenho.size === 0) return;

  const atuais = await tx
    .select()
    .from(t.estadoConceitos)
    .where(and(eq(t.estadoConceitos.alunoId, alunoId), inArray(t.estadoConceitos.conceitoId, [...desempenho.keys()])));
  const porConceito = new Map(atuais.map((a) => [a.conceitoId, a]));

  for (const [conceitoId, ok] of desempenho) {
    const atual = porConceito.get(conceitoId);
    const anterior: AgendaConceito | null = atual ? { intervaloDias: atual.intervaloDias, proximaRevisao: atual.proximaRevisao, estado: atual.estado, revisoes: atual.revisoes } : null;
    const nova = agendaAposSessao(anterior, sessao.tipo, ok, dia);
    if (!nova || nova === anterior) continue;
    await tx
      .insert(t.estadoConceitos)
      .values({ alunoId, conceitoId, ...nova })
      .onConflictDoUpdate({ target: [t.estadoConceitos.alunoId, t.estadoConceitos.conceitoId], set: nova });
  }
}

/** Unidade da lição, se esta primeira conclusão completou todas as suas lições (4.7). */
async function unidadeCompletada(tx: Tx, alunoId: string, licaoId: string) {
  const [licao] = await tx
    .select({ unidadeId: t.licoes.unidadeId, titulo: t.unidades.titulo })
    .from(t.licoes)
    .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .where(eq(t.licoes.id, licaoId));
  const [{ total }] = await tx.select({ total: count() }).from(t.licoes).where(eq(t.licoes.unidadeId, licao.unidadeId));
  const [{ feitas }] = await tx
    .select({ feitas: count() })
    .from(t.conclusoesLicao)
    .innerJoin(t.licoes, eq(t.licoes.id, t.conclusoesLicao.licaoId))
    .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.licoes.unidadeId, licao.unidadeId)));
  return feitas >= total ? { id: licao.unidadeId, titulo: licao.titulo } : null;
}

/* Leitura para as telas */

export type ResumoAluno = {
  nome: string;
  xpTotal: number;
  xpHoje: number;
  coracoes: number;
  /** Sequência exibida: zero quando um dia inteiro passou sem estudo (4.5). */
  sequencia: number;
  maiorSequencia: number;
  estudouHoje: boolean;
  meta: number;
  sessoesHoje: number;
  conquistas: Conquista[];
  licoesConcluidas: number;
  hoje: string;
  /** Semana de domingo a sábado que contém hoje, com os dias de estudo (calendário da sequência). */
  semana: DiaSemana[];
  fuso: string;
  fusoPendente: string | null;
  som: boolean;
};

/** Indicadores do aluno no dia de estudo atual, para a trilha, o painel, Praticar e o perfil. */
export async function resumoDoAluno(db: Db, perfil: Perfil, agora = new Date()): Promise<ResumoAluno> {
  const { fuso } = fusoVigente(perfil, agora);
  const hoje = diaDeEstudo(agora, fuso, perfil.ultimoDiaEstudo);
  const inicioSemana = semanaDe(hoje, new Set())[0].dia;
  const [[atividade], [xp], conquistas, [{ licoes }], diasDaSemana] = await Promise.all([
    db.select({ sessoes: t.atividadeDiaria.sessoes }).from(t.atividadeDiaria).where(and(eq(t.atividadeDiaria.alunoId, perfil.id), eq(t.atividadeDiaria.dia, hoje))),
    db
      .select({ total: sql<number>`coalesce(sum(${t.lancamentos.valor}), 0)::int` })
      .from(t.lancamentos)
      .where(and(eq(t.lancamentos.alunoId, perfil.id), eq(t.lancamentos.diaEstudo, hoje), eq(t.lancamentos.moeda, "xp"))),
    db.select({ conquista: t.conquistasAluno.conquista }).from(t.conquistasAluno).where(eq(t.conquistasAluno.alunoId, perfil.id)).orderBy(asc(t.conquistasAluno.concedidaEm)),
    db.select({ licoes: count() }).from(t.conclusoesLicao).where(eq(t.conclusoesLicao.alunoId, perfil.id)),
    db
      .select({ dia: t.atividadeDiaria.dia })
      .from(t.atividadeDiaria)
      .where(and(eq(t.atividadeDiaria.alunoId, perfil.id), gte(t.atividadeDiaria.dia, inicioSemana), lte(t.atividadeDiaria.dia, hoje))),
  ]);
  return {
    nome: perfil.nome,
    xpTotal: perfil.xpTotal,
    xpHoje: xp?.total ?? 0,
    coracoes: perfil.coracoes,
    sequencia: sequenciaExibida({ atual: perfil.sequenciaAtual, maior: perfil.maiorSequencia, ultimoDia: perfil.ultimoDiaEstudo }, hoje),
    maiorSequencia: perfil.maiorSequencia,
    estudouHoje: perfil.ultimoDiaEstudo === hoje,
    meta: perfil.metaDiaria,
    sessoesHoje: atividade?.sessoes ?? 0,
    conquistas: conquistas.map((c) => c.conquista),
    licoesConcluidas: licoes,
    hoje,
    semana: semanaDe(hoje, new Set(diasDaSemana.map((d) => d.dia))),
    fuso: perfil.fuso,
    fusoPendente: perfil.fusoPendente,
    som: perfil.som,
  };
}
