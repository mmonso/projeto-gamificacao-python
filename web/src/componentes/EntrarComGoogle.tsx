"use client";
// Botão oficial "Continuar com o Google" (Google Identity Services), desenhado pelo próprio Google dentro da página.
// O Google devolve um token de identidade e a ação entrarComGoogle o confere no Supabase. Como no visitante,
// continuar equivale a declarar a idade mínima e aceitar os documentos, por isso o aviso fica logo abaixo do botão.
import Link from "next/link";
import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import { entrarComGoogle, type EstadoFormulario } from "@/app/(conta)/acoes";
import { CHAVE_INTRODUCAO } from "@/modulos/conta/conta";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { GOOGLE_CLIENT_ID } from "@/modulos/conta/entrada-google";
import { Mensagens } from "./formulario";

const SCRIPT_GOOGLE = "https://accounts.google.com/gsi/client";

type RespostaGoogle = { credential?: string };
type GoogleId = {
  initialize(opcoes: { client_id: string; callback: (r: RespostaGoogle) => void; nonce: string; ux_mode: "popup"; context: "signin" | "signup" }): void;
  renderButton(elemento: HTMLElement, opcoes: Record<string, string | number>): void;
};
declare global {
  interface Window {
    google?: { accounts: { id: GoogleId } };
  }
}

/** Carrega o script do Google uma vez por página. */
function carregarScriptGoogle(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existente = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_GOOGLE}"]`);
    const script = existente ?? Object.assign(document.createElement("script"), { src: SCRIPT_GOOGLE, async: true });
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("script do Google")), { once: true });
    if (!existente) document.head.appendChild(script);
  });
}

/** Nonce aleatório: o original vai para o Supabase e o resumo SHA-256 (hex) vai para o Google, que o põe no token. */
async function gerarNonce(): Promise<{ original: string; resumo: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const original = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(original));
  const resumo = Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
  return { original, resumo };
}

function metaDaIntroducao(): string {
  try {
    return String(JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}").meta ?? "");
  } catch {
    return "";
  }
}

export function EntrarComGoogle({ origem, voltar }: { origem: "entrar" | "cadastro"; voltar?: string }) {
  const [estado, acao, enviando] = useActionState<EstadoFormulario, FormData>(entrarComGoogle, {});
  const lugar = useRef<HTMLDivElement>(null);
  const [falhou, setFalhou] = useState(false);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const [nonce] = await Promise.all([gerarNonce(), carregarScriptGoogle()]);
        const google = window.google?.accounts.id;
        if (!ativo || !google || !lugar.current) return;
        google.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: nonce.resumo,
          ux_mode: "popup",
          context: origem === "cadastro" ? "signup" : "signin",
          callback: ({ credential }) => {
            if (!credential) return;
            const dados = new FormData();
            dados.set("credencial", credential);
            dados.set("nonce", nonce.original);
            dados.set("fuso", Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
            dados.set("metaDiaria", metaDaIntroducao());
            if (voltar) dados.set("voltar", voltar);
            startTransition(() => acao(dados));
          },
        });
        // O botão do Google tem largura fixa em pixels (máximo 400): acompanha a coluna do formulário.
        const largura = Math.max(200, Math.min(400, Math.round(lugar.current.clientWidth)));
        google.renderButton(lugar.current, { type: "standard", theme: "outline", size: "large", text: "continue_with", shape: "rectangular", locale: "pt-BR", width: largura });
      } catch {
        if (ativo) setFalhou(true);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [acao, origem, voltar]);

  return (
    <div className="pilha entrar-google">
      <div ref={lugar} className="botao-google" aria-busy={enviando} hidden={enviando || falhou} />
      {enviando && <p className="mensagem-aviso">Entrando com o Google…</p>}
      <Mensagens erro={falhou ? "Não foi possível carregar o botão do Google. Confira a conexão ou use e-mail e senha." : estado.erro} />
      <p className="links-documentos">
        Ao continuar com o Google, você confirma ter {DOCUMENTOS.idadeMinima} anos ou mais e aceita os{" "}
        <Link href={`/termos?de=${origem}`}>termos de uso</Link> e a <Link href={`/privacidade?de=${origem}`}>política de privacidade</Link>.
      </p>
    </div>
  );
}
