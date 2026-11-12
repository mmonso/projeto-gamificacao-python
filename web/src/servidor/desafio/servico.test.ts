// Desafio do dia com o conteúdo publicado num PostgreSQL embutido.
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { count } from "drizzle-orm";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import { beforeAll, describe, expect, it } from "vitest";
import type { Exercicio } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { publicarCurso } from "@/servidor/conteudo/publicar";
import * as t from "@/servidor/db/esquema";
import { respostaCorreta } from "@/testes/respostas";
import { corrigirDesafio, desafioDeHoje, dicaDesafio } from "./servico";

const curso = carregarCurso(join(__dirname, "../../../../conteudo"));
const exercicios = new Map<string, Exercicio>(curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao])).map((e) => [e.id, e]));

let db: ReturnType<typeof drizzle<typeof t>>;

beforeAll(async () => {
  db = drizzle({ client: new PGlite(), schema: t });
  await migrate(db, { migrationsFolder: join(__dirname, "../../../drizzle") });
  await publicarCurso(db, curso);
}, 60_000);

const HOJE = new Date("2026-11-20T15:00:00Z"); // desafio #9

describe("desafio do dia no servidor", () => {
  it("monta 5 perguntas de qual é a saída, sem cartão abrindo sozinho, iguais em dois pedidos", async () => {
    const d = (await desafioDeHoje(db, HOJE))!;
    expect(d.numero).toBe(9);
    expect(d.exercicios).toHaveLength(5);
    for (const ex of d.exercicios) {
      expect(ex).toMatchObject({ tipo: "escolher_resultado", opcoesSao: "saida" });
      expect(ex.cartoes?.every((c) => !c.novo) ?? true).toBe(true);
    }
    expect((await desafioDeHoje(db, HOJE))!.exercicios.map((e) => e.id)).toEqual(d.exercicios.map((e) => e.id));
    expect((await desafioDeHoje(db, new Date("2026-11-21T15:00:00Z")))!.exercicios.map((e) => e.id)).not.toEqual(d.exercicios.map((e) => e.id));
  });

  it("corrige sem gravar nada e devolve a solução e a explicação", async () => {
    const d = (await desafioDeHoje(db, HOJE))!;
    const [primeiro] = d.exercicios;
    const antes = (await db.select({ n: count() }).from(t.submissoes))[0].n;
    const r = await corrigirDesafio(db, { numero: 9, exercicioId: primeiro.id, resposta: respostaCorreta(exercicios.get(primeiro.id)!) }, HOJE);
    expect(r).toMatchObject({ correta: true, solucao: { tipo: "escolher_resultado" } });
    expect(r!.explicacao.length).toBeGreaterThan(0);
    expect((await db.select({ n: count() }).from(t.submissoes))[0].n).toBe(antes);
    expect(await dicaDesafio(db, { numero: 9, exercicioId: primeiro.id, numeroDica: 1 }, HOJE)).toBe(exercicios.get(primeiro.id)!.dicas[0]);
  });

  it("recusa pergunta de fora do desafio e desafio de dias distantes", async () => {
    const d = (await desafioDeHoje(db, HOJE))!;
    const fora = [...exercicios.values()].find((e) => !d.exercicios.some((x) => x.id === e.id))!;
    expect(await corrigirDesafio(db, { numero: 9, exercicioId: fora.id, resposta: respostaCorreta(fora) }, HOJE)).toBeNull();
    const [primeiro] = d.exercicios;
    const resposta = respostaCorreta(exercicios.get(primeiro.id)!);
    // Ontem e amanhã ainda valem (quem começou perto da meia-noite); três dias atrás, não.
    expect(await corrigirDesafio(db, { numero: 9, exercicioId: primeiro.id, resposta }, new Date("2026-11-21T15:00:00Z"))).not.toBeNull();
    expect(await corrigirDesafio(db, { numero: 9, exercicioId: primeiro.id, resposta }, new Date("2026-11-23T15:00:00Z"))).toBeNull();
  });
});
