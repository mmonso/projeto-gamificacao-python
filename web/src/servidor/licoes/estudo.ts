// Operações de estudo de uma sessão: responder, pedir dica e concluir (FL-03, FL-04; E05.3 a E05.6).
// Cada operação trava a linha da sessão, confere o dono e é segura para reenvio:
// repetir o mesmo pedido devolve o resultado já gravado, sem novo efeito.
// Corações, XP, atividade e sequência entram no E06, dentro destas mesmas transações.
import { and, asc, count, eq, lt, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import {
  solucaoDoGabarito,
  type PedidoSubmissao,
  type Progresso,
  type ResultadoConclusao,
  type ResultadoSubmissao,
} from "@/modulos/aprendizagem/contrato";
import { corrigir } from "@/modulos/aprendizagem/corretor";
import { acertosDePrimeira, registrarResultado, type EstadoFila } from "@/modulos/aprendizagem/fila";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";
import { ordemDaTrilha } from "./servico";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];

export class ErroEstudo extends Error {
  constructor(
    readonly codigo: "sessao_inexistente" | "desatualizada" | "invalida" | "incompleta",
    mensagem: string,
  ) {
    super(mensagem);
  }
}

/** Sessão do aluno, travada até o fim da transação. Sessão de outro aluno é tratada como inexistente. */
async function travarSessao(tx: Tx, alunoId: string, sessaoId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(sessaoId)) throw new ErroEstudo("sessao_inexistente", "Sessão não encontrada.");
  const [s] = await tx
    .select()
    .from(t.sessoes)
    .where(and(eq(t.sessoes.id, sessaoId), eq(t.sessoes.alunoId, alunoId)))
    .for("update");
  if (!s || s.versaoLicaoId === null || s.licaoId === null) throw new ErroEstudo("sessao_inexistente", "Sessão não encontrada.");
  return { ...s, versaoLicaoId: s.versaoLicaoId, licaoId: s.licaoId, fila: s.fila as EstadoFila };
}

async function exercicioPublico(tx: Tx, versaoLicaoId: number, exercicioId: string | undefined): Promise<ExercicioPublico | null> {
  if (!exercicioId) return null;
  const [ex] = await tx
    .select({ publico: t.exercicios.publico })
    .from(t.exercicios)
    .where(and(eq(t.exercicios.versaoLicaoId, versaoLicaoId), eq(t.exercicios.exercicioId, exercicioId)));
  return (ex?.publico as ExercicioPublico | undefined) ?? null;
}

async function progresso(tx: Tx, versaoLicaoId: number, fila: EstadoFila, total: number): Promise<Progresso> {
  return {
    resolvidos: fila.resolvidos.length,
    total,
    concluida: fila.fila.length === 0,
    proximo: await exercicioPublico(tx, versaoLicaoId, fila.fila[0]),
  };
}

/** Gabarito e explicação: lidos só aqui, depois da submissão gravada. */
async function lerGabarito(tx: Tx, versaoLicaoId: number, exercicioId: string) {
  const [g] = await tx
    .select({ gabarito: t.gabaritos.gabarito, explicacao: t.gabaritos.explicacao })
    .from(t.gabaritos)
    .where(and(eq(t.gabaritos.versaoLicaoId, versaoLicaoId), eq(t.gabaritos.exercicioId, exercicioId)));
  if (!g) throw new Error(`Gabarito ausente: ${exercicioId}@${versaoLicaoId}`);
  return { gabarito: g.gabarito as Gabarito, explicacao: g.explicacao };
}

function feedbackDaOpcao(gabarito: Gabarito, resposta: unknown): string | undefined {
  if (gabarito.tipo !== "escolher_resultado") return undefined;
  const opcao = (resposta as { opcao?: unknown })?.opcao;
  return typeof opcao === "string" ? gabarito.feedbackOpcoes[opcao] : undefined;
}

/**
 * Corrige e grava a resposta do item atual (FL-03, passos 4 a 6). A fila só avança com acerto;
 * o item errado volta ao fim e o desempenho da primeira tentativa é preservado.
 */
