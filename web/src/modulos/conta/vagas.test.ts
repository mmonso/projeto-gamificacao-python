import { describe, expect, it } from "vitest";
import { cadastroAberto, LIMITE_DE_CONTAS, vagasRestantes } from "./vagas";

describe("vagas do teste", () => {
  it("aceita cadastro enquanto houver vaga e fecha ao chegar no teto", () => {
    expect(cadastroAberto(LIMITE_DE_CONTAS - 1)).toBe(true);
    expect(cadastroAberto(LIMITE_DE_CONTAS)).toBe(false);
    expect(cadastroAberto(LIMITE_DE_CONTAS + 3)).toBe(false);
  });

  it("teto zero fecha o cadastro para todos", () => {
    expect(cadastroAberto(0, 0)).toBe(false);
  });

  it("conta as vagas sem ficar negativo", () => {
    expect(vagasRestantes(10, 50)).toBe(40);
    expect(vagasRestantes(60, 50)).toBe(0);
  });
});
