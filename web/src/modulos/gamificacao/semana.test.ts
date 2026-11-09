import { describe, expect, it } from "vitest";
import { nomeDoDia, proximoMarco, semanaDe } from "./semana";

describe("calendário da semana", () => {
  it("vai de domingo a sábado e marca hoje, os dias estudados e os futuros", () => {
    // 2026-11-11 é uma quarta-feira.
    const semana = semanaDe("2026-11-11", new Set(["2026-11-09", "2026-11-10", "2026-11-04"]));
    expect(semana.map((d) => d.dia)).toEqual(["2026-11-08", "2026-11-09", "2026-11-10", "2026-11-11", "2026-11-12", "2026-11-13", "2026-11-14"]);
    expect(semana.map((d) => d.letra).join("")).toBe("DSTQQSS");
    expect(semana.filter((d) => d.estudou).map((d) => d.dia)).toEqual(["2026-11-09", "2026-11-10"]);
    expect(semana.find((d) => d.hoje)?.dia).toBe("2026-11-11");
    expect(semana.filter((d) => d.futuro)).toHaveLength(3);
    expect(nomeDoDia("2026-11-11")).toBe("quarta");
  });

  it("no domingo, a semana começa no próprio dia", () => {
    expect(semanaDe("2026-11-08", new Set())[0]).toMatchObject({ dia: "2026-11-08", hoje: true });
  });

  it("o próximo marco é o primeiro acima da sequência", () => {
    expect(proximoMarco(0)).toBe(3);
    expect(proximoMarco(3)).toBe(7);
    expect(proximoMarco(13)).toBe(14);
    expect(proximoMarco(30)).toBeNull();
  });
});
