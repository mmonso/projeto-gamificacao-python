import { describe, expect, it } from "vitest";
import { textoSeguidas, tituloDoFeedback } from "./frases";
import { notasDe } from "./som";

describe("feedback da lição", () => {
  it("alterna as frases de acerto e de erro sem repetir em seguida", () => {
    const acertos = [0, 1, 2, 3].map((v) => tituloDoFeedback(true, v));
    expect(new Set(acertos).size).toBe(4);
    expect(tituloDoFeedback(false, 0)).toBe("Ainda não.");
    expect(tituloDoFeedback(false, 1)).not.toBe(tituloDoFeedback(false, 0));
    expect(tituloDoFeedback(true, -1)).toBeTruthy();
  });

  it("mostra a contagem a partir de três respostas certas seguidas", () => {
    expect(textoSeguidas(2)).toBeNull();
    expect(textoSeguidas(3)).toBe("3 seguidas!");
    expect(textoSeguidas(12)).toBe("12 seguidas! Imparável!");
  });

  it("o som de acerto sobe de tom com as respostas seguidas, até um limite", () => {
    const primeira = notasDe("acerto", 1)[0].freq;
    const terceira = notasDe("acerto", 3)[0].freq;
    expect(terceira).toBeGreaterThan(primeira);
    expect(notasDe("acerto", 20)[0].freq).toBe(notasDe("acerto", 6)[0].freq);
  });
});
