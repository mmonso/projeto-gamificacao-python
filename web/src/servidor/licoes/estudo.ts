// Operações de estudo de uma sessão: responder, pedir dica e concluir (FL-03, FL-04, FL-06; E05.3 a E06.2).
// Cada operação trava a linha da sessão, confere o dono e é segura para reenvio:
// repetir o mesmo pedido devolve o resultado já gravado, sem novo efeito.
// Corações mudam na resposta; XP e corações recuperados, na conclusão. Atividade e sequência entram no E06.4.
import { and, asc, count, desc, eq, inArray, lt, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import {
  solucaoDoGabarito,
  type PedidoSubmissao,
  type Progresso,
  type ResultadoConclusao,
  type ResultadoSubmissao,
} from "@/modulos/aprendizagem/contrato";
import { corrigir, type Resposta } from "@/modulos/aprendizagem/corretor";
import { acertosDePrimeira, registrarResultado, type EstadoFila } from "@/modulos/aprendizagem/fila";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import { diaDeEstudo, fusoVigente } from "@/modulos/gamificacao/dias";
import { coracoesAposRecuperacao, coracoesAposResposta, xpDaConclusao } from "@/modulos/gamificacao/regras";
import * as t from "@/servidor/db/esquema";
import { ordemDaTrilha } from "./servico";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;
type Tx = Parameters<Parameters<Db["transaction"]>[0]>[0];
type TipoSessao = (typeof t.sessoes.$inferSelect)["tipo"];

export class ErroEstudo extends Error {
  constructor(
    readonly codigo: "sessao_inexistente" | "desatualizada" | "invalida" | "incompleta" | "sem_coracoes",
    mensagem: string,
  ) {
    super(mensagem);
  }
}

const SEM_CORACOES = "Você ficou sem corações. Faça uma revisão rápida para recuperar.";

/** Sessão do aluno, travada até o fim da transação. Sessão de outro aluno é tratada como inexistente. */
async function travarSessao(tx: Tx, alunoId: string, sessaoId: string) {
  if (!/^[0-9a-f-]{36}$/i.test(sessaoId)) throw new ErroEstudo("sessao_inexistente", "Sessão não encontrada.");
  const [s] = await tx
    .select()
    .from(t.sessoes)
    .where(and(eq(t.sessoes.id, sessaoId), eq(t.sessoes.alunoId, alunoId)))
    .for("update");
  if (!s) throw new ErroEstudo("sessao_inexistente", "Sessão não encontrada.");
  return { ...s, fila: s.fila as EstadoFila };
}

/** Perfil travado até o fim da transação. Sempre depois da sessão, na mesma ordem em todas as operações. */
async function travarPerfil(tx: Tx, alunoId: string) {
  const [p] = await tx.select().from(t.perfis).where(eq(t.perfis.id, alunoId)).for("update");
  return p;
}

/**
 * Exercício de um item da sessão, na versão gravada no item. Uma recuperação junta itens de lições
 * diferentes, então a versão vem do item, e não da sessão.
 */
async function exercicioDoItem(tx: Tx, sessaoId: string, exercicioId: string) {
  const [ex] = await tx
    .select({ versaoLicaoId: t.exercicios.versaoLicaoId, publico: t.exercicios.publico, dicas: t.exercicios.dicas })
    .from(t.itensSessao)
    .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
    .where(and(eq(t.itensSessao.sessaoId, sessaoId), eq(t.itensSessao.exercicioId, exercicioId)));
  return ex ? { ...ex, publico: ex.publico as ExercicioPublico } : null;
}

async function exercicioPublico(tx: Tx, sessaoId: string, exercicioId: string | undefined): Promise<ExercicioPublico | null> {
  if (!exercicioId) return null;
  return (await exercicioDoItem(tx, sessaoId, exercicioId))?.publico ?? null;
}

async function progresso(tx: Tx, sessaoId: string, fila: EstadoFila, total: number): Promise<Progresso> {
  return {
    resolvidos: fila.resolvidos.length,
    total,
    concluida: fila.fila.length === 0,
    proximo: await exercicioPublico(tx, sessaoId, fila.fila[0]),
  };
}

/** Gabarito e explicação: lidos só aqui, depois da submissão gravada. */
async function lerGabarito(tx: Tx, sessaoId: string, exercicioId: string) {
  const [g] = await tx
    .select({ gabarito: t.gabaritos.gabarito, explicacao: t.gabaritos.explicacao })
    .from(t.itensSessao)
    .innerJoin(t.gabaritos, and(eq(t.gabaritos.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.gabaritos.exercicioId, t.itensSessao.exercicioId)))
    .where(and(eq(t.itensSessao.sessaoId, sessaoId), eq(t.itensSessao.exercicioId, exercicioId)));
  if (!g) throw new Error(`Gabarito ausente: ${exercicioId} na sessão ${sessaoId}`);
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
 * Numa sessão principal, a primeira resposta errada de um item custa um coração (4.3); com saldo zero,
 * a sessão fica pausada depois do feedback e não aceita novas respostas até a recuperação (FL-06).
 */
export async function submeter(db: Db, alunoId: string, sessaoId: string, pedido: PedidoSubmissao): Promise<ResultadoSubmissao> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);
    const principal = sessao.tipo === "principal";

    const [gravada] = await tx.select().from(t.submissoes).where(eq(t.submissoes.id, pedido.id));
    if (gravada) {
      // Reenvio (FL-04, passo 2): devolve o resultado gravado. Um id usado em outra sessão é recusado.
      if (gravada.sessaoId !== sessao.id) throw new ErroEstudo("invalida", "Identificador de submissão já usado.");
      const [{ anteriores }] = await tx
        .select({ anteriores: count() })
        .from(t.submissoes)
        .where(and(eq(t.submissoes.sessaoId, sessao.id), eq(t.submissoes.exercicioId, gravada.exercicioId), lt(t.submissoes.criadoEm, gravada.criadoEm)));
      const { gabarito, explicacao } = await lerGabarito(tx, sessao.id, gravada.exercicioId);
      const perfil = principal ? await travarPerfil(tx, alunoId) : null;
      return {
        submissaoId: gravada.id,
        exercicioId: gravada.exercicioId,
        exercicio: (await exercicioPublico(tx, sessao.id, gravada.exercicioId))!,
        resposta: gravada.resposta as Resposta,
        correta: gravada.correta,
        primeiraTentativa: anteriores === 0,
        perdeuCoracao: gravada.perdeuCoracao,
        coracoes: perfil?.coracoes ?? null,
        pausada: sessao.estado === "pausada",
        solucao: solucaoDoGabarito(gabarito),
        explicacao,
        feedbackOpcao: feedbackDaOpcao(gabarito, gravada.resposta),
        ...(await progresso(tx, sessao.id, sessao.fila, sessao.totalItens)),
      };
    }

    if (sessao.estado === "pausada") throw new ErroEstudo("sem_coracoes", SEM_CORACOES);
    // Outra aba já respondeu este item, ou a sessão não aceita respostas: a interface recarrega a sessão.
    if (sessao.estado !== "aberta" || sessao.fila.fila[0] !== pedido.exercicioId) {
      throw new ErroEstudo("desatualizada", "Esta lição mudou em outra aba ou aparelho.");
    }
    // Saldo zerado em outra lição: nenhuma sessão principal continua sem corações (4.3).
    const perfil = principal ? await travarPerfil(tx, alunoId) : null;
    if (perfil && perfil.coracoes === 0) throw new ErroEstudo("sem_coracoes", SEM_CORACOES);

    const { gabarito, explicacao } = await lerGabarito(tx, sessao.id, pedido.exercicioId);
    const correta = corrigir(gabarito, pedido.resposta);
    const { estado: fila, primeiraTentativa } = registrarResultado(sessao.fila, pedido.exercicioId, correta);

    const coracoes = perfil ? coracoesAposResposta(perfil.coracoes, sessao.tipo, correta, primeiraTentativa) : null;
    const perdeuCoracao = perfil !== null && coracoes! < perfil.coracoes;
    if (perdeuCoracao) await tx.update(t.perfis).set({ coracoes: coracoes! }).where(eq(t.perfis.id, alunoId));
    const pausada = coracoes === 0 && fila.fila.length > 0;

    await tx.insert(t.submissoes).values({ id: pedido.id, sessaoId: sessao.id, exercicioId: pedido.exercicioId, resposta: pedido.resposta, correta, perdeuCoracao });
    await tx
      .update(t.itensSessao)
      .set({
        tentativas: sql`${t.itensSessao.tentativas} + 1`,
        resolvido: correta,
        ...(primeiraTentativa ? { errouPrimeira: !correta } : {}),
      })
      .where(and(eq(t.itensSessao.sessaoId, sessao.id), eq(t.itensSessao.exercicioId, pedido.exercicioId)));
    await tx
      .update(t.sessoes)
      .set({ fila, ...(pausada ? { estado: "pausada" as const } : {}), atualizadoEm: new Date() })
      .where(eq(t.sessoes.id, sessao.id));

    return {
      submissaoId: pedido.id,
      exercicioId: pedido.exercicioId,
      exercicio: (await exercicioPublico(tx, sessao.id, pedido.exercicioId))!,
      resposta: pedido.resposta,
      correta,
      primeiraTentativa,
      perdeuCoracao,
      coracoes,
      pausada,
      solucao: solucaoDoGabarito(gabarito),
      explicacao,
      feedbackOpcao: feedbackDaOpcao(gabarito, pedido.resposta),
      ...(await progresso(tx, sessao.id, fila, sessao.totalItens)),
    };
  });
}

