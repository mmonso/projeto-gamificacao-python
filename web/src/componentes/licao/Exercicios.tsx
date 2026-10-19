"use client";
// Os quatro tipos de exercício (F-10 a F-13), montados por toque ou teclado, sem arrastar (F-34).
import type { Solucao } from "@/modulos/aprendizagem/contrato";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { BlocoCodigo, BlocoSaida, realcar } from "./Codigo";

export const NOME_TIPO: Record<ExercicioPublico["tipo"], string> = {
  escolher_resultado: "Escolha o resultado",
  completar_lacuna: "Complete o código",
  ordenar_blocos: "Monte o programa",
  localizar_erro: "Encontre o erro",
};

export function respostaCompleta(ex: ExercicioPublico, r: Resposta | null): r is Resposta {
  if (!r || r.tipo !== ex.tipo) return false;
  if (r.tipo === "completar_lacuna" && ex.tipo === "completar_lacuna") return ex.lacunas.every((l) => r.lacunas[l.id] !== undefined);
  if (r.tipo === "ordenar_blocos") return r.blocos.length > 0;
  return true;
}

type Props = {
  ex: ExercicioPublico;
  resposta: Resposta | null;
  aoMudar: (r: Resposta | null) => void;
  anunciar: (texto: string) => void;
  bloqueado: boolean;
};

const LETRAS = "ABCD";

