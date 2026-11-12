import { describe, expect, it } from "vitest";
import { acertos, diaDoDesafio, tempoAteOProximo, diaDoNumero, fraseDoPlacar, itensDoDesafio, numeroDoDia, quadradinhos, textoParaCompartilhar } from "./desafio";

const candidatos = Array.from({ length: 23 }, (_, i) => ({ id: `u1-l1-e${String(i).padStart(2, "0")}`, dificuldade: (i % 3) + 1 }));

describe("desafio do dia", () => {
  it("numera os dias a partir do primeiro desafio, virando à meia-noite de Brasília", () => {
    expect(numeroDoDia("2026-11-12")).toBe(1);
    expect(numeroDoDia("2026-12-01")).toBe(20);
    expect(diaDoNumero(20)).toBe("2026-12-01");
    expect(diaDoDesafio(new Date("2026-11-13T02:59:00Z"))).toBe("2026-11-12"); // 23h59 em Brasília
    expect(diaDoDesafio(new Date("2026-11-13T03:00:00Z"))).toBe("2026-11-13");
  });

  it("escolhe 5 itens diferentes, iguais para todos no mesmo dia, do mais fácil ao mais difícil", () => {
    const hoje = itensDoDesafio(candidatos, 7);
    expect(hoje).toHaveLength(5);
    expect(new Set(hoje.map((c) => c.id)).size).toBe(5);
    expect(itensDoDesafio([...candidatos].reverse(), 7)).toEqual(hoje);
    const dificuldades = hoje.map((c) => c.dificuldade);
    expect(dificuldades).toEqual([...dificuldades].sort());
  });

  it("não repete item até a lista inteira passar", () => {
    const vistos = [1, 2, 3, 4].flatMap((n) => itensDoDesafio(candidatos, n).map((c) => c.id));
    expect(new Set(vistos).size).toBe(20);
  });

  it("funciona com menos candidatos que o tamanho do desafio", () => {
    expect(itensDoDesafio(candidatos.slice(0, 3), 1)).toHaveLength(3);
    expect(itensDoDesafio([], 1)).toEqual([]);
  });

  it("conta o tempo até o próximo desafio, à meia-noite de Brasília", () => {
    expect(tempoAteOProximo(new Date("2026-11-13T01:48:00Z"))).toBe("1 h 12 min"); // 22h48 em Brasília
    expect(tempoAteOProximo(new Date("2026-11-13T02:59:30Z"))).toBe("1 min");
    expect(tempoAteOProximo(new Date("2026-11-13T03:00:00Z"))).toBe("24 h 0 min");
  });

  it("monta o placar e o texto para compartilhar sem as respostas", () => {
    const marcas = ["certa", "certa", "dica", "errada", "certa"] as const;
    expect(quadradinhos(marcas)).toBe("🟩🟩🟨🟥🟩");
    expect(acertos(marcas)).toBe(4);
    expect(textoParaCompartilhar(3, marcas, "https://sibi.app/desafio")).toBe(
      "Sibi #3 🐍 4/5\n🟩🟩🟨🟥🟩\nQual é a saída? Tente o desafio de hoje:\nhttps://sibi.app/desafio",
    );
    expect(fraseDoPlacar(5, 5)).toBe("Placar perfeito!");
    expect(fraseDoPlacar(1, 5)).not.toMatch(/ruim|errou/i);
  });
});
