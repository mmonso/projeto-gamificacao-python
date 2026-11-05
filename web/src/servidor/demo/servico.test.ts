// Demonstração anônima e transferência para a conta (E06.6), com PostgreSQL embutido.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { Exercicio } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { licaoDisponivel } from "@/servidor/licoes/servico";
import { corrigirDemo, dentroDoLimite, licaoDemo, recusarDemo, transferirDemo, type LicaoDemo } from "./servico";

const EVA = "00000000-0000-4000-8000-0000000000e5";
const FABIO = "00000000-0000-4000-8000-0000000000f6";
const GIL = "00000000-0000-4000-8000-000000000007";
const HELO = "00000000-0000-4000-8000-000000000008";

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

let db: ReturnType<typeof drizzle<typeof t>>;
let demo: LicaoDemo;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
  await db.insert(t.perfis).values([{ id: EVA }, { id: FABIO }, { id: GIL }, { id: HELO }]);
  demo = (await licaoDemo(db))!;
}, 60_000);

const transferencia = () => ({
  versaoLicaoId: demo.versaoLicaoId,
  itens: demo.exercicios.map((e, i) => ({ exercicioId: e.id, resposta: correta(e.id), errouPrimeira: i === 0, dicas: 0 })),
});

describe("demonstração anônima (FL-01)", () => {
  it("é a primeira lição da trilha e não traz gabarito, explicação ou dicas (D-01, CA-02)", () => {
    expect(demo.licaoId).toBe(curso[0].licoes[0].id);
    const texto = JSON.stringify(demo);
    for (const e of demo.exercicios) {
      const original = exercicios.get(e.id)!;
      expect(texto).not.toContain(original.explicacao);
      for (const d of original.dicas) expect(texto).not.toContain(d);
    }
    expect(demo.exercicios.every((e) => !("resposta" in e))).toBe(true);
  });

  it("corrige sem gravar nada e recusa exercício de outra lição (D-02)", async () => {
    const [{ antes }] = await db.select({ antes: count() }).from(t.submissoes);
    const primeiro = demo.exercicios[0];
    expect(await corrigirDemo(db, { versaoLicaoId: demo.versaoLicaoId, exercicioId: primeiro.id, resposta: correta(primeiro.id) })).toMatchObject({ correta: true });
    const outra = curso[0].licoes[1].exercicios[0];
    expect(await corrigirDemo(db, { versaoLicaoId: demo.versaoLicaoId, exercicioId: outra.id, resposta: correta(outra.id) })).toBeNull();
    const [{ depois }] = await db.select({ depois: count() }).from(t.submissoes);
    expect(depois).toBe(antes);
  });

  it("recusa o excesso de pedidos por minuto (CA-06)", async () => {
    const agora = new Date("2026-04-01T12:00:10Z");
    const resultados = [];
    for (let i = 0; i < 4; i++) resultados.push(await dentroDoLimite(db, "demo:teste", 3, agora));
    expect(resultados).toEqual([true, true, true, false]);
    expect(await dentroDoLimite(db, "demo:teste", 3, new Date("2026-04-01T12:01:10Z"))).toBe(true);
  });
});

describe("transferência para a conta (FL-02)", () => {
  it("registra a lição 1 com 20 XP, atividade e desbloqueio, uma única vez (CA-17, CA-19)", async () => {
    const r = await transferirDemo(db, EVA, transferencia());
    expect(r).toMatchObject({ resultado: "registrada", conclusao: { xp: 20, primeiraConclusao: true, sequencia: 1, conquistas: ["primeira-licao"], acertosPrimeira: demo.exercicios.length - 1 } });
    expect(await licaoDisponivel(db, EVA, curso[0].licoes[1].id)).toBe(true);
    expect(await transferirDemo(db, EVA, transferencia())).toEqual({ resultado: "ja_processada" });
    const lancamentos = await db.select().from(t.lancamentos).where(eq(t.lancamentos.alunoId, EVA));
    expect(lancamentos.map((l) => l.valor)).toEqual([20]);
    const [atividade] = await db.select().from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, EVA));
    expect(atividade.sessoes).toBe(1);
  });

  it("respostas alteradas no navegador não registram nada (CA-18)", async () => {
    const pedido = transferencia();
    pedido.itens[0].resposta = { tipo: "localizar_erro", linha: 99 };
    expect(await transferirDemo(db, FABIO, pedido)).toEqual({ resultado: "invalida" });
    const faltando = { ...transferencia(), itens: transferencia().itens.slice(1) };
    expect(await transferirDemo(db, GIL, faltando)).toEqual({ resultado: "invalida" });
    const [{ conclusoes }] = await db.select({ conclusoes: count() }).from(t.conclusoesLicao).where(eq(t.conclusoesLicao.alunoId, FABIO));
    expect(conclusoes).toBe(0);
    expect(await licaoDisponivel(db, FABIO, curso[0].licoes[1].id)).toBe(false);
  });

  it("conta que já concluiu a lição 1 não recebe a transferência (CA-20)", async () => {
    await db.insert(t.conclusoesLicao).values({ alunoId: HELO, licaoId: demo.licaoId });
    expect(await transferirDemo(db, HELO, transferencia())).toEqual({ resultado: "ja_concluida" });
  });

  it("a recusa fica registrada e impede uma transferência depois", async () => {
    const IVO = "00000000-0000-4000-8000-000000000009";
    await db.insert(t.perfis).values({ id: IVO });
    await recusarDemo(db, IVO);
    expect(await transferirDemo(db, IVO, transferencia())).toEqual({ resultado: "ja_processada" });
  });
});
