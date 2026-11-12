"use client";
// Desafio do dia: a mesma tela da lição, com o motor local do desafio, e no fim o placar para compartilhar.
import { useEffect, useState } from "react";
import { lerDesafio, motorDesafio, novoDesafio, perguntaAtual, registrarEventoDesafio, type EstadoDesafio } from "@/componentes/licao/desafio";
import type { DesafioPublico } from "@/servidor/desafio/servico";
import { Licao } from "../sessao/[id]/Licao";
import { ResultadoDesafio } from "./ResultadoDesafio";

type Props = { desafio: DesafioPublico; compartilhado: boolean; comConta: boolean };

export function Desafio({ desafio, compartilhado, comConta }: Props) {
  const [estado, setEstado] = useState<EstadoDesafio | null>(null);

  // O desafio guardado continua de onde parou; o de outro dia é trocado pelo de hoje.
  useEffect(() => {
    const guardado = lerDesafio();
    if (guardado?.numero === desafio.numero) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEstado(guardado);
      return;
    }
    const novo = novoDesafio(desafio.numero, desafio.exercicios, compartilhado);
    registrarEventoDesafio(novo, "iniciado");
    setEstado(novo);
  }, [desafio, compartilhado]);

  if (!estado) {
    return (
      <main className="tela-centro justify-start" id="conteudo-principal">
        <div className="carregando" aria-busy="true">
          <div className="esqueleto h-7 w-4/5" />
          <div className="esqueleto h-24" />
        </div>
      </main>
    );
  }

  const telaFinal = () => <ResultadoDesafio estado={lerDesafio() ?? estado} comConta={comConta} />;
  if (estado.concluido) return telaFinal();

  return (
    <Licao
      sessaoId={`desafio-${estado.numero}`}
      tipo="principal"
      titulo={`Desafio #${estado.numero}`}
      inicial={{ exercicio: perguntaAtual(estado), resolvidos: estado.respondidas.length, total: estado.exercicios.length }}
      coracoesIniciais={null}
      semCoracoes={false}
      somInicial
      demo
      criarMotor={motorDesafio}
      desafio={{ telaFinal }}
    />
  );
}
