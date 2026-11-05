// Revisão recomendada e tela Praticar (E06.3; FL-05, F-27 a F-29; ESPECIFICACAO_MVP, 4.8).
// A revisão junta itens dos conceitos da agenda do aluno, na versão vigente das lições, com os vencidos à frente.
import { and, asc, desc, eq, gt, isNull } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { iniciarFila } from "@/modulos/aprendizagem/fila";
import { diaDeEstudo, fusoVigente } from "@/modulos/gamificacao/dias";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import * as t from "@/servidor/db/esquema";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;
type Perfil = typeof t.perfis.$inferSelect;

function hojeDoAluno(perfil: Perfil, agora: Date) {
  return diaDeEstudo(agora, fusoVigente(perfil, agora).fuso, perfil.ultimoDiaEstudo);
}

/** Conceitos da agenda: primeiro os vencidos, dos intervalos menores (erros e dicas recentes) para os maiores. */
async function agendaOrdenada(db: Pick<Db, "select">, alunoId: string, hoje: string) {
  const linhas = await db
    .select({ conceitoId: t.estadoConceitos.conceitoId, intervaloDias: t.estadoConceitos.intervaloDias, proximaRevisao: t.estadoConceitos.proximaRevisao })
    .from(t.estadoConceitos)
    .where(eq(t.estadoConceitos.alunoId, alunoId))
    .orderBy(asc(t.estadoConceitos.intervaloDias), asc(t.estadoConceitos.proximaRevisao));
  const vencidos = linhas.filter((l) => l.proximaRevisao <= hoje);
  // Sem vencidos suficientes, completa com os vistos mais recentemente, que têm a próxima revisão mais distante.
  const demais = linhas.filter((l) => l.proximaRevisao > hoje).sort((a, b) => b.proximaRevisao.localeCompare(a.proximaRevisao));
  return { vencidos: vencidos.map((l) => l.conceitoId), ordem: [...vencidos, ...demais].map((l) => l.conceitoId) };
}

export type ResultadoRevisao = { ok: true; sessaoId: string; recomendada: boolean } | { ok: false; motivo: "sem_conteudo" };

/**
 * Monta a revisão recomendada (FL-05, passo 2): de cinco a oito itens, priorizando os conceitos vencidos e,
 * entre eles, os que tiveram erro ou dica. Sem conceitos vencidos, é a revisão geral dos conceitos já vistos.
 * Uma revisão aberta há menos de 24 horas é retomada (D-08); depois disso, é descartada e outra é montada.
 */
export async function iniciarRevisao(db: Db, alunoId: string, agora = new Date()): Promise<ResultadoRevisao> {
  return db.transaction(async (tx) => {
    const [perfil] = await tx.select().from(t.perfis).where(eq(t.perfis.id, alunoId)).for("update");
    const hoje = hojeDoAluno(perfil, agora);
    const { vencidos, ordem } = await agendaOrdenada(tx, alunoId, hoje);

    const limite = new Date(agora.getTime() - PARAMETROS.horasExpiracaoPratica * 3_600_000);
    const [aberta] = await tx
      .select({ id: t.sessoes.id })
      .from(t.sessoes)
      .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, "revisao"), eq(t.sessoes.estado, "aberta"), gt(t.sessoes.atualizadoEm, limite)))
      .orderBy(desc(t.sessoes.atualizadoEm))
      .limit(1);
    if (aberta) return { ok: true, sessaoId: aberta.id, recomendada: vencidos.length > 0 } as const;

    const conhecidos = new Set(ordem);
    const candidatos = await exerciciosDosConceitos(tx, conhecidos);
    const tamanho = Math.min(PARAMETROS.itensRevisaoMax, Math.max(PARAMETROS.itensRevisaoMin, vencidos.length * 2));
    const escolhidos = escolherItens(candidatos, ordem, tamanho);
    if (escolhidos.length < PARAMETROS.itensRevisaoMin) return { ok: false, motivo: "sem_conteudo" } as const;

    await tx
      .update(t.sessoes)
      .set({ estado: "descartada", atualizadoEm: agora })
      .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, "revisao"), eq(t.sessoes.estado, "aberta")));
    const [sessao] = await tx
      .insert(t.sessoes)
      .values({ alunoId, tipo: "revisao", fila: iniciarFila(escolhidos.map((e) => e.id)), totalItens: escolhidos.length })
      .returning({ id: t.sessoes.id });
    await tx.insert(t.itensSessao).values(escolhidos.map((e, i) => ({ sessaoId: sessao.id, exercicioId: e.id, versaoLicaoId: e.versaoLicaoId, posicaoOriginal: i + 1 })));
    return { ok: true, sessaoId: sessao.id, recomendada: vencidos.length > 0 } as const;
  });
}

type Candidato = { id: string; versaoLicaoId: number; conceitos: string[]; uso: "principal" | "revisao" };

