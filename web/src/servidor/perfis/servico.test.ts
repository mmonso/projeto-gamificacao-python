// Perfil no primeiro acesso e isolamento entre contas (E04.5, E04.6), com PostgreSQL embutido.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import * as t from "@/servidor/db/esquema";
import { obterOuCriarPerfil } from "./servico";

const ANA = "00000000-0000-4000-8000-0000000000a1";
const BIA = "00000000-0000-4000-8000-0000000000b2";

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
}, 60_000);

describe("perfil no primeiro acesso", () => {
  it("cria o perfil com os dados do cadastro", async () => {
    const p = await obterOuCriarPerfil(db, ANA, { nome: "Ana", meta_diaria: 2, fuso: "America/Manaus", termos_aceitos_em: "2026-10-18T12:00:00Z" });
    expect(p).toMatchObject({ id: ANA, nome: "Ana", metaDiaria: 2, fuso: "America/Manaus", coracoes: 5, xpTotal: 0 });
    expect(p.termosAceitosEm?.toISOString()).toBe("2026-10-18T12:00:00.000Z");
  });

  it("não sobrescreve um perfil existente com metadados posteriores", async () => {
    await db.update(t.perfis).set({ metaDiaria: 3 }).where(eq(t.perfis.id, ANA));
    const p = await obterOuCriarPerfil(db, ANA, { nome: "Outro nome", meta_diaria: 1 });
    expect(p).toMatchObject({ nome: "Ana", metaDiaria: 3 });
  });

  it("cria um único perfil com acessos simultâneos", async () => {
    const [a, b] = await Promise.all([obterOuCriarPerfil(db, BIA, { nome: "Bia" }), obterOuCriarPerfil(db, BIA, { nome: "Bia" })]);
    expect(a.id).toBe(BIA);
    expect(b.id).toBe(BIA);
    expect(await db.select().from(t.perfis).where(eq(t.perfis.id, BIA))).toHaveLength(1);
  });

  it("cada conta recebe apenas o próprio perfil", async () => {
    const ana = await obterOuCriarPerfil(db, ANA, {});
    const bia = await obterOuCriarPerfil(db, BIA, {});
    expect(ana.id).toBe(ANA);
    expect(bia.id).toBe(BIA);
    expect(bia.nome).toBe("Bia");
  });
});
