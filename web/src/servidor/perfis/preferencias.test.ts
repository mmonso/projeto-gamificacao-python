// Preferências, exportação e exclusão de dados (F-31, F-32; CA-95, CA-96, CA-115, CA-116).
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { submeter } from "@/servidor/licoes/estudo";
import { iniciarSessao, obterSessaoAtual } from "@/servidor/licoes/servico";
import { excluirDadosDoAluno, exportarHistorico, mudarFuso, mudarMeta } from "./preferencias";

const JOAO = "00000000-0000-4000-8000-00000000000a";
const KIKA = "00000000-0000-4000-8000-00000000000b";

let db: ReturnType<typeof drizzle<typeof t>>;
const curso = carregarCurso(join(__dirname, "../../../../conteudo"));

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
  await db.insert(t.perfis).values([{ id: JOAO, nome: "João" }, { id: KIKA, nome: "Kika" }]);
  for (const aluno of [JOAO, KIKA]) {
    await iniciarSessao(db, aluno, curso[0].licoes[0].id);
    await db.insert(t.lancamentos).values({ alunoId: aluno, causa: "primeira_conclusao", valor: 20, diaEstudo: "2026-05-01", eventoId: `teste:${randomUUID()}` });
  }
}, 60_000);

describe("preferências", () => {
  it("a meta muda na hora e só aceita 1 a 3", async () => {
    await mudarMeta(db, JOAO, 3);
    const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, JOAO));
    expect(p.metaDiaria).toBe(3);
    await expect(mudarMeta(db, JOAO, 4)).rejects.toThrow();
  });

  it("o fuso novo fica pendente até o próximo dia de estudo; voltar ao atual cancela (CA-96)", async () => {
    await mudarFuso(db, JOAO, "Europe/Lisbon", new Date("2026-05-01T15:00:00Z"));
    let [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, JOAO));
    expect(p).toMatchObject({ fuso: "America/Sao_Paulo", fusoPendente: "Europe/Lisbon", pendenteAPartirDe: "2026-05-02" });
    await mudarFuso(db, JOAO, "America/Sao_Paulo");
    [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, JOAO));
    expect(p).toMatchObject({ fusoPendente: null, pendenteAPartirDe: null });
    await expect(mudarFuso(db, JOAO, "Lugar/Nenhum")).rejects.toThrow();
  });
});

describe("dados pessoais", () => {
  it("a exportação traz todos os dados do próprio aluno, com respostas e eventos, e nada da outra conta (CA-115)", async () => {
    const sessaoDe = async (aluno: string) => (await db.select({ id: t.sessoes.id }).from(t.sessoes).where(eq(t.sessoes.alunoId, aluno)))[0].id;
    for (const aluno of [JOAO, KIKA]) {
      const sessao = await sessaoDe(aluno);
      const atual = await obterSessaoAtual(db, aluno, sessao);
      await submeter(db, aluno, sessao, { id: randomUUID(), exercicioId: atual!.exercicio!.id, resposta: { tipo: "localizar_erro", linha: 99 } });
    }
    const h = await exportarHistorico(db, JOAO);
    expect(h.perfil?.nome).toBe("João");
    expect(h.lancamentos).toHaveLength(1);
    expect(h.sessoes).toHaveLength(1);
    expect(h.respostas).toMatchObject([{ resposta: { tipo: "localizar_erro", linha: 99 }, correta: false }]);
    expect(h.eventos.map((e) => e.nome)).toEqual(expect.arrayContaining(["licao_iniciada", "exercicio_respondido"]));
    const texto = JSON.stringify(h);
    expect(texto).not.toContain("Kika");
    expect(texto).not.toContain(await sessaoDe(KIKA));
  });

  it("a exclusão remove perfil, sessões e XP sem tocar na outra conta (CA-116)", async () => {
    await db.transaction((tx) => excluirDadosDoAluno(tx, JOAO));
    const contar = async (tabela: typeof t.sessoes | typeof t.lancamentos, aluno: string) =>
      (await db.select({ n: count() }).from(tabela).where(eq(tabela.alunoId, aluno)))[0].n;
    expect(await db.select().from(t.perfis).where(eq(t.perfis.id, JOAO))).toHaveLength(0);
    expect(await contar(t.sessoes, JOAO)).toBe(0);
    expect(await contar(t.lancamentos, JOAO)).toBe(0);
    expect(await contar(t.sessoes, KIKA)).toBe(1);
    expect(await contar(t.lancamentos, KIKA)).toBe(1);
  });
});
