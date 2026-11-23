import { describe, expect, it } from "vitest";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { dadosIniciaisDoPerfil, primeiroNomeDoProvedor } from "./conta";
import { lerPedidoGoogle } from "./entrada-google";

describe("pedido do botão do Google", () => {
  const base = { credencial: "x".repeat(40), nonce: "n".repeat(32) };

  it("lê token, nonce, meta e fuso", () => {
    expect(lerPedidoGoogle({ ...base, metaDiaria: "2", fuso: "America/Manaus" })).toEqual({ ...base, metaDiaria: 2, fuso: "America/Manaus" });
  });

  it("meta e fuso inválidos voltam ao padrão", () => {
    expect(lerPedidoGoogle({ ...base, metaDiaria: "9", fuso: "Lugar/Nenhum" })).toEqual({ ...base, metaDiaria: PARAMETROS.metaPadrao, fuso: PARAMETROS.fusoPadrao });
  });

  it("sem token ou sem nonce: recusado", () => {
    expect(lerPedidoGoogle({ nonce: base.nonce })).toBeNull();
    expect(lerPedidoGoogle({ credencial: base.credencial })).toBeNull();
    expect(lerPedidoGoogle({ ...base, nonce: "curto" })).toBeNull();
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
