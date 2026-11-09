// Responder, dicas e conclusão de uma lição (E05.3 a E05.7), com PostgreSQL embutido.
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { and, count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { Exercicio } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { respostaCorreta } from "@/testes/respostas";
import { concluir, ErroEstudo, itensDaSessao, pedirDica, submeter } from "./estudo";
import { iniciarRecuperacao, iniciarSessao, licaoDisponivel, obterSessaoAtual, obterTrilha } from "./servico";

const ANA = "00000000-0000-4000-8000-0000000000a1";
const BIA = "00000000-0000-4000-8000-0000000000b2";

const curso = carregarCurso(join(__dirname, "../../../../conteudo"));
const exercicios = new Map<string, Exercicio>(curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao])).map((e) => [e.id, e]));

function correta(id: string): Resposta {
  return respostaCorreta(exercicios.get(id)!);
}

function errada(id: string): Resposta {
  const ex = exercicios.get(id)!;
  if (ex.tipo === "escolher_resultado") return { tipo: ex.tipo, opcao: ex.opcoes.find((o) => o.id !== ex.resposta)!.id };
  if (ex.tipo === "localizar_erro") return { tipo: ex.tipo, linha: ex.resposta === 1 ? 2 : 1 };
  if (ex.tipo === "completar_lacuna") return { tipo: ex.tipo, lacunas: {} };
  return { tipo: "localizar_erro", linha: 1 };
}

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
  await db.insert(t.perfis).values([{ id: ANA }, { id: BIA }]);
}, 60_000);

async function atual(aluno: string, sessaoId: string) {
  return (await obterSessaoAtual(db, aluno, sessaoId))!;
}

async function xpTotal(aluno: string) {
  const [p] = await db.select({ xp: t.perfis.xpTotal }).from(t.perfis).where(eq(t.perfis.id, aluno));
  return p.xp;
}

