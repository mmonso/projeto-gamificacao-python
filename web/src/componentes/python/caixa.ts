// Ligação da página com a caixa do Python (public/python/caixa.js): um iframe escondido, criado uma vez só e
// só quando o aluno pede para rodar algo. As mensagens vêm de uma origem opaca ("null"), então a conferência é
// pela janela que mandou, nunca pela origem.
import type { ErroPython } from "@/modulos/python/erros";

export type ResultadoPython = { saida: string; erro: ErroPython | null; pedeEntrada?: string; recursos?: string[] };

let iframe: HTMLIFrameElement | null = null;
let pronto: Promise<void> | null = null;
const pendentes = new Map<string, (r: ResultadoPython) => void>();

function aoReceber(e: MessageEvent) {
  if (!iframe || e.source !== iframe.contentWindow) return;
  const m = e.data as { tipo?: string; id?: string } & ResultadoPython;
  if (m?.tipo === "resultado" && typeof m.id === "string") {
    pendentes.get(m.id)?.({ saida: String(m.saida ?? ""), erro: m.erro ?? null, pedeEntrada: m.pedeEntrada, recursos: m.recursos ?? [] });
    pendentes.delete(m.id);
  }
}

/** Cria a caixa (na primeira vez) e espera o Python ficar pronto. */
export function prepararPython(): Promise<void> {
  if (pronto) return pronto;
  pronto = new Promise<void>((resolver, recusar) => {
    const espera = setTimeout(() => recusar(new Error("O Python demorou demais para carregar.")), 90_000);
    const quandoPronto = (e: MessageEvent) => {
      if (!iframe || e.source !== iframe.contentWindow) return;
      const tipo = (e.data as { tipo?: string })?.tipo;
      if (tipo === "pronto" || tipo === "falha") {
        clearTimeout(espera);
        window.removeEventListener("message", quandoPronto);
        if (tipo === "pronto") resolver();
        else recusar(new Error(String((e.data as { mensagem?: string }).mensagem ?? "falha")));
      }
    };
    window.addEventListener("message", quandoPronto);
    window.addEventListener("message", aoReceber);
    iframe = document.createElement("iframe");
    iframe.setAttribute("sandbox", "allow-scripts");
    iframe.setAttribute("title", "Python do Sibi");
    iframe.setAttribute("aria-hidden", "true");
    iframe.tabIndex = -1;
    iframe.style.cssText = "position:absolute;width:0;height:0;border:0;visibility:hidden";
    iframe.src = "/python/caixa";
    document.body.appendChild(iframe);
  }).catch((erro) => {
    // Falhou (sem conexão, por exemplo): a próxima tentativa começa do zero.
    iframe?.remove();
    iframe = null;
    pronto = null;
    window.removeEventListener("message", aoReceber);
    throw erro;
  });
  return pronto;
}

/** Roda o código na caixa. `entradas` são as respostas já dadas aos input() do programa, em ordem. */
export async function rodarPython(codigo: string, entradas: string[] = []): Promise<ResultadoPython> {
  await prepararPython();
  const id = crypto.randomUUID();
  return new Promise((resolver) => {
    pendentes.set(id, resolver);
    iframe!.contentWindow!.postMessage({ tipo: "rodar", id, codigo, entradas }, "*");
  });
}
