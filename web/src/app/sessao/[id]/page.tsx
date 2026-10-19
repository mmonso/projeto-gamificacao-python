import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { obterSessaoAtual } from "@/servidor/licoes/servico";
import { Licao } from "./Licao";

export const metadata: Metadata = { title: "Lição" };

async function SessaoAtual({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { aluno, perfil } = await obterPerfilAtual();
  const sessao = await obterSessaoAtual(banco(), aluno.id, id);
  if (!sessao) notFound();
  return (
    <Licao
      // Uma nova montagem por sessão: o estado da lição anterior não vaza para a próxima.
      key={sessao.id}
      sessaoId={sessao.id}
      titulo={sessao.licao.titulo}
      inicial={{ exercicio: sessao.exercicio, resolvidos: sessao.resolvidos, total: sessao.totalItens }}
      somInicial={perfil.som}
    />
  );
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
        <div className="esqueleto h-14" />
      </div>
    </main>
  );
}

export default function PaginaSessao({ params }: PageProps<"/sessao/[id]">) {
  return (
    <Suspense fallback={<Carregando />}>
      <SessaoAtual params={params} />
    </Suspense>
  );
}
