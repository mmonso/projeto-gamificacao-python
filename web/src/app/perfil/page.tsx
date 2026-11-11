import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { sair } from "@/app/(conta)/acoes";
import { BotaoEnviar } from "@/componentes/formulario";
import { Icone } from "@/componentes/Icone";
import { CartaoMeta, Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { progressoDoAluno } from "@/servidor/gamificacao/conquistas";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { ExcluirConta, Preferencias } from "./Preferencias";

export const metadata: Metadata = { title: "Perfil" };

async function Perfil() {
  const { aluno, perfil } = await obterPerfilAtual();
  const [resumo, conquistas] = await Promise.all([resumoDoAluno(banco(), perfil), progressoDoAluno(banco(), perfil.id)]);
  return (
    <Moldura atual="perfil" resumo={resumo}>
      <h1>{perfil.nome || "Seu perfil"}</h1>
      {aluno.email && <p className="ajuda mb-4 break-all">{aluno.email}</p>}
      <div className="pilha">
        <div className="estatisticas">
          <div className="estatistica xp">
            <p className="topo">XP total</p>
            <p className="valor">{resumo.xpTotal}</p>
          </div>
          <div className="estatistica sequencia">
            <p className="topo">Sequência</p>
            <p className="valor">
              <Icone nome="chama" pequeno />
              {resumo.sequencia}
            </p>
          </div>
          <div className="estatistica acertos">
            <p className="topo">Lições</p>
            <p className="valor">{resumo.licoesConcluidas}</p>
          </div>
        </div>
        <p className="ajuda">
          Hoje: {resumo.xpHoje} XP. Maior sequência: {resumo.maiorSequencia} {resumo.maiorSequencia === 1 ? "dia" : "dias"}.
        </p>
        <CartaoMeta resumo={resumo} />

        <section className="cartao" aria-labelledby="titulo-conquistas">
          <h2 id="titulo-conquistas">
            Conquistas <span className="contagem-conquistas">{conquistas.filter((c) => c.conquistada).length} de {conquistas.length}</span>
          </h2>
          <ul className="conquistas">
            {conquistas.map((c) => (
              <li key={c.id} className={`conquista ${c.conquistada ? "" : "bloqueada"}`}>
                <div className="medalha">
                  <Icone nome={c.conquistada ? "trofeu" : "cadeado"} />
                </div>
                <span className="conquista-nome">{c.nome}</span>
                <span className="conquista-descricao">{c.descricao}</span>
                {c.conquistada ? (
                  <span className="so-leitor">Conquistada.</span>
                ) : c.meta > 1 ? (
                  <>
                    <span className="conquista-barra" aria-hidden="true">
                      <span style={{ width: `${(c.atual / c.meta) * 100}%` }} />
                    </span>
                    <span className="conquista-progresso">
                      {c.atual} de {c.meta}
                    </span>
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </section>

        <Preferencias nome={perfil.nome} meta={perfil.metaDiaria} fuso={perfil.fuso} fusoPendente={perfil.fusoPendente} som={perfil.som} />

        <section className="cartao pilha" aria-labelledby="titulo-conta">
          <h2 id="titulo-conta">Conta</h2>
          <a className="botao botao-secundario" href="/api/perfil/exportacao" download>
            Exportar meu histórico
          </a>
          <form action={sair}>
            <BotaoEnviar classe="botao botao-secundario">Sair</BotaoEnviar>
          </form>
          <ExcluirConta />
          <p className="links-documentos">
            <Link href="/termos?de=perfil">Termos de uso</Link> · <Link href="/privacidade?de=perfil">Política de privacidade</Link>
          </p>
        </section>
      </div>
    </Moldura>
  );
}

export default function PaginaPerfil() {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Perfil />
    </Suspense>
  );
}
