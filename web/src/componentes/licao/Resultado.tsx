"use client";
// Tela de resultado e celebrações (F-20, F-21; FL-03, passo 8). Mostra só valores confirmados pelo servidor;
// na demonstração, o XP aparece como provisório (FL-01, passo 7).
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ResultadoConclusao } from "@/modulos/aprendizagem/contrato";
import { CONQUISTAS } from "@/modulos/gamificacao/textos";
import { Icone } from "../Icone";
import { Mascote } from "../Mascote";
import { tocar } from "./som";

const TITULOS: Record<ResultadoConclusao["tipo"], string> = {
  principal: "Lição concluída!",
  pratica: "Prática concluída!",
  revisao: "Revisão concluída!",
  recuperacao: "Corações recuperados!",
};

type Celebracao = { titulo: string; texto: string };

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

/** Celebrações na ordem em que aparecem: sequência, unidade concluída e conquistas (FL-03, passo 8). */
export function celebracoesDe(c: ResultadoConclusao): Celebracao[] {
  const fila: Celebracao[] = [];
  if (c.sequenciaAumentou && c.sequencia > 0) {
    fila.push({ titulo: `${c.sequencia} ${plural(c.sequencia, "dia", "dias")} de sequência!`, texto: c.sequencia === 1 ? "Sua sequência começou. Estude amanhã para mantê-la." : "Estude amanhã para manter a chama acesa." });
  }
  if (c.unidadeConcluida) fila.push({ titulo: "Unidade concluída!", texto: `Você terminou “${c.unidadeConcluida.titulo}”.` });
  for (const id of c.conquistas) fila.push({ titulo: `Conquista: ${CONQUISTAS[id].nome}`, texto: `${CONQUISTAS[id].descricao}.` });
  return fila;
}

const CORES = ["#FFC23D", "#2FA85E", "#2367C9", "#D93A3A"];

export function TelaCelebracao({ celebracao, aoContinuar, som }: { celebracao: Celebracao; aoContinuar: () => void; som: boolean }) {
  const botao = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    botao.current?.focus();
    if (som) tocar("conclusao");
  }, [celebracao, som]);
  return (
    <div className="celebracao" role="dialog" aria-modal="true" aria-labelledby="titulo-celebracao">
      {Array.from({ length: 24 }, (_, i) => (
        <span key={i} className="confete" aria-hidden="true" style={{ left: `${(i * 41) % 100}%`, background: CORES[i % 4], animationDelay: `${(i % 8) * 0.25}s` }} />
      ))}
      <div className="conteudo surgir">
        <Mascote humor="comemoracao" tamanho="grande" />
        <h2 id="titulo-celebracao">{celebracao.titulo}</h2>
        <p className="subtitulo">{celebracao.texto}</p>
        <button ref={botao} type="button" className="botao" onClick={aoContinuar}>
          Continuar
        </button>
      </div>
    </div>
  );
}

export function Resultado({ conclusao, titulo, demo, som }: { conclusao: ResultadoConclusao; titulo: string; demo: boolean; som: boolean }) {
  const router = useRouter();
  const [fila, setFila] = useState<Celebracao[] | null>(null);
  const [destino, setDestino] = useState("/aprender");
  const tituloRef = useRef<HTMLHeadingElement>(null);
  useEffect(() => tituloRef.current?.focus(), []);

  function seguir(para: string) {
    const celebracoes = celebracoesDe(conclusao);
    if (celebracoes.length === 0) return router.push(para);
    setDestino(para);
    setFila(celebracoes);
  }

  if (fila && fila.length > 0) {
    return (
      <TelaCelebracao
        celebracao={fila[0]}
        som={som}
        aoContinuar={() => {
          if (fila.length === 1) router.push(destino);
          setFila(fila.slice(1));
        }}
      />
    );
  }

  const metaCumprida = conclusao.meta.cumpridaAgora;
  return (
    <main className="tela-centro text-center" id="conteudo-principal">
      <Mascote humor="comemoracao" tamanho="grande" />
      <h1 ref={tituloRef} tabIndex={-1} className="focus:outline-none">
        {TITULOS[conclusao.tipo]}
      </h1>
      {conclusao.licaoId && <p className="subtitulo">{titulo}</p>}
      {conclusao.coracoesRecuperados > 0 && (
        <p className="subtitulo">
          <span className="indicador indicador-coracoes">
            <Icone nome="coracao" pequeno />
          </span>{" "}
          Você recuperou {conclusao.coracoesRecuperados} {plural(conclusao.coracoesRecuperados, "coração", "corações")}.
        </p>
      )}
      <div className="estatisticas">
        <div className="estatistica xp">
          <p className="topo">XP</p>
          <p className="valor">
            <Icone nome="raio" pequeno />+{conclusao.xp}
          </p>
          {demo && <span className="selo-provisorio">provisório</span>}
        </div>
        <div className="estatistica acertos">
          <p className="topo">De primeira</p>
          <p className="valor">
            {conclusao.acertosPrimeira}/{conclusao.total}
          </p>
        </div>
        <div className="estatistica sequencia">
          <p className="topo">Sequência</p>
          <p className="valor">
            <Icone nome="chama" pequeno />
            {demo ? "–" : conclusao.sequencia}
          </p>
        </div>
      </div>
      {demo && <p>Crie uma conta para salvar este XP, começar sua sequência e liberar a próxima lição.</p>}
      {!demo && metaCumprida && (
        <p className="cartao cartao-destaque flex items-center justify-center gap-2 font-extrabold">
          <Icone nome="estrela" pequeno /> Meta do dia cumprida!
        </p>
      )}
      {!demo && !metaCumprida && conclusao.meta.feitas < conclusao.meta.meta && (
        <p className="ajuda">
          Meta do dia: {conclusao.meta.feitas} de {conclusao.meta.meta} {plural(conclusao.meta.meta, "sessão", "sessões")}.
        </p>
      )}
      {!demo && conclusao.primeiraConclusao && conclusao.proximaLicaoId && <p className="mensagem-aviso">A próxima lição foi liberada.</p>}
      {conclusao.limitePratica && <p>Você já recebeu XP de prática três vezes hoje. Pode continuar praticando, sem XP.</p>}
      <div className="acoes">
        {demo ? (
          <>
            <Link className="botao" href="/cadastro">
              Criar conta para salvar
            </Link>
            <Link className="botao botao-fantasma" href="/">
              Agora não
            </Link>
          </>
        ) : conclusao.voltarSessaoId ? (
          <>
            <button type="button" className="botao" onClick={() => seguir(`/sessao/${conclusao.voltarSessaoId}`)}>
              Voltar à lição
            </button>
            <button type="button" className="botao botao-secundario" onClick={() => seguir("/aprender")}>
              Voltar à trilha
            </button>
          </>
        ) : (
          <button type="button" className="botao" onClick={() => seguir(conclusao.tipo === "principal" ? "/aprender" : "/praticar")}>
            Continuar
          </button>
        )}
      </div>
    </main>
  );
}
