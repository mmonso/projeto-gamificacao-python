// Acesso de visitante: perfil marcado, evento próprio e limpeza só dos visitantes vencidos, com PostgreSQL embutido.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { count, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { DIAS_DE_VISITANTE } from "@/modulos/conta/conta";
import * as t from "@/servidor/db/esquema";
import { manutencaoAutorizada } from "@/servidor/manutencao";
import { obterOuCriarPerfil } from "./servico";
import { limiteDeVisitante, limparVisitantes } from "./visitantes";

const VISITANTE_VELHO = "00000000-0000-4000-8000-0000000000c1";
const VISITANTE_NOVO = "00000000-0000-4000-8000-0000000000c2";
const ALUNA_VELHA = "00000000-0000-4000-8000-0000000000c3";

const AGORA = new Date("2026-11-20T12:00:00Z");
const DIA = 86_400_000;

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
}, 60_000);

const eventos = async (aluno: string) => (await db.select({ n: count() }).from(t.eventosProduto).where(eq(t.eventosProduto.alunoId, aluno)))[0].n;

describe("acesso de visitante", () => {
  it("cria o perfil marcado como visitante, com evento próprio em vez de conta criada", async () => {
    const p = await obterOuCriarPerfil(db, VISITANTE_VELHO, { nome: "Visitante", termos_aceitos_em: "2026-11-01T12:00:00Z" }, true);
    expect(p).toMatchObject({ visitante: true, nome: "Visitante" });
    const [e] = await db.select().from(t.eventosProduto).where(eq(t.eventosProduto.alunoId, VISITANTE_VELHO));
    expect(e.nome).toBe("visitante_entrou");
  });

  it("conta com e-mail continua sem a marca de visitante", async () => {
    const p = await obterOuCriarPerfil(db, ALUNA_VELHA, { nome: "Ana" });
    expect(p.visitante).toBe(false);
  });

  it("a limpeza apaga só visitantes com mais de DIAS_DE_VISITANTE dias, com progresso e eventos", async () => {
    await obterOuCriarPerfil(db, VISITANTE_NOVO, {}, true);
    const velho = new Date(AGORA.getTime() - (DIAS_DE_VISITANTE + 1) * DIA);
    const recente = new Date(AGORA.getTime() - (DIAS_DE_VISITANTE - 1) * DIA);
    await db.update(t.perfis).set({ criadoEm: velho }).where(eq(t.perfis.id, VISITANTE_VELHO));
    await db.update(t.perfis).set({ criadoEm: velho }).where(eq(t.perfis.id, ALUNA_VELHA));
    await db.update(t.perfis).set({ criadoEm: recente }).where(eq(t.perfis.id, VISITANTE_NOVO));
    await db.insert(t.lancamentos).values({ alunoId: VISITANTE_VELHO, causa: "primeira_conclusao", valor: 20, diaEstudo: "2026-11-10", eventoId: "teste:visitante" });

    expect(await limparVisitantes(db, AGORA)).toEqual({ visitantes: 1, semPerfil: 0 });

    const ids = (await db.select({ id: t.perfis.id }).from(t.perfis)).map((p) => p.id);
    expect(ids).not.toContain(VISITANTE_VELHO);
    expect(ids).toContain(VISITANTE_NOVO);
    expect(ids).toContain(ALUNA_VELHA);
    expect(await eventos(VISITANTE_VELHO)).toBe(0);
    expect((await db.select({ n: count() }).from(t.lancamentos).where(eq(t.lancamentos.alunoId, VISITANTE_VELHO)))[0].n).toBe(0);
  });

  it("rodar de novo não apaga mais nada", async () => {
    expect(await limparVisitantes(db, AGORA)).toEqual({ visitantes: 0, semPerfil: 0 });
  });

  it("o limite fica DIAS_DE_VISITANTE dias antes de agora", () => {
    expect(limiteDeVisitante(AGORA).getTime()).toBe(AGORA.getTime() - DIAS_DE_VISITANTE * DIA);
  });
});

describe("autorização da manutenção", () => {
  const segredo = "um-segredo-longo-de-teste-123";
  it("aceita só o cabeçalho com o segredo certo", () => {
    expect(manutencaoAutorizada(`Bearer ${segredo}`, segredo)).toBe(true);
    expect(manutencaoAutorizada(`Bearer ${segredo}x`, segredo)).toBe(false);
    expect(manutencaoAutorizada(null, segredo)).toBe(false);
    expect(manutencaoAutorizada("Bearer undefined", undefined)).toBe(false);
  });
  it("recusa tudo quando o segredo é curto ou falta", () => {
    expect(manutencaoAutorizada("Bearer curto", "curto")).toBe(false);
    expect(manutencaoAutorizada("Bearer ", "")).toBe(false);
  });
});