export function AreaExercicio({ ex, resposta, aoMudar, anunciar, bloqueado }: Props) {
  switch (ex.tipo) {
    case "escolher_resultado": {
      const escolhida = resposta?.tipo === ex.tipo ? resposta.opcao : null;
      return (
        <>
          {ex.codigo && <BlocoCodigo codigo={ex.codigo} />}
          {ex.opcoesSao === "codigo" && ex.saidaEsperada && <BlocoSaida texto={ex.saidaEsperada} />}
          <div className="opcoes" role="group" aria-label="Opções">
            {ex.opcoes.map((o, i) => (
              <button
                key={o.id}
                type="button"
                className="opcao"
                aria-pressed={escolhida === o.id}
                disabled={bloqueado}
                onClick={() => aoMudar({ tipo: ex.tipo, opcao: o.id })}
              >
                <span className="opcao-letra" aria-hidden="true">
                  {LETRAS[i]}
                </span>
                {o.erro ? (
                  <span className="opcao-texto">O programa mostra um erro</span>
                ) : ex.opcoesSao === "codigo" ? (
                  <span className="codigo bloco-pre">{realcar(o.texto ?? "")}</span>
                ) : ex.opcoesSao === "saida" ? (
                  <span className="saida bloco-pre">{o.texto}</span>
                ) : (
                  <span className="opcao-texto">{o.texto}</span>
                )}
              </button>
            ))}
          </div>
        </>
      );
    }

    case "completar_lacuna": {
      const preenchidas = resposta?.tipo === ex.tipo ? resposta.lacunas : {};
      return (
        <>
          <pre className="codigo">
            {(ex.codigo ?? "").split(/(___\d___)/).map((parte, i) => {
              const marcador = parte.match(/^___(\d)___$/);
              if (!marcador) return <span key={i}>{realcar(parte)}</span>;
              const valor = preenchidas[marcador[1]];
              return (
                <span key={i} className={`lacuna ${valor ? "preenchida" : ""}`}>
                  {valor ?? ` ${marcador[1]} `}
                </span>
              );
            })}
          </pre>
          {ex.saidaEsperada && <BlocoSaida texto={ex.saidaEsperada} />}
          {ex.lacunas.map((l) => (
            <div key={l.id} className="grupo-lacuna" role="group" aria-label={`Opções para a lacuna ${l.id}`}>
              <p className="rotulo-bloco">{ex.lacunas.length > 1 ? `Lacuna ${l.id}` : "Escolha o que falta"}</p>
              <div className="fichas">
                {l.opcoes.map((o) => (
                  <button
                    key={o}
                    type="button"
                    className="ficha"
                    aria-pressed={preenchidas[l.id] === o}
                    disabled={bloqueado}
                    onClick={() => aoMudar({ tipo: ex.tipo, lacunas: { ...preenchidas, [l.id]: o } })}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      );
    }

    case "ordenar_blocos": {
      const escolhidos = resposta?.tipo === ex.tipo ? resposta.blocos : [];
      const codigoDe = (id: string) => ex.blocos.find((b) => b.id === id)?.codigo ?? "";
      return (
        <>
          {ex.saidaEsperada && <BlocoSaida texto={ex.saidaEsperada} />}
          <p className="rotulo-bloco" id="rotulo-montagem">
            Seu programa
          </p>
          <div className="area-montagem" aria-labelledby="rotulo-montagem">
            {ex.codigoAntes && <div className="linhas-fixas">{ex.codigoAntes}</div>}
            {escolhidos.length ? (
              escolhidos.map((id, i) => (
                <button
                  key={id}
                  type="button"
                  className="bloco escolhido"
                  aria-label={`Linha ${i + 1}: ${codigoDe(id)}. Remover`}
                  disabled={bloqueado}
                  onClick={() => {
                    const resto = escolhidos.filter((b) => b !== id);
                    aoMudar(resto.length ? { tipo: ex.tipo, blocos: resto } : null);
                    anunciar("Bloco removido");
                  }}
                >
                  <span className="numero" aria-hidden="true">
                    {i + 1}
                  </span>
                  {realcar(codigoDe(id))}
                </button>
              ))
            ) : (
              <p className="vazio">Toque ou pressione Enter nos blocos abaixo, na ordem certa.</p>
            )}
            {ex.codigoDepois && <div className="linhas-fixas">{ex.codigoDepois}</div>}
          </div>
          <p className="rotulo-bloco">Blocos disponíveis</p>
          <div className="banco">
            {ex.blocos
              .filter((b) => !escolhidos.includes(b.id))
              .map((b) => (
                <button
                  key={b.id}
                  type="button"
                  className="bloco"
                  aria-label={`Adicionar: ${b.codigo}`}
                  disabled={bloqueado}
                  onClick={() => {
                    aoMudar({ tipo: ex.tipo, blocos: [...escolhidos, b.id] });
                    anunciar(`Adicionado na linha ${escolhidos.length + 1}: ${b.codigo}`);
                  }}
                >
                  {realcar(b.codigo)}
                </button>
              ))}
          </div>
        </>
      );
    }

    case "localizar_erro": {
      const linha = resposta?.tipo === ex.tipo ? resposta.linha : null;
      return (
        <>
          {ex.saidaEsperada && <BlocoSaida texto={ex.saidaEsperada} />}
          <div className="linhas-codigo" role="group" aria-label="Linhas do programa">
            {(ex.codigo ?? "").split("\n").map((texto, i) => (
              <button
                key={i}
                type="button"
                className="linha-codigo"
                aria-pressed={linha === i + 1}
                aria-label={`Linha ${i + 1}: ${texto}`}
                disabled={bloqueado}
                onClick={() => aoMudar({ tipo: ex.tipo, linha: i + 1 })}
              >
                <span className="numero" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{realcar(texto)}</span>
              </button>
            ))}
          </div>
        </>
      );
    }
  }
}

/** Resposta correta mostrada no feedback de erro (F-14). */
export function RespostaCorreta({ ex, solucao }: { ex: ExercicioPublico; solucao: Solucao }) {
  if (ex.tipo === "escolher_resultado" && solucao.tipo === ex.tipo) {
    const o = ex.opcoes.find((x) => x.id === solucao.opcao);
    if (!o || o.erro) return <p>O programa mostra um erro.</p>;
    return ex.opcoesSao === "codigo" ? <BlocoCodigo codigo={o.texto ?? ""} /> : <pre className="saida">{o.texto}</pre>;
  }
  if (ex.tipo === "completar_lacuna" && solucao.tipo === ex.tipo) {
    return <BlocoCodigo codigo={(ex.codigo ?? "").replace(/___(\d)___/g, (_, id: string) => solucao.lacunas[id] ?? "")} />;
  }
  if (ex.tipo === "ordenar_blocos" && solucao.tipo === ex.tipo) {
    const linhas = solucao.blocos.map((id) => ex.blocos.find((b) => b.id === id)?.codigo ?? "");
    return <BlocoCodigo codigo={[ex.codigoAntes, ...linhas, ex.codigoDepois].filter(Boolean).join("\n")} />;
  }
  if (solucao.tipo === "localizar_erro") {
    return (
      <>
        <p>Linha {solucao.linha}. Correção:</p>
        <BlocoCodigo codigo={solucao.correcao} />
      </>
    );
  }
  return null;
}
