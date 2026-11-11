import { describe, expect, it } from "vitest";
import { diaDeEstudo, dataLocal, fusoVigente, pedirMudancaDeFuso } from "./dias";
import {
  coracoesAposRecuperacao,
  coracoesAposResposta,
  estadoAposRevisao,
  metaCompletadaAgora,
  podeRecuperar,
  proximoIntervalo,
  sequenciaAposSessao,
  sequenciaExibida,
  xpDaConclusao,
} from "./regras";

describe("XP (4.2)", () => {
  it("concede 20 XP só na primeira conclusão (CA-41)", () => {
    expect(xpDaConclusao("principal", false, 0)).toEqual({ xp: 20, causa: "primeira_conclusao" });
    expect(xpDaConclusao("principal", true, 0)).toEqual({ xp: 10, causa: "pratica" });
  });
  it("limita a três práticas recompensadas por dia (CA-72)", () => {
    expect(xpDaConclusao("pratica", true, 2).xp).toBe(10);
    expect(xpDaConclusao("revisao", true, 3)).toEqual({ xp: 0, causa: "pratica_sem_xp" });
    expect(xpDaConclusao("recuperacao", true, 3).xp).toBe(0);
  });
});

describe("Corações (4.3)", () => {
  it("perde um coração só no primeiro erro do item na sessão principal (CA-32)", () => {
    expect(coracoesAposResposta(5, "principal", false, true)).toBe(4);
    expect(coracoesAposResposta(4, "principal", false, false)).toBe(4);
    expect(coracoesAposResposta(5, "principal", true, true)).toBe(5);
  });
  it("não desconta em prática, revisão ou recuperação (CA-71)", () => {
    for (const tipo of ["pratica", "revisao", "recuperacao"] as const) expect(coracoesAposResposta(3, tipo, false, true)).toBe(3);
  });
  it("nunca fica negativo nem passa de cinco (CA-101, CA-81)", () => {
    expect(coracoesAposResposta(0, "principal", false, true)).toBe(0);
    expect(coracoesAposRecuperacao(0)).toBe(2);
    expect(coracoesAposRecuperacao(4)).toBe(5);
    expect(podeRecuperar(5)).toBe(false);
  });
});

describe("Meta (4.4)", () => {
  it("celebra a meta uma única vez, na sessão que a completa (CA-94, CA-95)", () => {
    expect(metaCompletadaAgora(0, 2)).toBe(false);
    expect(metaCompletadaAgora(1, 2)).toBe(true);
    expect(metaCompletadaAgora(2, 2)).toBe(false);
  });
});

describe("Sequência (4.5)", () => {
  const inicio = { atual: 0, maior: 0, ultimoDia: null };
  it("começa em um e cresce em dias seguidos (CA-91)", () => {
    const d1 = sequenciaAposSessao(inicio, "2026-10-01");
    const d2 = sequenciaAposSessao(d1, "2026-10-02");
    expect(d2).toEqual({ atual: 2, maior: 2, ultimoDia: "2026-10-02" });
  });
  it("não muda com a segunda sessão do dia (CA-93)", () => {
    const d1 = sequenciaAposSessao(inicio, "2026-10-01");
    expect(sequenciaAposSessao(d1, "2026-10-01")).toBe(d1);
  });
  it("zera depois de um dia inteiro sem estudo e recomeça em um (CA-92)", () => {
    const d2 = sequenciaAposSessao(sequenciaAposSessao(inicio, "2026-10-01"), "2026-10-02");
    expect(sequenciaExibida(d2, "2026-10-03")).toBe(2);
    expect(sequenciaExibida(d2, "2026-10-04")).toBe(0);
    expect(sequenciaAposSessao(d2, "2026-10-04")).toEqual({ atual: 1, maior: 2, ultimoDia: "2026-10-04" });
  });
  it("tolera um dia pulado por mudança de fuso (CA-98)", () => {
    const d1 = sequenciaAposSessao(inicio, "2026-10-01");
    expect(sequenciaAposSessao(d1, "2026-10-03", true).atual).toBe(2);
    expect(sequenciaAposSessao(d1, "2026-10-03", false).atual).toBe(1);
  });
});

describe("Fuso e dia de estudo (4.6)", () => {
  it("conta a sessão no dia local da conclusão (CA-90)", () => {
    // 23h55 em São Paulo (UTC-3) do dia 7 = 02h55 UTC do dia 8; conclusão 00h05 do dia 8.
    expect(dataLocal(new Date("2026-10-08T02:55:00Z"), "America/Sao_Paulo")).toBe("2026-10-07");
    expect(dataLocal(new Date("2026-10-08T03:05:00Z"), "America/Sao_Paulo")).toBe("2026-10-08");
  });
  it("aplica a mudança de fuso só no próximo dia de estudo (CA-96)", () => {
    const agora = new Date("2026-10-08T15:00:00Z");
    const config = pedirMudancaDeFuso({ fuso: "America/Sao_Paulo", fusoPendente: null, pendenteAPartirDe: null }, "Asia/Tokyo", agora);
    expect(config.pendenteAPartirDe).toBe("2026-10-09");
    expect(fusoVigente(config, agora).fuso).toBe("America/Sao_Paulo");
    expect(fusoVigente(config, new Date("2026-10-09T03:30:00Z"))).toEqual({ fuso: "Asia/Tokyo", acabouDeMudar: true });
  });
  it("nunca deixa a data de estudo recuar (CA-97)", () => {
    // Em Tóquio já é dia 9; ao mudar para São Paulo, a data local volta para o dia 8.
    expect(diaDeEstudo(new Date("2026-10-09T10:00:00Z"), "America/Sao_Paulo", "2026-10-09")).toBe("2026-10-09");
  });
  it("rejeita fusos inválidos", () => {
    expect(() => pedirMudancaDeFuso({ fuso: "America/Sao_Paulo", fusoPendente: null, pendenteAPartirDe: null }, "Lua/Base", new Date())).toThrow();
  });
});

describe("Agenda de revisão (4.8)", () => {
  it("avança 1 → 3 → 7 com acerto de primeira e sem dica (CA-73)", () => {
    expect(proximoIntervalo(null, true)).toBe(1);
    expect(proximoIntervalo(1, true)).toBe(3);
    expect(proximoIntervalo(3, true)).toBe(7);
    expect(proximoIntervalo(7, true)).toBe(7);
  });
  it("volta para 1 com erro ou dica (CA-74)", () => {
    expect(proximoIntervalo(7, false)).toBe(1);
  });
  it("consolida só depois de sucesso no intervalo de 7 dias", () => {
    expect(estadoAposRevisao(3, true)).toBe("praticando");
    expect(estadoAposRevisao(7, true)).toBe("consolidando");
    expect(estadoAposRevisao(7, false)).toBe("praticando");
  });
});
