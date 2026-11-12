// Apoio aos testes: a resposta certa de um exercício do conteúdo, como o aluno a enviaria. Vem do gabarito
// publicado, que usa os mesmos identificadores de bloco que a parte pública mostra.
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import { separarExercicio, type Exercicio, type ExercicioPublico } from "@/modulos/conteudo/esquema";

/**
 * Com `publico`, responde como a tela mostrou o item: na revisão e na prática, um escolher a saída pode
 * aparecer para digitar, e aí a resposta é o texto da opção certa.
 */
export function respostaCorreta(ex: Exercicio, publico?: ExercicioPublico | null): Resposta {
  if (publico?.tipo === "digitar_saida" && ex.tipo === "escolher_resultado") {
    return { tipo: "digitar_saida", texto: ex.opcoes.find((o) => o.id === ex.resposta)!.texto! };
  }
  const g = separarExercicio(ex).gabarito;
  switch (g.tipo) {
    case "escolher_resultado":
      return { tipo: g.tipo, opcao: g.opcao };
    case "completar_lacuna":
      return { tipo: g.tipo, lacunas: g.lacunas };
    case "ordenar_blocos":
      return { tipo: g.tipo, blocos: g.ordens[0] };
    case "localizar_erro":
      return { tipo: g.tipo, linha: g.linha };
    case "digitar_saida":
      return { tipo: g.tipo, texto: g.saida };
  }
}
