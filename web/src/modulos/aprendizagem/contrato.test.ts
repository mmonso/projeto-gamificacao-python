import { describe, expect, it } from "vitest";
import { pedidoSubmissao, TEMPO_MAXIMO_MS } from "./contrato";

const base = { id: "3f1c1e0a-6a51-4c8e-9f0e-2b7d1c9a5e11", exercicioId: "u1-l1-e01", resposta: { tipo: "escolher_resultado", opcao: "a" } };

describe("tempo da resposta no pedido", () => {
  it("guarda o tempo arredondado", () => {
    expect(pedidoSubmissao.parse({ ...base, tempoMs: 4200.6 }).tempoMs).toBe(4201);
  });

  it("aba esquecida aberta: limita a 1 hora em vez de recusar a resposta", () => {
    const r = pedidoSubmissao.safeParse({ ...base, tempoMs: 5 * 60 * 60 * 1000 });
    expect(r.success).toBe(true);
    expect(r.data?.tempoMs).toBe(TEMPO_MAXIMO_MS);
  });

  it("valor inválido vira sem tempo, e a resposta continua valendo", () => {
    for (const tempoMs of [-5, "rápido", Number.NaN, null]) {
      const r = pedidoSubmissao.safeParse({ ...base, tempoMs });
      expect(r.success).toBe(true);
      expect(r.data?.tempoMs).toBeUndefined();
    }
  });

  it("sem tempo também vale (aparelhos com a versão anterior)", () => {
    expect(pedidoSubmissao.safeParse(base).success).toBe(true);
  });
});
