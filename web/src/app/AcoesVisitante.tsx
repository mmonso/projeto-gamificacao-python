"use client";
// Ações da apresentação para quem ainda não entrou (FL-01): Começar leva direto à demonstração; com uma
// demonstração concluída neste navegador, o destaque é Criar conta para salvar. Entrar como visitante abre o app
// inteiro sem cadastro, para quem só quer conhecer.
import Link from "next/link";
import { useEffect, useState } from "react";
import { lerDemo } from "@/componentes/licao/demo";
import { EntrarComoVisitante } from "@/componentes/EntrarComoVisitante";
import { Mascote } from "@/componentes/Mascote";

export function AcoesVisitante() {
  const [demo, setDemo] = useState<"nenhuma" | "andamento" | "concluida">("nenhuma");
  useEffect(() => {
    const d = lerDemo();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (d) setDemo(d.concluida ? "concluida" : "andamento");
  }, []);

  if (demo === "concluida") {
    return (
      <>
        <div className="aviso-conta text-left">
          <Mascote humor="comemoracao" tamanho="pequeno" />
          <p>Você já concluiu a primeira lição. Crie uma conta para salvar seu progresso.</p>
        </div>
        <Link className="botao" href="/cadastro">
          Criar conta para salvar
        </Link>
        <Link className="botao botao-secundario" href="/entrar">
          Já tenho conta
        </Link>
        <EntrarComoVisitante origem="inicio" />
      </>
    );
  }
  return (
    <>
      <Link className="botao" href="/demo">
        {demo === "andamento" ? "Continuar a lição" : "Começar grátis"}
      </Link>
      <Link className="botao botao-secundario" href="/entrar">
        Já tenho conta
      </Link>
      <EntrarComoVisitante origem="inicio" />
    </>
  );
}
