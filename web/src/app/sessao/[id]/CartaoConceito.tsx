// Cartão "Conceito novo": a regra em uma frase, um exemplo que roda e a saída, escondida até o aluno pedir.
// Embaixo, o "Entenda melhor" fechado, para quem quiser mais explicação. Na lição, quem revela a saída é o
// botão principal do rodapé ("Ver a saída"); no caderno de conceitos o cartão já chega com a saída à vista.
import { useRef, useState } from "react";
import { realcar } from "@/componentes/licao/Codigo";
import { Icone } from "@/componentes/Icone";
import { normalizarSaida } from "@/modulos/aprendizagem/digitar";
import { traduzirErro } from "@/modulos/aprendizagem/nomes-de-erro";
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

/** O que acontece com o código errado: o nome do erro traduzido, ou a saída que surpreende. */
function Consequencia({ erro }: { erro: Entenda["erros"][number] }) {
  if (!erro.erro) {
    return (
      <>
        <p className="erro-comum-resultado">Mostra:</p>
        <pre className="saida">{erro.saida}</pre>
      </>
    );
  }
  const traducao = traduzirErro(erro.erro);
  return (
    <p className="erro-comum-resultado">
      Dá erro: <strong>{erro.erro}</strong>
      {traducao && <span className="erro-traducao"> ({traducao})</span>}
    </p>
  );
}

/**
 * "Entenda melhor": explicação em camadas, fechada até o aluno pedir. Três partes com cara própria
 * (design/MELHORIAS_UX.md, A1): a ideia, como conversa; o passo a passo, em etapas numeradas; e os erros
 * comuns numa caixa vermelha, com o código errado (✗) e, quando existe, o jeito certo (✓).
 */
