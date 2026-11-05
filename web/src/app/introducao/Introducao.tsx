"use client";
// Introdução (F-03; FL-01, passo 2): nome opcional, meta diária e uma explicação curta da trilha.
// As escolhas ficam no navegador até o cadastro, que as leva para a conta.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Voltar } from "@/componentes/formulario";
import { Mascote } from "@/componentes/Mascote";
import { CHAVE_INTRODUCAO, NOME_MAXIMO } from "@/modulos/conta/conta";

const METAS = [
  [1, "Leve", "1 lição por dia, cerca de 5 minutos"],
  [2, "Regular", "2 lições por dia, cerca de 10 minutos"],
  [3, "Intensa", "3 lições por dia, cerca de 15 minutos"],
] as const;

function ler(): { nome: string; meta: number } {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    return { nome: typeof v.nome === "string" ? v.nome : "", meta: [1, 2, 3].includes(v.meta) ? v.meta : 1 };
  } catch {
    return { nome: "", meta: 1 };
  }
}

function salvar(dados: { nome: string; meta: number }) {
  try {
    localStorage.setItem(CHAVE_INTRODUCAO, JSON.stringify(dados));
  } catch {
    // Sem armazenamento, a introdução segue; o cadastro usa os valores padrão.
  }
}

export function Introducao() {
  const router = useRouter();
  const [passo, setPasso] = useState(0);
  const [nome, setNome] = useState("");
  const [meta, setMeta] = useState(1);
  const titulo = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const v = ler();
    /* eslint-disable react-hooks/set-state-in-effect */
    setNome(v.nome);
    setMeta(v.meta);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);
  useEffect(() => titulo.current?.focus(), [passo]);

  function avancar() {
    salvar({ nome: nome.trim(), meta });
    if (passo < 2) setPasso(passo + 1);
    else router.push("/demo");
  }

  return (
    <main className="tela-centro" id="conteudo-principal">
      {passo === 0 ? (
        <Voltar href="/" />
      ) : (
        <button type="button" className="botao-icone" aria-label="Voltar" onClick={() => setPasso(passo - 1)}>
          <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      )}
      <p className="ajuda font-extrabold">Passo {passo + 1} de 3</p>
      <form
        className="formulario"
        onSubmit={(e) => {
          e.preventDefault();
          avancar();
        }}
      >
        {passo === 0 && (
          <>
            <Mascote humor="incentivo" />
            <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
              Oi! Eu sou o Sibi.
            </h1>
            <p className="subtitulo">Vou acompanhar você nos primeiros passos em Python. Como posso te chamar?</p>
            <div className="campo">
              <label htmlFor="nome">Seu nome ou apelido (opcional)</label>
              <input id="nome" autoComplete="given-name" maxLength={NOME_MAXIMO} value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          </>
        )}
        {passo === 1 && (
          <>
            <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
              Qual vai ser sua meta diária?
            </h1>
            <p className="subtitulo">Você pode mudar depois, no perfil.</p>
            <div className="opcoes" role="group" aria-label="Meta diária">
              {METAS.map(([n, rotulo, descricao]) => (
                <button key={n} type="button" aria-pressed={meta === n} className="opcao" onClick={() => setMeta(n)}>
                  <span className="opcao-texto">
                    <strong>{rotulo}</strong>
                    <br />
                    <span className="font-semibold text-[var(--texto-suave)]">{descricao}</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}
        {passo === 2 && (
          <>
            <Mascote humor="comemoracao" />
            <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
              {nome.trim() ? `Tudo pronto, ${nome.trim()}!` : "Tudo pronto!"}
            </h1>
            <p className="subtitulo">
              Sua trilha tem lições curtas. Em cada uma, você responde alguns exercícios e recebe ajuda quando errar. Vamos à primeira? Você pode experimentar antes de criar a conta.
            </p>
          </>
        )}
        <div className="acoes">
          <button type="submit" className="botao">
            {passo === 2 ? "Começar a lição" : "Continuar"}
          </button>
          {passo === 2 && (
            <Link className="botao botao-fantasma" href="/cadastro">
              Criar conta primeiro
            </Link>
          )}
        </div>
      </form>
    </main>
  );
}
