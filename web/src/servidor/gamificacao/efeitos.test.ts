// Atividade diária, meta, sequência, agenda de revisão e conquistas na conclusão (E06.3 a E06.5),
// com PostgreSQL embutido e o relógio controlado para simular a passagem dos dias.
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import type { ResultadoConclusao } from "@/modulos/aprendizagem/contrato";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { Exercicio, ExercicioPublico } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { respostaCorreta } from "@/testes/respostas";
import { concluir, pedirDica, submeter } from "@/servidor/licoes/estudo";
import { estadoPraticar, iniciarRevisao } from "@/servidor/licoes/revisao";
import { iniciarSessao, obterSessaoAtual } from "@/servidor/licoes/servico";
import { resumoDoAluno } from "./efeitos";

const CAIO = "00000000-0000-4000-8000-0000000000c3";
const DORA = "00000000-0000-4000-8000-0000000000d4";
const ELI = "00000000-0000-4000-8000-0000000000e5";

const curso = carregarCurso(join(__dirname, "../../../../conteudo"));
const exercicios = new Map<string, Exercicio>(curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao])).map((e) => [e.id, e]));
const licoesU1 = curso[0].licoes.map((l) => l.id);

function correta(id: string, publico?: ExercicioPublico | null): Resposta {
  return respostaCorreta(exercicios.get(id)!, publico);
}

function errada(id: string): Resposta {
  const ex = exercicios.get(id)!;
  if (ex.tipo === "escolher_resultado") return { tipo: ex.tipo, opcao: ex.opcoes.find((o) => o.id !== ex.resposta)!.id };
  if (ex.tipo === "localizar_erro") return { tipo: ex.tipo, linha: ex.resposta === 1 ? 2 : 1 };
  if (ex.tipo === "completar_lacuna") return { tipo: ex.tipo, lacunas: {} };
  return { tipo: "localizar_erro", linha: 1 };
}

let db: ReturnType<typeof drizzle<typeof t>>;

/** Meio-dia em São Paulo (15h UTC) do dia indicado. */
function em(dia: string, hora = "15:00") {
  vi.setSystemTime(new Date(`${dia}T${hora}:00Z`));
}

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
  await db.insert(t.perfis).values([{ id: CAIO }, { id: DORA, metaDiaria: 2 }, { id: ELI }]);
  vi.useFakeTimers({ toFake: ["Date"] });
}, 60_000);

afterAll(() => {
  vi.useRealTimers();
});

/** Resolve a sessão inteira; `errarPrimeiro` erra o primeiro item uma vez e `dica` pede uma dica nele. */
async function resolver(aluno: string, sessaoId: string, opcoes: { errarPrimeiro?: boolean; dica?: boolean } = {}) {
  let primeiro = true;
  for (let s = await obterSessaoAtual(db, aluno, sessaoId); s?.exercicio; s = await obterSessaoAtual(db, aluno, sessaoId)) {
    const id = s.exercicio.id;
    if (primeiro && opcoes.dica) await pedirDica(db, aluno, sessaoId, id, 1);
    const resposta = primeiro && opcoes.errarPrimeiro ? errada(id) : correta(id, s.exercicio);
    primeiro = false;
    await submeter(db, aluno, sessaoId, { id: randomUUID(), exercicioId: id, resposta });
  }
  return concluir(db, aluno, sessaoId);
}

async function estudarLicao(aluno: string, licaoId: string, opcoes?: { errarPrimeiro?: boolean; dica?: boolean }): Promise<ResultadoConclusao> {
  const inicio = await iniciarSessao(db, aluno, licaoId);
  if (!inicio.ok) throw new Error(`Não iniciou ${licaoId}: ${inicio.motivo}`);
  return resolver(aluno, inicio.sessaoId, opcoes);
}

async function perfil(aluno: string) {
  const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, aluno));
  return p;
}

async function agenda(aluno: string, conceitoId: string) {
  const [a] = await db.select().from(t.estadoConceitos).where(and(eq(t.estadoConceitos.alunoId, aluno), eq(t.estadoConceitos.conceitoId, conceitoId)));
  return a;
}

const conceitosDaLicao = (licaoId: string) => [...new Set(curso[0].licoes.find((l) => l.id === licaoId)!.exercicios.flatMap((e) => e.conceitos))];

