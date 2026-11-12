// Integração com PostgreSQL embutido (PGlite): migrações, restrições e publicação de conteúdo.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { count, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "./esquema";

const ALUNO = "00000000-0000-4000-8000-000000000001";
const OUTRO = "00000000-0000-4000-8000-000000000002";

let db: ReturnType<typeof drizzle<typeof t>>;

async function falha(promessa: Promise<unknown>): Promise<string> {
  try {
    await promessa;
  } catch (e) {
    return String((e as { cause?: { message?: string } }).cause?.message ?? (e as Error).message);
  }
  throw new Error("A operação deveria ter falhado");
}

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await db.insert(t.perfis).values([{ id: ALUNO }, { id: OUTRO }]);
}, 60_000);

describe("migrações e restrições", () => {
  it("cria o perfil com cinco corações e meta 1", async () => {
    const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, ALUNO));
    expect(p).toMatchObject({ coracoes: 5, metaDiaria: 1, fuso: "America/Sao_Paulo" });
  });

  it("impede corações fora da faixa de 0 a 5 (CA-101)", async () => {
    expect(await falha(db.update(t.perfis).set({ coracoes: 6 }).where(eq(t.perfis.id, ALUNO)))).toMatch(/perfis_coracoes_faixa/);
    expect(await falha(db.update(t.perfis).set({ coracoes: -1 }).where(eq(t.perfis.id, ALUNO)))).toMatch(/perfis_coracoes_faixa/);
  });

  it("impede lançar duas vezes o mesmo evento de recompensa (CA-19, CA-56)", async () => {
    const lancamento = { alunoId: ALUNO, causa: "primeira_conclusao", valor: 20, diaEstudo: "2026-10-09", eventoId: "conclusao:teste" };
    await db.insert(t.lancamentos).values(lancamento);
    expect(await falha(db.insert(t.lancamentos).values(lancamento))).toMatch(/lancamentos_evento_id_unique/);
  });
});

describe("publicação de conteúdo", () => {
  const curso = carregarCurso(join(__dirname, "../../../../conteudo"));

  it("publica as 20 lições com exercícios e gabaritos separados (E04.7)", async () => {
    const r = await publicarCurso(db, curso);
    expect(r.publicadas).toHaveLength(20);
    const [{ n: nEx }] = await db.select({ n: count() }).from(t.exercicios);
    const [{ n: nGab }] = await db.select({ n: count() }).from(t.gabaritos);
    expect(nEx).toBeGreaterThanOrEqual(140);
    expect(nGab).toBe(nEx);
    const linhas = await db.select({ publico: t.exercicios.publico }).from(t.exercicios);
    for (const { publico } of linhas) expect(JSON.stringify(publico)).not.toMatch(/"(resposta|explicacao|feedback|correcao)"/);
  });

  it("é idempotente: publicar de novo não duplica versões", async () => {
    const r = await publicarCurso(db, curso);
    expect(r.publicadas).toHaveLength(0);
    expect(r.jaExistentes).toHaveLength(20);
  });
});

describe("sessões e conclusões", () => {
  it("permite só uma sessão principal aberta por aluno e lição (D-07, CA-30)", async () => {
    const [versao] = await db.select().from(t.versoesLicao).where(eq(t.versoesLicao.licaoId, "u1-l1"));
    const sessao = { alunoId: ALUNO, tipo: "principal" as const, licaoId: "u1-l1", versaoLicaoId: versao.id, fila: {}, totalItens: 6 };
    await db.insert(t.sessoes).values(sessao);
    expect(await falha(db.insert(t.sessoes).values(sessao))).toMatch(/sessoes_principal_aberta/);
    await db.insert(t.sessoes).values({ ...sessao, alunoId: OUTRO });
    await db.insert(t.sessoes).values({ ...sessao, tipo: "pratica" });
  });

  it("registra uma única primeira conclusão por aluno e lição", async () => {
    await db.insert(t.conclusoesLicao).values({ alunoId: ALUNO, licaoId: "u1-l1" });
    expect(await falha(db.insert(t.conclusoesLicao).values({ alunoId: ALUNO, licaoId: "u1-l1" }))).toMatch(/duplicate key|conclusoes_licao/);
  });

  it("apaga os dados do aluno quando o perfil é excluído (CA-116)", async () => {
    await db.delete(t.perfis).where(eq(t.perfis.id, ALUNO));
    const restos = await db.execute(sql`
      select (select count(*) from sessoes where aluno_id = ${ALUNO}) +
             (select count(*) from lancamentos where aluno_id = ${ALUNO}) +
             (select count(*) from conclusoes_licao where aluno_id = ${ALUNO}) as total`);
    expect(Number((restos.rows[0] as { total: number }).total)).toBe(0);
  });
});
