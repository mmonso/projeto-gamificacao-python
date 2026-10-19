// Lições publicadas e início de sessão (E04.7; FL-03). Só a parte pública dos exercícios sai daqui:
// a tabela de gabaritos não é consultada por nenhuma função deste módulo (F-15).
// O identificador do aluno vem sempre da sessão verificada (servidor/auth/sessao).
import { and, asc, desc, eq, inArray, isNull, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { iniciarFila, type EstadoFila } from "@/modulos/aprendizagem/fila";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export type LicaoPublica = {
  id: string;
  unidadeId: string;
  unidadeTitulo: string;
  ordem: number;
  titulo: string;
  objetivo: string;
  versaoLicaoId: number;
  versao: number;
  totalExercicios: number;
};

/** Versão vigente de uma lição: a mais recente publicada e não retirada. */
async function versaoVigente(db: Db, licaoId: string) {
  const [v] = await db
    .select({ id: t.versoesLicao.id, versao: t.versoesLicao.versao })
    .from(t.versoesLicao)
    .where(and(eq(t.versoesLicao.licaoId, licaoId), isNull(t.versoesLicao.retiradaEm)))
    .orderBy(desc(t.versoesLicao.versao))
    .limit(1);
  return v ?? null;
}

export async function obterLicaoPublica(db: Db, licaoId: string): Promise<LicaoPublica | null> {
  const [licao] = await db
    .select({ id: t.licoes.id, unidadeId: t.licoes.unidadeId, unidadeTitulo: t.unidades.titulo, ordem: t.licoes.ordem, titulo: t.licoes.titulo, objetivo: t.licoes.objetivo })
    .from(t.licoes)
    .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .where(eq(t.licoes.id, licaoId));
  if (!licao) return null;
  const versao = await versaoVigente(db, licaoId);
  if (!versao) return null;
  const [{ total }] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(t.exercicios)
    .where(and(eq(t.exercicios.versaoLicaoId, versao.id), eq(t.exercicios.uso, "principal")));
  return { ...licao, versaoLicaoId: versao.id, versao: versao.versao, totalExercicios: total };
}

/**
 * Lição liberada para o aluno: a primeira do curso sempre; as demais depois de concluída a anterior
 * na ordem da trilha (PLANO, seção 8: desbloqueio).
 */
export async function licaoDisponivel(db: Db, alunoId: string, licaoId: string): Promise<boolean> {
  const trilha = await db
    .select({ id: t.licoes.id })
    .from(t.licoes)
    .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .orderBy(asc(t.unidades.ordem), asc(t.licoes.ordem));
  const posicao = trilha.findIndex((l) => l.id === licaoId);
  if (posicao < 0) return false;
  if (posicao === 0) return true;
  const anterior = trilha[posicao - 1].id;
  const [concluida] = await db
    .select({ licaoId: t.conclusoesLicao.licaoId })
    .from(t.conclusoesLicao)
    .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, anterior)));
  return Boolean(concluida);
}

export type ResultadoInicio = { ok: true; sessaoId: string; retomada: boolean } | { ok: false; motivo: "inexistente" | "bloqueada" };

/**
 * Inicia a sessão principal de uma lição ou retoma a que já está aberta (D-07: no máximo uma por aluno e lição).
 * A sessão fica presa à versão vigente no início; publicar uma versão nova não muda a fila dela.
 */