describe("primeira conclusão do dia (FL-03, passo 7)", () => {
  it("registra atividade, inicia a sequência, cumpre a meta, concede a primeira conquista e agenda os conceitos (CA-35)", async () => {
    em("2026-03-02");
    const r = await estudarLicao(CAIO, licoesU1[0]);
    expect(r).toMatchObject({ xp: 20, sequencia: 1, sequenciaAumentou: true, meta: { feitas: 1, meta: 1, cumpridaAgora: true }, unidadeConcluida: null });
    expect(r.conquistas).toEqual(["primeira-licao", "primeira-coroa"]);

    const [atividade] = await db.select().from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, CAIO));
    expect(atividade).toMatchObject({ dia: "2026-03-02", sessoes: 1 });
    expect(await perfil(CAIO)).toMatchObject({ sequenciaAtual: 1, maiorSequencia: 1, ultimoDiaEstudo: "2026-03-02" });
    for (const c of conceitosDaLicao(licoesU1[0])) {
      expect(await agenda(CAIO, c)).toMatchObject({ intervaloDias: 1, proximaRevisao: "2026-03-03", estado: "iniciado" });
    }
  });

  it("uma segunda sessão no mesmo dia não muda a sequência nem repete a meta (CA-93)", async () => {
    em("2026-03-02", "18:00");
    const r = await estudarLicao(CAIO, licoesU1[0]);
    expect(r).toMatchObject({ tipo: "pratica", xp: 10, sequencia: 1, sequenciaAumentou: false, meta: { feitas: 2, cumpridaAgora: false }, conquistas: [] });
  });

  it("um pedido repetido devolve o mesmo resultado, sem novos efeitos (CA-56)", async () => {
    const inicio = await iniciarSessao(db, CAIO, licoesU1[1]);
    if (!inicio.ok) throw new Error();
    const primeiro = await resolver(CAIO, inicio.sessaoId);
    const segundo = await concluir(db, CAIO, inicio.sessaoId);
    expect(segundo).toEqual(primeiro);
    const [atividade] = await db.select().from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, CAIO));
    expect(atividade.sessoes).toBe(3);
  });

  it("o resumo mostra XP do dia, sessões e meta", async () => {
    const resumo = await resumoDoAluno(db, await perfil(CAIO));
    expect(resumo).toMatchObject({ xpTotal: 50, xpHoje: 50, sessoesHoje: 3, sequencia: 1, estudouHoje: true });
    expect(resumo.conquistas).toEqual(expect.arrayContaining(["primeira-licao"]));
  });
});

describe("agenda de revisão (E06.3; 4.8)", () => {
  it("no dia seguinte, a revisão recomendada traz itens dos conceitos vencidos (CA-70)", async () => {
    em("2026-03-03");
    const praticar = await estadoPraticar(db, await perfil(CAIO));
    expect(praticar.conceitosVencidos).toBe(new Set([...conceitosDaLicao(licoesU1[0]), ...conceitosDaLicao(licoesU1[1])]).size);
    const revisao = await iniciarRevisao(db, CAIO);
    if (!revisao.ok) throw new Error();
    expect(revisao.recomendada).toBe(true);
    const sessao = (await obterSessaoAtual(db, CAIO, revisao.sessaoId))!;
    expect(sessao.tipo).toBe("revisao");
    expect(sessao.totalItens).toBeGreaterThanOrEqual(5);
    expect(sessao.totalItens).toBeLessThanOrEqual(8);
    // Retomada enquanto aberta (D-08).
    expect(await iniciarRevisao(db, CAIO)).toMatchObject({ ok: true, sessaoId: revisao.sessaoId });
  });

  it("acertar tudo de primeira e sem dica na revisão vencida avança o intervalo para 3 dias e conta a sequência (CA-73, CA-91)", async () => {
    const [aberta] = await db.select({ id: t.sessoes.id }).from(t.sessoes).where(and(eq(t.sessoes.alunoId, CAIO), eq(t.sessoes.tipo, "revisao"), eq(t.sessoes.estado, "aberta")));
    const r = await resolver(CAIO, aberta.id);
    expect(r).toMatchObject({ tipo: "revisao", xp: 10, sequencia: 2, sequenciaAumentou: true });
    const itens = await db
      .select({ conceitos: t.exercicios.conceitos })
      .from(t.itensSessao)
      .innerJoin(t.exercicios, and(eq(t.exercicios.versaoLicaoId, t.itensSessao.versaoLicaoId), eq(t.exercicios.exercicioId, t.itensSessao.exercicioId)))
      .where(eq(t.itensSessao.sessaoId, aberta.id));
    const revisado = itens[0].conceitos[0];
    expect(await agenda(CAIO, revisado)).toMatchObject({ intervaloDias: 3, proximaRevisao: "2026-03-06", estado: "praticando", revisoes: 1 });
  });

  it("repetir a prática antes do vencimento não pula etapas; erro ou dica volta para 1 dia (CA-74)", async () => {
    const r = await estudarLicao(CAIO, licoesU1[0], { errarPrimeiro: true });
    expect(r.tipo).toBe("pratica");
    const comErro = await db.select().from(t.estadoConceitos).where(and(eq(t.estadoConceitos.alunoId, CAIO), eq(t.estadoConceitos.intervaloDias, 1), eq(t.estadoConceitos.proximaRevisao, "2026-03-04")));
    expect(comErro.length).toBeGreaterThan(0);
    const avancados = await db.select().from(t.estadoConceitos).where(and(eq(t.estadoConceitos.alunoId, CAIO), eq(t.estadoConceitos.intervaloDias, 3)));
    for (const a of avancados) expect(a.proximaRevisao).toBe("2026-03-06");
  });

  it("sem lição concluída, Praticar não tem conceitos e a revisão é recusada (CA-75)", async () => {
    expect(await estadoPraticar(db, await perfil(DORA))).toMatchObject({ conceitos: [], licoesConcluidas: [] });
    expect(await iniciarRevisao(db, DORA)).toEqual({ ok: false, motivo: "sem_conteudo" });
  });
});

