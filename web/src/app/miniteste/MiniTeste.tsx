"use client";
// Mini-teste da unidade 1: 5 perguntas "qual é a saída?", sem nota e sem gabarito na tela, para não ensinar a
// resposta antes da unidade. O servidor corrige e guarda só o número de acertos.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PERGUNTAS_MINITESTE, type Momento } from "@/modulos/aprendizagem/miniteste";

type Estado = { antes: number | null; depois: number | null; total: number };

const INTRO: Record<Momento, { titulo: string; texto: string }> = {
  antes: {
    titulo: "Antes de começar",
    texto: "5 perguntas rápidas, sem nota. Se não souber, chute: é só para marcar de onde você parte. No fim da unidade 1, você refaz e vê quanto aprendeu.",
  },
  depois: { titulo: "Quanto você aprendeu?", texto: "As mesmas 5 perguntas do começo. Responda com calma." },
};

function Resultado({ momento, estado }: { momento: Momento; estado: Estado }) {
  const titulo = useRef<HTMLHeadingElement>(null);
  useEffect(() => titulo.current?.focus(), []);
  const { antes, depois, total } = estado;
  return (
    <main className="tela-centro text-center miniteste" id="conteudo-principal">
      <h1 ref={titulo} tabIndex={-1} className="focus:outline-none">
        {momento === "antes" ? "Ponto de partida marcado" : "Seu resultado"}
      </h1>
      {momento === "antes" ? (
        <p className="subtitulo">
          Você acertou {antes} de {total}. Agora é aprender: no fim da unidade 1, a trilha chama você para refazer.
        </p>
      ) : (
        <>
          <p className="miniteste-comparacao">
            {antes !== null && (
              <span>
                Antes: <strong>{antes} de {total}</strong>
              </span>
            )}
            <span>
              Agora: <strong>{depois} de {total}</strong>
            </span>
          </p>
          <p className="subtitulo">
            {antes !== null && depois !== null && depois > antes
              ? `Você subiu ${depois - antes} ${depois - antes === 1 ? "ponto" : "pontos"}. Isso é aprendizado de verdade.`
              : "Revisar ajuda a fixar: a aba Praticar escolhe o que voltar a ver."}
          </p>
        </>
      )}
      <div className="acoes">
        <Link className="botao" href="/aprender">
          Voltar à trilha
        </Link>
      </div>
    </main>
  );
}

export function MiniTeste({ momento, estado: inicial }: { momento: Momento; estado: Estado }) {
  const [estado, setEstado] = useState(inicial);
  const [respostas, setRespostas] = useState<(number | null)[]>(() => PERGUNTAS_MINITESTE.map(() => null));
  const [enviando, setEnviando] = useState(false);
  const [falha, setFalha] = useState<string | null>(null);

  if (estado[momento] !== null) return <Resultado momento={momento} estado={estado} />;

  const completo = respostas.every((r) => r !== null);

  async function enviar() {
    if (!completo || enviando) return;
    setEnviando(true);
    setFalha(null);
    try {
      const r = await fetch("/api/miniteste", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ momento, respostas }) });
      if (!r.ok) throw new Error(String(r.status));
      setEstado(await r.json());
    } catch {
      setFalha("Não foi possível enviar agora. Suas respostas continuam aqui: tente de novo.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="tela-centro miniteste" id="conteudo-principal">
      <h1>{INTRO[momento].titulo}</h1>
      <p className="subtitulo">{INTRO[momento].texto}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar();
        }}
      >
        {PERGUNTAS_MINITESTE.map((p, i) => (
          <fieldset key={p.id} className="miniteste-pergunta">
            <legend>
              Pergunta {i + 1} de {PERGUNTAS_MINITESTE.length}: qual é a saída?
            </legend>
            <pre className="codigo">{p.codigo}</pre>
            <div className="miniteste-opcoes">
              {p.opcoes.map((opcao, j) => (
                <label key={opcao} className={`miniteste-opcao ${respostas[i] === j ? "marcada" : ""}`}>
                  <input
                    type="radio"
                    name={p.id}
                    value={j}
                    checked={respostas[i] === j}
                    onChange={() => setRespostas((rs) => rs.map((r, k) => (k === i ? j : r)))}
                  />
                  <pre>{opcao}</pre>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
        {falha && (
          <p className="mensagem-erro" role="alert">
            {falha}
          </p>
        )}
        <div className="acoes">
          <button type="submit" className="botao" disabled={!completo || enviando}>
            {enviando ? "Enviando..." : completo ? "Enviar respostas" : "Responda as 5 para enviar"}
          </button>
          <Link className="botao botao-fantasma" href="/aprender">
            Agora não
          </Link>
        </div>
      </form>
    </main>
  );
}
