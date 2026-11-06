"use client";
// Moldura dos termos de uso e da política de privacidade (E08.9).
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { DOCUMENTOS } from "@/modulos/conta/documentos";

/** Telas que abrem os documentos, indicadas no link com ?de=. */
const ORIGENS: Record<string, string> = { cadastro: "/cadastro", perfil: "/perfil", inicio: "/" };

/**
 * Volta para a tela de onde a pessoa veio. Pelo histórico, quando há, o cadastro reaparece como estava;
 * aberto num link direto, vai para a origem indicada, ou para o início.
 */
function VoltarAnterior() {
  const router = useRouter();
  return (
    <Link
      href="/"
      className="botao-icone"
      aria-label="Voltar"
      onClick={(e) => {
        const origem = ORIGENS[new URLSearchParams(window.location.search).get("de") ?? ""];
        if (!origem) return;
        e.preventDefault();
        if (window.history.length > 1) router.back();
        else router.push(origem);
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </Link>
  );
}

/** Valor dos dados de DOCUMENTOS; vazio, aparece marcado para ser preenchido antes do beta. */
export function Definir({ valor, oQue }: { valor: string | null; oQue: string }) {
  return valor ? <>{valor}</> : <mark className="a-definir">[{oQue}: a definir]</mark>;
}

export function Documento({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <main className="documento" id="conteudo-principal">
      <VoltarAnterior />
      <h1>{titulo}</h1>
      <p className="documento-versao">Versão de {DOCUMENTOS.versao}</p>
      {DOCUMENTOS.preliminar && (
        <p className="mensagem-aviso">Texto preliminar, em revisão antes da abertura do beta.</p>
      )}
      {children}
    </main>
  );
}
