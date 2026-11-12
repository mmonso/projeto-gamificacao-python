import { describe, expect, it } from "vitest";
import { LIMITE_DE_CONTAS } from "../conta/vagas";
import { avaliar, type Medidas } from "./vigilancia";

const calmo: Medidas = {
  visitantes24h: 3,
  anonimosSemPerfil24h: 0,
  anonimosTotal: 12,
  chavesNoLimite: 0,
  picoPorMinuto: 8,
  eventos24h: 400,
  desafios24h: 10,
  bancoMb: 30,
  contas: 5,
};

describe("vigilância de abuso", () => {
  it("não acusa nada num dia normal da fase de teste", () => {
    expect(avaliar(calmo)).toEqual([]);
  });

  it("separa atenção de alerta e põe os alertas primeiro", () => {
    const achados = avaliar({ ...calmo, visitantes24h: 40, anonimosSemPerfil24h: 80 });
    expect(achados.map((a) => a.nivel)).toEqual(["alerta", "atencao"]);
    expect(achados[0].texto).toMatch(/Supabase direto/);
    expect(achados[1].texto).toMatch(/40 visitantes/);
  });

  it("avisa de repetição automática quando alguém bate no limite por minuto", () => {
    expect(avaliar({ ...calmo, chavesNoLimite: 1 })).toEqual([expect.objectContaining({ nivel: "atencao" })]);
  });

  it("avisa quando as contas chegam perto do teto e quando o cadastro fecha", () => {
    const perto = avaliar({ ...calmo, contas: Math.ceil(LIMITE_DE_CONTAS * 0.8) });
    expect(perto).toEqual([expect.objectContaining({ nivel: "atencao", texto: expect.stringMatching(/fecha sozinho/) })]);
    const cheio = avaliar({ ...calmo, contas: LIMITE_DE_CONTAS });
    expect(cheio).toEqual([expect.objectContaining({ nivel: "alerta", texto: expect.stringMatching(/cadastro está fechado/) })]);
  });
});
