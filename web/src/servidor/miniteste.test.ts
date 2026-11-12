// Mini-teste da unidade 1: correção no servidor, registro só da primeira vez de cada momento.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import { PERGUNTAS_MINITESTE } from "@/modulos/aprendizagem/miniteste";
import * as t from "@/servidor/db/esquema";
import { corrigirMiniteste, estadoMiniteste, registrarMiniteste } from "./miniteste";

const LIA = "00000000-0000-4000-8000-00000000017a";

/** Saídas conferidas rodando cada código no Python 3.14. */
const SAIDAS = ["5 + 3", "Total: 8", "cidade", "25", "30"];
const certas = PERGUNTAS_MINITESTE.map((p, i) => p.opcoes.indexOf(SAIDAS[i]));

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../drizzle") });
  await db.insert(t.perfis).values([{ id: LIA }]);
}, 60_000);

describe("mini-teste", () => {
  it("cada pergunta tem a saída verdadeira entre as opções, e o gabarito aponta para ela", () => {
    expect(certas.every((i) => i >= 0)).toBe(true);
    expect(corrigirMiniteste(certas)).toBe(PERGUNTAS_MINITESTE.length);
    expect(corrigirMiniteste(certas.map((i) => (i + 1) % 4))).toBe(0);
  });

  it("guarda antes e depois só na primeira vez e devolve a comparação", async () => {
    expect(await estadoMiniteste(db, LIA)).toEqual({ antes: null, depois: null, total: 5 });
    const antes = await registrarMiniteste(db, LIA, "antes", [0, 0, 0, 0, 0]);
    expect(antes).toMatchObject({ antes: 1, depois: null });
    // Refazer o "antes" não muda a medida.
    expect(await registrarMiniteste(db, LIA, "antes", certas)).toMatchObject({ antes: 1, acertos: 1 });
    const depois = await registrarMiniteste(db, LIA, "depois", certas);
    expect(depois).toMatchObject({ antes: 1, depois: 5, acertos: 5 });
  });
});
