import Link from "next/link";
import { Suspense } from "react";
import { Mascote } from "@/componentes/Mascote";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { obterAluno } from "@/servidor/auth/sessao";
import { AcoesVisitante } from "./AcoesVisitante";

// Apresentação (F-01): Começar leva à introdução e à demonstração; Já tenho conta, ao login.
async function Acoes() {
  const aluno = await obterAluno();
  if (aluno) {
    return (
      <Link className="botao" href="/aprender">
        Continuar
      </Link>
    );
  }
  return <AcoesVisitante />;
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
      <p className="links-documentos mt-8">
        Conta para maiores de {DOCUMENTOS.idadeMinima} anos · <Link href="/termos?de=inicio">Termos de uso</Link> ·{" "}
        <Link href="/privacidade?de=inicio">Política de privacidade</Link>
      </p>
    </main>
  );
}