/** Dica número `numero` do item atual (FL-03, passo 3). Registra o maior número de dicas vistas. */
export async function pedirDica(db: Db, alunoId: string, sessaoId: string, exercicioId: string, numero: number): Promise<string> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);
    if (sessao.estado === "pausada") throw new ErroEstudo("sem_coracoes", SEM_CORACOES);
    if (sessao.estado !== "aberta" || sessao.fila.fila[0] !== exercicioId) throw new ErroEstudo("desatualizada", "Esta lição mudou em outra aba ou aparelho.");
    const dica = (await exercicioDoItem(tx, sessao.id, exercicioId))?.dicas[numero - 1];
    if (!dica) throw new ErroEstudo("invalida", "Não há mais dicas para este exercício.");
    await tx
      .update(t.itensSessao)
      .set({ dicasUsadas: sql`greatest(${t.itensSessao.dicasUsadas}, ${numero})` })
      .where(and(eq(t.itensSessao.sessaoId, sessao.id), eq(t.itensSessao.exercicioId, exercicioId)));
    return dica;
  });
}

const eventoConclusao = (sessaoId: string) => `conclusao:${sessaoId}`;
const eventoRecuperacao = (sessaoId: string) => `recuperacao:${sessaoId}`;

/**
 * Lança o XP da conclusão (4.2) no dia de estudo do momento da conclusão. O perfil, travado pela conclusão,
 * serializa conclusões simultâneas de outras sessões, que assim contam o limite diário de prática.
 * O identificador do evento é único: a sessão nunca recebe dois lançamentos.
 */
