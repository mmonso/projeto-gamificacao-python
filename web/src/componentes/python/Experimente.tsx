"use client";
// "Experimente" (design/MELHORIAS_UX.md, E): o aluno muda o código e roda Python de verdade, no próprio aparelho,
// dentro da caixa isolada. Erros aparecem em português; input() pergunta na tela e roda de novo com a resposta.
import { useRef, useState } from "react";
import { Icone } from "@/componentes/Icone";
import { avisoDeRecursos, endireitarAspas, traduzirErroPython } from "@/modulos/python/erros";
import { rodarPython, type ResultadoPython } from "./caixa";

const SIMBOLOS = ["(", ")", '"', ":", "=", "+", ",", "[", "]", "#"];

type Props = {
  codigoInicial: string;
  /** Unidade em que o aluno está, para o aviso de recursos que ainda não apareceram no curso. */
  unidade?: number;
  /** Começa aberto (laboratório) em vez de mostrar só o botão. */
  aberto?: boolean;
  rotulo?: string;
};

export function Experimente({ codigoInicial, unidade, aberto = false, rotulo = "Experimente: mude o código e rode" }: Props) {
  const [ativo, setAtivo] = useState(aberto);
  const [codigo, setCodigo] = useState(codigoInicial);
  const [estado, setEstado] = useState<"parado" | "carregando" | "rodando">("parado");
  const [resultado, setResultado] = useState<ResultadoPython | null>(null);
  const [entradas, setEntradas] = useState<string[]>([]);
  const [resposta, setResposta] = useState("");
  const [falha, setFalha] = useState<string | null>(null);
  const campo = useRef<HTMLTextAreaElement>(null);

  async function rodar(comEntradas: string[]) {
    setFalha(null);
    setEstado((e) => (e === "parado" && !resultado ? "carregando" : "rodando"));
    try {
      const limpo = endireitarAspas(codigo);
      if (limpo !== codigo) setCodigo(limpo);
      const r = await rodarPython(limpo, comEntradas);
      setEntradas(comEntradas);
      setResultado(r);
    } catch {
      setFalha("Não foi possível carregar o Python. Confira a conexão e tente de novo.");
    } finally {
      setEstado("parado");
    }
  }

  function inserir(texto: string) {
    const el = campo.current;
    if (!el) return setCodigo((c) => c + texto);
    const { selectionStart: i, selectionEnd: f } = el;
    const novo = codigo.slice(0, i) + texto + codigo.slice(f);
    setCodigo(novo);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(i + texto.length, i + texto.length);
    });
  }

  if (!ativo) {
    return (
      <button type="button" className="botao botao-secundario experimente-abrir" onClick={() => setAtivo(true)}>
        <Icone nome="raio" /> {rotulo}
      </button>
    );
  }

  const linhas = Math.min(14, Math.max(3, codigo.split("\n").length + 1));
  const erro = resultado?.erro ? traduzirErroPython(resultado.erro) : null;
  const aviso = resultado ? avisoDeRecursos(resultado.recursos ?? [], unidade) : null;
  const ocupado = estado !== "parado";

  return (
    <section className="experimente" aria-label="Experimente o código">
      <p className="experimente-titulo">
        <Icone nome="raio" /> Python de verdade, aqui mesmo
      </p>
      <textarea
        ref={campo}
        className="experimente-codigo"
        value={codigo}
        rows={linhas}
        onChange={(e) => setCodigo(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            inserir("    ");
          } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            void rodar([]);
          }
        }}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        aria-label="Código em Python"
      />
      <div className="experimente-simbolos" aria-label="Símbolos">
        {SIMBOLOS.map((s) => (
          <button key={s} type="button" onClick={() => inserir(s)} aria-label={`Inserir ${s}`}>
            {s}
          </button>
        ))}
        <button type="button" onClick={() => inserir("    ")} aria-label="Inserir recuo de 4 espaços">
          ⇥
        </button>
      </div>
      <div className="experimente-acoes">
        <button type="button" className="botao botao-pequeno" disabled={ocupado} onClick={() => void rodar([])}>
          {estado === "carregando" ? "Preparando o Python…" : estado === "rodando" ? "Rodando…" : "▶ Rodar"}
        </button>
        <button
          type="button"
          className="botao botao-fantasma botao-pequeno"
          disabled={ocupado || codigo === codigoInicial}
          onClick={() => {
            setCodigo(codigoInicial);
            setResultado(null);
          }}
        >
          Voltar ao exemplo
        </button>
      </div>
      {estado === "carregando" && <p className="ajuda">Na primeira vez o Python é baixado para o aparelho (uns segundos). Depois fica guardado.</p>}
      {falha && (
        <p className="mensagem-erro" role="alert">
          {falha}
        </p>
      )}
      {resultado && (
        <div className="experimente-resultado" aria-live="polite">
          {(resultado.saida || !resultado.erro) && (
            <>
              <p className="rotulo-bloco">Na tela</p>
              <pre className="saida experimente-saida">{resultado.saida || (resultado.pedeEntrada !== undefined ? "" : "(nada apareceu: o programa não tem print)")}</pre>
            </>
          )}
          {resultado.pedeEntrada !== undefined && (
            <form
              className="experimente-entrada"
              onSubmit={(e) => {
                e.preventDefault();
                const valor = resposta;
                setResposta("");
                void rodar([...entradas, valor]);
              }}
            >
              <label htmlFor="experimente-resposta">O programa está perguntando{resultado.pedeEntrada ? `: ${resultado.pedeEntrada}` : "."}</label>
              <div className="experimente-entrada-linha">
                <input id="experimente-resposta" value={resposta} onChange={(e) => setResposta(e.target.value)} autoFocus autoCapitalize="off" autoCorrect="off" />
                <button type="submit" className="botao botao-pequeno" disabled={ocupado}>
                  Responder
                </button>
              </div>
            </form>
          )}
          {erro && resultado.erro && (
            <div className="experimente-erro" role="alert">
              <p className="experimente-erro-titulo">
                <Icone nome="alerta" /> {erro.titulo}
              </p>
              <p>{erro.explicacao}</p>
              {resultado.erro.mensagem && (
                <details>
                  <summary>Ver a mensagem original</summary>
                  <code>
                    {resultado.erro.tipo}: {resultado.erro.mensagem}
                  </code>
                </details>
              )}
            </div>
          )}
          {aviso && <p className="experimente-aviso">{aviso}</p>}
        </div>
      )}
    </section>
  );
}
