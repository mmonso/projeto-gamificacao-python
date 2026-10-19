// Lição publicada, início e retomada de sessão e isolamento entre contas (E04.7, E04.8), com PostgreSQL embutido.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { and, count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { iniciarSessao, licaoDisponivel, obterLicaoPublica, obterSessaoAtual } from "./servico";

const ANA = "00000000-0000-4000-8000-0000000000a1";
const BIA = "00000000-0000-4000-8000-0000000000b2";

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, carregarCurso(join(__dirname, "../../../../conteudo")));
  await db.insert(t.perfis).values([{ id: ANA }, { id: BIA }]);
}, 60_000);

describe("lição publicada", () => {
  it("traz a versão vigente da lição piloto com seus exercícios principais", async () => {
    const l = await obterLicaoPublica(db, "u1-l1");
    expect(l).toMatchObject({ id: "u1-l1", unidadeId: "u1", ordem: 1, versao: 1 });
    expect(l!.totalExercicios).toBeGreaterThanOrEqual(5);
  });

  it("devolve null para lição inexistente", async () => {
    expect(await obterLicaoPublica(db, "u9-l9")).toBeNull();
  });

  it("ignora versão retirada", async () => {
    const [v] = await db.select().from(t.versoesLicao).where(eq(t.versoesLicao.licaoId, "u3-l5"));
    await db.update(t.versoesLicao).set({ retiradaEm: new Date() }).where(eq(t.versoesLicao.id, v.id));
    expect(await obterLicaoPublica(db, "u3-l5")).toBeNull();
    await db.update(t.versoesLicao).set({ retiradaEm: null }).where(eq(t.versoesLicao.id, v.id));
  });
});

describe("desbloqueio", () => {
  it("libera a primeira lição e bloqueia a seguinte até a anterior ser concluída", async () => {
    expect(await licaoDisponivel(db, ANA, "u1-l1")).toBe(true);
    expect(await licaoDisponivel(db, ANA, "u1-l2")).toBe(false);
    await db.insert(t.conclusoesLicao).values({ alunoId: ANA, licaoId: "u1-l1" });
    expect(await licaoDisponivel(db, ANA, "u1-l2")).toBe(true);
    expect(await licaoDisponivel(db, BIA, "u1-l2")).toBe(false);
  });

  it("recusa iniciar lição bloqueada ou inexistente", async () => {
    expect(await iniciarSessao(db, BIA, "u1-l3")).toEqual({ ok: false, motivo: "bloqueada" });
    expect(await iniciarSessao(db, BIA, "u9-l9")).toEqual({ ok: false, motivo: "inexistente" });
  });
});

describe("sessão da lição piloto", () => {
  it("cria a sessão presa à versão vigente, com a fila na ordem dos exercícios", async () => {
    const r = await iniciarSessao(db, BIA, "u1-l1");
    expect(r).toMatchObject({ ok: true, retomada: false });
    const atual = await obterSessaoAtual(db, BIA, (r as { sessaoId: string }).sessaoId);
    expect(atual).toMatchObject({ estado: "aberta", resolvidos: 0, licao: { id: "u1-l1" } });
    expect(atual!.exercicio?.id).toBe("u1-l1-e01");
    const [{ n }] = await db.select({ n: count() }).from(t.itensSessao).where(eq(t.itensSessao.sessaoId, atual!.id));
    expect(n).toBe(atual!.totalItens);
  });

  it("retoma a sessão aberta em vez de criar outra (D-07)", async () => {
    const [a, b] = await Promise.all([iniciarSessao(db, BIA, "u1-l1"), iniciarSessao(db, BIA, "u1-l1")]);
    expect(a).toMatchObject({ ok: true, retomada: true });
    expect(b).toEqual(a);
    const abertas = await db
      .select({ n: count() })
      .from(t.sessoes)
      .where(and(eq(t.sessoes.alunoId, BIA), eq(t.sessoes.licaoId, "u1-l1"), eq(t.sessoes.estado, "aberta")));
    expect(abertas[0].n).toBe(1);
  });

  it("nunca entrega gabarito, explicação ou dicas no exercício atual (F-15, CA-02)", async () => {
    const r = (await iniciarSessao(db, BIA, "u1-l1")) as { sessaoId: string };
    const { exercicio } = (await obterSessaoAtual(db, BIA, r.sessaoId))!;
    const texto = JSON.stringify(exercicio);
    for (const chave of ["resposta", "gabarito", "explicacao", "feedback", "dicas", "correcao"]) expect(texto).not.toContain(`"${chave}"`);
  });

  it("outra conta não enxerga a sessão (CA-42)", async () => {
    const r = (await iniciarSessao(db, BIA, "u1-l1")) as { sessaoId: string };
    expect(await obterSessaoAtual(db, ANA, r.sessaoId)).toBeNull();
    expect(await obterSessaoAtual(db, ANA, "nao-e-uuid")).toBeNull();
  });
});
