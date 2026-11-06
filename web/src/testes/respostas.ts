// Apoio aos testes: a resposta certa de um exercício do conteúdo, como o aluno a enviaria. Vem do gabarito
// publicado, que usa os mesmos identificadores de bloco que a parte pública mostra.
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import { separarExercicio, type Exercicio } from "@/modulos/conteudo/esquema";

export function respostaCorreta(ex: Exercicio): Resposta {
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
  }
}
