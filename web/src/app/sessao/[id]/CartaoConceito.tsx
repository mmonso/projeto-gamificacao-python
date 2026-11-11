// Cartão "Conceito novo": a regra em uma frase, um exemplo que roda e a saída, escondida até o aluno pedir.
import { useState } from "react";
import { realcar } from "@/componentes/licao/Codigo";
import { Icone } from "@/componentes/Icone";
import type { CartaoConceito as Cartao } from "@/modulos/conteudo/esquema";

function Exemplo({ cartao }: { cartao: Cartao }) {
  const { exemplo, destaque } = cartao;
  const i = destaque ? exemplo.indexOf(destaque) : -1;
  if (!destaque || i < 0) return <>{realcar(exemplo)}</>;
  return (
    <>
      {realcar(exemplo.slice(0, i))}
      <mark className="destaque-codigo">{realcar(destaque)}</mark>
      {realcar(exemplo.slice(i + destaque.length))}
    </>
  );
}

export function CartaoConceito({ cartao, posicao, total }: { cartao: Cartao; posicao: number; total: number }) {
  const [vendo, setVendo] = useState(false);
  return (
    <section className="cartao-conceito" aria-labelledby="titulo-cartao">
      <p className="etiqueta-cartao">
        <Icone nome="lampada" pequeno /> {cartao.novo ? "Conceito novo" : "Conceito"}
        {total > 1 && <span className="posicao-cartao">{posicao} de {total}</span>}
      </p>
      <h1 id="titulo-cartao" tabIndex={-1}>
        {cartao.nome}
      </h1>
      <p className="regra-cartao">{cartao.regra}</p>
      <p className="rotulo-bloco">Exemplo</p>
      <pre className="codigo">
        <Exemplo cartao={cartao} />
      </pre>
      {vendo ? (
        <div className="surgir">
          <p className="rotulo-bloco">O que aparece na tela</p>
          <pre className="saida">{cartao.saida}</pre>
          <p className="repare-cartao">
            <strong>Repare:</strong> {cartao.repare}
          </p>
        </div>
      ) : (
        <button type="button" className="botao botao-secundario" onClick={() => setVendo(true)}>
          Ver a saída
        </button>
      )}
    </section>
  );
}
