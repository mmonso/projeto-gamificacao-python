import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { sair } from "@/app/(conta)/acoes";
import { BotaoEnviar } from "@/componentes/formulario";
import { Mascote } from "@/componentes/Mascote";
import { obterPerfilAtual } from "@/servidor/auth/sessao";

export const metadata: Metadata = { title: "Perfil" };

const NOMES_META: Record<number, string> = { 1: "Leve: 1 lição por dia", 2: "Regular: 2 lições por dia", 3: "Intensa: 3 lições por dia" };

async function DadosDoPerfil() {
  const { aluno, perfil } = await obterPerfilAtual();
  const dias = perfil.sequenciaAtual === 1 ? "dia seguido" : "dias seguidos";
  return (
    <>
      <h1>{perfil.nome ? `Oi, ${perfil.nome}!` : "Seu perfil"}</h1>
      {aluno.email && <p className="ajuda break-all">{aluno.email}</p>}
      <dl className="grid grid-cols-3 gap-3 text-center">
        <div className="cartao">
          <dt className="ajuda">XP</dt>
          <dd className="text-2xl font-black text-azul">{perfil.xpTotal}</dd>
        </div>
        <div className="cartao">
          <dt className="ajuda">Sequência</dt>
          <dd className="text-2xl font-black text-[var(--amarelo-texto)]">
            {perfil.sequenciaAtual}
            <span className="so-leitor"> {dias}</span>
          </dd>
        </div>
        <div className="cartao">
          <dt className="ajuda">Corações</dt>
          <dd className="text-2xl font-black text-[var(--vermelho-texto)]">{perfil.coracoes}</dd>
        </div>
      </dl>
      <dl className="cartao grid gap-2">
        <div>
          <dt className="font-extrabold">Meta diária</dt>
          <dd>{NOMES_META[perfil.metaDiaria]}</dd>
        </div>
        <div>
          <dt className="font-extrabold">Fuso horário</dt>
          <dd>{perfil.fuso.replaceAll("_", " ")}</dd>
        </div>
      </dl>
    </>
  );
}

export default function PaginaPerfil() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Mascote humor="comemoracao" tamanho="pequeno" />
      <Suspense fallback={<div className="esqueleto h-80" aria-busy="true" />}>
        <DadosDoPerfil />
      </Suspense>
      {/* A trilha (E05.1) substitui este atalho para a lição piloto. */}
      <Link className="botao" href="/licao/u1-l1">
        Estudar a primeira lição
      </Link>
      <form action={sair} className="acoes">
        <BotaoEnviar classe="botao botao-secundario">Sair</BotaoEnviar>
      </form>
    </main>
  );
}