async function lancarXp(tx: Tx, perfil: typeof t.perfis.$inferSelect, sessao: { id: string; tipo: TipoSessao }, primeiraConclusao: boolean, dia: string) {
  const [{ praticas }] = await tx
    .select({ praticas: count() })
    .from(t.lancamentos)
    .where(and(eq(t.lancamentos.alunoId, perfil.id), eq(t.lancamentos.diaEstudo, dia), eq(t.lancamentos.causa, "pratica")));
  const { xp, causa } = xpDaConclusao(sessao.tipo, !primeiraConclusao, praticas);
  if (xp === 0) return 0;
  await tx.insert(t.lancamentos).values({ alunoId: perfil.id, causa, valor: xp, diaEstudo: dia, eventoId: eventoConclusao(sessao.id) });
  await tx.update(t.perfis).set({ xpTotal: sql`${t.perfis.xpTotal} + ${xp}` }).where(eq(t.perfis.id, perfil.id));
  return xp;
}

/**
 * Devolve os corações da recuperação (FL-06, passo 4), sem passar do máximo, e reabre a sessão principal
 * pausada. A devolução fica no livro de lançamentos, para que um pedido repetido mostre o mesmo valor.
 */
async function devolverCoracoes(tx: Tx, perfil: typeof t.perfis.$inferSelect, sessaoId: string, dia: string, agora: Date) {
  const devolvidos = coracoesAposRecuperacao(perfil.coracoes) - perfil.coracoes;
  if (devolvidos > 0) {
    await tx.update(t.perfis).set({ coracoes: perfil.coracoes + devolvidos }).where(eq(t.perfis.id, perfil.id));
    await tx.insert(t.lancamentos).values({ alunoId: perfil.id, moeda: "coracoes", causa: "recuperacao", valor: devolvidos, diaEstudo: dia, eventoId: eventoRecuperacao(sessaoId) });
  }
  await tx
    .update(t.sessoes)
    .set({ estado: "aberta", atualizadoEm: agora })
    .where(and(eq(t.sessoes.alunoId, perfil.id), eq(t.sessoes.tipo, "principal"), eq(t.sessoes.estado, "pausada")));
  return devolvidos;
}

