import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Voltar } from "@/componentes/formulario";
import { destinoSeguro } from "@/modulos/conta/conta";
import { FormularioEntrar } from "./formulario";

export const metadata: Metadata = { title: "Entrar" };

async function Formulario({ searchParams }: { searchParams: Promise<{ voltar?: string | string[] }> }) {
  const { voltar } = await searchParams;
  return <FormularioEntrar voltar={voltar ? destinoSeguro(voltar) : undefined} />;
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
    </main>
  );
}
