// Trabalhador do Python do Sibi (design/MELHORIAS_UX.md, E). Roda dentro da caixa isolada (python/caixa.js),
// num Web Worker criado a partir de um blob: o Pyodide (CPython em WebAssembly) executa o código do aluno no
// próprio aparelho dele. Depois de carregar, a rede e as pontes para criar outros trabalhadores são removidas.
/* global loadPyodide */
"use strict";

let pyodide = null;

const PREPARO = String.raw`
import ast, builtins, io, json, sys, traceback

class _SaidaDemais(Exception):
    pass

class _PrecisaEntrada(Exception):
    def __init__(self, pergunta):
        self.pergunta = pergunta

_LIMITE = 20000

class _Saida(io.StringIO):
    def write(self, s):
        s = str(s)
        if self.tell() + len(s) > _LIMITE:
            super().write(s[: max(0, _LIMITE - self.tell())])
            raise _SaidaDemais()
        return super().write(s)

_PROIBIDOS = {"open", "__import__", "exec", "eval", "compile", "breakpoint", "help", "exit", "quit", "globals", "locals", "vars", "memoryview", "input"}
_BASE = {k: v for k, v in builtins.__dict__.items() if k not in _PROIBIDOS}
_RECURSOS = {"If", "For", "While", "FunctionDef", "Lambda", "ClassDef", "Try", "With", "ListComp", "Dict"}

def _sibi_rodar(codigo, entradas_json):
    entradas = list(json.loads(entradas_json))
    saida = _Saida()
    resultado = {"saida": "", "erro": None, "recursos": []}

    def entrada(pergunta=""):
        saida.write(pergunta)
        if not entradas:
            raise _PrecisaEntrada(str(pergunta))
        valor = str(entradas.pop(0))
        saida.write(valor + "\n")
        return valor

    antigo_out, antigo_err = sys.stdout, sys.stderr
    try:
        arvore = ast.parse(codigo, filename="<sibi>")
        nos = list(ast.walk(arvore))
        for no in nos:
            if isinstance(no, (ast.Import, ast.ImportFrom)):
                resultado["erro"] = {"tipo": "Importacao", "mensagem": "", "linha": no.lineno}
                return json.dumps(resultado)
        resultado["recursos"] = sorted({type(no).__name__ for no in nos} & _RECURSOS)
        objeto = compile(arvore, "<sibi>", "exec")
        globais = {"__name__": "__main__", "__builtins__": {**_BASE, "input": entrada}}
        sys.stdout = sys.stderr = saida
        try:
            exec(objeto, globais)
        finally:
            sys.stdout, sys.stderr = antigo_out, antigo_err
    except _PrecisaEntrada as e:
        resultado["pedeEntrada"] = e.pergunta
    except _SaidaDemais:
        resultado["erro"] = {"tipo": "SaidaLonga", "mensagem": "", "linha": None}
    except SyntaxError as e:
        resultado["erro"] = {"tipo": type(e).__name__, "mensagem": str(e.msg), "linha": e.lineno}
    except BaseException as e:
        linha = None
        for quadro in traceback.extract_tb(e.__traceback__):
            if quadro.filename == "<sibi>":
                linha = quadro.lineno
        ultima = traceback.format_exception_only(e)[-1].strip()
        mensagem = ultima.split(": ", 1)[1] if ": " in ultima else ""
        resultado["erro"] = {"tipo": type(e).__name__, "mensagem": mensagem, "linha": linha}
    finally:
        sys.stdout, sys.stderr = antigo_out, antigo_err
    resultado["saida"] = saida.getvalue()
    return json.dumps(resultado)
`;

/** Tira do trabalhador o acesso à rede e a outros trabalhadores: o código do aluno só calcula e escreve. */
function fecharPontes() {
  for (const nome of ["fetch", "XMLHttpRequest", "WebSocket", "WebSocketStream", "EventSource", "Worker", "SharedWorker", "importScripts", "indexedDB", "caches", "BroadcastChannel", "WebTransport"]) {
    try {
      Object.defineProperty(self, nome, { value: undefined, configurable: false, writable: false });
    } catch {
      try {
        self[nome] = undefined;
      } catch {
        // Propriedade que o navegador não deixa mudar: a CSP da caixa já barra a rede.
      }
    }
  }
}

async function iniciar(base) {
  importScripts(base + "pyodide.js");
  pyodide = await loadPyodide({ indexURL: base, fullStdLib: false });
  pyodide.runPython(PREPARO);
  fecharPontes();
}

self.onmessage = async (evento) => {
  const m = evento.data || {};
  if (m.tipo === "iniciar") {
    try {
      await iniciar(m.base);
      self.postMessage({ tipo: "pronto" });
    } catch (erro) {
      self.postMessage({ tipo: "falha", mensagem: String(erro && erro.message ? erro.message : erro) });
    }
    return;
  }
  if (m.tipo === "rodar" && pyodide) {
    let resposta;
    try {
      const rodar = pyodide.globals.get("_sibi_rodar");
      resposta = JSON.parse(rodar(String(m.codigo || ""), JSON.stringify(Array.isArray(m.entradas) ? m.entradas : [])));
    } catch (erro) {
      resposta = { saida: "", erro: { tipo: "Falha", mensagem: String(erro && erro.message ? erro.message : erro), linha: null } };
    }
    self.postMessage({ tipo: "resultado", id: m.id, ...resposta });
  }
};
