import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Voltar } from "@/componentes/formulario";
import { Mascote } from "@/componentes/Mascote";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { obterLicaoPublica, obterTrilha } from "@/servidor/licoes/servico";
import { BotaoComecar } from "./botao";

export const metadata: Metadata = { title: "Lição" };

async function AberturaDaLicao({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { aluno } = await obterPerfilAtual();
  const [licao, trilha] = await Promise.all([obterLicaoPublica(banco(), id), obterTrilha(banco(), aluno.id)]);
  const licoes = trilha.flatMap((u) => u.licoes);
  const no = licoes.find((l) => l.id === id);
  if (!licao || !no) notFound();
  const anterior = licoes[licoes.indexOf(no) - 1];

  return (
    <>
      <Mascote humor={no.estado === "bloqueada" ? "descanso" : no.estado === "concluida" ? "comemoracao" : "incentivo"} />
      <p className="ajuda font-extrabold uppercase tracking-wide">
        {licao.unidadeTitulo} · {no.desafio ? "Desafio final" : `Lição ${licao.ordem}`}
      </p>
      <h1>{licao.titulo}</h1>
      <p className="subtitulo">{licao.objetivo}</p>
      <p className="ajuda">{licao.totalExercicios} exercícios, cerca de 5 minutos.</p>
      {no.estado === "atual" && <BotaoComecar licaoId={licao.id} rotulo={no.sessaoAberta ? "Continuar" : "Começar"} />}
      {no.estado === "bloqueada" && <p className="mensagem-aviso">Conclua “{anterior?.titulo}” para liberar esta lição.</p>}
      {no.estado === "concluida" && (
        <>
          <p className="mensagem-aviso">Você já concluiu esta lição. A prática das lições concluídas chega em breve.</p>
          <div className="acoes">
            <Link className="botao botao-secundario" href="/aprender">
              Voltar à trilha
            </Link>
          </div>
        </>
      )}
    </>
  );
}

export default function PaginaLicao({ params }: PageProps<"/licao/[id]">) {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/aprender" />
      <Suspense fallback={<div className="esqueleto h-96" aria-busy="true" />}>
        <AberturaDaLicao params={params} />
      </Suspense>
    </main>
  );
}
