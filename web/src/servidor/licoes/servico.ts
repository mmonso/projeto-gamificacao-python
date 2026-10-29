// Lições publicadas e início de sessão (E04.7; FL-03). Só a parte pública dos exercícios sai daqui:
// a tabela de gabaritos não é consultada por nenhuma função deste módulo (F-15).
// O identificador do aluno vem sempre da sessão verificada (servidor/auth/sessao).
import { and, asc, desc, eq, gt, inArray, isNull, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { iniciarFila, type EstadoFila } from "@/modulos/aprendizagem/fila";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
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

/** Identificadores das lições na ordem da trilha: unidade, depois lição. */
export async function ordemDaTrilha(db: Pick<Db, "select">): Promise<string[]> {
  const linhas = await db
    .select({ id: t.licoes.id })
    .from(t.licoes)
    .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .orderBy(asc(t.unidades.ordem), asc(t.licoes.ordem));
  return linhas.map((l) => l.id);
}

/**
 * Lição liberada para o aluno: a primeira do curso sempre; as demais depois de concluída a anterior
 * na ordem da trilha (PLANO, seção 8: desbloqueio).
 */
export async function licaoDisponivel(db: Db, alunoId: string, licaoId: string): Promise<boolean> {
  const trilha = await ordemDaTrilha(db);
  const posicao = trilha.indexOf(licaoId);
  if (posicao < 0) return false;
  if (posicao === 0) return true;
  const anterior = trilha[posicao - 1];
  const [concluida] = await db
    .select({ licaoId: t.conclusoesLicao.licaoId })
    .from(t.conclusoesLicao)
    .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, anterior)));
  return Boolean(concluida);
}

export type EstadoNo = "concluida" | "atual" | "bloqueada";
export type NoTrilha = { id: string; ordem: number; titulo: string; objetivo: string; estado: EstadoNo; sessaoAberta: boolean; desafio: boolean };
export type UnidadeTrilha = { id: string; ordem: number; titulo: string; descricao: string; licoes: NoTrilha[] };

/**
 * Trilha do aluno (F-07): lições concluídas, a atual (primeira não concluída) e as bloqueadas.
 * A quinta lição de cada unidade é o desafio final.
 */
export async function obterTrilha(db: Db, alunoId: string): Promise<UnidadeTrilha[]> {
  const [licoes, concluidas, abertas] = await Promise.all([
    db
      .select({
        id: t.licoes.id,
        ordem: t.licoes.ordem,
        titulo: t.licoes.titulo,
        objetivo: t.licoes.objetivo,
        unidadeId: t.unidades.id,
        unidadeOrdem: t.unidades.ordem,
        unidadeTitulo: t.unidades.titulo,
        unidadeDescricao: t.unidades.descricao,
      })
      .from(t.licoes)
      .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
      .orderBy(asc(t.unidades.ordem), asc(t.licoes.ordem)),
    db.select({ licaoId: t.conclusoesLicao.licaoId }).from(t.conclusoesLicao).where(eq(t.conclusoesLicao.alunoId, alunoId)),
    db
      .select({ licaoId: t.sessoes.licaoId })
      .from(t.sessoes)
      .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, "principal"), inArray(t.sessoes.estado, ["aberta", "pausada"]))),
  ]);
  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const emAndamento = new Set(abertas.map((s) => s.licaoId));
  const ultimaPorUnidade = new Map(licoes.map((l) => [l.unidadeId, l.ordem]));

  const unidades: UnidadeTrilha[] = [];
  let atualDefinida = false;
  for (const l of licoes) {
    let estado: EstadoNo = "bloqueada";
    if (feitas.has(l.id)) estado = "concluida";
    else if (!atualDefinida) {
      estado = "atual";
      atualDefinida = true;
    }
    let unidade = unidades.at(-1);
    if (unidade?.id !== l.unidadeId) {
      unidade = { id: l.unidadeId, ordem: l.unidadeOrdem, titulo: l.unidadeTitulo, descricao: l.unidadeDescricao, licoes: [] };
      unidades.push(unidade);
    }
    unidade.licoes.push({
      id: l.id,
      ordem: l.ordem,
      titulo: l.titulo,
      objetivo: l.objetivo,
      estado,
      sessaoAberta: emAndamento.has(l.id),
      desafio: ultimaPorUnidade.get(l.unidadeId) === l.ordem,
    });
  }
  return unidades;
}

export type ResultadoInicio = { ok: true; sessaoId: string; retomada: boolean } | { ok: false; motivo: "inexistente" | "bloqueada" | "sem_coracoes" };

