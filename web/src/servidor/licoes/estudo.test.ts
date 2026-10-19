// Responder, dicas e conclusão de uma lição (E05.3 a E05.6), com PostgreSQL embutido.
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
import { concluir, ErroEstudo, itensDaSessao, pedirDica, submeter } from "./estudo";
import { iniciarSessao, licaoDisponivel, obterSessaoAtual, obterTrilha } from "./servico";

const ANA = "00000000-0000-4000-8000-0000000000a1";
const BIA = "00000000-0000-4000-8000-0000000000b2";

const curso = carregarCurso(join(__dirname, "../../../../conteudo"));
const exercicios = new Map<string, Exercicio>(curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao])).map((e) => [e.id, e]));

function correta(id: string): Resposta {
  const ex = exercicios.get(id)!;
  switch (ex.tipo) {
    case "escolher_resultado":
      return { tipo: ex.tipo, opcao: ex.resposta };
    case "completar_lacuna":
      return { tipo: ex.tipo, lacunas: Object.fromEntries(ex.lacunas.map((l) => [l.id, l.resposta])) };
    case "ordenar_blocos":
      return { tipo: ex.tipo, blocos: ex.resposta[0] };
    case "localizar_erro":
      return { tipo: ex.tipo, linha: ex.resposta };
  }
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
    expect(a).toMatchObject({ licaoId: "u1-l1", primeiraConclusao: true, proximaLicaoId: "u1-l2" });
    expect(a.acertosPrimeira).toBe(a.total - 1);
    expect(await licaoDisponivel(db, ANA, "u1-l2")).toBe(true);

    const [u1] = await obterTrilha(db, ANA);
    expect(u1.licoes.map((l) => l.estado)).toEqual(["concluida", "atual", "bloqueada", "bloqueada", "bloqueada"]);
    expect(u1.licoes.at(-1)!.desafio).toBe(true);

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