export async function submeter(db: Db, alunoId: string, sessaoId: string, pedido: PedidoSubmissao): Promise<ResultadoSubmissao> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);

    const [gravada] = await tx.select().from(t.submissoes).where(eq(t.submissoes.id, pedido.id));
    if (gravada) {
      // Reenvio (FL-04, passo 2): devolve o resultado gravado. Um id usado em outra sessão é recusado.
      if (gravada.sessaoId !== sessao.id) throw new ErroEstudo("invalida", "Identificador de submissão já usado.");
      const [{ anteriores }] = await tx
        .select({ anteriores: count() })
        .from(t.submissoes)
        .where(and(eq(t.submissoes.sessaoId, sessao.id), eq(t.submissoes.exercicioId, gravada.exercicioId), lt(t.submissoes.criadoEm, gravada.criadoEm)));
      const { gabarito, explicacao } = await lerGabarito(tx, sessao.versaoLicaoId, gravada.exercicioId);
      return {
        submissaoId: gravada.id,
        exercicioId: gravada.exercicioId,
        exercicio: (await exercicioPublico(tx, sessao.versaoLicaoId, gravada.exercicioId))!,
        correta: gravada.correta,
        primeiraTentativa: anteriores === 0,
        solucao: solucaoDoGabarito(gabarito),
        explicacao,
        feedbackOpcao: feedbackDaOpcao(gabarito, gravada.resposta),
        ...(await progresso(tx, sessao.versaoLicaoId, sessao.fila, sessao.totalItens)),
      };
    }

    // Outra aba já respondeu este item, ou a sessão não aceita respostas: a interface recarrega a sessão.
    if (sessao.estado !== "aberta" || sessao.fila.fila[0] !== pedido.exercicioId) {
      throw new ErroEstudo("desatualizada", "Esta lição mudou em outra aba ou aparelho.");
    }

    const { gabarito, explicacao } = await lerGabarito(tx, sessao.versaoLicaoId, pedido.exercicioId);
    const correta = corrigir(gabarito, pedido.resposta);
    const { estado: fila, primeiraTentativa } = registrarResultado(sessao.fila, pedido.exercicioId, correta);

    await tx.insert(t.submissoes).values({ id: pedido.id, sessaoId: sessao.id, exercicioId: pedido.exercicioId, resposta: pedido.resposta, correta });
    await tx
      .update(t.itensSessao)
      .set({
        tentativas: sql`${t.itensSessao.tentativas} + 1`,
        resolvido: correta,
        ...(primeiraTentativa ? { errouPrimeira: !correta } : {}),
      })
      .where(and(eq(t.itensSessao.sessaoId, sessao.id), eq(t.itensSessao.exercicioId, pedido.exercicioId)));
    await tx.update(t.sessoes).set({ fila, atualizadoEm: new Date() }).where(eq(t.sessoes.id, sessao.id));

    return {
      submissaoId: pedido.id,
      exercicioId: pedido.exercicioId,
      exercicio: (await exercicioPublico(tx, sessao.versaoLicaoId, pedido.exercicioId))!,
      correta,
      primeiraTentativa,
      solucao: solucaoDoGabarito(gabarito),
      explicacao,
      feedbackOpcao: feedbackDaOpcao(gabarito, pedido.resposta),
      ...(await progresso(tx, sessao.versaoLicaoId, fila, sessao.totalItens)),
    };
  });
}

/** Dica número `numero` do item atual (FL-03, passo 3). Registra o maior número de dicas vistas. */
export async function pedirDica(db: Db, alunoId: string, sessaoId: string, exercicioId: string, numero: number): Promise<string> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);
    if (sessao.estado !== "aberta" || sessao.fila.fila[0] !== exercicioId) throw new ErroEstudo("desatualizada", "Esta lição mudou em outra aba ou aparelho.");
    const [ex] = await tx
      .select({ dicas: t.exercicios.dicas })
      .from(t.exercicios)
      .where(and(eq(t.exercicios.versaoLicaoId, sessao.versaoLicaoId), eq(t.exercicios.exercicioId, exercicioId)));
    const dica = ex?.dicas[numero - 1];
    if (!dica) throw new ErroEstudo("invalida", "Não há mais dicas para este exercício.");
    await tx
      .update(t.itensSessao)
      .set({ dicasUsadas: sql`greatest(${t.itensSessao.dicasUsadas}, ${numero})` })
      .where(and(eq(t.itensSessao.sessaoId, sessao.id), eq(t.itensSessao.exercicioId, exercicioId)));
    return dica;
  });
}

/**
 * Conclui a sessão depois de todos os itens resolvidos (FL-03, passo 7) e registra a conclusão da lição,
 * que desbloqueia a próxima. Pedidos repetidos ou de outra aba devolvem o mesmo resultado.
 */
export async function concluir(db: Db, alunoId: string, sessaoId: string): Promise<ResultadoConclusao> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);
    if (sessao.fila.fila.length > 0) throw new ErroEstudo("incompleta", "Ainda há exercícios para resolver nesta lição.");

    let primeiraConclusao: boolean;
    if (sessao.estado === "concluida") {
      const [c] = await tx
        .select({ sessaoId: t.conclusoesLicao.sessaoId })
        .from(t.conclusoesLicao)
        .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, sessao.licaoId)));
      primeiraConclusao = c?.sessaoId === sessao.id;
    } else {
      const agora = new Date();
      await tx.update(t.sessoes).set({ estado: "concluida", concluidaEm: agora, atualizadoEm: agora }).where(eq(t.sessoes.id, sessao.id));
      const inserida = await tx
        .insert(t.conclusoesLicao)
        .values({ alunoId, licaoId: sessao.licaoId, sessaoId: sessao.id, concluidaEm: agora })
        .onConflictDoNothing()
        .returning({ licaoId: t.conclusoesLicao.licaoId });
      primeiraConclusao = inserida.length > 0;
    }

    const trilha = await ordemDaTrilha(tx);
    const posicao = trilha.indexOf(sessao.licaoId);
    return {
      licaoId: sessao.licaoId,
      total: sessao.totalItens,
      acertosPrimeira: acertosDePrimeira(sessao.fila),
      primeiraConclusao,
      proximaLicaoId: trilha[posicao + 1] ?? null,
    };
  });
}

/** Itens da sessão, para relatórios e testes. */
export async function itensDaSessao(db: Db, sessaoId: string) {
  return db.select().from(t.itensSessao).where(eq(t.itensSessao.sessaoId, sessaoId)).orderBy(asc(t.itensSessao.posicaoOriginal));
}
