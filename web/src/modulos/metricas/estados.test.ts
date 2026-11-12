import { describe, expect, it } from "vitest";
import { diasEntre, estadoDoAluno, painelDoDia, retencaoDeCorrentes } from "./estados";

const HOJE = "2026-11-12";

describe("estadoDoAluno", () => {
  it("conta criada nos últimos 7 dias é novo, mesmo sem estudo", () => {
    expect(estadoDoAluno({ dia0: "2026-11-08", diasAtivos: [] }, HOJE)).toBe("novo");
    expect(estadoDoAluno({ dia0: HOJE, diasAtivos: [] }, HOJE)).toBe("novo");
  });

  it("estudou hoje ou ontem e não teve pausa longa: corrente", () => {
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-08", "2026-11-11", HOJE] }, HOJE)).toBe("corrente");
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-11"] }, HOJE)).toBe("corrente");
  });

  it("uma folga de um dia dentro da sequência não quebra o ciclo", () => {
    // Estudou dia 8, pulou o 9 e voltou no 10 e no 12: a sequência inteira é um só ciclo.
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-08", "2026-11-10", HOJE] }, HOJE)).toBe("corrente");
  });

  it("parou há 2 a 6 dias: em risco", () => {
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-10"] }, HOJE)).toBe("em_risco");
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-06"] }, HOJE)).toBe("em_risco");
  });

  it("parou há 7 dias ou mais: inativo", () => {
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-05"] }, HOJE)).toBe("inativo");
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: [] }, HOJE)).toBe("inativo");
  });

  it("voltou depois de uma pausa de 7 dias ou mais: reativado", () => {
    // Estudou em outubro, ficou fora até o começo de novembro e estudou de novo ontem e hoje.
    expect(estadoDoAluno({ dia0: "2026-09-01", diasAtivos: ["2026-10-02", "2026-11-10", "2026-11-11", HOJE] }, HOJE)).toBe("reativado");
  });

  it("dias depois da referência são ignorados", () => {
    expect(estadoDoAluno({ dia0: "2026-10-01", diasAtivos: ["2026-11-12", "2026-11-20"] }, "2026-11-11")).toBe("inativo");
  });
});

describe("painelDoDia", () => {
  it("conta cada aluno em um só estado", () => {
    const painel = painelDoDia(
      [
        { dia0: HOJE, diasAtivos: [] },
        { dia0: "2026-10-01", diasAtivos: [HOJE] },
        { dia0: "2026-10-01", diasAtivos: ["2026-11-10"] },
        { dia0: "2026-10-01", diasAtivos: [] },
      ],
      HOJE,
    );
    expect(painel).toEqual({ novo: 1, corrente: 1, reativado: 0, em_risco: 1, inativo: 1, total: 4 });
  });
});

describe("retencaoDeCorrentes", () => {
  it("compara quem estava ativo ontem com quem estudou hoje", () => {
    const alunos = [
      { dia0: "2026-10-01", diasAtivos: ["2026-11-10", "2026-11-11", HOJE] }, // corrente ontem, estudou hoje
      { dia0: "2026-10-01", diasAtivos: ["2026-11-10", "2026-11-11"] }, // corrente ontem, não estudou hoje
      { dia0: "2026-10-01", diasAtivos: ["2026-11-05"] }, // inativo ontem
    ];
    expect(retencaoDeCorrentes(alunos, HOJE)).toEqual({ base: 2, mantidos: 1, taxa: 0.5 });
  });

  it("sem ninguém ativo ontem, a taxa fica vazia", () => {
    expect(retencaoDeCorrentes([{ dia0: "2026-10-01", diasAtivos: [] }], HOJE)).toEqual({ base: 0, mantidos: 0, taxa: null });
  });
});

describe("diasEntre", () => {
  it("conta dias corridos, atravessando meses", () => {
    expect(diasEntre("2026-10-31", "2026-11-02")).toBe(2);
    expect(diasEntre(HOJE, HOJE)).toBe(0);
  });
});
