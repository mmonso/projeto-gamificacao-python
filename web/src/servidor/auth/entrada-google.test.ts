// Volta do Google: perfil novo com os dados do cookie, conta existente intacta e teto de contas respeitado.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it, vi } from "vitest";
import * as t from "@/servidor/db/esquema";

vi.mock("server-only", () => ({}));
vi.mock("@/modulos/conta/vagas", async (original) => {
  const real = await original<typeof import("@/modulos/conta/vagas")>();
  return { ...real, cadastroAberto: (contas: number) => real.cadastroAberto(contas, 3) };
});

const { prepararPerfilDoProvedor } = await import("./entrada-google");

const ANA = "00000000-0000-4000-8000-0000000001a1";
const BIA = "00000000-0000-4000-8000-0000000001b2";
const CAIO = "00000000-0000-4000-8000-0000000001c3";
const DORA = "00000000-0000-4000-8000-0000000001d4";
const ACEITE = "2026-11-23T18:00:00.000Z";
const google = (id: string, nome = "Ana Maria Souza") => ({ id, app_metadata: { provider: "google" }, user_metadata: { full_name: nome } });

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await db.insert(t.perfis).values({ id: BIA, nome: "Bia" });
}, 60_000);

describe("perfil na volta do Google", () => {
  it("conta nova: primeiro nome do Google, meta, fuso e aceite do cookie", async () => {
    const r = await prepararPerfilDoProvedor(db, google(ANA), { meta_diaria: 2, fuso: "America/Manaus", termos_aceitos_em: ACEITE });
    expect(r).toBe("ok");
    const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, ANA));
    expect(p).toMatchObject({ nome: "Ana", metaDiaria: 2, fuso: "America/Manaus", visitante: false });
    expect(p.termosAceitosEm?.toISOString()).toBe(ACEITE);
  });

  it("conta que já tem perfil: nada muda", async () => {
    expect(await prepararPerfilDoProvedor(db, google(BIA, "Beatriz Lima"), null)).toBe("ok");
    const [p] = await db.select().from(t.perfis).where(eq(t.perfis.id, BIA));
    expect(p.nome).toBe("Bia");
  });

  it("entrada por e-mail não passa por aqui", async () => {
    expect(await prepararPerfilDoProvedor(db, { id: CAIO, app_metadata: { provider: "email" } }, null)).toBe("ok");
    expect(await db.select().from(t.perfis).where(eq(t.perfis.id, CAIO))).toHaveLength(0);
  });

  it("teto cheio: conta nova fica sem perfil", async () => {
    await db.insert(t.perfis).values({ id: CAIO });
    expect(await prepararPerfilDoProvedor(db, google(DORA), null)).toBe("sem-vagas");
    expect(await db.select().from(t.perfis).where(eq(t.perfis.id, DORA))).toHaveLength(0);
    expect(await prepararPerfilDoProvedor(db, google(ANA), null)).toBe("ok");
  });
});