describe("sequência e meta ao longo dos dias (4.4, 4.5)", () => {
  it("um dia inteiro sem estudo zera a sequência exibida; a próxima sessão recomeça em um (CA-92)", async () => {
    em("2026-03-05");
    expect((await resumoDoAluno(db, await perfil(CAIO))).sequencia).toBe(0);
    const r = await estudarLicao(CAIO, licoesU1[0]);
    expect(r).toMatchObject({ sequencia: 1, sequenciaAumentou: true });
    expect((await perfil(CAIO)).maiorSequencia).toBe(2);
  });

  it("a meta de duas sessões aparece cumprida só na segunda (CA-94)", async () => {
    em("2026-03-05");
    const primeira = await estudarLicao(DORA, licoesU1[0]);
    expect(primeira.meta).toEqual({ feitas: 1, meta: 2, cumpridaAgora: false });
    const segunda = await estudarLicao(DORA, licoesU1[0]);
    expect(segunda.meta).toEqual({ feitas: 2, meta: 2, cumpridaAgora: true });
    const terceira = await estudarLicao(DORA, licoesU1[0]);
    expect(terceira.meta.cumpridaAgora).toBe(false);
  });

  it("uma sessão iniciada às 23h55 e concluída às 0h05 conta para o novo dia (CA-90)", async () => {
    em("2026-03-06", "02:55"); // 23h55 de 05/03 em São Paulo
    const inicio = await iniciarSessao(db, DORA, licoesU1[1]);
    if (!inicio.ok) throw new Error();
    em("2026-03-06", "03:05"); // 0h05 de 06/03
    const r = await resolver(DORA, inicio.sessaoId);
    expect(r).toMatchObject({ sequencia: 2, sequenciaAumentou: true, meta: { feitas: 1 } });
  });

  it("a mudança de fuso vale a partir do próximo dia e um dia pulado por ela não quebra a sequência (CA-96, CA-98)", async () => {
    await db.update(t.perfis).set({ fusoPendente: "Pacific/Kiritimati", pendenteAPartirDe: "2026-03-07" }).where(eq(t.perfis.id, DORA));
    // 06/03 23h30 em São Paulo ainda é o dia 06 no fuso antigo: o fuso pendente não vale.
    em("2026-03-07", "02:30");
    expect((await resumoDoAluno(db, await perfil(DORA))).hoje).toBe("2026-03-06");
    // 07/03 8h em São Paulo; em Kiritimati (UTC+14) já é 08/03: a data pula o dia 07 sem quebrar a sequência.
    em("2026-03-07", "11:00");
    const r = await estudarLicao(DORA, licoesU1[1]);
    expect(r).toMatchObject({ sequencia: 3, sequenciaAumentou: true });
    expect(await perfil(DORA)).toMatchObject({ fuso: "Pacific/Kiritimati", fusoPendente: null, ultimoDiaEstudo: "2026-03-08" });
  });
});

