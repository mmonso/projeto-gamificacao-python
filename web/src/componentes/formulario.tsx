"use client";
// Peças comuns dos formulários de conta.
import Link from "next/link";
import { useFormStatus } from "react-dom";

export function BotaoEnviar({ children, desabilitado, classe = "botao" }: { children: React.ReactNode; desabilitado?: boolean; classe?: string }) {
  const { pending } = useFormStatus();
  return (
    <button className={classe} type="submit" disabled={desabilitado || pending} aria-busy={pending}>
      {pending ? "Aguarde…" : children}
    </button>
  );
}

/** Mensagens de erro e aviso, anunciadas a leitores de tela. */
export function Mensagens({ erro, aviso }: { erro?: string; aviso?: string }) {
  return (
    <div aria-live="polite">
      {erro && (
        <p className="mensagem-erro" role="alert">
          {erro}
        </p>
      )}
      {aviso && <p className="mensagem-aviso">{aviso}</p>}
    </div>
  );
}

export function Voltar({ href }: { href: string }) {
  return (
    <Link href={href} className="botao-icone" aria-label="Voltar">
      <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 5l-7 7 7 7" />
      </svg>
    </Link>
  );
}
