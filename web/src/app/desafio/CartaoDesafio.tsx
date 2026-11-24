"use client";
// Cartão do desafio do dia no Praticar (design/MELHORIAS_UX.md, C6): com cara de botão ("Jogar") e, se o
// desafio de hoje já foi feito neste aparelho, o placar e quanto falta para o próximo.
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icone } from "@/componentes/Icone";
import { diaDoDesafio, numeroDoDia, tempoAteOProximo } from "@/modulos/desafio/desafio";
import { lerPlacarDeHoje } from "./placar-de-hoje";

export function CartaoDesafio() {
  const [numero] = useState(() => numeroDoDia(diaDoDesafio()));
  const [feito, setFeito] = useState<{ placar: string; falta: string } | null>(null);
  useEffect(() => {
    const placar = lerPlacarDeHoje(numero);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (placar) setFeito({ placar, falta: tempoAteOProximo() });
  }, [numero]);

  return (
    <Link className="cartao cartao-desafio" href="/desafio">
      <span className="cartao-desafio-corpo">
        <span className="cartao-desafio-quadrados" aria-hidden="true">
          {feito ? feito.placar : "🟩🟨🟥"}
        </span>
        <strong>Desafio do dia #{numero}</strong>
        <span className="cartao-desafio-texto">
          {feito ? `Feito hoje. Novo desafio em ${feito.falta}.` : "5 perguntas de \"qual é a saída?\", iguais para todo mundo. Jogue e mande o placar aos amigos."}
        </span>
      </span>
      <span className="cartao-desafio-jogar">
        {feito ? "Ver" : "Jogar"} <Icone nome="seta" pequeno />
      </span>
    </Link>
  );
}
