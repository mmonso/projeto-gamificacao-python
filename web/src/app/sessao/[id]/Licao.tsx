"use client";
// Lição em andamento (FL-03, FL-04; estados da seção 3.1 da especificação).
// O servidor corrige e decide; a interface só mostra o que ele confirmou.
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useEffectEvent, useRef, useState } from "react";
import { Icone } from "@/componentes/Icone";
import { AreaExercicio, NOME_TIPO, RespostaCorreta, respostaCompleta } from "@/componentes/licao/Exercicios";
import { guardar, lerGuardada, retomar, type Envio } from "@/componentes/licao/guardada";
import { tocar } from "@/componentes/licao/som";
import { Mascote } from "@/componentes/Mascote";
import type { ErroApi, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";

type Fase = "respondendo" | "verificando" | "feedback" | "concluindo" | "concluida";

type Props = {
  sessaoId: string;
  titulo: string;
  inicial: { exercicio: ExercicioPublico | null; resolvidos: number; total: number };
  somInicial: boolean;
};

const TITULOS_ACERTO = ["Muito bem!", "Isso mesmo!", "Correto!"];

type Chamada<T> = { ok: true; dados: T } | { ok: false; erro: ErroApi | null };

async function chamar<T>(url: string, corpo?: unknown): Promise<Chamada<T>> {
  try {
    const r = await fetch(url, corpo === undefined ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
    const dados = await r.json();
    return r.ok ? { ok: true, dados } : { ok: false, erro: dados as ErroApi };
  } catch {
    return { ok: false, erro: null };
  }
}

export function Licao({ sessaoId, titulo, inicial, somInicial }: Props) {
  const router = useRouter();
  const chave = `sibi-resposta:${sessaoId}`;
  const api = `/api/sessoes/${sessaoId}`;

  const [exercicio, setExercicio] = useState(inicial.exercicio);
  const [resposta, setResposta] = useState<Resposta | null>(null);
  const [fase, setFase] = useState<Fase>(inicial.exercicio ? "respondendo" : "concluindo");
  const [progresso, setProgresso] = useState({ resolvidos: inicial.resolvidos, total: inicial.total });
  const [resultado, setResultado] = useState<ResultadoSubmissao | null>(null);
  const [conclusao, setConclusao] = useState<ResultadoConclusao | null>(null);
  const [dicas, setDicas] = useState<string[]>([]);
  const [falha, setFalha] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [som, setSom] = useState(somInicial);
  const [confirmarSaida, setConfirmarSaida] = useState(false);
  const [anuncio, setAnuncio] = useState("");

  const enunciadoRef = useRef<HTMLHeadingElement>(null);
  const feedbackRef = useRef<HTMLParagraphElement>(null);
  // Lido dentro de callbacks assíncronos, que precisam do valor mais recente.
  const somRef = useRef(som);
  useEffect(() => {
    somRef.current = som;
  }, [som]);
  /**
   * Id do envio do exercício mostrado, até o aluno tocar Continuar. Tentar novamente o reusa mesmo que a
   * resposta tenha mudado: se o primeiro envio chegou ao servidor, vale o resultado gravado (FL-04, passo 2).
   */
  const envioRef = useRef<string | null>(null);

  const tratarErro = useCallback(
    (erro: ErroApi | null, aoFalhar: () => void) => {
      if (erro?.erro === "nao_autenticado") return router.push(`/entrar?voltar=${encodeURIComponent(`/sessao/${sessaoId}`)}`);
      if (erro?.erro === "sessao_inexistente") {
        guardar(chave, null);
        return router.replace("/aprender");
      }
      aoFalhar();
    },
    [router, sessaoId, chave],
  );

  const concluirLicao = useCallback(async () => {
    setFase("concluindo");
    setFalha(null);
    const r = await chamar<ResultadoConclusao>(`${api}/conclusao`, {});
    if (r.ok) {
      setConclusao(r.dados);
      setFase("concluida");
      if (somRef.current) tocar("conclusao");
      return;
    }
    tratarErro(r.erro, () => setFalha("Não foi possível registrar a conclusão. Seu progresso está salvo."));
  }, [api, tratarErro]);

  /** Outra aba ou aparelho mudou a sessão: recarrega o estado do servidor (FL-04). */
  const recarregar = useCallback(async () => {
    const r = await chamar<{ exercicio: ExercicioPublico | null; resolvidos: number; totalItens: number }>(api);
    if (!r.ok) return tratarErro(r.erro, () => setFalha("Sem conexão. Tente de novo em instantes."));
    guardar(chave, null);
    envioRef.current = null;
    setAviso("Atualizamos a lição com o que foi feito em outra aba ou aparelho.");
    setProgresso({ resolvidos: r.dados.resolvidos, total: r.dados.totalItens });
    setResultado(null);
    setResposta(null);
    setDicas([]);
    setExercicio(r.dados.exercicio);
    if (r.dados.exercicio) setFase("respondendo");
    else void concluirLicao();
  }, [api, chave, tratarErro, concluirLicao]);

  const verificar = useCallback(
    async (envio: Envio) => {
      // Guardada antes do envio (FL-04, passo 1): uma recarga a reenvia com o mesmo id.
      guardar(chave, envio);
      envioRef.current = envio.envioId;
      setFase("verificando");
      setFalha(null);
      const r = await chamar<ResultadoSubmissao>(`${api}/submissoes`, { id: envio.envioId, exercicioId: envio.exercicio.id, resposta: envio.resposta });
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
      setFase("feedback");
      setAnuncio(res.correta ? "Resposta correta." : "Resposta incorreta.");
      if (somRef.current) tocar(res.correta ? "acerto" : "erro");
    },
    [api, chave, recarregar, tratarErro],
  );

  // Retomada depois de recarga (FL-04, passo 3): reenvia o envio guardado, cujo resultado o servidor devolve
  // se já o gravou, ou devolve o rascunho à tela. O armazenamento do navegador só existe depois da montagem.
  useEffect(() => {
    const r = retomar(lerGuardada(chave), inicial.exercicio);
    if (r.acao === "reenviar") {
      /* eslint-disable react-hooks/set-state-in-effect */
      setExercicio(r.envio.exercicio);
      setResposta(r.envio.resposta);
      /* eslint-enable react-hooks/set-state-in-effect */
      void verificar(r.envio);
    } else if (r.acao === "rascunho") {
      setResposta(r.resposta);
    } else {
      guardar(chave, null);
      if (!inicial.exercicio) void concluirLicao();
    }
    // Só na montagem.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (fase === "feedback") feedbackRef.current?.focus({ preventScroll: true });
    if (fase === "respondendo" && !falha) enunciadoRef.current?.focus({ preventScroll: true });
  }, [fase, exercicio, falha]);

  function continuar() {
    if (!resultado) return;
    guardar(chave, null);
    envioRef.current = null;
    if (resultado.concluida) return void concluirLicao();
    setExercicio(resultado.proximo);
    setResposta(null);
    setResultado(null);
    setDicas([]);
    setAviso(null);
    setFase("respondendo");
  }

  async function pedirDica() {
    if (!exercicio) return;
    const r = await chamar<{ dica: string }>(`${api}/dicas`, { exercicioId: exercicio.id, numero: dicas.length + 1 });
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
    setSom(novo);
    void chamar(`/api/perfil/som`, { som: novo });
  }

  const podeVerificar = fase === "respondendo" && exercicio !== null && respostaCompleta(exercicio, resposta);

  function acaoPrincipal() {
    if (fase === "feedback") continuar();
    else if (podeVerificar && exercicio && resposta) void verificar({ exercicio, resposta, envioId: envioRef.current ?? crypto.randomUUID() });
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

  if (fase === "concluida" && conclusao) {
    return (
      <main className="tela-centro text-center" id="conteudo-principal">
        <Mascote humor="comemoracao" tamanho="grande" />
        <h1>Lição concluída!</h1>
        <p className="subtitulo">{titulo}</p>
        <div className="estatisticas">
          <div className="estatistica acertos">
            <p className="topo">Acertos de primeira</p>
            <p className="valor">
              {conclusao.acertosPrimeira} de {conclusao.total}
            </p>
          </div>
        </div>
        {conclusao.primeiraConclusao && conclusao.proximaLicaoId && <p className="mensagem-aviso">A próxima lição foi liberada.</p>}
        <div className="acoes">
          <Link className="botao" href="/aprender">
            Continuar
          </Link>
        </div>
      </main>
    );
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
          <span style={{ width: `${percentual}%` }} />
        </div>
        <button type="button" className="botao-icone" aria-label={som ? "Desligar som" : "Ligar som"} aria-pressed={som} onClick={alternarSom}>
          <Icone nome={som ? "som" : "semSom"} />
        </button>
      </header>

      <main className="licao-corpo" id="conteudo-principal">
        {aviso && <p className="mensagem-aviso mb-4">{aviso}</p>}
        {exercicio ? (
          <>
            <p className="etiqueta-tipo">
              {titulo} · {NOME_TIPO[exercicio.tipo]}
            </p>
            <h1 id="enunciado" ref={enunciadoRef} tabIndex={-1}>
              {exercicio.enunciado}
            </h1>
            <AreaExercicio ex={exercicio} resposta={resposta} aoMudar={mudarResposta} anunciar={setAnuncio} bloqueado={bloqueado} />
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
          </>
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
              <p className="feedback-titulo" ref={feedbackRef} tabIndex={-1}>
                <span className="selo">
                  <Icone nome={resultado.correta ? "check" : "x"} />
                </span>
                {resultado.correta ? TITULOS_ACERTO[resultado.resolvidos % TITULOS_ACERTO.length] : "Ainda não."}
              </p>
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
              {!resultado.correta && <p className="retorno-aviso">Este exercício volta no fim da lição.</p>}
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
            {fase === "concluindo" ? (
              <button type="button" className="botao" disabled={!falha} onClick={() => void concluirLicao()}>
                {falha ? "Tentar novamente" : "Concluindo…"}
              </button>
            ) : (
              <>
                <div className="rodape-acoes">
                  <button type="button" className="botao botao-secundario botao-dica" disabled={bloqueado || dicas.length >= totalDicas} onClick={() => void pedirDica()}>
                    <Icone nome="lampada" /> Dica{totalDicas - dicas.length > 0 ? ` (${totalDicas - dicas.length})` : ""}
                  </button>
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
            <Link className="botao botao-secundario" href="/aprender">
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
