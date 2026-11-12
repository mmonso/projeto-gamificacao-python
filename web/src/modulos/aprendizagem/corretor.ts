// Correção determinística das respostas (conteudo/FORMATO.md, seção 6).
import { z } from "zod";
import type { Gabarito } from "@/modulos/conteudo/esquema";
import { normalizarSaida } from "./digitar";

export const respostaEsquema = z.discriminatedUnion("tipo", [
  z.object({ tipo: z.literal("escolher_resultado"), opcao: z.string().min(1).max(20) }),
  z.object({ tipo: z.literal("completar_lacuna"), lacunas: z.record(z.string().max(5), z.string().max(200)) }),
  z.object({ tipo: z.literal("ordenar_blocos"), blocos: z.array(z.string().max(20)).min(1).max(7) }),
  z.object({ tipo: z.literal("localizar_erro"), linha: z.number().int().min(1).max(50) }),
  z.object({ tipo: z.literal("digitar_saida"), texto: z.string().max(400) }),
]);

export type Resposta = z.infer<typeof respostaEsquema>;

/** Uma resposta de tipo diferente do exercício é sempre incorreta, nunca um erro de servidor. */
export function corrigir(gabarito: Gabarito, resposta: Resposta): boolean {
  if (gabarito.tipo !== resposta.tipo) return false;
  switch (gabarito.tipo) {
    case "escolher_resultado":
      return (resposta as Extract<Resposta, { tipo: "escolher_resultado" }>).opcao === gabarito.opcao;
    case "completar_lacuna": {
      const lacunas = (resposta as Extract<Resposta, { tipo: "completar_lacuna" }>).lacunas;
      const esperadas = Object.entries(gabarito.lacunas);
      return Object.keys(lacunas).length === esperadas.length && esperadas.every(([id, valor]) => lacunas[id] === valor);
    }
    case "ordenar_blocos": {
      const montada = (resposta as Extract<Resposta, { tipo: "ordenar_blocos" }>).blocos;
      return gabarito.ordens.some((ordem) => ordem.length === montada.length && ordem.every((id, i) => montada[i] === id));
    }
    case "localizar_erro":
      return (resposta as Extract<Resposta, { tipo: "localizar_erro" }>).linha === gabarito.linha;
    case "digitar_saida":
      return normalizarSaida((resposta as Extract<Resposta, { tipo: "digitar_saida" }>).texto) === normalizarSaida(gabarito.saida);
  }
}
