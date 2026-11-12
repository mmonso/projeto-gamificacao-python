import { describe, expect, it } from "vitest";
import { textoDoResultadoDaLicao } from "./compartilhar";

const endereco = "https://sibi-three.vercel.app";

describe("textoDoResultadoDaLicao", () => {
  it("leva título, placar de primeira, sequência e o endereço", () => {
    expect(textoDoResultadoDaLicao({ titulo: "Listas e repetição", acertosPrimeira: 9, total: 10, sequencia: 4 }, endereco)).toBe(
      "Terminei a lição “Listas e repetição” no Sibi, um curso de Python em português.\n9 de 10 certas de primeira.\nSequência de 4 dias.\nAprenda também: https://sibi-three.vercel.app",
    );
  });

  it("usa o singular quando a sequência é de um dia", () => {
    const texto = textoDoResultadoDaLicao({ titulo: "Textos", acertosPrimeira: 5, total: 5, sequencia: 1 }, endereco);
    expect(texto).toContain("Sequência de 1 dia.");
  });

  it("omite a linha de sequência quando ela é zero", () => {
    const texto = textoDoResultadoDaLicao({ titulo: "Textos", acertosPrimeira: 3, total: 5, sequencia: 0 }, endereco);
    expect(texto).not.toContain("Sequência");
    expect(texto.split("\n")).toHaveLength(3);
  });

  it("não traz nome nem respostas: só os campos recebidos", () => {
    const texto = textoDoResultadoDaLicao({ titulo: "Textos", acertosPrimeira: 1, total: 2, sequencia: 2 }, endereco);
    expect(texto).not.toMatch(/Ana|Rui|print\(/);
  });
});
