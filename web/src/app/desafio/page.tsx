import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { desafioDeHoje } from "@/servidor/desafio/servico";
import { Desafio } from "./Desafio";

export const metadata: Metadata = {
  title: "Desafio do dia",
  description: "5 perguntas de Python: qual é a saída? Jogue sem cadastro e compare com os amigos.",
};

async function CarregarDesafio({ busca }: { busca: Promise<{ c?: string }> }) {
  await connection();
  const [desafio, aluno, { c }] = await Promise.all([desafioDeHoje(banco()), obterAluno(), busca]);
  if (!desafio) {
    return (
      <main className="tela-centro text-center" id="conteudo-principal">
        <h1>O desafio de hoje não está disponível agora</h1>
        <p className="subtitulo">Tente de novo em instantes.</p>
      </main>
    );
  }
  return <Desafio desafio={desafio} compartilhado={c === "1"} comConta={aluno !== null && !aluno.visitante} />;
}

function Carregando() {
  return (
    <main className="tela-centro justify-start" id="conteudo-principal">
      <h1 className="so-leitor">Carregando o desafio</h1>
      <div className="carregando" aria-busy="true">
        <div className="esqueleto h-[18px] w-2/5" />
        <div className="esqueleto h-7 w-4/5" />
        <div className="esqueleto h-24" />
        <div className="esqueleto h-14" />
      </div>
    </main>
  );
}

export default function PaginaDesafio({ searchParams }: { searchParams: Promise<{ c?: string }> }) {
  return (
    <Suspense fallback={<Carregando />}>
      <CarregarDesafio busca={searchParams} />
    </Suspense>
  );
}
