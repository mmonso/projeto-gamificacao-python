import { describe, expect, it } from "vitest";
import { diasEntre, ganhaDiaLivre, sequenciaComDiasLivres, sequenciaViva } from "./diaslivres";

const estado = (atual: number, ultimoDia: string | null, maior = atual) => ({ atual, maior, ultimoDia });

describe("Dia livre", () => {
  it("diasEntre conta dias de calendário, inclusive na virada do mês e do ano", () => {
    expect(diasEntre("2026-03-01", "2026-03-04")).toBe(3);
    expect(diasEntre("2026-12-30", "2027-01-02")).toBe(3);
  });

  it("o primeiro dia livre vem aos 3 dias; depois, um a cada 7", () => {
    expect([1, 2, 3, 4, 9, 10, 11, 17, 24].filter(ganhaDiaLivre)).toEqual([3, 10, 17, 24]);
  });

  it("estudar em dias seguidos ganha o dia livre aos 3 dias e não usa nenhum", () => {
    const r = sequenciaComDiasLivres(estado(2, "2026-03-02"), "2026-03-03", false, 0);
    expect(r).toMatchObject({ estado: { atual: 3, ultimoDia: "2026-03-03" }, diasLivres: 1, usados: [], ganhou: true });
  });

  it("não passa de dois dias livres guardados", () => {
    const r = sequenciaComDiasLivres(estado(9, "2026-03-09"), "2026-03-10", false, 2);
    expect(r).toMatchObject({ estado: { atual: 10 }, diasLivres: 2, ganhou: false });
  });

  it("um dia perdido é coberto por um dia livre, e a sequência continua", () => {
    const r = sequenciaComDiasLivres(estado(5, "2026-03-05"), "2026-03-07", false, 1);
    expect(r).toMatchObject({ estado: { atual: 6, maior: 6, ultimoDia: "2026-03-07" }, diasLivres: 0, usados: ["2026-03-06"], ganhou: false });
  });

  it("dois dias perdidos usam dois dias livres", () => {
    const r = sequenciaComDiasLivres(estado(5, "2026-03-05"), "2026-03-08", false, 2);
    expect(r).toMatchObject({ estado: { atual: 6 }, diasLivres: 0, usados: ["2026-03-06", "2026-03-07"] });
  });

  it("sem dias livres suficientes, a sequência recomeça e nada é gasto", () => {
    expect(sequenciaComDiasLivres(estado(5, "2026-03-05", 5), "2026-03-08", false, 1)).toMatchObject({ estado: { atual: 1, maior: 5 }, diasLivres: 1, usados: [] });
    expect(sequenciaComDiasLivres(estado(5, "2026-03-05", 5), "2026-03-07", false, 0)).toMatchObject({ estado: { atual: 1 }, diasLivres: 0, usados: [] });
  });

  it("a tolerância de fuso continua valendo sem gastar dia livre", () => {
    const r = sequenciaComDiasLivres(estado(5, "2026-03-05"), "2026-03-07", true, 1);
    expect(r).toMatchObject({ estado: { atual: 6 }, diasLivres: 1, usados: [] });
  });

  it("a segunda sessão do mesmo dia não muda nada", () => {
    const r = sequenciaComDiasLivres(estado(3, "2026-03-05"), "2026-03-05", false, 1);
    expect(r).toMatchObject({ estado: { atual: 3 }, diasLivres: 1, usados: [], ganhou: false });
  });

  it("usar e ganhar no mesmo dia: cobre o dia perdido e ainda ganha ao chegar no marco", () => {
    const r = sequenciaComDiasLivres(estado(9, "2026-03-09"), "2026-03-11", false, 1);
    expect(r).toMatchObject({ estado: { atual: 10 }, usados: ["2026-03-10"], ganhou: true, diasLivres: 1 });
  });

  it("a sequência mostrada segue viva enquanto os dias sem estudo couberem nos dias livres", () => {
    const e = estado(4, "2026-03-05");
    expect(sequenciaViva(e, "2026-03-06", 0)).toBe(4);
    expect(sequenciaViva(e, "2026-03-07", 0)).toBe(0);
    expect(sequenciaViva(e, "2026-03-07", 1)).toBe(4);
    expect(sequenciaViva(e, "2026-03-08", 1)).toBe(0);
    expect(sequenciaViva(e, "2026-03-08", 2)).toBe(4);
    expect(sequenciaViva(estado(0, null), "2026-03-08", 2)).toBe(0);
  });
});
