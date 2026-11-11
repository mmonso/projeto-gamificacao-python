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

/** Celebração própria de cada marco da sequência (3, 7, 14 e 30 dias). */
const TEXTOS_MARCO: Record<number, Celebracao> = {
  3: { titulo: "3 dias seguidos!", texto: "Você está pegando o ritmo. Pouco por dia rende mais do que muito de uma vez." },
  7: { titulo: "Uma semana inteira!", texto: "Sete dias seguidos. O hábito já tem forma: continue amanhã." },
  14: { titulo: "Duas semanas de Python!", texto: "Quatorze dias seguidos. Quem chega até aqui costuma continuar." },
  30: { titulo: "30 dias de sequência!", texto: "Um mês inteiro estudando todo dia. Isso é hábito de verdade." },
};

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

/** Celebrações na ordem em que aparecem: sequência, unidade concluída e conquistas (FL-03, passo 8). */
export function celebracoesDe(c: ResultadoConclusao): Celebracao[] {
  const fila: Celebracao[] = [];
  if (c.sequenciaAumentou && c.sequencia > 0) {
    const marco = TEXTOS_MARCO[c.sequencia];
    fila.push(
      marco ?? { titulo: `${c.sequencia} ${plural(c.sequencia, "dia", "dias")} de sequência!`, texto: c.sequencia === 1 ? "Sua sequência começou. Estude amanhã para mantê-la." : "Estude amanhã para manter a chama acesa." },
    );
  }
  if (c.unidadeConcluida) fila.push({ titulo: "Unidade concluída!", texto: `Você terminou “${c.unidadeConcluida.titulo}”.` });
  for (const id of c.conquistas) fila.push({ titulo: `Conquista: ${CONQUISTAS[id].nome}`, texto: `Você conseguiu: ${CONQUISTAS[id].descricao.charAt(0).toLowerCase()}${CONQUISTAS[id].descricao.slice(1)}.` });
  return fila;
}

const CORES = ["#FFC23D", "#2FA85E", "#2367C9", "#D93A3A"];

/** Confete: contínuo nas celebrações, uma única chuva leve no resultado. Some com movimento reduzido. */
function Confete({ quantidade, leve = false }: { quantidade: number; leve?: boolean }) {
  return (
    <>
      {Array.from({ length: quantidade }, (_, i) => (
        <span
          key={i}
          className={`confete ${leve ? "leve" : ""}`}
          aria-hidden="true"
          style={{ left: `${(i * 41) % 100}%`, background: CORES[i % 4], animationDelay: `${(i % 8) * (leve ? 0.12 : 0.25)}s` }}
        />
      ))}
    </>
  );
}

const reduzirMovimento = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Número que sobe até o valor final; com movimento reduzido, já aparece pronto. O leitor de tela ouve só o final. */
function Contador({ valor, atraso = 0 }: { valor: number; atraso?: number }) {
  const [mostrado, setMostrado] = useState(() => (reduzirMovimento() ? valor : 0));
  useEffect(() => {
    if (reduzirMovimento()) return;
    let quadro = 0;
    const inicio = performance.now() + atraso;
    const passo = (agora: number) => {
      const p = Math.min(1, Math.max(0, (agora - inicio) / 700));
      setMostrado(Math.round(valor * (1 - (1 - p) ** 3)));
      if (p < 1) quadro = requestAnimationFrame(passo);
    };
    quadro = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(quadro);
  }, [valor, atraso]);
  return (
    <>
      <span aria-hidden="true">{mostrado}</span>
      <span className="so-leitor">{valor}</span>
    </>
  );
}

export function TelaCelebracao({ celebracao, aoContinuar, som }: { celebracao: Celebracao; aoContinuar: () => void; som: boolean }) {
  const botao = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    botao.current?.focus();
    if (som) tocar("celebracao");
  }, [celebracao, som]);
  return (
    <div className="celebracao" role="dialog" aria-modal="true" aria-labelledby="titulo-celebracao">
      <Confete quantidade={24} />
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
  const perfeita = conclusao.total > 0 && conclusao.acertosPrimeira === conclusao.total;
  const acendeu = !demo && conclusao.sequenciaAumentou && conclusao.sequencia > 0;
  // Cartões sem informação somem: XP zerado pelo limite diário de prática e sequência na demonstração.
  const mostrarXp = conclusao.xp > 0 || demo;
  const colunas = 1 + (mostrarXp ? 1 : 0) + (demo ? 0 : 1);
  const porcentagemMeta = Math.min(100, Math.round((conclusao.meta.feitas / Math.max(1, conclusao.meta.meta)) * 100));
  return (
    <main className="tela-centro text-center resultado" id="conteudo-principal">
      <Confete quantidade={14} leve />
      <div className="resultado-mascote">
        <Mascote humor="comemoracao" tamanho="grande" />
      </div>
      <h1 ref={tituloRef} tabIndex={-1} className="focus:outline-none">
        {TITULOS[conclusao.tipo]}
      </h1>
      {conclusao.licaoId && <p className="subtitulo">{titulo}</p>}
      {perfeita && (
        <p className="selo-perfeita">
          <Icone nome="coroa" pequeno /> {conclusao.tipo === "principal" ? "Lição perfeita!" : "Tudo certo de primeira!"}
        </p>
      )}
      {conclusao.coracoesRecuperados > 0 && (
        <p className="subtitulo">
          <span className="indicador indicador-coracoes">
            <Icone nome="coracao" pequeno />
          </span>{" "}
          Você recuperou {conclusao.coracoesRecuperados} {plural(conclusao.coracoesRecuperados, "coração", "corações")}.
        </p>
      )}
      <div className="estatisticas" style={{ gridTemplateColumns: `repeat(${colunas}, minmax(0, 1fr))` }}>
        {mostrarXp && (
          <div className="estatistica xp">
            <p className="topo">XP</p>
            <p className="valor">
              <Icone nome="raio" pequeno />
              <span>
                +<Contador valor={conclusao.xp} atraso={250} />
              </span>
            </p>
            {demo && <span className="selo-provisorio">provisório</span>}
          </div>
        )}
        <div className="estatistica acertos">
          <p className="topo">De primeira</p>
          <p className="valor">
            <span>
              <Contador valor={conclusao.acertosPrimeira} atraso={450} />/{conclusao.total}
            </span>
          </p>
        </div>
        {!demo && (
          <div className={`estatistica sequencia ${acendeu ? "acendeu" : ""}`}>
            <p className="topo">Sequência</p>
            <p className="valor">
              <Icone nome="chama" pequeno />
              {conclusao.sequencia}
            </p>
            {acendeu && <span className="mais-um">+1 dia</span>}
          </div>
        )}
      </div>
      {demo && <p>Crie uma conta para salvar este XP, começar sua sequência e liberar a próxima lição.</p>}
      {!demo && (metaCumprida || conclusao.meta.feitas < conclusao.meta.meta) && (
        <div className={`meta-resultado ${metaCumprida ? "cumprida" : ""}`}>
          <p className="meta-resultado-texto">
            <Icone nome="estrela" pequeno />
            {metaCumprida
              ? "Meta do dia cumprida!"
              : `Meta do dia: ${conclusao.meta.feitas} de ${conclusao.meta.meta} ${plural(conclusao.meta.meta, "sessão", "sessões")}`}
          </p>
          <div className="progresso-meta" aria-hidden="true">
            <span style={{ width: `${porcentagemMeta}%` }} />
          </div>
        </div>
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