/**
 * Inicia a sessão de uma lição ou retoma a que já está aberta. Numa lição já concluída, a sessão é de prática
 * (FL-05) e não usa corações; nas demais, é a principal (D-07: no máximo uma por aluno e lição), que não
 * começa com saldo zero (4.3). A sessão fica presa à versão vigente no início.
 */
export async function iniciarSessao(db: Db, alunoId: string, licaoId: string): Promise<ResultadoInicio> {
  const aberta = await sessaoPrincipalAberta(db, alunoId, licaoId);
  if (aberta) return { ok: true, sessaoId: aberta, retomada: true };

  const licao = await obterLicaoPublica(db, licaoId);
  if (!licao) return { ok: false, motivo: "inexistente" };
  if (await licaoConcluida(db, alunoId, licaoId)) return iniciarPratica(db, alunoId, licao);
  if (!(await licaoDisponivel(db, alunoId, licaoId))) return { ok: false, motivo: "bloqueada" };
  const [perfil] = await db.select({ coracoes: t.perfis.coracoes }).from(t.perfis).where(eq(t.perfis.id, alunoId));
  if (perfil.coracoes === 0) return { ok: false, motivo: "sem_coracoes" };

  const itens = await itensPrincipais(db, licao.versaoLicaoId);
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

async function itensPrincipais(db: Pick<Db, "select">, versaoLicaoId: number) {
  return db
    .select({ id: t.exercicios.exercicioId, posicao: t.exercicios.posicao })
    .from(t.exercicios)
    .where(and(eq(t.exercicios.versaoLicaoId, versaoLicaoId), eq(t.exercicios.uso, "principal")))
    .orderBy(asc(t.exercicios.posicao));
}

async function licaoConcluida(db: Db, alunoId: string, licaoId: string) {
  const [c] = await db
    .select({ licaoId: t.conclusoesLicao.licaoId })
    .from(t.conclusoesLicao)
    .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, licaoId)));
  return Boolean(c);
}

/** Prática aberta há menos tempo que a expiração (D-08) é retomada; depois disso, começa outra. */
async function iniciarPratica(db: Db, alunoId: string, licao: LicaoPublica): Promise<ResultadoInicio> {
  const limite = new Date(Date.now() - PARAMETROS.horasExpiracaoPratica * 3_600_000);
  const [aberta] = await db
    .select({ id: t.sessoes.id })
    .from(t.sessoes)
    .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.licaoId, licao.id), eq(t.sessoes.tipo, "pratica"), eq(t.sessoes.estado, "aberta"), gt(t.sessoes.atualizadoEm, limite)))
    .orderBy(desc(t.sessoes.atualizadoEm))
    .limit(1);
  if (aberta) return { ok: true, sessaoId: aberta.id, retomada: true };

  const itens = await itensPrincipais(db, licao.versaoLicaoId);
  const sessaoId = await db.transaction(async (tx) => {
    const [sessao] = await tx
      .insert(t.sessoes)
      .values({ alunoId, tipo: "pratica", licaoId: licao.id, versaoLicaoId: licao.versaoLicaoId, fila: iniciarFila(itens.map((i) => i.id)), totalItens: itens.length })
      .returning({ id: t.sessoes.id });
    await tx.insert(t.itensSessao).values(itens.map((i) => ({ sessaoId: sessao.id, exercicioId: i.id, versaoLicaoId: licao.versaoLicaoId, posicaoOriginal: i.posicao })));
    return sessao.id;
  });
  return { ok: true, sessaoId, retomada: false };
}

export type ResultadoRecuperacao = { ok: true; sessaoId: string } | { ok: false; motivo: "coracoes_cheios" | "sem_conteudo" };

/**
 * Monta uma revisão de recuperação (FL-06, passo 2): itens das lições que o aluno já estudou, na versão vigente,
 * só de conceitos que ele já viu, com os que errou de primeira à frente. Com cinco corações, o pedido é recusado
 * (CA-80). Uma recuperação abandonada é descartada e a nova monta outra revisão.
 */
