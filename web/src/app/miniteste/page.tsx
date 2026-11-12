import type { Metadata } from "next";
import { Suspense } from "react";
import type { Momento } from "@/modulos/aprendizagem/miniteste";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { estadoMiniteste } from "@/servidor/miniteste";
import { MiniTeste } from "./MiniTeste";

export const metadata: Metadata = { title: "Mini-teste" };

async function Conteudo({ searchParams }: { searchParams: Promise<{ momento?: string | string[] }> }) {
  const { momento } = await searchParams;
  const m: Momento = momento === "depois" ? "depois" : "antes";
  const { perfil } = await obterPerfilAtual();
  return <MiniTeste momento={m} estado={await estadoMiniteste(banco(), perfil.id)} />;
}

export default function PaginaMiniteste({ searchParams }: { searchParams: Promise<{ momento?: string | string[] }> }) {
  return (
    <Suspense fallback={<main className="tela-centro" id="conteudo-principal" aria-busy="true" />}>
      <Conteudo searchParams={searchParams} />
    </Suspense>
  );
}
