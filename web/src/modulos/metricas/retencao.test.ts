import { describe, expect, it } from "vitest";
import { formatarTaxa, inicioDaSemana, retencao, retencaoPorSemana, somarDias } from "./retencao";

describe("retenção D1, D7 e D30", () => {
  it("soma dias atravessando meses e anos", () => {
    expect(somarDias("2026-11-30", 1)).toBe("2026-12-01");
    expect(somarDias("2026-12-25", 7)).toBe("2027-01-01");
    expect(somarDias("2026-03-01", -1)).toBe("2026-02-28");
  });

  it("acha a segunda-feira da semana", () => {
    expect(inicioDaSemana("2026-11-12")).toBe("2026-11-09"); // quinta
    expect(inicioDaSemana("2026-11-09")).toBe("2026-11-09"); // segunda
    expect(inicioDaSemana("2026-11-15")).toBe("2026-11-09"); // domingo
  });

  it("conta só quem estudou exatamente no dia N", () => {
    const alunos = [
      { dia0: "2026-11-01", diasAtivos: ["2026-11-01", "2026-11-02", "2026-11-08"] },
      { dia0: "2026-11-01", diasAtivos: ["2026-11-01", "2026-11-03", "2026-11-09"] },
    ];
    const [d1, d7] = retencao(alunos, "2026-11-20");
    expect(d1).toMatchObject({ elegiveis: 2, retidos: 1, taxa: 0.5 });
    expect(d7).toMatchObject({ elegiveis: 2, retidos: 1, taxa: 0.5 });
  });

  it("deixa de fora quem ainda não chegou ao dia N", () => {
    const alunos = [
      { dia0: "2026-11-10", diasAtivos: ["2026-11-10", "2026-11-11"] },
      { dia0: "2026-11-11", diasAtivos: ["2026-11-11"] },
    ];
    const [d1, d7, d30] = retencao(alunos, "2026-11-12");
    expect(d1).toMatchObject({ elegiveis: 1, retidos: 1 }); // o dia 1 do segundo é hoje, ainda em andamento
    expect(d7).toMatchObject({ elegiveis: 0, retidos: 0, taxa: null });
    expect(d30.taxa).toBeNull();
    expect(formatarTaxa(d7)).toBe("—");
    expect(formatarTaxa(d1)).toBe("100% (1/1)");
  });

  it("separa as coortes pela semana de entrada", () => {
    const coortes = retencaoPorSemana(
      [
        { dia0: "2026-11-10", diasAtivos: [] },
        { dia0: "2026-11-02", diasAtivos: ["2026-11-03"] },
        { dia0: "2026-11-12", diasAtivos: [] },
      ],
      "2026-12-31",
    );
    expect(coortes.map((c) => [c.semana, c.alunos])).toEqual([
      ["2026-11-02", 1],
      ["2026-11-09", 2],
    ]);
    expect(coortes[0].linhas[0]).toMatchObject({ retidos: 1, elegiveis: 1 });
  });
});