export async function iniciarRecuperacao(db: Db, alunoId: string): Promise<ResultadoRecuperacao> {
  return db.transaction(async (tx) => {
    const [perfil] = await tx.select({ coracoes: t.perfis.coracoes }).from(t.perfis).where(eq(t.perfis.id, alunoId)).for("update");
    if (perfil.coracoes >= PARAMETROS.coracoesMaximos) return { ok: false, motivo: "coracoes_cheios" } as const;

    const vistos = await tx
      .select({ licaoId: t.sessoes.licaoId, conceitos: t.exercicios.conceitos, errouPrimeira: t.itensSessao.errouPrimeira })
      .from(t.itensSessao)
      .innerJoin(t.sessoes, eq(t.sessoes.id, t.itensSessao.sessaoId))
      .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
      .where(and(eq(t.sessoes.alunoId, alunoId), gt(t.itensSessao.tentativas, 0)));
    const conceitosVistos = new Set(vistos.flatMap((v) => v.conceitos));
    const conceitosErrados = new Set(vistos.filter((v) => v.errouPrimeira).flatMap((v) => v.conceitos));
    const licoes = [...new Set(vistos.map((v) => v.licaoId).filter((l): l is string => l !== null))];

    const candidatos: { id: string; versaoLicaoId: number; conceitos: string[]; uso: "principal" | "revisao" }[] = [];
    for (const licaoId of licoes) {
      const versao = await versaoVigente(tx, licaoId);
      if (!versao) continue;
      const exercicios = await tx
        .select({ id: t.exercicios.exercicioId, versaoLicaoId: t.exercicios.versaoLicaoId, conceitos: t.exercicios.conceitos, uso: t.exercicios.uso })
        .from(t.exercicios)
        .where(eq(t.exercicios.versaoLicaoId, versao.id));
      candidatos.push(...exercicios.filter((e) => e.conceitos.every((c) => conceitosVistos.has(c))));
    }
    // Primeiro os de conceitos errados; depois as variações de revisão; o resto em ordem aleatória.
    const peso = (e: (typeof candidatos)[number]): number => (e.conceitos.some((c) => conceitosErrados.has(c)) ? 0 : 2) + (e.uso === "revisao" ? 0 : 1) + Math.random();
    const escolhidos = candidatos
      .map((e) => ({ e, p: peso(e) }))
      .sort((a, b) => a.p - b.p)
      .slice(0, PARAMETROS.itensRecuperacao)
      .map(({ e }) => e);
    if (escolhidos.length < PARAMETROS.itensRecuperacao) return { ok: false, motivo: "sem_conteudo" } as const;

    await tx
      .update(t.sessoes)
      .set({ estado: "descartada", atualizadoEm: new Date() })
      .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, "recuperacao"), eq(t.sessoes.estado, "aberta")));
    const [sessao] = await tx
      .insert(t.sessoes)
      .values({ alunoId, tipo: "recuperacao", fila: iniciarFila(escolhidos.map((e) => e.id)), totalItens: escolhidos.length })
      .returning({ id: t.sessoes.id });
    await tx.insert(t.itensSessao).values(escolhidos.map((e, i) => ({ sessaoId: sessao.id, exercicioId: e.id, versaoLicaoId: e.versaoLicaoId, posicaoOriginal: i + 1 })));
    return { ok: true, sessaoId: sessao.id } as const;
  });
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
  tipo: (typeof t.sessoes.$inferSelect)["tipo"];
  /** Lição da sessão; null numa recuperação, que junta itens de várias lições. */
  licao: Pick<LicaoPublica, "id" | "titulo" | "unidadeTitulo"> | null;
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
      tipo: t.sessoes.tipo,
      estado: t.sessoes.estado,
      fila: t.sessoes.fila,
      totalItens: t.sessoes.totalItens,
      licaoId: t.licoes.id,
      titulo: t.licoes.titulo,
      unidadeTitulo: t.unidades.titulo,
    })
    .from(t.sessoes)
    .leftJoin(t.licoes, eq(t.licoes.id, t.sessoes.licaoId))
    .leftJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
    .where(and(eq(t.sessoes.id, sessaoId), eq(t.sessoes.alunoId, alunoId)));
  if (!s) return null;

  const fila = s.fila as EstadoFila;
  const atual = fila.fila[0];
  let exercicio: ExercicioPublico | null = null;
  if (atual) {
    // Na versão gravada no item, que numa recuperação muda de um item para outro.
    const [ex] = await db
      .select({ publico: t.exercicios.publico })
      .from(t.itensSessao)
      .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
      .where(and(eq(t.itensSessao.sessaoId, s.id), eq(t.itensSessao.exercicioId, atual)));
    exercicio = (ex?.publico as ExercicioPublico | undefined) ?? null;
  }
  return {
    id: s.id,
    tipo: s.tipo,
    licao: s.licaoId && s.titulo && s.unidadeTitulo ? { id: s.licaoId, titulo: s.titulo, unidadeTitulo: s.unidadeTitulo } : null,
    estado: s.estado,
    totalItens: s.totalItens,
    resolvidos: fila.resolvidos.length,
    exercicio,
  };
}
