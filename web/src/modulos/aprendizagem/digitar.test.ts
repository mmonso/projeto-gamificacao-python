import { describe, expect, it } from "vitest";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { corrigir } from "./corretor";
import { comentarioDeQuase, gabaritoParaDigitar, normalizarSaida, paraDigitar, podeDigitar, usaDigitacao } from "./digitar";

const escolha = (textos: (string | null)[], extra: Partial<{ opcoesSao: "saida" | "codigo" }> = {}) =>
  ({
    id: "u1-l1-r01",
    versao: 1,
    enunciado: "O que este programa exibe?",
    codigo: 'print("Oi")',
    totalDicas: 2,
    tipo: "escolher_resultado",
    opcoesSao: extra.opcoesSao ?? "saida",
    opcoes: textos.map((texto, i) => (texto === null ? { id: "abcd"[i], erro: true } : { id: "abcd"[i], texto })),
  }) as ExercicioPublico;

describe("digitar a saída", () => {
  it("normaliza quebras de linha, espaços no fim e aspas e travessões trocados pelo celular", () => {
    expect(normalizarSaida("Oi  \r\nTchau \n\n")).toBe("Oi\nTchau");
    expect(normalizarSaida("<class ‘int’>")).toBe("<class 'int'>");
    expect(normalizarSaida("——-")).toBe("-----");
    expect(normalizarSaida("a  b")).toBe("a  b");
  });

  it("só transforma saídas curtas, sem opção de erro e de saída (não de código)", () => {
    expect(podeDigitar(escolha(["Oi", "oi", "Oi!"]))).toBe(true);
    expect(podeDigitar(escolha(["Oi", "oi", null]))).toBe(false);
    expect(podeDigitar(escolha(["Oi", "oi", "x"], { opcoesSao: "codigo" }))).toBe(false);
    expect(podeDigitar(escolha(["1\n2\n3\n4\n5", "1", "2"]))).toBe(false);
    expect(podeDigitar(escolha(["x".repeat(41), "1", "2"]))).toBe(false);
    // Opções que só diferem por espaço no fim seriam a mesma resposta digitada.
    expect(podeDigitar(escolha(["Oi", "Oi ", "Tchau"]))).toBe(false);
  });

  it("usa na revisão sempre, na prática em parte dos itens e nunca na lição principal nem na recuperação", () => {
    const ex = escolha(["Oi", "oi", "Oi!"]);
    expect(usaDigitacao("revisao", "s1", ex)).toBe(true);
    expect(usaDigitacao("principal", "s1", ex)).toBe(false);
    expect(usaDigitacao("recuperacao", "s1", ex)).toBe(false);
    const sessoes = Array.from({ length: 40 }, (_, i) => `sessao-${i}`);
    const naPratica = sessoes.filter((s) => usaDigitacao("pratica", s, ex)).length;
    expect(naPratica).toBeGreaterThan(5);
    expect(naPratica).toBeLessThan(35);
    expect(usaDigitacao("pratica", "sessao-3", ex)).toBe(usaDigitacao("pratica", "sessao-3", ex));
  });

  it("esconde as opções e corrige pelo texto da opção certa", () => {
    const ex = escolha(["Primeiro\nSegundo", "Primeiro Segundo", "Segundo\nPrimeiro"]);
    if (!podeDigitar(ex)) throw new Error();
    const publico = paraDigitar(ex);
    expect(publico).toMatchObject({ tipo: "digitar_saida", linhas: 2, codigo: 'print("Oi")' });
    expect(publico).not.toHaveProperty("opcoes");
    const g = gabaritoParaDigitar({ tipo: "escolher_resultado", opcao: "a", feedbackOpcoes: {} }, ex);
    expect(g).toEqual({ tipo: "digitar_saida", saida: "Primeiro\nSegundo" });
    expect(corrigir(g, { tipo: "digitar_saida", texto: "Primeiro \nSegundo\n" })).toBe(true);
    expect(corrigir(g, { tipo: "digitar_saida", texto: "Primeiro Segundo" })).toBe(false);
    expect(corrigir(g, { tipo: "escolher_resultado", opcao: "a" })).toBe(false);
  });

  it("explica o que faltou numa resposta quase certa", () => {
    expect(comentarioDeQuase("true", "True")).toMatch(/maiúsculas/);
    expect(comentarioDeQuase('"Olá"', "Olá")).toMatch(/sem as aspas/);
    expect(comentarioDeQuase("Idade:30", "Idade: 30")).toBeUndefined();
    expect(comentarioDeQuase("Idade:  30", "Idade: 30")).toMatch(/espaços/);
    expect(comentarioDeQuase("Primeiro Segundo", "Primeiro\nSegundo")).toMatch(/linha/);
    expect(comentarioDeQuase("42", "15")).toBeUndefined();
    expect(comentarioDeQuase("True", "True")).toBeUndefined();
  });
});
