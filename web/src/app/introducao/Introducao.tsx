"use client";
// Boas-vindas (lição 0; design/MELHORIAS_UX.md, B1): três telas curtas que pegam a pessoa pela mão antes da
// primeira lição. O que é um programa, o que é Python e o que ela vai conseguir fazer, e como o Sibi funciona.
// Toda tela tem "Já sei o básico, pular". A meta diária é escolhida depois, no fim da primeira lição.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Voltar } from "@/componentes/formulario";
import { Icone } from "@/componentes/Icone";
import { realcar } from "@/componentes/licao/Codigo";
import { Mascote } from "@/componentes/Mascote";
import { CHAVE_INTRODUCAO } from "@/modulos/conta/conta";
import { marcarBoasVindasVistas } from "@/modulos/conta/boas-vindas";

/** O que a pessoa vai conseguir fazer em cada unidade (conteudo/unidade-N/UNIDADE.md). */
const MAPA = [
  ["Primeiros comandos", "mostrar mensagens na tela e guardar valores"],
  ["Valores e operações", "fazer contas e juntar textos"],
  ["Decisões", "fazer o programa escolher o que fazer"],
  ["Listas e repetição", "repetir um comando para cada item de uma lista"],
] as const;

const PALAVRAS = [
  ["Código", "o que a gente escreve para o computador seguir."],
  ["Saída", "o que aparece na tela quando o código roda."],
  ["Comando", "uma palavra que o Python entende, como print."],
] as const;

function lerNome(): string {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    return typeof v.nome === "string" ? v.nome.trim() : "";
  } catch {
    return "";
  }
}

export function Introducao() {
  const router = useRouter();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNome(lerNome());
  }, []);
  useEffect(() => titulo.current?.focus(), [passo]);

  function irParaLicao() {
    marcarBoasVindasVistas();
    router.push("/demo");
  }

  function avancar() {
    if (passo < 2) setPasso(passo + 1);
    else irParaLicao();
  }

  return (
    <main className="tela-centro boas-vindas" id="conteudo-principal">
      <div className="boas-vindas-topo">
        {passo === 0 ? (
          <Voltar href="/" />
        ) : (
          <button type="button" className="botao-icone" aria-label="Voltar" onClick={() => setPasso(passo - 1)}>
            <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
        )}
        <div className="barra-progresso" role="progressbar" aria-label="Boas-vindas" aria-valuemin={1} aria-valuemax={3} aria-valuenow={passo + 1}>
          <span style={{ width: `${((passo + 1) / 3) * 100}%` }} />
        </div>
        <button type="button" className="link-discreto pular" onClick={irParaLicao}>
          Pular
        </button>
      </div>

      {passo === 0 && (
        <section className="boas-vindas-passo surgir" key="programa">
          <Mascote humor="incentivo" />
          <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
            O que é um programa?
          </h1>
          <p className="subtitulo">
            É uma lista de instruções que o computador segue, uma por uma, como uma receita. O app do banco, o WhatsApp e a calculadora do celular são programas.
          </p>
          {nome ? (
            <div className="ponte-primeiro-programa">
              <p>Lá no começo você escreveu:</p>
              <pre className="codigo">{realcar(`print("Olá, ${nome}!")`)}</pre>
              <p>
                <strong>Aquilo já foi um programa</strong>, de uma linha só. O computador seguiu a instrução e mostrou a mensagem.
              </p>
            </div>
          ) : (
            <div className="ponte-primeiro-programa">
              <pre className="codigo">{realcar('print("Olá!")')}</pre>
              <p>
                Esta linha já é um programa: uma instrução só, que manda mostrar <strong>Olá!</strong> na tela.
              </p>
            </div>
          )}
        </section>
      )}

      {passo === 1 && (
        <section className="boas-vindas-passo surgir" key="python">
          <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
            E o Python?
          </h1>
          <p className="subtitulo">
            Python é uma língua para escrever essas instruções. É uma das mais fáceis de ler, e é usada para automatizar planilhas, criar sites e trabalhar com inteligência artificial.
          </p>
          <p className="rotulo-bloco">O que você vai conseguir fazer</p>
          <ol className="mapa-curso">
            {MAPA.map(([unidade, faz], i) => (
              <li key={unidade}>
                <span className="mapa-numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span>
                  <strong>{unidade}:</strong> {faz}.
                </span>
              </li>
            ))}
          </ol>
        </section>
      )}

      {passo === 2 && (
        <section className="boas-vindas-passo surgir" key="como">
          <Mascote humor="comemoracao" />
          <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
            {nome ? `Como funciona aqui, ${nome}` : "Como funciona aqui"}
          </h1>
          <p className="subtitulo">
            Você não precisa instalar nada. Vai ler programas curtinhos e adivinhar o que aparece na tela, em lições de 5 minutos. Errar faz parte: cada erro vem com explicação.
          </p>
          <p className="rotulo-bloco">Três palavras que vão aparecer</p>
          <dl className="palavras-basicas">
            {PALAVRAS.map(([palavra, sentido]) => (
              <div key={palavra}>
                <dt>{palavra}</dt>
                <dd>{sentido}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div className="acoes">
        <button type="button" className="botao" onClick={avancar}>
          {passo === 2 ? "Bora para o primeiro programa" : "Continuar"}
        </button>
        {passo === 0 && (
          <button type="button" className="botao botao-fantasma" onClick={irParaLicao}>
            <Icone nome="raio" pequeno /> Já sei o básico, pular
          </button>
        )}
        {passo === 2 && (
          <Link className="botao botao-fantasma" href="/cadastro" onClick={() => marcarBoasVindasVistas()}>
            Criar conta primeiro
          </Link>
        )}
      </div>
    </main>
  );
}