/** Inicia a sessão de uma lição e resolve todos os itens de primeira, sem concluir. */
async function resolverTudo(aluno: string, licaoId: string) {
  const { sessaoId } = (await iniciarSessao(db, aluno, licaoId)) as { sessaoId: string };
  for (let s = await atual(aluno, sessaoId); s.exercicio; s = await atual(aluno, sessaoId)) {
    await submeter(db, aluno, sessaoId, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
  }
  return sessaoId;
}

async function falha(promessa: Promise<unknown>): Promise<string> {
  try {
    await promessa;
  } catch (e) {
    if (e instanceof ErroEstudo) return e.codigo;
    throw e;
  }
  throw new Error("A operação deveria ter falhado");
}

describe("lição piloto do começo ao fim", () => {
  let sessaoId: string;

  it("errar devolve a solução e a explicação e manda o item para o fim da fila (CA-32)", async () => {
    const [u1] = await obterTrilha(db, ANA);
    expect(u1.licoes[0]).toMatchObject({ estado: "atual", sessaoAberta: false });
    sessaoId = ((await iniciarSessao(db, ANA, "u1-l1")) as { sessaoId: string }).sessaoId;
    const primeiro = (await atual(ANA, sessaoId)).exercicio!.id;
    const r = await submeter(db, ANA, sessaoId, { id: randomUUID(), exercicioId: primeiro, resposta: errada(primeiro) });
    expect(r).toMatchObject({ correta: false, primeiraTentativa: true, resolvidos: 0, concluida: false });
    expect(r.explicacao.length).toBeGreaterThan(10);
    expect(r.solucao.tipo).toBe(exercicios.get(primeiro)!.tipo);
    expect(r.proximo?.id).not.toBe(primeiro);
  });

  it("o reenvio com o mesmo identificador devolve o resultado gravado sem novo efeito (FL-04)", async () => {
    const atualId = (await atual(ANA, sessaoId)).exercicio!.id;
    const id = randomUUID();
    const a = await submeter(db, ANA, sessaoId, { id, exercicioId: atualId, resposta: correta(atualId) });
    const b = await submeter(db, ANA, sessaoId, { id, exercicioId: atualId, resposta: correta(atualId) });
    expect(b).toEqual(a);
    expect(a).toMatchObject({ correta: true, primeiraTentativa: true, resolvidos: 1 });
    const [{ n }] = await db.select({ n: count() }).from(t.submissoes).where(eq(t.submissoes.id, id));
    expect(n).toBe(1);
  });

  it("o reenvio com resposta alterada depois da falha devolve a resposta gravada no primeiro envio (FL-04)", async () => {
    const atualId = (await atual(ANA, sessaoId)).exercicio!.id;
    const id = randomUUID();
    const a = await submeter(db, ANA, sessaoId, { id, exercicioId: atualId, resposta: correta(atualId) });
    const b = await submeter(db, ANA, sessaoId, { id, exercicioId: atualId, resposta: errada(atualId) });
    expect(b).toEqual(a);
    expect(b).toMatchObject({ correta: true, resposta: correta(atualId) });
  });

  it("resposta para item que não é o atual pede recarga (duas abas)", async () => {
    const outro = curso[0].licoes[0].exercicios.at(-1)!.id;
    expect(await falha(submeter(db, ANA, sessaoId, { id: randomUUID(), exercicioId: outro, resposta: correta(outro) }))).toBe("desatualizada");
  });

  it("entrega as dicas uma a uma e registra o uso", async () => {
    const atualId = (await atual(ANA, sessaoId)).exercicio!.id;
    expect(await pedirDica(db, ANA, sessaoId, atualId, 1)).toBe(exercicios.get(atualId)!.dicas[0]);
    expect(await falha(pedirDica(db, ANA, sessaoId, atualId, 4 as number))).toBe("invalida");
    const item = (await itensDaSessao(db, sessaoId)).find((i) => i.exercicioId === atualId)!;
    expect(item.dicasUsadas).toBe(1);
  });

  it("não conclui com itens pendentes", async () => {
    expect(await falha(concluir(db, ANA, sessaoId))).toBe("incompleta");
  });

  it("resolve a fila, conclui uma única vez e libera a próxima lição (CA-34)", async () => {
    for (let s = await atual(ANA, sessaoId); s.exercicio; s = await atual(ANA, sessaoId)) {
      await submeter(db, ANA, sessaoId, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
    }
    const [a, b] = await Promise.all([concluir(db, ANA, sessaoId), concluir(db, ANA, sessaoId)]);
    expect(a).toEqual(b);
    expect(a).toMatchObject({ licaoId: "u1-l1", primeiraConclusao: true, xp: 20, proximaLicaoId: "u1-l2" });
    expect(a.acertosPrimeira).toBe(a.total - 1);
    expect(await concluir(db, ANA, sessaoId)).toEqual(a);
    const lancados = await db.select().from(t.lancamentos).where(eq(t.lancamentos.alunoId, ANA));
    expect(lancados).toMatchObject([{ causa: "primeira_conclusao", valor: 20, eventoId: `conclusao:${sessaoId}` }]);
    expect(await xpTotal(ANA)).toBe(20);
    expect(await licaoDisponivel(db, ANA, "u1-l2")).toBe(true);

    const [u1] = await obterTrilha(db, ANA);
    expect(u1.licoes.map((l) => l.estado)).toEqual(["concluida", "atual", "bloqueada", "bloqueada", "bloqueada"]);
    expect(u1.licoes.at(-1)!.desafio).toBe(true);
    // Houve um erro de primeira: concluída, mas sem coroa.
    expect(u1.licoes[0].perfeita).toBe(false);

    const itens = await itensDaSessao(db, sessaoId);
    expect(itens.every((i) => i.resolvido)).toBe(true);
    expect(itens.filter((i) => i.errouPrimeira)).toHaveLength(1);
  });

  it("depois de concluída, a sessão não aceita respostas", async () => {
    const id = curso[0].licoes[0].exercicios[0].id;
    expect(await falha(submeter(db, ANA, sessaoId, { id: randomUUID(), exercicioId: id, resposta: correta(id) }))).toBe("desatualizada");
  });
});

describe("isolamento entre contas (CA-42)", () => {
  it("outra conta não responde, não pede dica e não conclui a sessão alheia", async () => {
    const { sessaoId } = (await iniciarSessao(db, BIA, "u1-l1")) as { sessaoId: string };
    const ex = (await atual(BIA, sessaoId)).exercicio!.id;
    expect(await falha(submeter(db, ANA, sessaoId, { id: randomUUID(), exercicioId: ex, resposta: correta(ex) }))).toBe("sessao_inexistente");
    expect(await falha(pedirDica(db, ANA, sessaoId, ex, 1))).toBe("sessao_inexistente");
    expect(await falha(concluir(db, ANA, sessaoId))).toBe("sessao_inexistente");
  });

  it("um identificador de submissão de outra sessão é recusado", async () => {
    const [usada] = await db.select().from(t.submissoes).limit(1);
    const { sessaoId } = (await iniciarSessao(db, BIA, "u1-l1")) as { sessaoId: string };
    const ex = (await atual(BIA, sessaoId)).exercicio!.id;
    expect(await falha(submeter(db, BIA, sessaoId, { id: usada.id, exercicioId: ex, resposta: correta(ex) }))).toBe("invalida");
    const [{ n }] = await db.select({ n: count() }).from(t.submissoes).where(and(eq(t.submissoes.sessaoId, sessaoId)));
    expect(n).toBe(0);
  });
});

describe("XP da conclusão (E06.1)", () => {
  const ELI = "00000000-0000-4000-8000-0000000000e5";

  it("uma falha no meio da conclusão não grava nenhum efeito (CA-36)", async () => {
    await db.insert(t.perfis).values({ id: ELI });
    const sessaoId = await resolverTudo(ELI, "u1-l1");
    // Um lançamento com o mesmo evento faz a transação falhar depois de gravar sessão e conclusão.
    await db.insert(t.lancamentos).values({ alunoId: ELI, causa: "teste", valor: 0, diaEstudo: "2026-01-01", eventoId: `conclusao:${sessaoId}` });
    await expect(concluir(db, ELI, sessaoId)).rejects.toThrow();

    const [s] = await db.select({ estado: t.sessoes.estado }).from(t.sessoes).where(eq(t.sessoes.id, sessaoId));
    expect(s.estado).toBe("aberta");
    expect(await licaoDisponivel(db, ELI, "u1-l2")).toBe(false);
    expect(await xpTotal(ELI)).toBe(0);

    await db.delete(t.lancamentos).where(eq(t.lancamentos.alunoId, ELI));
    expect(await concluir(db, ELI, sessaoId)).toMatchObject({ primeiraConclusao: true, xp: 20 });
    expect(await xpTotal(ELI)).toBe(20);
  });

  it("refazer a lição vale como prática: 10 XP nas três primeiras do dia e zero depois (4.2, 4.9)", async () => {
    const ganhos: number[] = [];
    for (let i = 0; i < 4; i++) {
      const r = await concluir(db, ELI, await resolverTudo(ELI, "u1-l1"));
      expect(r.primeiraConclusao).toBe(false);
      ganhos.push(r.xp);
    }
    expect(ganhos).toEqual([10, 10, 10, 0]);
    expect(await xpTotal(ELI)).toBe(50);
    const lancados = await db.select({ causa: t.lancamentos.causa }).from(t.lancamentos).where(eq(t.lancamentos.alunoId, ELI));
    expect(lancados.map((l) => l.causa).sort()).toEqual(["pratica", "pratica", "pratica", "primeira_conclusao"]);
  });
});

describe("corações e recuperação (E06.2)", () => {
  const FABI = "00000000-0000-4000-8000-0000000000f6";
  let principal: string;
  let recuperacao: string;

  async function coracoes(aluno: string) {
    const [p] = await db.select({ c: t.perfis.coracoes }).from(t.perfis).where(eq(t.perfis.id, aluno));
    return p.c;
  }

  it("só o primeiro erro de cada item custa um coração; reenvio e nova tentativa não (CA-32, 4.9)", async () => {
    await db.insert(t.perfis).values({ id: FABI });
    principal = ((await iniciarSessao(db, FABI, "u1-l1")) as { sessaoId: string }).sessaoId;
    const primeiro = (await atual(FABI, principal)).exercicio!.id;
    const id = randomUUID();
    const a = await submeter(db, FABI, principal, { id, exercicioId: primeiro, resposta: errada(primeiro) });
    expect(a).toMatchObject({ perdeuCoracao: true, coracoes: 4, pausada: false });
    expect(await submeter(db, FABI, principal, { id, exercicioId: primeiro, resposta: errada(primeiro) })).toEqual(a);
    expect(await coracoes(FABI)).toBe(4);
  });

  it("com o último coração perdido, a sessão pausa e recusa respostas, dicas e lições novas (CA-38, CA-39)", async () => {
    // Erra de primeira os itens seguintes até zerar; o primeiro item, já errado, volta sem custo.
    let r;
    do {
      const ex = (await atual(FABI, principal)).exercicio!.id;
      r = await submeter(db, FABI, principal, { id: randomUUID(), exercicioId: ex, resposta: errada(ex) });
    } while (!r.pausada);
    expect(r).toMatchObject({ perdeuCoracao: true, coracoes: 0 });
    expect(await coracoes(FABI)).toBe(0);
    const s = (await obterSessaoAtual(db, FABI, principal))!;
    expect(s.estado).toBe("pausada");

    const ex = s.exercicio!.id;
    expect(await falha(submeter(db, FABI, principal, { id: randomUUID(), exercicioId: ex, resposta: correta(ex) }))).toBe("sem_coracoes");
    expect(await falha(pedirDica(db, FABI, principal, ex, 1))).toBe("sem_coracoes");
    // A lição atual devolve a sessão pausada, sem criar outra.
    expect(await iniciarSessao(db, FABI, "u1-l1")).toEqual({ ok: true, sessaoId: principal, retomada: true });
  });

  it("a recuperação junta cinco itens já vistos e não usa corações (FL-06)", async () => {
    const r = await iniciarRecuperacao(db, FABI);
    expect(r.ok).toBe(true);
    recuperacao = (r as { sessaoId: string }).sessaoId;
    const s = (await obterSessaoAtual(db, FABI, recuperacao))!;
    expect(s).toMatchObject({ tipo: "recuperacao", licao: null, totalItens: 5 });
    const ex = s.exercicio!.id;
    const e = await submeter(db, FABI, recuperacao, { id: randomUUID(), exercicioId: ex, resposta: errada(ex) });
    expect(e).toMatchObject({ correta: false, perdeuCoracao: false, coracoes: null, pausada: false });
  });

  it("abandonar a recuperação não devolve corações, e a próxima monta outra revisão (CA-82)", async () => {
    const outra = ((await iniciarRecuperacao(db, FABI)) as { sessaoId: string }).sessaoId;
    expect(outra).not.toBe(recuperacao);
    const [antiga] = await db.select({ estado: t.sessoes.estado }).from(t.sessoes).where(eq(t.sessoes.id, recuperacao));
    expect(antiga.estado).toBe("descartada");
    expect(await coracoes(FABI)).toBe(0);
    recuperacao = outra;
  });

  it("concluir a recuperação devolve dois corações, conta como prática e reabre a lição pausada (CA-81, CA-84)", async () => {
    for (let s = await atual(FABI, recuperacao); s.exercicio; s = await atual(FABI, recuperacao)) {
      await submeter(db, FABI, recuperacao, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
    }
    const a = await concluir(db, FABI, recuperacao);
    expect(a).toMatchObject({ tipo: "recuperacao", licaoId: null, primeiraConclusao: false, xp: 10, coracoesRecuperados: 2, voltarSessaoId: principal });
    expect(await concluir(db, FABI, recuperacao)).toEqual(a);
    expect(await coracoes(FABI)).toBe(2);

    // A lição continua no mesmo item em que parou.
    const s = (await obterSessaoAtual(db, FABI, principal))!;
    expect(s.estado).toBe("aberta");
    const r = await submeter(db, FABI, principal, { id: randomUUID(), exercicioId: s.exercicio!.id, resposta: correta(s.exercicio!.id) });
    expect(r).toMatchObject({ correta: true, perdeuCoracao: false, coracoes: 2 });
  });

  it("com quatro corações, a recuperação devolve só um; com cinco, é recusada (CA-80, CA-81)", async () => {
    await db.update(t.perfis).set({ coracoes: 4 }).where(eq(t.perfis.id, FABI));
    const id = ((await iniciarRecuperacao(db, FABI)) as { sessaoId: string }).sessaoId;
    for (let s = await atual(FABI, id); s.exercicio; s = await atual(FABI, id)) {
      await submeter(db, FABI, id, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
    }
    expect((await concluir(db, FABI, id)).coracoesRecuperados).toBe(1);
    expect(await coracoes(FABI)).toBe(5);
    expect(await iniciarRecuperacao(db, FABI)).toEqual({ ok: false, motivo: "coracoes_cheios" });
  });

  it("o banco recusa saldo fora de zero a cinco (CA-101)", async () => {
    await expect(db.update(t.perfis).set({ coracoes: -1 }).where(eq(t.perfis.id, FABI))).rejects.toThrow();
    await expect(db.update(t.perfis).set({ coracoes: 6 }).where(eq(t.perfis.id, FABI))).rejects.toThrow();
  });

  it("sem corações, a prática de lição concluída continua e a lição nova é recusada (CA-39, CA-71)", async () => {
    const ELI = "00000000-0000-4000-8000-0000000000e5";
    await db.update(t.perfis).set({ coracoes: 0 }).where(eq(t.perfis.id, ELI));
    expect(await iniciarSessao(db, ELI, "u1-l2")).toEqual({ ok: false, motivo: "sem_coracoes" });

    const pratica = ((await iniciarSessao(db, ELI, "u1-l1")) as { sessaoId: string }).sessaoId;
    const s = (await obterSessaoAtual(db, ELI, pratica))!;
    expect(s.tipo).toBe("pratica");
    const r = await submeter(db, ELI, pratica, { id: randomUUID(), exercicioId: s.exercicio!.id, resposta: errada(s.exercicio!.id) });
    expect(r).toMatchObject({ perdeuCoracao: false, coracoes: null });
    expect(await coracoes(ELI)).toBe(0);
  });
});

describe("nova versão publicada durante a sessão (FL-04)", () => {
  const CAIO = "00000000-0000-4000-8000-0000000000c3";
  const DANI = "00000000-0000-4000-8000-0000000000d4";

  it("a sessão aberta termina na versão em que começou; a nova vale para as próximas", async () => {
    await db.insert(t.perfis).values([{ id: CAIO }, { id: DANI }]);
    const antiga = ((await iniciarSessao(db, CAIO, "u1-l1")) as { sessaoId: string }).sessaoId;
    const primeiro = (await atual(CAIO, antiga)).exercicio!;
    expect(primeiro).toMatchObject({ id: "u1-l1-e01", versao: 1 });

    // Versão 2 da lição piloto, em que o gabarito do primeiro exercício muda.
    const [{ unidade, licoes }] = curso;
    const v2 = structuredClone(licoes[0]);
    v2.versao = licoes[0].versao + 1;
    const e01 = v2.exercicios[0];
    if (e01.tipo !== "escolher_resultado") throw new Error("O primeiro exercício da lição piloto deveria ser de escolha");
    e01.versao = 2;
    e01.resposta = e01.opcoes.find((o) => o.id !== e01.resposta)!.id;
    expect((await publicarCurso(db, [{ unidade, licoes: [v2] }])).publicadas).toEqual([`u1-l1@${v2.versao}`]);

    // Na sessão antiga, o exercício e a correção continuam os da versão 1.
    expect((await atual(CAIO, antiga)).exercicio).toEqual(primeiro);
    const r = await submeter(db, CAIO, antiga, { id: randomUUID(), exercicioId: primeiro.id, resposta: correta(primeiro.id) });
    expect(r.correta).toBe(true);

    // Uma sessão nova usa a versão 2: a resposta certa da versão 1 passa a ser errada.
    const nova = ((await iniciarSessao(db, DANI, "u1-l1")) as { sessaoId: string }).sessaoId;
    expect((await atual(DANI, nova)).exercicio).toMatchObject({ id: "u1-l1-e01", versao: 2 });
    const s = await submeter(db, DANI, nova, { id: randomUUID(), exercicioId: e01.id, resposta: correta(e01.id) });
    expect(s).toMatchObject({ correta: false, solucao: { opcao: e01.resposta } });
  });
});
