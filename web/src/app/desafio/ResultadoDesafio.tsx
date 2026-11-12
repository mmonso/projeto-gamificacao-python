"use client";
// Fim do desafio do dia: placar em quadradinhos para mandar no WhatsApp, sem as respostas, e o convite para
// quem ainda não estuda no Sibi (design/ESTRATEGIA_DE_CRESCIMENTO.md, loop "Desafio do dia").
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mascote } from "@/componentes/Mascote";
import { marcasDo, type EstadoDesafio } from "@/componentes/licao/desafio";
import { acertos, fraseDoPlacar, quadradinhos, tempoAteOProximo, textoParaCompartilhar, type Marca } from "@/modulos/desafio/desafio";

const NOME_MARCA: Record<Marca, string> = { certa: "acertou", dica: "acertou com ajuda", errada: "errou" };

export function ResultadoDesafio({ estado, comConta }: { estado: EstadoDesafio; comConta: boolean }) {
  const marcas = marcasDo(estado);
  const certas = acertos(marcas);
  const total = estado.exercicios.length;
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const [texto, setTexto] = useState<string | null>(null);
  const [podeCompartilhar, setPodeCompartilhar] = useState(false);
  const [copiado, setCopiado] = useState(false);
  const [falta, setFalta] = useState<string | null>(null);

  // O endereço e o relógio só existem no navegador.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setTexto(textoParaCompartilhar(estado.numero, marcas, `${location.origin}/desafio?c=1`));
    setPodeCompartilhar(typeof navigator.share === "function");
    setFalta(tempoAteOProximo());
    /* eslint-enable react-hooks/set-state-in-effect */
    tituloRef.current?.focus({ preventScroll: true });
    const relogio = setInterval(() => setFalta(tempoAteOProximo()), 30_000);
    return () => clearInterval(relogio);
    // O placar não muda depois do fim.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [estado.numero]);

  async function copiar() {
    if (!texto) return;
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2500);
    } catch {
      setCopiado(false);
    }
  }

  async function compartilhar() {
    if (!texto) return;
    try {
      await navigator.share({ text: texto });
    } catch {
      // Cancelado pelo aluno ou sem suporte: os outros botões continuam ali.
    }
  }

  return (
    <main className="tela-centro text-center resultado resultado-desafio" id="conteudo-principal">
      <div className="resultado-mascote">
        <Mascote humor={certas >= Math.ceil(total / 2) ? "comemoracao" : "incentivo"} tamanho="grande" />
      </div>
      <h1 ref={tituloRef} tabIndex={-1} className="focus:outline-none">
        Desafio #{estado.numero}
      </h1>
      <p className="subtitulo">{fraseDoPlacar(certas, total)}</p>
      <p className="placar-desafio" aria-label={`${certas} de ${total}: ${marcas.map((m) => NOME_MARCA[m]).join(", ")}`}>
        <span className="placar-numero" aria-hidden="true">
          {certas}/{total}
        </span>
        <span className="placar-quadrados" aria-hidden="true">
          {quadradinhos(marcas)}
        </span>
      </p>
      <p className="legenda-desafio">🟩 de primeira · 🟨 com dica · 🟥 errou</p>

      <div className="acoes">
        <a
          className="botao"
          href={texto ? `https://wa.me/?text=${encodeURIComponent(texto)}` : undefined}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={!texto}
        >
          Mandar no WhatsApp
        </a>
        <button type="button" className="botao botao-secundario" onClick={() => void copiar()} disabled={!texto}>
          {copiado ? "Copiado!" : "Copiar resultado"}
        </button>
        {podeCompartilhar && (
          <button type="button" className="botao botao-fantasma" onClick={() => void compartilhar()}>
            Outras formas de compartilhar
          </button>
        )}
      </div>
      <p className="so-leitor" aria-live="polite">
        {copiado ? "Resultado copiado." : ""}
      </p>
      {falta && <p className="proximo-desafio">Novo desafio em {falta}.</p>}

      {comConta ? (
        <div className="acoes">
          <Link className="botao botao-secundario" href="/aprender">
            Voltar à trilha
          </Link>
        </div>
      ) : (
        <div className="convite-desafio">
          <p>
            <strong>Quer acertar todas amanhã?</strong> O Sibi ensina Python em 5 minutos por dia, de graça. A primeira lição leva 2 minutos e
            não pede cadastro.
          </p>
          <div className="acoes">
            <Link className="botao" href="/demo">
              Fazer a primeira lição
            </Link>
            <Link className="botao botao-fantasma" href="/cadastro">
              Criar conta
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
