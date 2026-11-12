import { describe, expect, it } from "vitest";
import { MIN_RESPOSTAS, ordenarDificuldade, sinalDoExercicio } from "./dificuldade";

describe("sinalDoExercicio", () => {
  it("sem amostra suficiente, não sinaliza nada", () => {
    expect(sinalDoExercicio({ respostas: MIN_RESPOSTAS - 1, acertosPrimeira: 0 })).toBeNull();
  });

  it("menos da metade acertando de primeira é confuso", () => {
    expect(sinalDoExercicio({ respostas: 20, acertosPrimeira: 9 })).toBe("confuso");
  });

  it("quase todos acertando de primeira é fácil demais", () => {
    expect(sinalDoExercicio({ respostas: 40, acertosPrimeira: 39 })).toBe("facil");
  });

  it("taxas no meio do caminho não sinalizam", () => {
    expect(sinalDoExercicio({ respostas: 20, acertosPrimeira: 10 })).toBeNull();
    expect(sinalDoExercicio({ respostas: 20, acertosPrimeira: 18 })).toBeNull();
  });
});

describe("ordenarDificuldade", () => {
  it("põe os confusos primeiro, depois os fáceis, e os sem sinal por último; dentro de cada grupo, a pior taxa vem à frente", () => {
    const ordenados = ordenarDificuldade([
      { exercicioId: "a", respostas: 20, acertosPrimeira: 20, tempoMedianoMs: 3000 },
      { exercicioId: "b", respostas: 20, acertosPrimeira: 4, tempoMedianoMs: 9000 },
      { exercicioId: "c", respostas: 20, acertosPrimeira: 8, tempoMedianoMs: null },
      { exercicioId: "d", respostas: 20, acertosPrimeira: 12, tempoMedianoMs: null },
      { exercicioId: "e", respostas: 40, acertosPrimeira: 39, tempoMedianoMs: 2000 },
    ]);
    // b (20%) e c (40%) confusos; e (97,5%) e a (100%) fáceis; d (60%) sem sinal.
    expect(ordenados.map((r) => r.exercicioId)).toEqual(["b", "c", "e", "a", "d"]);
    expect(ordenados[0]).toMatchObject({ sinal: "confuso", taxa: 0.2 });
    expect(ordenados[2]).toMatchObject({ sinal: "facil" });
    expect(ordenados[4].sinal).toBeNull();
  });
});
