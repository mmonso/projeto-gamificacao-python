"use client";
// Demonstração anônima (FL-01): a mesma tela da lição, com o motor local e sem corações.
import { useEffect, useState } from "react";
import { exercicioAtual, lerDemo, motorDemo, novaDemo, resultadoDaDemo, type EstadoDemo } from "@/componentes/licao/demo";
import { Resultado } from "@/componentes/licao/Resultado";
import type { LicaoDemo } from "@/servidor/demo/servico";
import { Licao } from "../sessao/[id]/Licao";

export function Demonstracao({ licao }: { licao: LicaoDemo }) {
  const [estado, setEstado] = useState<EstadoDemo | null>(null);

  // A demonstração guardada continua do item em que parou e na versão em que começou (CA-04).
  useEffect(() => {
    const guardada = lerDemo();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEstado(guardada ?? novaDemo(licao));
  }, [licao]);

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
  if (estado.concluida) return <Resultado conclusao={resultadoDaDemo(estado)} titulo={estado.titulo} demo som={false} />;

  return (
    <Licao
      sessaoId="demo"
      tipo="principal"
      titulo={estado.titulo}
      inicial={{ exercicio: exercicioAtual(estado), resolvidos: estado.fila.resolvidos.length, total: estado.exercicios.length }}
      coracoesIniciais={null}
      semCoracoes={false}
      somInicial
      demo
      criarMotor={motorDemo}
    />
  );
}