export async function iniciarSessao(db: Db, alunoId: string, licaoId: string): Promise<ResultadoInicio> {
  const aberta = await sessaoPrincipalAberta(db, alunoId, licaoId);
  if (aberta) return { ok: true, sessaoId: aberta, retomada: true };

  const licao = await obterLicaoPublica(db, licaoId);
  if (!licao) return { ok: false, motivo: "inexistente" };
  if (!(await licaoDisponivel(db, alunoId, licaoId))) return { ok: false, motivo: "bloqueada" };

  const itens = await db
    .select({ id: t.exercicios.exercicioId, posicao: t.exercicios.posicao })
    .from(t.exercicios)
    .where(and(eq(t.exercicios.versaoLicaoId, licao.versaoLicaoId), eq(t.exercicios.uso, "principal")))
    .orderBy(asc(t.exercicios.posicao));

  const criada = await db.transaction(async (tx) => {
    const [sessao] = await tx
      .insert(t.sessoes)
      .values({ alunoId, tipo: "principal", licaoId, versaoLicaoId: licao.versaoLicaoId, fila: iniciarFila(itens.map((i) => i.id)), totalItens: itens.length })
      // Outra requisição criou a sessão ao mesmo tempo: o índice parcial impede a segunda.
      .onConflictDoNothing()
      .returning({ id: t.sessoes.id });
    if (!sessao) return null;
    await tx.insert(t.itensSessao).values(itens.map((i) => ({ sessaoId: sessao.id, exercicioId: i.id, versaoLicaoId: licao.versaoLicaoId, posicaoOriginal: i.posicao })));
    return sessao.id;
  });
  if (criada) return { ok: true, sessaoId: criada, retomada: false };

  const concorrente = await sessaoPrincipalAberta(db, alunoId, licaoId);
  if (!concorrente) throw new Error("Sessão principal não encontrada depois de conflito na criação");
  return { ok: true, sessaoId: concorrente, retomada: true };
}

async function sessaoPrincipalAberta(db: Db, alunoId: string, licaoId: string): Promise<string | null> {
  const [s] = await db
    .select({ id: t.sessoes.id })
    .from(t.sessoes)
    .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.licaoId, licaoId), eq(t.sessoes.tipo, "principal"), inArray(t.sessoes.estado, ["aberta", "pausada"])));
  return s?.id ?? null;
}

export type SessaoAtual = {
  id: string;
  licao: Pick<LicaoPublica, "id" | "titulo" | "unidadeTitulo">;
  estado: (typeof t.sessoes.$inferSelect)["estado"];
  totalItens: number;
  resolvidos: number;
  exercicio: ExercicioPublico | null;
};

/** Sessão do aluno com o exercício atual. Sessão de outro aluno é tratada como inexistente (CA-42). */
export async function obterSessaoAtual(db: Db, alunoId: string, sessaoId: string): Promise<SessaoAtual | null> {
  if (!/^[0-9a-f-]{36}$/i.test(sessaoId)) return null;
  const [s] = await db
    .select({
      id: t.sessoes.id,
      estado: t.sessoes.estado,
      fila: t.sessoes.fila,
      totalItens: t.sessoes.totalItens,
      versaoLicaoId: t.sessoes.versaoLicaoId,
      licaoId: t.licoes.id,
      titulo: t.licoes.titulo,
      unidadeTitulo: t.unidades.titulo,
    })
    .from(t.sessoes)
    .innerJoin(t.licoes, eq(t.licoes.id, t.sessoes.licaoId))
    .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .where(and(eq(t.sessoes.id, sessaoId), eq(t.sessoes.alunoId, alunoId)));
  if (!s || s.versaoLicaoId === null) return null;

  const fila = s.fila as EstadoFila;
  const atual = fila.fila[0];
  let exercicio: ExercicioPublico | null = null;
  if (atual) {
    const [ex] = await db
      .select({ publico: t.exercicios.publico })
      .from(t.exercicios)
      .where(and(eq(t.exercicios.versaoLicaoId, s.versaoLicaoId), eq(t.exercicios.exercicioId, atual)));
    exercicio = (ex?.publico as ExercicioPublico | undefined) ?? null;
  }
  return {
    id: s.id,
    licao: { id: s.licaoId, titulo: s.titulo, unidadeTitulo: s.unidadeTitulo },
    estado: s.estado,
    totalItens: s.totalItens,
    resolvidos: fila.resolvidos.length,
    exercicio,
  };
}
