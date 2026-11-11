import { describe, expect, it } from "vitest";
import { IDS_CONQUISTAS, novasConquistas, progressoDasConquistas, type Metricas } from "./conquistas";

const zero: Metricas = {
  licoesConcluidas: 0,
  totalLicoes: 15,
  unidadeCompleta: false,
  maiorSequencia: 0,
  diasDeMeta: 0,
  sessoesPerfeitas: 0,
  licoesComCoroa: 0,
  acertosEncontreErro: 0,
  acertosMonteOPrograma: 0,
  revisoesConcluidas: 0,
  diasDeRevisao: 0,
  conceitosConsolidando: 0,
  xpTotal: 0,
  recuperacoesConcluidas: 0,
};

describe("Conquistas (4.7)", () => {
  it("são 18, com ids únicos", () => {
    expect(IDS_CONQUISTAS).toHaveLength(18);
    expect(new Set(IDS_CONQUISTAS).size).toBe(18);
  });

  it("ninguém começa com conquista", () => {
    expect(novasConquistas([], zero)).toEqual([]);
  });

  it("concede cada conquista uma vez e não remove (CA-99)", () => {
    const m = { ...zero, licoesConcluidas: 1, xpTotal: 20 };
    expect(novasConquistas([], m)).toEqual(["primeira-licao"]);
    expect(novasConquistas(["primeira-licao"], m)).toEqual([]);
    expect(novasConquistas(["primeira-licao"], { ...m, licoesConcluidas: 5, unidadeCompleta: true, maiorSequencia: 7, xpTotal: 100 })).toEqual(["primeira-unidade", "tres-dias", "sete-dias", "cem-xp"]);
  });

  it("a sequência usa a maior já alcançada, e as faixas são 3, 7, 14 e 30 dias", () => {
    const ids = (maiorSequencia: number) => novasConquistas([], { ...zero, maiorSequencia });
    expect(ids(2)).toEqual([]);
    expect(ids(3)).toEqual(["tres-dias"]);
    expect(ids(14)).toEqual(["tres-dias", "sete-dias", "catorze-dias"]);
    expect(ids(30)).toEqual(["tres-dias", "sete-dias", "catorze-dias", "trinta-dias"]);
  });

  it("as contagens chegam aos limites: 5 dias de meta, 5 coroas, 10 encontre o erro, 8 monte o programa, 5 dias de revisão, 10 conceitos", () => {
    expect(novasConquistas([], { ...zero, diasDeMeta: 5 })).toEqual(["meta-cinco"]);
    expect(novasConquistas([], { ...zero, sessoesPerfeitas: 5, licoesComCoroa: 4 })).toEqual(["primeira-coroa"]);
    expect(novasConquistas([], { ...zero, licoesComCoroa: 5 })).toEqual(["cinco-coroas"]);
    expect(novasConquistas([], { ...zero, acertosEncontreErro: 9 })).toEqual([]);
    expect(novasConquistas([], { ...zero, acertosEncontreErro: 10 })).toEqual(["caca-bugs"]);
    expect(novasConquistas([], { ...zero, acertosMonteOPrograma: 8 })).toEqual(["encaixou"]);
    expect(novasConquistas([], { ...zero, revisoesConcluidas: 1 })).toEqual(["primeira-revisao"]);
    expect(novasConquistas([], { ...zero, diasDeRevisao: 5 })).toEqual(["revisor-constante"]);
    expect(novasConquistas([], { ...zero, conceitosConsolidando: 1 })).toEqual(["sabe-de-cor"]);
    expect(novasConquistas([], { ...zero, conceitosConsolidando: 10 })).toEqual(["sabe-de-cor", "biblioteca-propria"]);
    expect(novasConquistas([], { ...zero, recuperacoesConcluidas: 1 })).toEqual(["folego-novo"]);
  });

  it("o curso completo vale quando todas as lições estão concluídas", () => {
    expect(novasConquistas([], { ...zero, licoesConcluidas: 14, unidadeCompleta: true })).toEqual(["primeira-licao", "primeira-unidade"]);
    expect(novasConquistas([], { ...zero, licoesConcluidas: 15, unidadeCompleta: true })).toEqual(["primeira-licao", "primeira-unidade", "curso-completo"]);
  });

  it("o progresso nunca passa da meta, e uma conquista concedida continua conquistada", () => {
    const p = progressoDasConquistas({ ...zero, acertosEncontreErro: 4, maiorSequencia: 2 }, ["sete-dias"]);
    expect(p.find((x) => x.id === "caca-bugs")).toMatchObject({ atual: 4, meta: 10, conquistada: false });
    expect(p.find((x) => x.id === "sete-dias")).toMatchObject({ atual: 7, meta: 7, conquistada: true });
    expect(p.find((x) => x.id === "tres-dias")).toMatchObject({ atual: 2, meta: 3, conquistada: false });
    expect(progressoDasConquistas({ ...zero, xpTotal: 900 }).find((x) => x.id === "cem-xp")).toMatchObject({ atual: 100, conquistada: true });
  });
});
