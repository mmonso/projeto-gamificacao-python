import Link from "next/link";
import { Suspense } from "react";
import { Mascote } from "@/componentes/Mascote";
import { obterAluno } from "@/servidor/auth/sessao";

// Apresentação (F-01). A introdução e a demonstração entram em E06.6; por ora, Começar leva ao cadastro.
async function Acoes() {
  const aluno = await obterAluno();
  if (aluno) {
    return (
      <Link className="botao" href="/aprender">
        Continuar
      </Link>
    );
  }
  return (
    <>
      <Link className="botao" href="/cadastro">
        Começar
      </Link>
      <Link className="botao botao-secundario" href="/entrar">
        Já tenho conta
      </Link>
    </>
  );
}

export default function Apresentacao() {
  return (
    <main className="tela-centro text-center" id="conteudo-principal">
      <Mascote humor="incentivo" tamanho="grande" />
      <h1 className="marca">Sibi</h1>
      <p className="subtitulo">Aprenda Python do zero, com lições de 5 minutos por dia.</p>
      <div className="acoes">
        <Suspense fallback={<div className="esqueleto h-[116px]" />}>
          <Acoes />
        </Suspense>
      </div>
    </main>
  );
}
