// Preferências e dados pessoais do aluno (F-31, F-32; E08.5). O identificador vem sempre da sessão verificada.
import { asc, eq, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { pedirMudancaDeFuso } from "@/modulos/gamificacao/dias";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

/** Nova meta diária: vale a partir do dia de estudo atual (4.4). */
export async function mudarMeta(db: Db, alunoId: string, meta: number) {
  if (!(PARAMETROS.opcoesMeta as readonly number[]).includes(meta)) throw new Error(`Meta inválida: ${meta}`);
  await db.update(t.perfis).set({ metaDiaria: meta }).where(eq(t.perfis.id, alunoId));
}

/** Pede uma mudança de fuso: vale a partir do próximo dia de estudo, contado no fuso atual (4.6). */
export async function mudarFuso(db: Db, alunoId: string, fuso: string, agora = new Date()) {
  await db.transaction(async (tx) => {
    const [p] = await tx.select().from(t.perfis).where(eq(t.perfis.id, alunoId)).for("update");
    const config = pedirMudancaDeFuso({ fuso: p.fuso, fusoPendente: p.fusoPendente, pendenteAPartirDe: p.pendenteAPartirDe }, fuso, agora);
    await tx.update(t.perfis).set(config).where(eq(t.perfis.id, alunoId));
  });
}

export async function mudarNome(db: Db, alunoId: string, nome: string) {
  await db.update(t.perfis).set({ nome: nome.trim().slice(0, 40) }).where(eq(t.perfis.id, alunoId));
}

/**
 * Histórico do aluno para exportação (F-32, CA-115): só os próprios dados de progresso.
 * Não inclui gabaritos nem dados de outras contas.
 */
export async function exportarHistorico(db: Db, alunoId: string) {
  const [perfil] = await db.select().from(t.perfis).where(eq(t.perfis.id, alunoId));
  const [conclusoes, lancamentos, atividade, conquistas, conceitos, sessoes, respostas, eventos] = await Promise.all([
    db.select({ licao: t.conclusoesLicao.licaoId, concluidaEm: t.conclusoesLicao.concluidaEm }).from(t.conclusoesLicao).where(eq(t.conclusoesLicao.alunoId, alunoId)).orderBy(asc(t.conclusoesLicao.concluidaEm)),
    db
      .select({ moeda: t.lancamentos.moeda, causa: t.lancamentos.causa, valor: t.lancamentos.valor, diaEstudo: t.lancamentos.diaEstudo, criadoEm: t.lancamentos.criadoEm })
      .from(t.lancamentos)
      .where(eq(t.lancamentos.alunoId, alunoId))
      .orderBy(asc(t.lancamentos.id)),
    db.select({ dia: t.atividadeDiaria.dia, sessoes: t.atividadeDiaria.sessoes }).from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, alunoId)).orderBy(asc(t.atividadeDiaria.dia)),
    db.select({ conquista: t.conquistasAluno.conquista, concedidaEm: t.conquistasAluno.concedidaEm }).from(t.conquistasAluno).where(eq(t.conquistasAluno.alunoId, alunoId)),
    db
      .select({ conceito: t.estadoConceitos.conceitoId, estado: t.estadoConceitos.estado, intervaloDias: t.estadoConceitos.intervaloDias, proximaRevisao: t.estadoConceitos.proximaRevisao })
      .from(t.estadoConceitos)
      .where(eq(t.estadoConceitos.alunoId, alunoId)),
    db
      .select({ id: t.sessoes.id, tipo: t.sessoes.tipo, licao: t.sessoes.licaoId, estado: t.sessoes.estado, criadoEm: t.sessoes.criadoEm, concluidaEm: t.sessoes.concluidaEm })
      .from(t.sessoes)
      .where(eq(t.sessoes.alunoId, alunoId))
      .orderBy(asc(t.sessoes.criadoEm)),
    // Respostas enviadas e eventos de uso: a exportação traz todos os dados da conta (LGPD, art. 18).
    db
      .select({ sessao: t.submissoes.sessaoId, exercicio: t.submissoes.exercicioId, resposta: t.submissoes.resposta, correta: t.submissoes.correta, criadoEm: t.submissoes.criadoEm })
      .from(t.submissoes)
      .innerJoin(t.sessoes, eq(t.sessoes.id, t.submissoes.sessaoId))
      .where(eq(t.sessoes.alunoId, alunoId))
      .orderBy(asc(t.submissoes.criadoEm)),
    db.select({ nome: t.eventosProduto.nome, dados: t.eventosProduto.dados, criadoEm: t.eventosProduto.criadoEm }).from(t.eventosProduto).where(eq(t.eventosProduto.alunoId, alunoId)).orderBy(asc(t.eventosProduto.id)),
  ]);
  return {
    exportadoEm: new Date().toISOString(),
    perfil: perfil && {
      nome: perfil.nome,
      metaDiaria: perfil.metaDiaria,
      fuso: perfil.fuso,
      som: perfil.som,
      coracoes: perfil.coracoes,
      xpTotal: perfil.xpTotal,
      sequenciaAtual: perfil.sequenciaAtual,
      maiorSequencia: perfil.maiorSequencia,
      termosAceitosEm: perfil.termosAceitosEm,
      criadoEm: perfil.criadoEm,
    },
    conclusoes,
    lancamentos,
    atividade,
    conquistas,
    conceitos,
    sessoes,
    respostas,
    eventos,
  };
}

/**
 * Remove todos os dados do aluno (F-32, CA-116): o perfil leva, em cascata, sessões, respostas, conclusões,
 * XP, atividade, agenda, conquistas e a transferência da demonstração. Eventos de produto também saem.
 */
export async function excluirDadosDoAluno(tx: Pick<Db, "delete" | "execute">, alunoId: string) {
  await tx.delete(t.eventosProduto).where(eq(t.eventosProduto.alunoId, alunoId));
  await tx.delete(t.perfis).where(eq(t.perfis.id, alunoId));
}

/** Remove o usuário do Supabase Auth pela conexão do servidor; o login deixa de funcionar. */
export async function excluirUsuarioAuth(tx: Pick<Db, "execute">, alunoId: string) {
  await tx.execute(sql`delete from auth.users where id = ${alunoId}`);
}
