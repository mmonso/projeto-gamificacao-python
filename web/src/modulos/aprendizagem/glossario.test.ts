import { describe, expect, it } from "vitest";
import { marcarTermos, TERMOS } from "./glossario";

const marcados = (texto: string, limite?: number) =>
  marcarTermos(texto, limite)
    .filter((p) => typeof p !== "string")
    .map((p) => (p as { texto: string }).texto);

describe("glossário", () => {
  it("marca a primeira ocorrência de cada termo, respeitando acentos e maiúsculas", () => {
    expect(marcados("A variável guarda um valor. Outra variável também.")).toEqual(["variável", "valor"]);
    expect(marcados("Programa e Saída")).toEqual(["Programa", "Saída"]);
  });

  it("não marca pedaço de outra palavra", () => {
    expect(marcados("listagem e programação")).toEqual([]);
    expect(marcados("O índice começa do 0")).toEqual(["índice"]);
  });

  it("limita a quantidade de termos por texto e não perde texto", () => {
    const texto = "O programa mostra a saída do comando com a variável.";
    expect(marcados(texto, 2)).toEqual(["programa", "saída"]);
    const juntado = marcarTermos(texto, 2)
      .map((p) => (typeof p === "string" ? p : p.texto))
      .join("");
    expect(juntado).toBe(texto);
  });

  it("explica os erros do Python em português", () => {
    expect(marcados("Dá NameError")).toEqual(["NameError"]);
    expect(TERMOS.find((t) => t.id === "nameerror")?.definicao).toContain("nome que o Python não conhece");
  });
});
