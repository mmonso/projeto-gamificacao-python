import type { Metadata } from "next";
import { Suspense } from "react";
import { banco } from "@/servidor/db/cliente";
import { licaoDemo } from "@/servidor/demo/servico";
import { connection } from "next/server";
import { Demonstracao } from "./Demonstracao";

export const metadata: Metadata = { title: "Primeira lição" };

async function CarregarDemo() {
  await connection();
  const licao = await licaoDemo(banco());
  if (!licao) {
    return (
      <main className="tela-centro text-center" id="conteudo-principal">
        <h1>A demonstração não está disponível agora</h1>
        <p className="subtitulo">Tente de novo em instantes.</p>
      </main>
    );
  }
  return <Demonstracao licao={licao} />;
}

function Carregando() {
  return (
    <main className="tela-centro justify-start" id="conteudo-principal">
      <h1 className="so-leitor">Carregando a lição</h1>
      <div className="carregando" aria-busy="true">
        <div className="esqueleto h-[18px] w-2/5" />
        <div className="esqueleto h-7 w-4/5" />
        <div className="esqueleto h-24" />
        <div className="esqueleto h-14" />
      </div>
    </main>
  );
}

export default function PaginaDemo() {
  return (
    <Suspense fallback={<Carregando />}>
      <CarregarDemo />
    </Suspense>
  );
}
