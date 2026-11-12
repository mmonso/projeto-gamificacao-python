// Cartão "Conceito novo": a regra em uma frase, um exemplo que roda e a saída, escondida até o aluno pedir.
// Embaixo, o "Entenda melhor" fechado, para quem quiser mais explicação.
import { useState } from "react";
import { realcar } from "@/componentes/licao/Codigo";
import { Icone } from "@/componentes/Icone";
import type { CartaoConceito as Cartao, Entenda } from "@/modulos/conteudo/esquema";

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

/** "Entenda melhor": explicação em camadas, fechada até o aluno pedir (texto, passo a passo e erros comuns). */
function EntendaMelhor({ entenda, aoAbrir }: { entenda: Entenda; aoAbrir?: () => void }) {
  const [aberto, setAberto] = useState(false);
  return (
    <details
      className="entenda"
      onToggle={(e) => {
        const agora = (e.currentTarget as HTMLDetailsElement).open;
        if (agora && !aberto) aoAbrir?.();
        setAberto(agora);
      }}
    >
      <summary>Entenda melhor</summary>
      <div className="entenda-corpo">
        <p>{entenda.texto}</p>
        <p className="rotulo-bloco">Passo a passo</p>
        <pre className="codigo">{realcar(entenda.passo_a_passo.codigo)}</pre>
        <ol className="entenda-etapas">
          {entenda.passo_a_passo.etapas.map((etapa) => (
            <li key={etapa}>{etapa}</li>
          ))}
        </ol>
        <pre className="saida">{entenda.passo_a_passo.saida}</pre>
        <p className="rotulo-bloco">{entenda.erros.length > 1 ? "Erros comuns" : "Erro comum"}</p>
        {entenda.erros.map((erro) => (
          <div key={erro.codigo} className="entenda-erro">
            <pre className="codigo">{realcar(erro.codigo)}</pre>
            <p className="entenda-resultado">
              {erro.erro ? (
                <>
                  Dá erro: <strong>{erro.erro}</strong>
                </>
              ) : (
                <>Mostra:</>
              )}
            </p>
            {erro.saida && <pre className="saida">{erro.saida}</pre>}
            <p>{erro.porque}</p>
          </div>
        ))}
      </div>
    </details>
  );
}

type Props = { cartao: Cartao; posicao: number; total: number; aoAbrirEntenda?: (conceitoId: string) => void };

export function CartaoConceito({ cartao, posicao, total, aoAbrirEntenda }: Props) {
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
      {cartao.entenda && <EntendaMelhor entenda={cartao.entenda} aoAbrir={() => aoAbrirEntenda?.(cartao.conceitoId)} />}
    </section>
  );
}
