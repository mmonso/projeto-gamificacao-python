import { describe, expect, it } from "vitest";
import { arquivoIcs, linkGoogleAgenda, proximoDia } from "./lembrete";

describe("lembrete na agenda", () => {
  it("marca para hoje se a hora ainda não passou, senão para amanhã", () => {
    expect(proximoDia(new Date(2026, 10, 24, 9, 30), 20)).toBe("20261124");
    expect(proximoDia(new Date(2026, 10, 24, 20, 0), 20)).toBe("20261125");
    expect(proximoDia(new Date(2026, 11, 31, 22, 0), 20)).toBe("20270101");
  });

  it("monta o link do Google Agenda com repetição diária e sem dado pessoal", () => {
    const link = new URL(linkGoogleAgenda(new Date(2026, 10, 24, 6, 0), 7, "America/Sao_Paulo", "https://sibi.exemplo"));
    expect(link.hostname).toBe("calendar.google.com");
    expect(link.searchParams.get("recur")).toBe("RRULE:FREQ=DAILY");
    expect(link.searchParams.get("dates")).toBe("20261124T070000/20261124T071000");
    expect(link.searchParams.get("ctz")).toBe("America/Sao_Paulo");
    expect(link.searchParams.get("details")).toContain("https://sibi.exemplo/aprender");
  });

  it("gera um .ics válido, diário, com aviso", () => {
    const ics = arquivoIcs(new Date(2026, 10, 24, 21, 0), 20, "https://sibi.exemplo");
    expect(ics.startsWith("BEGIN:VCALENDAR\r\n")).toBe(true);
    expect(ics).toContain("DTSTART:20261125T200000");
    expect(ics).toContain("RRULE:FREQ=DAILY");
    expect(ics).toContain("BEGIN:VALARM");
    expect(ics.trimEnd().endsWith("END:VCALENDAR")).toBe(true);
  });
});