/** Exercícios das versões vigentes cujos conceitos o aluno já viu. */
async function exerciciosDosConceitos(db: Pick<Db, "select">, conhecidos: Set<string>): Promise<Candidato[]> {
  if (conhecidos.size === 0) return [];
  const linhas = await db
    .select({
      licaoId: t.versoesLicao.licaoId,
      versao: t.versoesLicao.versao,
      id: t.exercicios.exercicioId,
      versaoLicaoId: t.exercicios.versaoLicaoId,
      conceitos: t.exercicios.conceitos,
      uso: t.exercicios.uso,
    })
    .from(t.exercicios)
    .innerJoin(t.versoesLicao, eq(t.versoesLicao.id, t.exercicios.versaoLicaoId))
    .where(isNull(t.versoesLicao.retiradaEm));
  // Versão vigente de cada lição: a mais recente não retirada.
  const vigente = new Map<string, number>();
  for (const l of linhas) vigente.set(l.licaoId, Math.max(vigente.get(l.licaoId) ?? 0, l.versao));
  return linhas
    .filter((l) => vigente.get(l.licaoId) === l.versao && l.conceitos.length > 0 && l.conceitos.every((c) => conhecidos.has(c)))
    .map(({ id, versaoLicaoId, conceitos, uso }) => ({ id, versaoLicaoId, conceitos, uso }));
}

/**
 * Um item por conceito, na ordem de prioridade, preferindo as variações de revisão; depois, completa com
 * outros itens dos mesmos conceitos. Identificadores de exercício são únicos no curso.
 */
export function escolherItens(candidatos: Candidato[], ordem: string[], tamanho: number, aleatorio = Math.random): Candidato[] {
  const embaralhados = candidatos
    .map((c) => ({ c, p: (c.uso === "revisao" ? 0 : 1) + aleatorio() }))
    .sort((a, b) => a.p - b.p)
    .map(({ c }) => c);
  const escolhidos: Candidato[] = [];
  const usados = new Set<string>();
  const pegar = (c: Candidato) => {
    escolhidos.push(c);
    usados.add(c.id);
  };
  for (const conceito of ordem) {
    if (escolhidos.length >= tamanho) break;
    if (escolhidos.some((e) => e.conceitos.includes(conceito))) continue;
    const item = embaralhados.find((c) => !usados.has(c.id) && c.conceitos.includes(conceito));
    if (item) pegar(item);
  }
  for (const conceito of ordem) {
    for (const c of embaralhados) {
      if (escolhidos.length >= tamanho) return escolhidos;
      if (!usados.has(c.id) && c.conceitos.includes(conceito)) pegar(c);
    }
  }
  return escolhidos;
}

export type EstadoPraticar = {
  conceitosVencidos: number;
  conceitos: { id: string; nome: string; estado: "iniciado" | "praticando" | "consolidando"; vencido: boolean }[];
  licoesConcluidas: { id: string; titulo: string; unidadeTitulo: string; unidadeOrdem: number; ordem: number }[];
  /** Revisão já montada e ainda aberta: Praticar oferece Continuar. */
  revisaoAberta: boolean;
};

/** Dados da tela Praticar (F-27): revisão recomendada, conceitos da agenda e lições concluídas. */
export async function estadoPraticar(db: Db, perfil: Perfil, agora = new Date()): Promise<EstadoPraticar> {
  const hoje = hojeDoAluno(perfil, agora);
  const [conceitos, licoes, [aberta]] = await Promise.all([
    db
      .select({ id: t.conceitos.id, nome: t.conceitos.nome, estado: t.estadoConceitos.estado, proximaRevisao: t.estadoConceitos.proximaRevisao, unidadeOrdem: t.unidades.ordem })
      .from(t.estadoConceitos)
      .innerJoin(t.conceitos, eq(t.conceitos.id, t.estadoConceitos.conceitoId))
      .innerJoin(t.unidades, eq(t.unidades.id, t.conceitos.unidadeId))
      .where(eq(t.estadoConceitos.alunoId, perfil.id))
      .orderBy(asc(t.unidades.ordem), asc(t.estadoConceitos.proximaRevisao)),
    db
      .select({ id: t.licoes.id, titulo: t.licoes.titulo, ordem: t.licoes.ordem, unidadeTitulo: t.unidades.titulo, unidadeOrdem: t.unidades.ordem })
      .from(t.conclusoesLicao)
      .innerJoin(t.licoes, eq(t.licoes.id, t.conclusoesLicao.licaoId))
      .innerJoin(t.unidades, eq(t.unidades.id, t.licoes.unidadeId))
      .where(eq(t.conclusoesLicao.alunoId, perfil.id))
      .orderBy(asc(t.unidades.ordem), asc(t.licoes.ordem)),
    db
      .select({ id: t.sessoes.id })
      .from(t.sessoes)
      .where(and(eq(t.sessoes.alunoId, perfil.id), eq(t.sessoes.tipo, "revisao"), eq(t.sessoes.estado, "aberta")))
      .limit(1),
  ]);
  const lista = conceitos.map((c) => ({ id: c.id, nome: c.nome, estado: c.estado, vencido: c.proximaRevisao <= hoje }));
  return { conceitosVencidos: lista.filter((c) => c.vencido).length, conceitos: lista, licoesConcluidas: licoes, revisaoAberta: Boolean(aberta) };
}
