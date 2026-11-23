import { describe, expect, it } from "vitest";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { dadosIniciaisDoPerfil, primeiroNomeDoProvedor } from "./conta";
import { lerEntradaGoogle } from "./entrada-google";

describe("cookie da entrada com Google", () => {
  const aceite = "2026-11-23T18:00:00.000Z";

  it("lê meta, fuso e a data do aceite", () => {
    const valor = JSON.stringify({ meta_diaria: 2, fuso: "America/Sao_Paulo", termos_aceitos_em: aceite });
    expect(lerEntradaGoogle(valor)).toEqual({ meta_diaria: 2, fuso: "America/Sao_Paulo", termos_aceitos_em: aceite });
  });

  it("meta e fuso inválidos voltam ao padrão, sem perder o aceite", () => {
    const valor = JSON.stringify({ meta_diaria: 9, fuso: "Lugar/Nenhum", termos_aceitos_em: aceite });
    expect(lerEntradaGoogle(valor)).toEqual({ meta_diaria: PARAMETROS.metaPadrao, fuso: PARAMETROS.fusoPadrao, termos_aceitos_em: aceite });
  });

  it("sem cookie, corrompido ou sem aceite: null", () => {
    expect(lerEntradaGoogle(undefined)).toBeNull();
    expect(lerEntradaGoogle("{não é json")).toBeNull();
    expect(lerEntradaGoogle(JSON.stringify({ meta_diaria: 1, fuso: "America/Sao_Paulo" }))).toBeNull();
  });
});

describe("nome vindo do Google", () => {
  it("usa só o primeiro nome", () => {
    expect(primeiroNomeDoProvedor({ full_name: "  Ana Maria Souza " })).toBe("Ana");
    expect(primeiroNomeDoProvedor({ name: "Bia Lima" })).toBe("Bia");
  });

  it("sem nome do provedor: vazio", () => {
    expect(primeiroNomeDoProvedor({})).toBe("");
    expect(primeiroNomeDoProvedor({ full_name: "   " })).toBe("");
  });

  it("o nome digitado no cadastro tem prioridade", () => {
    expect(dadosIniciaisDoPerfil({ nome: "Caio", full_name: "Carlos Silva" }).nome).toBe("Caio");
    expect(dadosIniciaisDoPerfil({ full_name: "Carlos Silva" }).nome).toBe("Carlos");
  });
});
