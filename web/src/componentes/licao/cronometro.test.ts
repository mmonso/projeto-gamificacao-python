import { describe, expect, it } from "vitest";
import { atualizarCronometro, CRONOMETRO_VAZIO, tempoDoCronometro } from "./cronometro";

describe("cronômetro da resposta", () => {
  it("sem cartão, conta desde que o exercício aparece", () => {
    const c = atualizarCronometro(CRONOMETRO_VAZIO, "e1", false, 1000);
    expect(tempoDoCronometro(c, 5000)).toBe(4000);
  });

  it("com o cartão aberto no começo, só começa quando ele fecha", () => {
    let c = atualizarCronometro(CRONOMETRO_VAZIO, "e1", true, 1000);
    expect(tempoDoCronometro(c, 9000)).toBe(0);
    c = atualizarCronometro(c, "e1", false, 9000);
    expect(tempoDoCronometro(c, 12000)).toBe(3000);
  });

  it("reabrir o cartão no meio pausa e depois continua, sem zerar", () => {
    let c = atualizarCronometro(CRONOMETRO_VAZIO, "e1", false, 0);
    c = atualizarCronometro(c, "e1", true, 4000); // 4 s respondendo, abre o cartão
    c = atualizarCronometro(c, "e1", false, 30000); // 26 s lendo o cartão: não contam
    expect(tempoDoCronometro(c, 32000)).toBe(6000);
  });

  it("um exercício novo recomeça do zero", () => {
    let c = atualizarCronometro(CRONOMETRO_VAZIO, "e1", false, 0);
    c = atualizarCronometro(c, "e2", false, 10000);
    expect(tempoDoCronometro(c, 11500)).toBe(1500);
  });

  it("repetir o mesmo estado não mexe no tempo", () => {
    const c = atualizarCronometro(CRONOMETRO_VAZIO, "e1", false, 0);
    expect(atualizarCronometro(c, "e1", false, 7000)).toBe(c);
  });
});
