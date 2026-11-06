import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { separarExercicio } from "@/modulos/conteudo/esquema";
import { carregarCurso } from "@/servidor/conteudo/carregar";
import { respostaCorreta } from "@/testes/respostas";
import { corrigir, respostaEsquema } from "./corretor";
import { acertosDePrimeira, iniciarFila, registrarResultado } from "./fila";

describe("conteúdo publicado", () => {
  const licoes = carregarCurso(join(__dirname, "../../../../conteudo")).flatMap((u) => u.licoes);
  const exercicios = licoes.flatMap((l) => [...l.exercicios, ...l.revisao]);

  it("todas as lições das três unidades passam no esquema", () => {
    expect(licoes).toHaveLength(15);
    expect(exercicios.length).toBeGreaterThanOrEqual(140);
  });

  it("a parte pública nunca contém resposta, explicação ou feedback (CA-02)", () => {
    for (const ex of exercicios) {
      const { publico } = separarExercicio(ex);
      const json = JSON.stringify(publico);
      expect(json).not.toMatch(/"(resposta|explicacao|feedback|correcao|erro_tipo|ordens)"/);
      if (ex.tipo === "escolher_resultado") {
        for (const o of ex.opcoes.filter((x) => x.feedback)) expect(json).not.toContain(o.feedback);
      }
      if (ex.tipo === "ordenar_blocos") expect(json).not.toContain('"resposta"');
    }
  });

  it("o corretor aceita a resposta correta de todos os exercícios", () => {
    for (const ex of exercicios) {
      const { gabarito } = separarExercicio(ex);
      expect(corrigir(gabarito, respostaEsquema.parse(respostaCorreta(ex))), ex.id).toBe(true);
    }
  });

  it("a ordem dos blocos e das opções de lacuna não entrega a resposta, e a publicação é sempre igual", () => {
    let lacunas = 0;
    let certaPrimeiro = 0;
    for (const ex of exercicios) {
      const { publico, gabarito } = separarExercicio(ex);
      expect(separarExercicio(ex), ex.id).toEqual(separarExercicio(ex));
      if (publico.tipo === "ordenar_blocos" && gabarito.tipo === "ordenar_blocos" && ex.tipo === "ordenar_blocos") {
        const ids = publico.blocos.map((b) => b.id);
        for (const r of gabarito.ordens) expect(ids.filter((id) => r.includes(id)), ex.id).not.toEqual(r);
        expect(ids.some((id) => ex.blocos.some((b) => b.id === id)), `${ex.id}: ids do conteúdo`).toBe(false);
      }
      if (publico.tipo === "completar_lacuna" && gabarito.tipo === "completar_lacuna") {
        for (const l of publico.lacunas) {
          lacunas++;
          if (l.opcoes[0] === gabarito.lacunas[l.id]) certaPrimeiro++;
        }
      }
    }
    expect(certaPrimeiro).toBeLessThan(lacunas / 2);
  });
});

describe("corretor", () => {
  const blocos = { tipo: "ordenar_blocos" as const, ordens: [["a", "b", "c"], ["b", "a", "c"]] };
  it("aceita qualquer ordem válida e recusa as outras", () => {
    expect(corrigir(blocos, { tipo: "ordenar_blocos", blocos: ["b", "a", "c"] })).toBe(true);
    expect(corrigir(blocos, { tipo: "ordenar_blocos", blocos: ["a", "b"] })).toBe(false);
    expect(corrigir(blocos, { tipo: "ordenar_blocos", blocos: ["a", "b", "c", "d"] })).toBe(false);
  });
  it("exige todas as lacunas e nenhuma a mais", () => {
    const g = { tipo: "completar_lacuna" as const, lacunas: { "1": "=", "2": "idade" } };
    expect(corrigir(g, { tipo: "completar_lacuna", lacunas: { "1": "=", "2": "idade" } })).toBe(true);
    expect(corrigir(g, { tipo: "completar_lacuna", lacunas: { "1": "=" } })).toBe(false);
    expect(corrigir(g, { tipo: "completar_lacuna", lacunas: { "1": "=", "2": "idade", "3": "x" } })).toBe(false);
  });
  it("trata resposta de outro tipo como incorreta", () => {
    expect(corrigir({ tipo: "localizar_erro", linha: 2, correcao: "x" }, { tipo: "escolher_resultado", opcao: "a" })).toBe(false);
  });
  it("rejeita respostas malformadas na validação", () => {
    expect(respostaEsquema.safeParse({ tipo: "localizar_erro", linha: "2" }).success).toBe(false);
    expect(respostaEsquema.safeParse({ tipo: "ordenar_blocos", blocos: [] }).success).toBe(false);
  });
});

describe("fila da sessão", () => {
  it("itens errados voltam ao fim e o primeiro desempenho é preservado (CA-32, CA-34)", () => {
    let e = iniciarFila(["e1", "e2", "e3"]);
    let r = registrarResultado(e, "e1", false);
    expect(r.estado.fila).toEqual(["e2", "e3", "e1"]);
    expect(r.primeiraTentativa).toBe(true);
    e = registrarResultado(r.estado, "e2", true).estado;
    e = registrarResultado(e, "e3", true).estado;
    r = registrarResultado(e, "e1", false);
    expect(r.primeiraTentativa).toBe(false);
    r = registrarResultado(r.estado, "e1", true);
    expect(r.concluida).toBe(true);
    expect(acertosDePrimeira(r.estado)).toBe(2);
  });
  it("recusa resultado para item que não é o atual", () => {
    expect(() => registrarResultado(iniciarFila(["e1", "e2"]), "e2", true)).toThrow();
  });
});
