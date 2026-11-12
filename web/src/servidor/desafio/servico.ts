// Desafio do dia no servidor: monta os itens do dia a partir do conteúdo publicado e corrige sem gravar nada.
// Como na demonstração, o gabarito só sai depois da resposta, e as rotas anônimas têm limite de frequência.
import { and, desc, eq, inArray, isNull } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { z } from "zod";
import { solucaoDoGabarito } from "@/modulos/aprendizagem/contrato";
import { corrigir, respostaEsquema } from "@/modulos/aprendizagem/corretor";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import { diaDoDesafio, itensDoDesafio, numeroDoDia } from "@/modulos/desafio/desafio";
import * as t from "@/servidor/db/esquema";
import type { CorrecaoDemo } from "@/servidor/demo/servico";
import { comCartoes } from "@/servidor/licoes/cartoes";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

type ItemCandidato = { id: string; dificuldade: number; versaoLicaoId: number; publico: ExercicioPublico };

/** "Qual é a saída?" das versões vigentes de todas as lições, da lição principal e da revisão. */
async function candidatos(db: Pick<Db, "select" | "selectDistinctOn">): Promise<ItemCandidato[]> {
  const vigentes = await db
    .selectDistinctOn([t.versoesLicao.licaoId], { id: t.versoesLicao.id })
    .from(t.versoesLicao)
    .where(isNull(t.versoesLicao.retiradaEm))
    .orderBy(t.versoesLicao.licaoId, desc(t.versoesLicao.versao));
  if (!vigentes.length) return [];
  const linhas = await db
    .select({ id: t.exercicios.exercicioId, dificuldade: t.exercicios.dificuldade, versaoLicaoId: t.exercicios.versaoLicaoId, publico: t.exercicios.publico })
    .from(t.exercicios)
    .where(and(inArray(t.exercicios.versaoLicaoId, vigentes.map((v) => v.id)), eq(t.exercicios.tipo, "escolher_resultado")));
  return linhas
    .map((l) => ({ ...l, publico: l.publico as ExercicioPublico }))
    .filter((l) => l.publico.tipo === "escolher_resultado" && l.publico.opcoesSao === "saida");
}

async function itensDoNumero(db: Db, numero: number) {
  const todos = await candidatos(db);
  const porId = new Map(todos.map((c) => [c.id, c]));
  return itensDoDesafio(todos, numero).map((c) => porId.get(c.id)!);
}

/** O número de hoje e os vizinhos: quem começou perto da meia-noite, ou está noutro fuso, ainda termina. */
export function numeroAceito(numero: number, agora = new Date()) {
  return Math.abs(numero - numeroDoDia(diaDoDesafio(agora))) <= 1;
}

export type DesafioPublico = { numero: number; exercicios: ExercicioPublico[] };

/** Desafio de hoje, só com a parte pública. Os cartões de conceito ficam no botão Conceito, sem abrir sozinhos. */
export async function desafioDeHoje(db: Db, agora = new Date()): Promise<DesafioPublico | null> {
  const numero = numeroDoDia(diaDoDesafio(agora));
  const itens = await itensDoNumero(db, numero);
  if (!itens.length) return null;
  const exercicios = await Promise.all(
    itens.map(async (i) => {
      const ex = await comCartoes(db, i.publico, { demo: true });
      return ex.cartoes ? { ...ex, cartoes: ex.cartoes.map((c) => ({ ...c, novo: false })) } : ex;
    }),
  );
  return { numero, exercicios };
}

async function itemDoDesafio(db: Db, numero: number, exercicioId: string) {
  const item = (await itensDoNumero(db, numero)).find((i) => i.id === exercicioId);
  if (!item) return null;
  const [e] = await db
    .select({ dicas: t.exercicios.dicas, gabarito: t.gabaritos.gabarito, explicacao: t.gabaritos.explicacao })
    .from(t.exercicios)
    .innerJoin(t.gabaritos, and(eq(t.gabaritos.versaoLicaoId, t.exercicios.versaoLicaoId), eq(t.gabaritos.exercicioId, t.exercicios.exercicioId)))
    .where(and(eq(t.exercicios.versaoLicaoId, item.versaoLicaoId), eq(t.exercicios.exercicioId, exercicioId)));
  return e ? { ...e, gabarito: e.gabarito as Gabarito } : null;
}

const numeroDesafio = z.number().int().min(1).max(100_000);

export const pedidoCorrecaoDesafio = z.object({ numero: numeroDesafio, exercicioId: z.string().min(1).max(40), resposta: respostaEsquema });
export const pedidoDicaDesafio = z.object({ numero: numeroDesafio, exercicioId: z.string().min(1).max(40), numeroDica: z.number().int().min(1).max(3) });
export const pedidoEventoDesafio = z.object({
  numero: numeroDesafio,
  evento: z.enum(["iniciado", "concluido"]),
  /** Veio de um link compartilhado (?c=1): mede quantos jogam a partir de um compartilhamento. */
  compartilhado: z.boolean(),
  acertos: z.number().int().min(0).max(10).optional(),
});

/** Corrige sem gravar nada. Devolve null para item fora do desafio daquele número ou número fora do prazo. */
export async function corrigirDesafio(db: Db, pedido: z.infer<typeof pedidoCorrecaoDesafio>, agora = new Date()): Promise<CorrecaoDemo | null> {
  if (!numeroAceito(pedido.numero, agora)) return null;
  const ex = await itemDoDesafio(db, pedido.numero, pedido.exercicioId);
  if (!ex || ex.gabarito.tipo !== pedido.resposta.tipo) return null;
  const opcao = pedido.resposta.tipo === "escolher_resultado" ? pedido.resposta.opcao : null;
  return {
    correta: corrigir(ex.gabarito, pedido.resposta),
    solucao: solucaoDoGabarito(ex.gabarito),
    explicacao: ex.explicacao,
    feedbackOpcao: ex.gabarito.tipo === "escolher_resultado" && opcao ? ex.gabarito.feedbackOpcoes[opcao] : undefined,
  };
}

export async function dicaDesafio(db: Db, pedido: z.infer<typeof pedidoDicaDesafio>, agora = new Date()): Promise<string | null> {
  if (!numeroAceito(pedido.numero, agora)) return null;
  return (await itemDoDesafio(db, pedido.numero, pedido.exercicioId))?.dicas[pedido.numeroDica - 1] ?? null;
}