describe("conquistas (E06.5; 4.7)", () => {
  it("concluir as cinco lições da unidade concede Primeira unidade uma única vez (CA-44)", async () => {
    em("2026-03-05", "20:00");
    let ultima: ResultadoConclusao | null = null;
    for (const licaoId of licoesU1.slice(2)) ultima = await estudarLicao(CAIO, licaoId);
    expect(ultima).toMatchObject({ unidadeConcluida: { id: curso[0].unidade.id } });
    expect(ultima!.conquistas).toContain("primeira-unidade");
    const repetida = await estudarLicao(CAIO, licoesU1[4]);
    expect(repetida).toMatchObject({ unidadeConcluida: null });
    expect(repetida.conquistas).not.toContain("primeira-unidade");
  });

  it("sete dias seguidos concedem a conquista, que permanece quando a sequência quebra (CA-99)", async () => {
    for (let d = 6; d <= 11; d++) {
      em(`2026-03-${String(d).padStart(2, "0")}`);
      const r = await estudarLicao(CAIO, licoesU1[0]);
      expect(r.sequencia).toBe(d - 4);
      if (d === 11) expect(r.conquistas).toContain("sete-dias");
      else expect(r.conquistas).not.toContain("sete-dias");
    }
    em("2026-03-20");
    const resumo = await resumoDoAluno(db, await perfil(CAIO));
    expect(resumo.sequencia).toBe(0);
    expect(resumo.conquistas).toEqual(expect.arrayContaining(["primeira-licao", "primeira-unidade", "sete-dias"]));
  });

  it("o limite de XP de prática chega a zero XP, mas a sessão conta para a meta e a sequência (CA-72)", async () => {
    em("2026-03-21");
    const resultados = [];
    for (let i = 0; i < 4; i++) resultados.push(await estudarLicao(CAIO, licoesU1[0]));
    expect(resultados.map((r) => r.xp)).toEqual([10, 10, 10, 0]);
    expect(resultados[3]).toMatchObject({ limitePratica: true, meta: { feitas: 4 }, sequencia: 1 });
  });
});

describe("dia livre (2D)", () => {
  it("ganha-se aos 3 dias, é usado sozinho ao faltar um dia e aparece no calendário", async () => {
    // Terça 10/03 a quinta 12/03: a terceira sessão seguida rende o primeiro dia livre.
    em("2026-03-10");
    expect(await estudarLicao(ELI, licoesU1[0])).toMatchObject({ sequencia: 1, diasLivres: { ganhou: false, usados: 0 } });
    em("2026-03-11");
    expect(await estudarLicao(ELI, licoesU1[0])).toMatchObject({ sequencia: 2, diasLivres: { ganhou: false } });
    em("2026-03-12");
    expect(await estudarLicao(ELI, licoesU1[0])).toMatchObject({ sequencia: 3, diasLivres: { ganhou: true, usados: 0 } });
    expect((await resumoDoAluno(db, await perfil(ELI))).diasLivres).toBe(1);

    // Sexta 13/03 sem estudo: a sequência segue viva no sábado, graças ao dia livre.
    em("2026-03-14");
    const antes = await resumoDoAluno(db, await perfil(ELI));
    expect(antes).toMatchObject({ sequencia: 3, diasLivres: 1 });
    const r = await estudarLicao(ELI, licoesU1[0]);
    expect(r).toMatchObject({ sequencia: 4, sequenciaAumentou: true, diasLivres: { ganhou: false, usados: 1 } });

    const depois = await resumoDoAluno(db, await perfil(ELI));
    expect(depois.diasLivres).toBe(0);
    expect(depois.semana.filter((d) => d.livre).map((d) => d.dia)).toEqual(["2026-03-13"]);
    expect(depois.semana.filter((d) => d.estudou).map((d) => d.dia)).toEqual(["2026-03-10", "2026-03-11", "2026-03-12", "2026-03-14"]);
  });

  it("sem dia livre, um dia perdido quebra a sequência", async () => {
    // Sábado 14/03 foi o último dia; domingo 15 sem estudo e segunda 16 sem estudo (dois dias perdidos até terça).
    em("2026-03-17");
    expect((await resumoDoAluno(db, await perfil(ELI))).sequencia).toBe(0);
    expect(await estudarLicao(ELI, licoesU1[0])).toMatchObject({ sequencia: 1, diasLivres: { ganhou: false, usados: 0 } });
  });
});
