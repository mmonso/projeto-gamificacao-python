import Link from "next/link";
import { Suspense } from "react";
import { Mascote } from "@/componentes/Mascote";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { obterAluno } from "@/servidor/auth/sessao";
import { AcoesVisitante } from "./AcoesVisitante";
import { PrimeiroPrograma } from "./PrimeiroPrograma";

// Apresentação (F-01; design/ANALISE_UX_GAMIFICACAO.md, 2A): o primeiro programa na própria tela e Começar
// direto na demonstração. Os botões de visitante aparecem na hora, sem esperar a sessão ser conferida.
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
      <p className="marca marca-inicio">Sibi</p>
      <Mascote humor="incentivo" tamanho="medio" />
      <h1 className="chamada">Escreva seu primeiro programa em Python. Agora.</h1>
      <PrimeiroPrograma />
      <p className="subtitulo">A academia diária de Python, em português: 5 minutos por dia para ler, prever e corrigir código.</p>
      <div className="acoes">
        <Suspense fallback={<AcoesVisitante />}>
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
