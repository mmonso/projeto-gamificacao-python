"use client";
// Lição em andamento (FL-03, FL-04, FL-06; estados da seção 3.1 da especificação).
// O servidor corrige e decide; a interface só mostra o que ele confirmou.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { BotaoRecuperar } from "@/app/licao/[id]/botao";
import { Icone } from "@/componentes/Icone";
import { AreaExercicio, NOME_TIPO, RespostaCorreta, respostaCompleta } from "@/componentes/licao/Exercicios";
import { textoSeguidas, tituloDoFeedback } from "@/componentes/licao/frases";
import { atualizarCronometro, CRONOMETRO_VAZIO, tempoDoCronometro, type Cronometro } from "@/componentes/licao/cronometro";
import { guardar, lerGuardada, retomar, type Envio } from "@/componentes/licao/guardada";
import { chamar, motorDaSessao, type Motor } from "@/componentes/licao/motor";
import { Resultado } from "@/componentes/licao/Resultado";
import { liberarSom, tocar } from "@/componentes/licao/som";
import { Mascote } from "@/componentes/Mascote";
import type { ErroApi, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { CartaoConceito as Cartao, ExercicioPublico } from "@/modulos/conteudo/esquema";
import { CartaoConceito } from "./CartaoConceito";

type Fase = "respondendo" | "verificando" | "feedback" | "concluindo" | "concluida" | "sem_coracoes";

type Props = {
  sessaoId: string;
  tipo: ResultadoConclusao["tipo"];
  titulo: string;
  inicial: { exercicio: ExercicioPublico | null; resolvidos: number; total: number };
  /** Saldo do aluno, mostrado só na sessão principal, a única que usa corações; null nas demais. */
  coracoesIniciais: number | null;
  /** Sessão principal sem corações para continuar: abre na tela Sem corações. */
  semCoracoes: boolean;
  somInicial: boolean;
  /** Demonstração anônima: o motor é local e o resultado mostra o XP como provisório (FL-01). */
  demo?: boolean;
  /** Motor criado no navegador; sem ele, a lição usa a API da sessão. */
  criarMotor?: () => Motor;
  /**
   * Desafio do dia: uma tentativa por pergunta (o erro não volta no fim), o cartão do conceito conta como ajuda
   * e o fim mostra a tela própria do desafio, desenhada por `telaFinal`.
   */
  desafio?: { telaFinal: () => ReactNode };
};

/** Cartões abertos sozinhos: os de conceito novo, uma única vez por exercício nesta tela. */
type CartaoAberto = { lista: Cartao[]; indice: number };
const cartaoNovo = (ex: ExercicioPublico | null): CartaoAberto | null => {
  const lista = ex?.cartoes?.filter((c) => c.novo) ?? [];
  return lista.length ? { lista, indice: 0 } : null;
};

const ROTULO_SESSAO: Record<ResultadoConclusao["tipo"], string> = { principal: "Lição", pratica: "Prática", revisao: "Revisão", recuperacao: "Recuperação" };

/** Faíscas do acerto, em volta do mascote; somem com movimento reduzido. */
const FAISCAS = Array.from({ length: 8 }, (_, i) => ({ "--angulo": `${i * 45}deg` }) as CSSProperties);

export function Licao({ sessaoId, tipo, titulo, inicial, coracoesIniciais, semCoracoes, somInicial, demo = false, criarMotor, desafio }: Props) {
  const router = useRouter();
  const chave = `sibi-resposta:${sessaoId}`;
  const [motor] = useState(() => (criarMotor ? criarMotor() : motorDaSessao(sessaoId)));

  const [exercicio, setExercicio] = useState(inicial.exercicio);
  const [cartaoAberto, setCartaoAberto] = useState<CartaoAberto | null>(() => cartaoNovo(inicial.exercicio));
  /** Exercícios cujo cartão novo já abriu sozinho; uma volta do exercício ao fim da fila não o abre de novo. */
  const cartaoVistoRef = useRef(new Set<string>(inicial.exercicio?.cartoes?.some((c) => c.novo) ? [inicial.exercicio.id] : []));
  const abrirCartaoSozinho = (ex: ExercicioPublico | null) => {
    if (!ex || cartaoVistoRef.current.has(ex.id)) return setCartaoAberto(null);
    const c = cartaoNovo(ex);
    if (c) cartaoVistoRef.current.add(ex.id);
    setCartaoAberto(c);
  };
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [fase, setFase] = useState<Fase>(semCoracoes ? "sem_coracoes" : inicial.exercicio ? "respondendo" : "concluindo");
  const [coracoes, setCoracoes] = useState(coracoesIniciais);
  const [progresso, setProgresso] = useState({ resolvidos: inicial.resolvidos, total: inicial.total });
  const [resultado, setResultado] = useState<ResultadoSubmissao | null>(null);
  const [conclusao, setConclusao] = useState<ResultadoConclusao | null>(null);
  const [dicas, setDicas] = useState<string[]>([]);
  const [falha, setFalha] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [som, setSom] = useState(somInicial);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [anuncio, setAnuncio] = useState("");
  /** Respostas certas seguidas nesta tela e quantos feedbacks já apareceram, para variar as frases. */
  const [seguidas, setSeguidas] = useState(0);
  const [vez, setVez] = useState(0);

  const enunciadoRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  // Lido dentro de callbacks assíncronos, que precisam do valor mais recente.
  const somRef = useRef(som);
  useEffect(() => {
    somRef.current = som;
  }, [som]);
  // O áudio só pode começar dentro de um toque ou tecla: cada gesto na lição o deixa liberado (som.ts).
  useEffect(() => {
    const liberar = () => {
      if (somRef.current) liberarSom();
    };
    document.addEventListener("pointerdown", liberar, true);
    document.addEventListener("keydown", liberar, true);
    return () => {
      document.removeEventListener("pointerdown", liberar, true);
      document.removeEventListener("keydown", liberar, true);
    };
  }, []);
  const seguidasRef = useRef(0);
  /**
   * Id do envio do exercício mostrado, até o aluno tocar Continuar. Tentar novamente o reusa mesmo que a
   * resposta tenha mudado: se o primeiro envio chegou ao servidor, vale o resultado gravado (FL-04, passo 2).
   */
  const envioRef = useRef<string | null>(null);
  /**
   * Tempo até o envio: conta só enquanto o exercício está à vista. Pausa com o cartão do conceito aberto (no
   * começo ou reaberto no meio) e continua quando ele fecha. Vale o do primeiro envio; Tentar novamente leva o
   * mesmo valor (FL-04).
   */
  const cronometroRef = useRef<Cronometro>(CRONOMETRO_VAZIO);
  const tempoEnvioRef = useRef<number | undefined>(undefined);
  useEffect(() => {
    cronometroRef.current = atualizarCronometro(cronometroRef.current, exercicio?.id ?? null, cartaoAberto !== null, performance.now());
  }, [exercicio?.id, cartaoAberto]);
  const tempoAteAgora = () => tempoDoCronometro(cronometroRef.current, performance.now());

  const tratarErro = useCallback(
    (erro: ErroApi | null, aoFalhar: () => void) => {
      if (erro?.erro === "nao_autenticado") return router.push(`/entrar?voltar=${encodeURIComponent(`/sessao/${sessaoId}`)}`);
      if (erro?.erro === "sessao_inexistente") {
        guardar(chave, null);
        return router.replace("/aprender");
      }
      // Corações acabaram nesta ou em outra lição: a resposta não foi gravada (FL-06).
      if (erro?.erro === "sem_coracoes") {
        guardar(chave, null);
        envioRef.current = null;
        setCoracoes(0);
        return setFase("sem_coracoes");
      }
      aoFalhar();
      // Limite de frequência da demonstração: a mensagem do servidor explica quanto esperar.
      if (erro?.erro === "limite") setFalha(erro.mensagem);
    },
    [router, sessaoId, chave],
  );

  const concluirLicao = useCallback(async () => {
    setFase("concluindo");
    setFalha(null);
    const r = await motor.concluir();
    if (r.ok) {
      setConclusao(r.dados);
      setFase("concluida");
      if (somRef.current) tocar("conclusao");
      return;
    }
    tratarErro(r.erro, () => setFalha("Não foi possível registrar a conclusão. Seu progresso está salvo."));
  }, [motor, tratarErro]);

  /** Outra aba ou aparelho mudou a sessão: recarrega o estado do servidor (FL-04). */
  const recarregar = useCallback(async () => {
    const r = await motor.estado();
    if (!r.ok) return tratarErro(r.erro, () => setFalha("Sem conexão. Tente de novo em instantes."));
    guardar(chave, null);
    envioRef.current = null;
    setAviso("Atualizamos a lição com o que foi feito em outra aba ou aparelho.");
    setProgresso({ resolvidos: r.dados.resolvidos, total: r.dados.totalItens });
    setResultado(null);
    setResposta(null);
    setDicas([]);
    setExercicio(r.dados.exercicio);
    abrirCartaoSozinho(r.dados.exercicio);
    if (r.dados.exercicio) setFase("respondendo");
    else void concluirLicao();
  }, [motor, chave, tratarErro, concluirLicao]);

  const verificar = useCallback(
    async (envio: Envio) => {
      // Guardada antes do envio (FL-04, passo 1): uma recarga a reenvia com o mesmo id.
      guardar(chave, envio);
      envioRef.current = envio.envioId;
      setFase("verificando");
      setFalha(null);
      const r = await motor.submeter({ id: envio.envioId, exercicioId: envio.exercicio.id, resposta: envio.resposta, tempoMs: envio.tempoMs });
      if (!r.ok) {
        if (r.erro?.erro === "desatualizada" || r.erro?.erro === "invalida") return void recarregar();
        return tratarErro(r.erro, () => {
          // A resposta continua na tela com Tentar novamente (CA-50).
          setFase("respondendo");
          setFalha("Não foi possível verificar agora. Sua resposta foi guardada.");
        });
      }
      const res = r.dados;
      setExercicio(res.exercicio);
      setResposta(res.resposta);
      setResultado(res);
      setProgresso({ resolvidos: res.resolvidos, total: res.total });
      if (res.coracoes !== null) setCoracoes(res.coracoes);
      const agora = res.correta ? seguidasRef.current + 1 : 0;
      seguidasRef.current = agora;
      setSeguidas(agora);
      setVez((v) => v + 1);
      setFase("feedback");
      setAnuncio(res.correta ? `Resposta correta.${textoSeguidas(agora) ? ` ${textoSeguidas(agora)}` : ""}` : "Resposta incorreta.");
      if (somRef.current) tocar(res.correta ? "acerto" : "erro", agora);
    },
    [motor, chave, recarregar, tratarErro],
  );

  // Retomada depois de recarga (FL-04, passo 3): reenvia o envio guardado, cujo resultado o servidor devolve
  // se já o gravou, ou devolve o rascunho à tela. O armazenamento do navegador só existe depois da montagem.
  useEffect(() => {
    const r = retomar(lerGuardada(chave), inicial.exercicio);
    if (r.acao === "reenviar") {
      /* eslint-disable react-hooks/set-state-in-effect */
      setExercicio(r.envio.exercicio);
      setResposta(r.envio.resposta);
      setCartaoAberto(null);
      /* eslint-enable react-hooks/set-state-in-effect */
      void verificar(r.envio);
    } else if (r.acao === "rascunho") {
      setResposta(r.resposta);
      setCartaoAberto(null);
    } else {
      guardar(chave, null);
      if (!inicial.exercicio) void concluirLicao();
    }
    // Só na montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fase === "feedback") feedbackRef.current?.focus({ preventScroll: true });
    if (cartaoAberto) document.getElementById("titulo-cartao")?.focus({ preventScroll: true });
    else if (fase === "respondendo" && !falha) enunciadoRef.current?.focus({ preventScroll: true });
  }, [fase, exercicio, falha, cartaoAberto]);

  function continuar() {
    if (!resultado) return;
    guardar(chave, null);
    envioRef.current = null;
    if (resultado.concluida) return void concluirLicao();
    if (resultado.pausada) return setFase("sem_coracoes");
    setExercicio(resultado.proximo);
    abrirCartaoSozinho(resultado.proximo);
    setResposta(null);
    setResultado(null);
    setDicas([]);
    setAviso(null);
    setFase("respondendo");
  }

  /** Botão "Conceito": reabre os cartões do exercício. Na revisão e na prática, isso conta como dica na agenda. */
  function abrirCartao() {
    if (!exercicio?.cartoes?.length) return;
    setCartaoAberto({ lista: exercicio.cartoes, indice: 0 });
    if (desafio || (!demo && tipo !== "principal")) void motor.dica(exercicio.id, 0);
  }

  /** "Entenda melhor" aberto: só evento de produto, para medir se a explicação muda o acerto depois. */
  function abrirEntenda(conceitoId: string) {
    // Navegador controlado por automação (testes, robôs) não entra na métrica.
    if (!exercicio || navigator.webdriver) return;
    const contexto = desafio ? "desafio" : demo ? "demo" : tipo;
    const sessao = /^[0-9a-f-]{36}$/i.test(sessaoId) ? { sessaoId } : {};
    void chamar("/api/eventos/entenda", { conceitoId, exercicioId: exercicio.id, contexto, ...sessao });
  }

  function avancarCartao() {
    setCartaoAberto((c) => (c && c.indice + 1 < c.lista.length ? { ...c, indice: c.indice + 1 } : null));
  }

  async function pedirDica() {
    if (!exercicio) return;
    const r = await motor.dica(exercicio.id, dicas.length + 1);
    if (r.ok) setDicas((d) => [...d, r.dados.dica]);
    else if (r.erro?.erro === "desatualizada") void recarregar();
    else tratarErro(r.erro, () => setFalha("Não foi possível carregar a dica agora."));
  }

  /** Cada mudança fica guardada: uma recarga devolve o rascunho à tela (CA-53). */
  function mudarResposta(nova: Resposta | null) {
    setResposta(nova);
    if (!exercicio) return;
    if (nova) guardar(chave, { exercicio, resposta: nova, envioId: envioRef.current });
    // Sem resposta, um envio sem confirmação continua guardado com a resposta anterior.
    else if (!envioRef.current) guardar(chave, null);
  }

  function alternarSom() {
    const novo = !som;
    if (novo) liberarSom();
    setSom(novo);
    void motor.som(novo);
  }

  const podeVerificar = fase === "respondendo" && exercicio !== null && respostaCompleta(exercicio, resposta);

  function acaoPrincipal() {
    if (cartaoAberto) avancarCartao();
    else if (fase === "feedback") continuar();
    else if (podeVerificar && exercicio && resposta) {
      // Primeiro envio: mede o tempo agora. Tentar novamente reaproveita o tempo do primeiro.
      if (!envioRef.current) tempoEnvioRef.current = tempoAteAgora();
      void verificar({ exercicio, resposta, envioId: envioRef.current ?? crypto.randomUUID(), tempoMs: tempoEnvioRef.current });
    }
    else if (fase === "concluindo" && falha) void concluirLicao();
  }

  // Enter aciona Verificar ou Continuar quando o foco não está num controle (design/DESIGN.md).
  const aoTeclar = useEffectEvent((e: KeyboardEvent) => {
    if (e.key !== "Enter" || confirmarSaida) return;
    if ((e.target as HTMLElement).closest("button, a, input, textarea, select")) return;
    e.preventDefault();
    acaoPrincipal();
  });
  useEffect(() => {
    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, []);

  if (fase === "sem_coracoes") {
    return (
      <main className="tela-centro text-center" id="conteudo-principal">
        <Mascote humor="atencao" tamanho="grande" />
        <h1>Você ficou sem corações</h1>
        <p className="subtitulo">Seu progresso na lição está salvo. Faça uma revisão rápida de 5 exercícios para recuperar 2 corações.</p>
        <BotaoRecuperar />
        <div className="acoes">
          <Link className="botao botao-secundario" href="/aprender">
            Voltar à trilha
          </Link>
        </div>
      </main>
    );
  }

  if (fase === "concluida" && conclusao) {
    if (desafio) return desafio.telaFinal();
    return <Resultado conclusao={conclusao} titulo={titulo} demo={demo} som={som} />;
  }

  const percentual = progresso.total ? Math.round((progresso.resolvidos / progresso.total) * 100) : 0;
  const totalDicas = exercicio?.totalDicas ?? 0;
  const bloqueado = fase !== "respondendo";

  return (
    <div className="licao">
      <header className="licao-topo">
        <button type="button" className="botao-icone" aria-label="Sair da lição" onClick={() => setConfirmarSaida(true)}>
          <Icone nome="x" />
        </button>
        <div className="barra-progresso" role="progressbar" aria-label="Progresso da lição" aria-valuemin={0} aria-valuemax={progresso.total} aria-valuenow={progresso.resolvidos}>
          <span style={{ width: `${percentual}%` }}>{progresso.resolvidos > 0 && <i key={progresso.resolvidos} className="brilho" aria-hidden="true" />}</span>
        </div>
        <button type="button" className="botao-icone" aria-label={som ? "Desligar som" : "Ligar som"} aria-pressed={som} onClick={alternarSom}>
          <Icone nome={som ? "som" : "semSom"} />
        </button>
        {coracoes !== null && (
          <span className="indicador indicador-coracoes">
            <Icone nome="coracao" />
            <span>{coracoes}</span>
            <span className="so-leitor">corações</span>
          </span>
        )}
      </header>

      <main className="licao-corpo" id="conteudo-principal">
        {aviso && <p className="mensagem-aviso mb-4">{aviso}</p>}
        {exercicio && cartaoAberto && <CartaoConceito key={`${exercicio.id}:${cartaoAberto.indice}`} cartao={cartaoAberto.lista[cartaoAberto.indice]} posicao={cartaoAberto.indice + 1} total={cartaoAberto.lista.length} aoAbrirEntenda={abrirEntenda} />}
        {exercicio ? (
          <div hidden={cartaoAberto !== null}>
            <p className="etiqueta-tipo">
              {(demo || tipo !== "principal") && <span className="selo-sessao">{desafio ? "Desafio do dia" : demo ? "Demonstração" : ROTULO_SESSAO[tipo]}</span>}
              {/* Espaço só para o texto lido (leitor de tela, cópia): na tela, o gap do flex já separa. */}
              {(demo || tipo !== "principal") && " "}
              {NOME_TIPO[exercicio.tipo]}
            </p>
            <h1 id="enunciado" ref={enunciadoRef} tabIndex={-1}>
              {exercicio.enunciado}
            </h1>
            <AreaExercicio
              ex={exercicio}
              resposta={resposta}
              aoMudar={mudarResposta}
              anunciar={setAnuncio}
              bloqueado={bloqueado}
              correcao={fase === "feedback" && resultado ? { correta: resultado.correta, solucao: resultado.solucao } : null}
              aoEnviar={acaoPrincipal}
            />
            {dicas.length > 0 && (
              <div className="dicas" aria-live="polite">
                {dicas.map((d, i) => (
                  <div key={i} className="dica">
                    <Icone nome="lampada" />
                    <span>
                      <strong>Dica {i + 1}:</strong> {d}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="carregando" aria-busy="true">
            <h1 className="so-leitor">Concluindo a lição</h1>
            <div className="esqueleto h-7 w-4/5" />
            <div className="esqueleto h-24" />
          </div>
        )}
      </main>

      {fase === "feedback" && resultado && exercicio ? (
        <div className={`rodape-licao ${resultado.correta ? "acerto" : "erro"}`}>
          <div className="rodape-conteudo surgir">
            <div className="feedback">
              <div className="feedback-cabeca">
                <div className="feedback-mascote" aria-hidden="true">
                  <Mascote humor={resultado.correta ? "comemoracao" : "incentivo"} tamanho="mini" soCabeca />
                  <span className="selo selo-canto">
                    <Icone nome={resultado.correta ? "check" : "x"} pequeno />
                  </span>
                  {resultado.correta && (
                    <span className="faiscas">
                      {FAISCAS.map((estilo, i) => (
                        <i key={i} style={estilo} />
                      ))}
                    </span>
                  )}
                </div>
                <div>
                  <p className="feedback-titulo" ref={feedbackRef} tabIndex={-1}>
                    {tituloDoFeedback(resultado.correta, vez - 1)}
                  </p>
                  {resultado.correta && textoSeguidas(seguidas) && (
                    <p className="selo-seguidas">
                      <Icone nome="chama" pequeno /> {textoSeguidas(seguidas)}
                    </p>
                  )}
                </div>
              </div>
              {!resultado.correta && resultado.feedbackOpcao && (
                <p className="feedback-texto">
                  <strong>{resultado.feedbackOpcao}</strong>
                </p>
              )}
              {!resultado.correta && (
                <div className="feedback-resposta">
                  <p className="rotulo-bloco">Resposta correta</p>
                  <RespostaCorreta ex={exercicio} solucao={resultado.solucao} />
                </div>
              )}
              <p className="feedback-texto">{resultado.explicacao}</p>
              {!resultado.correta && !desafio && <p className="retorno-neutro">Este exercício volta no fim da lição.</p>}
              {resultado.perdeuCoracao && (
                <p className="retorno-aviso">
                  <Icone nome="coracao" pequeno /> Você perdeu um coração. {resultado.coracoes === 0 ? "Seus corações acabaram." : `Restam ${resultado.coracoes}.`}
                </p>
              )}
            </div>
            <button type="button" className="botao" onClick={continuar}>
              Continuar
            </button>
          </div>
        </div>
      ) : (
        <div className="rodape-licao">
          <div className="rodape-conteudo">
            {falha && (
              <p className="erro-envio" role="alert">
                <Icone nome="semRede" /> {falha}
              </p>
            )}
            {cartaoAberto ? (
              <button type="button" className="botao" onClick={avancarCartao}>
                {cartaoAberto.indice + 1 < cartaoAberto.lista.length ? "Próximo conceito" : "Entendi"}
              </button>
            ) : fase === "concluindo" ? (
              <button type="button" className="botao" disabled={!falha} onClick={() => void concluirLicao()}>
                {falha ? "Tentar novamente" : "Concluindo…"}
              </button>
            ) : (
              <>
                <div className="rodape-acoes">
                  <button type="button" className="botao botao-secundario botao-dica" disabled={bloqueado || dicas.length >= totalDicas} onClick={() => void pedirDica()}>
                    <Icone nome="lampada" /> Dica{totalDicas - dicas.length > 0 ? ` (${totalDicas - dicas.length})` : ""}
                  </button>
                  {exercicio?.cartoes?.length ? (
                    <button type="button" className="botao botao-secundario botao-dica" disabled={bloqueado} onClick={abrirCartao}>
                      <Icone nome="livro" /> Conceito
                    </button>
                  ) : null}
                </div>
                <button type="button" className="botao" disabled={!podeVerificar} onClick={acaoPrincipal}>
                  {fase === "verificando" ? "Verificando…" : falha ? "Tentar novamente" : "Verificar"}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {confirmarSaida && (
        <div className="fundo-modal" onClick={() => setConfirmarSaida(false)}>
          <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-saida" onClick={(e) => e.stopPropagation()}>
            <h2 id="titulo-saida">Sair da lição?</h2>
            <p>Seu progresso nesta lição fica salvo. Você pode continuar depois, de onde parou.</p>
            <button type="button" className="botao" autoFocus onClick={() => setConfirmarSaida(false)}>
              Continuar estudando
            </button>
            <Link className="botao botao-secundario" href={demo ? "/" : "/aprender"}>
              Sair
            </Link>
          </div>
        </div>
      )}

      <div className="so-leitor" aria-live="polite">
        {anuncio}
      </div>
    </div>
  );
}
