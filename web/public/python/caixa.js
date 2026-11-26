// Caixa do Python do Sibi: roda num iframe com sandbox="allow-scripts" (origem opaca: sem os cookies e o
// armazenamento do Sibi) e com uma CSP que só deixa buscar os arquivos do Pyodide. Cria o trabalhador, repassa
// os pedidos da página e corta o programa que demora demais (laço infinito), recriando o trabalhador.
"use strict";

(() => {
  const ORIGEM = new URL(location.href).origin;
  const BASE_PYODIDE = ORIGEM + "/pyodide/314.0.8/";
  const TEMPO_MAXIMO = 5000;

  let trabalhador = null;
  let pronto = null;
  let atual = null; // { id, relogio }
  let fila = Promise.resolve();

  function avisar(m) {
    parent.postMessage(m, "*");
  }

  function criar() {
    pronto = (async () => {
      const texto = await (await fetch(ORIGEM + "/python/trabalhador.js")).text();
      const url = URL.createObjectURL(new Blob([texto], { type: "text/javascript" }));
      trabalhador = new Worker(url);
      URL.revokeObjectURL(url);
      await new Promise((resolver, recusar) => {
        trabalhador.onmessage = (e) => {
          const m = e.data || {};
          if (m.tipo === "pronto") resolver();
          else if (m.tipo === "falha") recusar(new Error(m.mensagem));
          else if (m.tipo === "resultado") terminar(m);
        };
        trabalhador.onerror = (e) => {
          e.preventDefault();
          if (atual) terminar({ tipo: "resultado", id: atual.id, saida: "", erro: { tipo: "Falha", mensagem: "O Python parou de responder.", linha: null } }, true);
          else recusar(new Error("trabalhador"));
        };
        trabalhador.postMessage({ tipo: "iniciar", base: BASE_PYODIDE });
      });
    })();
    return pronto;
  }

  let concluirAtual = null;
  function terminar(resultado, reiniciar) {
    if (!atual || resultado.id !== atual.id) return;
    clearTimeout(atual.relogio);
    atual = null;
    avisar(resultado);
    if (reiniciar) {
      trabalhador.terminate();
      criar().catch(() => {});
    }
    if (concluirAtual) concluirAtual();
  }

  function rodar(m) {
    return new Promise((fim) => {
      concluirAtual = fim;
      atual = {
        id: m.id,
        relogio: setTimeout(() => terminar({ tipo: "resultado", id: m.id, saida: "", erro: { tipo: "Tempo", mensagem: "", linha: null } }, true), TEMPO_MAXIMO),
      };
      trabalhador.postMessage({ tipo: "rodar", id: m.id, codigo: m.codigo, entradas: m.entradas });
    });
  }

  window.addEventListener("message", (e) => {
    if (e.source !== parent) return;
    const m = e.data || {};
    if (m.tipo !== "rodar" || typeof m.id !== "string" || typeof m.codigo !== "string") return;
    // Um programa de cada vez: o próximo espera o anterior terminar (ou ser cortado).
    fila = fila.then(async () => {
      try {
        await pronto;
      } catch {
        await criar();
      }
      await rodar(m);
    }).catch(() => avisar({ tipo: "resultado", id: m.id, saida: "", erro: { tipo: "Falha", mensagem: "O Python não carregou.", linha: null } }));
  });

  criar().then(
    () => avisar({ tipo: "pronto" }),
    (erro) => avisar({ tipo: "falha", mensagem: String(erro && erro.message ? erro.message : erro) }),
  );
})();
