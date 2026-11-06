// Percurso do curso inteiro (E07.5): ordem, desbloqueios, recompensas, unidades e revisões nas 15 lições,
// com PostgreSQL embutido e o conteúdo publicado de ../conteudo.
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { corrigir, type Resposta } from "@/modulos/aprendizagem/corretor";
import { separarExercicio, type Exercicio } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { respostaCorreta } from "@/testes/respostas";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { concluir, submeter } from "./estudo";
import { iniciarRevisao } from "./revisao";
import { iniciarRecuperacao, iniciarSessao, obterSessaoAtual, obterTrilha } from "./servico";

const LIA = "00000000-0000-4000-8000-0000000000aa";

const curso = carregarCurso(join(__dirname, "../../../../conteudo"));
const todos = curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao]));
const exercicios = new Map<string, Exercicio>(todos.map((e) => [e.id, e]));

function correta(id: string): Resposta {
  return respostaCorreta(exercicios.get(id)!);
}

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
  await db.insert(t.perfis).values({ id: LIA });
}, 60_000);

async function resolverSessao(sessaoId: string) {
  for (let s = await obterSessaoAtual(db, LIA, sessaoId); s?.exercicio; s = await obterSessaoAtual(db, LIA, sessaoId)) {
    const r = await submeter(db, LIA, sessaoId, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
    expect(r.correta, `${s.exercicio.id} deveria aceitar a resposta do conteúdo`).toBe(true);
  }
  return concluir(db, LIA, sessaoId);
}

describe("conteúdo publicado", () => {
  it("tem três unidades de cinco lições, com o desafio final em quinto", () => {
    expect(curso).toHaveLength(3);
    for (const u of curso) expect(u.licoes.map((l) => l.ordem)).toEqual([1, 2, 3, 4, 5]);
  });

  it("cada gabarito aceita a resposta do próprio conteúdo, inclusive nas variações de revisão", () => {
    for (const ex of todos) expect(corrigir(separarExercicio(ex).gabarito, correta(ex.id)), ex.id).toBe(true);
  });

  it("identificadores de exercício são únicos no curso", () => {
    expect(new Set(todos.map((e) => e.id)).size).toBe(todos.length);
  });
});

describe("percurso das 15 lições", () => {
  it("cada lição só começa depois da anterior e libera a próxima; cada unidade completa é celebrada", async () => {
    const ordem = curso.flatMap((u) => u.licoes.map((l) => ({ id: l.id, unidade: u.unidade.id, ultima: l.ordem === u.licoes.length })));
    for (const [i, licao] of ordem.entries()) {
      const proxima = ordem[i + 1];
      if (proxima) expect(await iniciarSessao(db, LIA, proxima.id)).toEqual({ ok: false, motivo: "bloqueada" });

      const inicio = await iniciarSessao(db, LIA, licao.id);
      if (!inicio.ok) throw new Error(`${licao.id}: ${inicio.motivo}`);
      const r = await resolverSessao(inicio.sessaoId);
      expect(r).toMatchObject({ tipo: "principal", xp: 20, primeiraConclusao: true, proximaLicaoId: proxima?.id ?? null });
      expect(r.unidadeConcluida?.id ?? null).toBe(licao.ultima ? licao.unidade : null);
      if (i === 0) expect(r.conquistas).toEqual(["primeira-licao"]);
      else if (i === 4) expect(r.conquistas).toEqual(["primeira-unidade"]);
      else expect(r.conquistas).toEqual([]);
    }

    const trilha = await obterTrilha(db, LIA);
    expect(trilha.flatMap((u) => u.licoes).every((l) => l.estado === "concluida")).toBe(true);
    const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, LIA));
    const resumo = await resumoDoAluno(db, p);
    expect(resumo).toMatchObject({ xpTotal: 300, licoesConcluidas: 15, coracoes: 5, conquistas: ["primeira-licao", "primeira-unidade"] });
  });

  it("a revisão geral e a recuperação usam conceitos das três unidades", async () => {
    const revisao = await iniciarRevisao(db, LIA);
    if (!revisao.ok) throw new Error();
    const r = await resolverSessao(revisao.sessaoId);
    expect(r.tipo).toBe("revisao");
    expect(r.total).toBeGreaterThanOrEqual(5);

    await db.update(t.perfis).set({ coracoes: 1 }).where(eq(t.perfis.id, LIA));
    const recuperacao = await iniciarRecuperacao(db, LIA);
    if (!recuperacao.ok) throw new Error();
    const rr = await resolverSessao(recuperacao.sessaoId);
    expect(rr).toMatchObject({ tipo: "recuperacao", coracoesRecuperados: 2 });
  });

  it("praticar o desafio final de cada unidade não repete a recompensa de primeira conclusão", async () => {
    for (const u of curso) {
      const ultima = u.licoes.at(-1)!;
      const inicio = await iniciarSessao(db, LIA, ultima.id);
      if (!inicio.ok) throw new Error();
      const r = await resolverSessao(inicio.sessaoId);
      expect(r).toMatchObject({ tipo: "pratica", primeiraConclusao: false, unidadeConcluida: null });
    }
  });
});

describe("eventos de produto (PLANO, seção 16; CA-117)", () => {
  it("registram início, respostas, dicas e conclusões só com identificadores, sem respostas", async () => {
    const eventos = await db.select().from(t.eventosProduto).where(eq(t.eventosProduto.alunoId, LIA));
    const nomes = new Set(eventos.map((e) => e.nome));
    for (const n of ["licao_iniciada", "exercicio_respondido", "licao_concluida", "revisao_concluida"]) expect(nomes).toContain(n);
    const permitidas = new Set(["licaoId", "sessaoId", "tipo", "exercicioId", "correta", "primeiraTentativa", "numero", "acertosPrimeira", "total", "unidadeConcluida", "recomendada"]);
    for (const e of eventos) for (const chave of Object.keys(e.dados as object)) expect(permitidas, `${e.nome}.${chave}`).toContain(chave);
  });
});