/** Sessão principal para a qual a recuperação leva de volta: a aberta mais recente (FL-06, passo 5). */
async function licaoParaVoltar(tx: Tx, alunoId: string) {
  const [s] = await tx
    .select({ id: t.sessoes.id })
    .from(t.sessoes)
    .where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, "principal"), eq(t.sessoes.estado, "aberta")))
    .orderBy(desc(t.sessoes.atualizadoEm))
    .limit(1);
  return s?.id ?? null;
}

/**
 * Conclui a sessão depois de todos os itens resolvidos (FL-03, passo 7): registra a conclusão da lição,
 * que desbloqueia a próxima, lança o XP e, numa recuperação, devolve corações, tudo na mesma transação
 * (CA-35, CA-36). Pedidos repetidos ou de outra aba devolvem o mesmo resultado.
 */
export async function concluir(db: Db, alunoId: string, sessaoId: string): Promise<ResultadoConclusao> {
  return db.transaction(async (tx) => {
    const sessao = await travarSessao(tx, alunoId, sessaoId);
    if (sessao.fila.fila.length > 0) throw new ErroEstudo("incompleta", "Ainda há exercícios para resolver nesta lição.");

    let primeiraConclusao = false;
    let xp: number;
    let coracoesRecuperados = 0;
    if (sessao.estado === "concluida") {
      if (sessao.licaoId) {
        const [c] = await tx
          .select({ sessaoId: t.conclusoesLicao.sessaoId })
          .from(t.conclusoesLicao)
          .where(and(eq(t.conclusoesLicao.alunoId, alunoId), eq(t.conclusoesLicao.licaoId, sessao.licaoId)));
        primeiraConclusao = c?.sessaoId === sessao.id;
      }
      const lancados = await tx
        .select({ eventoId: t.lancamentos.eventoId, valor: t.lancamentos.valor })
        .from(t.lancamentos)
        .where(inArray(t.lancamentos.eventoId, [eventoConclusao(sessao.id), eventoRecuperacao(sessao.id)]));
      xp = lancados.find((l) => l.eventoId === eventoConclusao(sessao.id))?.valor ?? 0;
      coracoesRecuperados = lancados.find((l) => l.eventoId === eventoRecuperacao(sessao.id))?.valor ?? 0;
    } else {
      const agora = new Date();
      await tx.update(t.sessoes).set({ estado: "concluida", concluidaEm: agora, atualizadoEm: agora }).where(eq(t.sessoes.id, sessao.id));
      if (sessao.licaoId) {
        const inserida = await tx
          .insert(t.conclusoesLicao)
          .values({ alunoId, licaoId: sessao.licaoId, sessaoId: sessao.id, concluidaEm: agora })
          .onConflictDoNothing()
          .returning({ licaoId: t.conclusoesLicao.licaoId });
        primeiraConclusao = inserida.length > 0;
      }
      const perfil = await travarPerfil(tx, alunoId);
      const dia = diaDeEstudo(agora, fusoVigente(perfil, agora).fuso, perfil.ultimoDiaEstudo);
      xp = await lancarXp(tx, perfil, sessao, primeiraConclusao, dia);
      if (sessao.tipo === "recuperacao") coracoesRecuperados = await devolverCoracoes(tx, perfil, sessao.id, dia, agora);
    }

    const trilha = await ordemDaTrilha(tx);
    const posicao = sessao.licaoId ? trilha.indexOf(sessao.licaoId) : -1;
    return {
      tipo: sessao.tipo,
      licaoId: sessao.licaoId,
      total: sessao.totalItens,
      acertosPrimeira: acertosDePrimeira(sessao.fila),
      primeiraConclusao,
      xp,
      coracoesRecuperados,
      voltarSessaoId: sessao.tipo === "recuperacao" ? await licaoParaVoltar(tx, alunoId) : null,
      proximaLicaoId: posicao >= 0 ? (trilha[posicao + 1] ?? null) : null,
    };
  });
}

/** Itens da sessão, para relatórios e testes. */
export async function itensDaSessao(db: Db, sessaoId: string) {
  return db.select().from(t.itensSessao).where(eq(t.itensSessao.sessaoId, sessaoId)).orderBy(asc(t.itensSessao.posicaoOriginal));
}
