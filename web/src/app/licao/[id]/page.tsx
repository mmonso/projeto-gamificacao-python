import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Voltar } from "@/componentes/formulario";
import { Mascote } from "@/componentes/Mascote";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { licaoDisponivel, obterLicaoPublica } from "@/servidor/licoes/servico";
import { BotaoComecar } from "./botao";

export const metadata: Metadata = { title: "Lição" };

async function AberturaDaLicao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { aluno } = await obterPerfilAtual();
  const licao = await obterLicaoPublica(banco(), id);
  if (!licao) notFound();
  const disponivel = await licaoDisponivel(banco(), aluno.id, id);

  return (
    <>
      <Mascote humor={disponivel ? "incentivo" : "descanso"} />
      <p className="ajuda font-extrabold uppercase tracking-wide">
        {licao.unidadeTitulo} · Lição {licao.ordem}
      </p>
      <h1>{licao.titulo}</h1>
      <p className="subtitulo">{licao.objetivo}</p>
      <p className="ajuda">{licao.totalExercicios} exercícios, cerca de 5 minutos.</p>
      {disponivel ? <BotaoComecar licaoId={licao.id} /> : <p className="mensagem-aviso">Conclua a lição anterior para liberar esta.</p>}
    </>
  );
}

export default function PaginaLicao({ params }: PageProps<"/licao/[id]">) {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/perfil" />
      <Suspense fallback={<div className="esqueleto h-96" aria-busy="true" />}>
        <AberturaDaLicao params={params} />
      </Suspense>
    </main>
  );
}
