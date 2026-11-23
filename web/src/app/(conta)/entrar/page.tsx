import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { EntrarComGoogle } from "@/componentes/EntrarComGoogle";
import { EntrarComoVisitante } from "@/componentes/EntrarComoVisitante";
import { Mensagens, Voltar } from "@/componentes/formulario";
import { destinoSeguro, MENSAGENS } from "@/modulos/conta/conta";
import { MENSAGEM_SEM_VAGAS } from "@/modulos/conta/vagas";
import { FormularioEntrar } from "./formulario";

export const metadata: Metadata = { title: "Entrar" };

/** Motivo de quem volta do Google sem entrar (auth/confirmar). */
const AVISOS: Record<string, string> = { "sem-vagas": MENSAGEM_SEM_VAGAS, google: MENSAGENS.googleFalhou };

async function Formulario({ searchParams }: { searchParams: Promise<{ voltar?: string | string[]; aviso?: string | string[] }> }) {
  const { voltar, aviso } = await searchParams;
  const destino = voltar ? destinoSeguro(voltar) : undefined;
  return (
    <>
      <Mensagens erro={typeof aviso === "string" ? AVISOS[aviso] : undefined} />
      <EntrarComGoogle origem="entrar" voltar={destino} />
      <p className="divisor-ou">ou com e-mail</p>
      <FormularioEntrar voltar={destino} />
    </>
  );
}

export default function PaginaEntrar({ searchParams }: PageProps<"/entrar">) {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/" />
      <h1>Entrar</h1>
      <Suspense fallback={<div className="esqueleto h-72" />}>
        <Formulario searchParams={searchParams} />
      </Suspense>
      <p className="text-center">
        <Link href="/recuperar">Esqueci minha senha</Link>
      </p>
      <p className="text-center">
        Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
      </p>
      <EntrarComoVisitante origem="entrar" />
    </main>
  );
}