export function EntendaMelhor({ entenda, aoAbrir, abertoInicial = false }: { entenda: Entenda; aoAbrir?: () => void; abertoInicial?: boolean }) {
  const [aberto, setAberto] = useState(abertoInicial);
  const ref = useRef<HTMLDetailsElement>(null);
  const qtdErros = entenda.erros.length;
  return (
    <details
      ref={ref}
      className="entenda"
      open={abertoInicial || undefined}
      onToggle={(e) => {
        const agora = (e.currentTarget as HTMLDetailsElement).open;
        if (agora && !aberto) {
          aoAbrir?.();
          // Abre à vista: sem isso, no celular só aparecem três linhas acima do botão fixo da lição.
          const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          requestAnimationFrame(() => ref.current?.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" }));
        }
        setAberto(agora);
      }}
    >
      <summary>
        <span>
          Entenda melhor
          <span className="entenda-previa">
            a ideia · passo a passo · {qtdErros > 1 ? `${qtdErros} erros comuns` : "1 erro comum"}
          </span>
        </span>
      </summary>
      <div className="entenda-corpo surgir">
        <div className="entenda-ideia">
          <Icone nome="lampada" />
          <p>{entenda.texto}</p>
        </div>

        <section className="entenda-passos" aria-label="Passo a passo">
          <p className="rotulo-bloco">Passo a passo</p>
          <pre className="codigo">{realcar(entenda.passo_a_passo.codigo)}</pre>
          <ol className="entenda-etapas">
            {entenda.passo_a_passo.etapas.map((etapa, i) => (
              <li key={etapa}>
                <span className="etapa-numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{etapa}</span>
              </li>
            ))}
          </ol>
          <p className="rotulo-bloco">Na tela</p>
          <pre className="saida">{entenda.passo_a_passo.saida}</pre>
        </section>

        <section className="erros-comuns" aria-labelledby="titulo-erros-comuns">
          <p className="erros-comuns-titulo" id="titulo-erros-comuns">
            <Icone nome="alerta" /> {qtdErros > 1 ? "Cuidado com estes erros" : "Cuidado com este erro"}
          </p>
          {entenda.erros.map((erro) => (
            <div key={erro.codigo} className="erro-comum">
              <div className="erro-comum-linha">
                <span className="marca-erro errado" aria-label="Errado">
                  <Icone nome="x" pequeno />
                </span>
                <pre className="codigo">{realcar(erro.codigo)}</pre>
              </div>
              <Consequencia erro={erro} />
              <p className="erro-comum-porque">{erro.porque}</p>
              {erro.certo && (
                <div className="erro-comum-linha">
                  <span className="marca-erro certo" aria-label="Certo">
                    <Icone nome="check" pequeno />
                  </span>
                  <pre className="codigo">{realcar(erro.certo)}</pre>
                </div>
              )}
            </div>
          ))}
        </section>
      </div>
    </details>
  );
}

type Props = {
  cartao: Cartao;
  posicao: number;
  total: number;
  /** A saída já foi revelada (pelo botão principal da lição, ou desde o início no caderno). */
  vendo: boolean;
  aoAbrirEntenda?: (conceitoId: string) => void;
  /** Caderno de conceitos: sem previsão e com o "Entenda melhor" já aberto. */
  consulta?: boolean;
};

export function CartaoConceito({ cartao, posicao, total, vendo, aoAbrirEntenda, consulta = false }: Props) {
  // A previsão existe só nesta tela: não é gravada nem enviada a ninguém.
  const [previsao, setPrevisao] = useState("");
  const palpite = previsao.trim();
  const acertou = palpite !== "" && normalizarSaida(palpite) === normalizarSaida(cartao.saida);
  return (
    <section className="cartao-conceito" aria-labelledby="titulo-cartao">
      {!consulta && (
        <p className="etiqueta-cartao">
          <Icone nome="lampada" pequeno /> {cartao.novo ? "Conceito novo" : "Conceito"}
          {total > 1 && <span className="posicao-cartao">{posicao} de {total}</span>}
        </p>
      )}
      <h1 id="titulo-cartao" tabIndex={-1}>
        {cartao.nome}
      </h1>
      <p className="regra-cartao">{cartao.regra}</p>
      <p className="rotulo-bloco">Exemplo</p>
      <pre className="codigo">
        <Exemplo cartao={cartao} />
      </pre>
      {vendo ? (
        <div className={consulta ? undefined : "surgir"}>
          {palpite && (
            <p className={`previsao-cartao${acertou ? " acertou" : ""}`}>
              <span className="rotulo-bloco">Seu palpite</span>
              <span className="previsao-texto">
                {acertou && <Icone nome="check" pequeno />} {palpite}
              </span>
              {acertou && <span className="previsao-acerto">Acertou em cheio!</span>}
            </p>
          )}
          <p className="rotulo-bloco">O que aparece na tela</p>
          <pre className="saida">{cartao.saida}</pre>
          <p className="repare-cartao">
            <Icone nome="olho" />
            <span>
              <strong>Repare:</strong> {cartao.repare}
            </span>
          </p>
        </div>
      ) : (
        // Preveja antes de ver (PRIMM, pesquisa do Duolingo ação 5): escrever o palpite é opcional, mas convida a pensar.
        <div className="previsao-antes">
          <label htmlFor={`previsao-${cartao.conceitoId}`} className="previsao-pergunta">
            Antes de ver: o que você acha que aparece na tela?
          </label>
          <textarea
            id={`previsao-${cartao.conceitoId}`}
            className="previsao-campo"
            rows={2}
            maxLength={200}
            value={previsao}
            onChange={(e) => setPrevisao(e.target.value)}
            placeholder="Pode ser só um palpite (ou deixe em branco)."
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
        </div>
      )}
      {cartao.entenda && (vendo || consulta) && (
        <EntendaMelhor entenda={cartao.entenda} abertoInicial={consulta} aoAbrir={() => aoAbrirEntenda?.(cartao.conceitoId)} />
      )}
    </section>
  );
}
