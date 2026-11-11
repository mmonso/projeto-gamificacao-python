import { describe, expect, it } from "vitest";
import { degrauDoConceito } from "./dominio";

describe("Mapa de domínio", () => {
  it("sobe de visto a consolidando conforme o intervalo da agenda", () => {
    expect(degrauDoConceito("iniciado", 1)).toBe(1);
    expect(degrauDoConceito("praticando", 1)).toBe(2);
    expect(degrauDoConceito("praticando", 3)).toBe(3);
    expect(degrauDoConceito("praticando", 7)).toBe(3);
    expect(degrauDoConceito("consolidando", 7)).toBe(4);
  });
});
