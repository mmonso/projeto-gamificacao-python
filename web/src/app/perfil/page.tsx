import type { Metadata } from "next";
import { Suspense } from "react";
import { sair } from "@/app/(conta)/acoes";
import { BotaoEnviar } from "@/componentes/formulario";
import { Icone } from "@/componentes/Icone";
import { CartaoMeta, Moldura, MolduraCarregando } from "@/componentes/Moldura";
import type { Conquista } from "@/modulos/gamificacao/regras";
import { CONQUISTAS } from "@/modulos/gamificacao/textos";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { ExcluirConta, Preferencias } from "./Preferencias";

export const metadata: Metadata = { title: "Perfil" };

async function Perfil() {
  const { aluno, perfil } = await obterPerfilAtual();
  const resumo = await resumoDoAluno(banco(), perfil);
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
          <h2 id="titulo-conquistas">Conquistas</h2>
          <div className="conquistas">
            {(Object.keys(CONQUISTAS) as Conquista[]).map((id) => {
              const tem = resumo.conquistas.includes(id);
              return (
                <div key={id} className={`conquista ${tem ? "" : "bloqueada"}`} title={CONQUISTAS[id].descricao}>
                  <div className="medalha">
                    <Icone nome={tem ? "trofeu" : "cadeado"} />
                  </div>
                  {CONQUISTAS[id].nome}
                  <span className="so-leitor">{tem ? ", conquistada" : `, ainda não conquistada: ${CONQUISTAS[id].descricao.toLowerCase()}`}</span>
                </div>
              );
            })}
          </div>
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
