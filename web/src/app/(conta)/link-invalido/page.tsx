import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mascote } from "@/componentes/Mascote";

export const metadata: Metadata = { title: "Link inválido" };

async function Acoes({ searchParams }: { searchParams: Promise<{ tipo?: string | string[] }> }) {
  const { tipo } = await searchParams;
  if (tipo === "senha") {
    return (
      <div className="acoes">
        <Link className="botao" href="/recuperar">
          Pedir um novo link
        </Link>
      </div>
    );
  }
  return (
    <>
      <p>Se você acabou de confirmar seu e-mail em outro navegador, já pode entrar. Se o e-mail ainda não foi confirmado, ao entrar você pode pedir um novo link.</p>
      <div className="acoes">
        <Link className="botao" href="/entrar">
          Entrar
        </Link>
      </div>
    </>
  );
}

export default function PaginaLinkInvalido({ searchParams }: PageProps<"/link-invalido">) {
  return (
    <main className="tela-centro text-center" id="conteudo-principal">
      <Mascote humor="atencao" />
      <h1>Esse link não vale mais</h1>
      <p className="subtitulo">Ele expirou, já foi usado ou foi aberto em outro navegador.</p>
      <Suspense>
        <Acoes searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
