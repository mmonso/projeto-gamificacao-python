// Conquistas no banco (design/ANALISE_UX_GAMIFICACAO.md, seção 5): lê as métricas do aluno, concede as
// conquistas merecidas, uma única vez, e mostra o progresso de cada uma no perfil.
import { and, count, countDistinct, eq, gte, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { novasConquistas, progressoDasConquistas, type Conquista, type Metricas, type ProgressoConquista } from "@/modulos/gamificacao/conquistas";
import * as t from "@/servidor/db/esquema";

type Db = Pick<PgDatabase<PgQueryResultHKT, typeof t>, "select" | "insert">;

/** Métricas lidas do banco. Numa conclusão, a sessão já está concluída e com o resultado gravado. */
export async function lerMetricas(db: Pick<Db, "select">, alunoId: string): Promise<Metricas> {
  const [perfil] = await db
    .select({ xpTotal: t.perfis.xpTotal, maiorSequencia: t.perfis.maiorSequencia, sequenciaAtual: t.perfis.sequenciaAtual, meta: t.perfis.metaDiaria, fuso: t.perfis.fuso })
    .from(t.perfis)
    .where(eq(t.perfis.id, alunoId));
  const concluida = and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.estado, "concluida"));

  const [{ total: totalLicoes }] = await db.select({ total: count() }).from(t.licoes);
  const totaisPorUnidade = await db.select({ unidade: t.licoes.unidadeId, total: count() }).from(t.licoes).groupBy(t.licoes.unidadeId);
  const feitasPorUnidade = await db
    .select({ unidade: t.licoes.unidadeId, feitas: count() })
    .from(t.conclusoesLicao)
    .innerJoin(t.licoes, eq(t.licoes.id, t.conclusoesLicao.licaoId))
    .where(eq(t.conclusoesLicao.alunoId, alunoId))
    .groupBy(t.licoes.unidadeId);
  const feitas = new Map(feitasPorUnidade.map((f) => [f.unidade, f.feitas]));
  const licoesConcluidas = feitasPorUnidade.reduce((soma, f) => soma + f.feitas, 0);

  const [{ dias: diasDeMeta }] = await db
    .select({ dias: count() })
    .from(t.atividadeDiaria)
    .where(and(eq(t.atividadeDiaria.alunoId, alunoId), gte(t.atividadeDiaria.sessoes, perfil.meta)));

  // Sessão perfeita: todos os itens certos de primeira (a mesma regra da coroa na trilha).
  const perfeitas = await db
    .select({ licaoId: t.sessoes.licaoId, sessoes: count() })
    .from(t.sessoes)
    .where(and(concluida, sql`(${t.sessoes.resultado}->>'total')::int > 0 and (${t.sessoes.resultado}->>'acertosPrimeira')::int = (${t.sessoes.resultado}->>'total')::int`))
    .groupBy(t.sessoes.licaoId);

  const acertos = await db
    .select({ tipo: t.exercicios.tipo, exercicios: countDistinct(t.itensSessao.exercicioId) })
    .from(t.itensSessao)
    .innerJoin(t.sessoes, eq(t.sessoes.id, t.itensSessao.sessaoId))
    .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
    .where(and(concluida, eq(t.itensSessao.errouPrimeira, false)))
    .groupBy(t.exercicios.tipo);
  const acertosDe = (tipo: string) => acertos.find((a) => a.tipo === tipo)?.exercicios ?? 0;

  const sessoesPorTipo = await db.select({ tipo: t.sessoes.tipo, total: count() }).from(t.sessoes).where(concluida).groupBy(t.sessoes.tipo);
  const sessoesDe = (tipo: string) => sessoesPorTipo.find((s) => s.tipo === tipo)?.total ?? 0;
  const [{ dias: diasDeRevisao }] = await db
    .select({ dias: countDistinct(sql`(${t.sessoes.concluidaEm} at time zone ${perfil.fuso})::date`) })
    .from(t.sessoes)
    .where(and(concluida, eq(t.sessoes.tipo, "revisao")));
  const [{ consolidando }] = await db
    .select({ consolidando: count() })
    .from(t.estadoConceitos)
    .where(and(eq(t.estadoConceitos.alunoId, alunoId), eq(t.estadoConceitos.estado, "consolidando")));

  return {
    licoesConcluidas,
    totalLicoes,
    unidadeCompleta: totaisPorUnidade.some((u) => (feitas.get(u.unidade) ?? 0) >= u.total),
    maiorSequencia: Math.max(perfil.maiorSequencia, perfil.sequenciaAtual),
    diasDeMeta,
    sessoesPerfeitas: perfeitas.reduce((soma, p) => soma + p.sessoes, 0),
    licoesComCoroa: perfeitas.filter((p) => p.licaoId !== null).length,
    acertosEncontreErro: acertosDe("localizar_erro"),
    acertosMonteOPrograma: acertosDe("ordenar_blocos"),
    revisoesConcluidas: sessoesDe("revisao"),
    diasDeRevisao,
    conceitosConsolidando: consolidando,
    xpTotal: perfil.xpTotal,
    recuperacoesConcluidas: sessoesDe("recuperacao"),
  };
}

/** Concede, uma única vez, as conquistas merecidas; nunca remove (4.7, CA-99). */
export async function concederConquistas(tx: Db, alunoId: string): Promise<Conquista[]> {
  const existentes = await tx.select({ conquista: t.conquistasAluno.conquista }).from(t.conquistasAluno).where(eq(t.conquistasAluno.alunoId, alunoId));
  const novas = novasConquistas(existentes.map((e) => e.conquista), await lerMetricas(tx, alunoId));
  if (novas.length === 0) return [];
  const inseridas = await tx
    .insert(t.conquistasAluno)
    .values(novas.map((conquista) => ({ alunoId, conquista })))
    .onConflictDoNothing()
    .returning({ conquista: t.conquistasAluno.conquista });
  return inseridas.map((i) => i.conquista);
}

/** Progresso de todas as conquistas, para a grade do perfil. */
export async function progressoDoAluno(db: Pick<Db, "select">, alunoId: string): Promise<ProgressoConquista[]> {
  const existentes = await db.select({ conquista: t.conquistasAluno.conquista }).from(t.conquistasAluno).where(eq(t.conquistasAluno.alunoId, alunoId));
  return progressoDasConquistas(await lerMetricas(db, alunoId), existentes.map((e) => e.conquista));
}
