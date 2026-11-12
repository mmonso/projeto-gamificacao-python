// Retomada da resposta guardada no navegador (FL-04; CA-52, CA-53).
import { describe, expect, it } from "vitest";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { interpretar, retomar, type Guardada } from "./guardada";

const ex1: ExercicioPublico = { id: "u1-l1-e1", versao: 1, enunciado: "O que aparece?", totalDicas: 2, tipo: "localizar_erro", codigo: "print(1)\nprint(2" };
const ex2: ExercicioPublico = { id: "u1-l1-e2", versao: 1, enunciado: "Qual linha?", totalDicas: 2, tipo: "localizar_erro", codigo: "x = 1\nprint(y)" };

const rascunho: Guardada = { exercicio: ex1, resposta: { tipo: "localizar_erro", linha: 2 }, envioId: null };
const envio: Guardada = { ...rascunho, envioId: "7c9e6679-7425-40de-944b-e07fc1f90ae7" };

describe("interpretar o valor guardado", () => {
  it("lê o que foi gravado", () => {
    expect(interpretar(JSON.stringify(envio))).toEqual(envio);
    expect(interpretar(JSON.stringify(rascunho))).toEqual(rascunho);
  });

  it("ignora valor ausente, malformado ou do formato anterior", () => {
    expect(interpretar(null)).toBeNull();
    expect(interpretar("{")).toBeNull();
    expect(interpretar(JSON.stringify({ id: envio.envioId, exercicioId: ex1.id, resposta: rascunho.resposta }))).toBeNull();
    expect(interpretar(JSON.stringify({ ...rascunho, resposta: { tipo: "escolher_resultado", opcao: "a" } }))).toBeNull();
  });
});

describe("retomar depois de recarga", () => {
  it("reenvia um envio com o mesmo id, mesmo que o servidor já mostre outro exercício (CA-52)", () => {
    expect(retomar(envio, ex2)).toEqual({ acao: "reenviar", envio });
    expect(retomar(envio, null)).toEqual({ acao: "reenviar", envio });
  });

  it("devolve o rascunho do exercício atual (CA-53)", () => {
    expect(retomar(rascunho, ex1)).toEqual({ acao: "rascunho", resposta: rascunho.resposta });
  });

  it("descarta o rascunho de outro exercício", () => {
    expect(retomar(rascunho, ex2)).toEqual({ acao: "nenhuma" });
    expect(retomar(rascunho, null)).toEqual({ acao: "nenhuma" });
    expect(retomar(null, ex1)).toEqual({ acao: "nenhuma" });
  });
});

describe("tempo guardado com o envio", () => {
  it("mantém o tempo depois de recarregar e descarta valores inválidos", () => {
    const bom = JSON.stringify({ exercicio: ex1, resposta: rascunho.resposta, envioId: "a1", tempoMs: 3100 });
    expect(interpretar(bom)?.tempoMs).toBe(3100);
    const negativo = JSON.stringify({ exercicio: ex1, resposta: rascunho.resposta, envioId: "a1", tempoMs: -4 });
    expect(interpretar(negativo)?.tempoMs).toBeUndefined();
    const sem = JSON.stringify({ exercicio: ex1, resposta: rascunho.resposta, envioId: "a1" });
    expect(interpretar(sem)).not.toHaveProperty("tempoMs");
  });
});
