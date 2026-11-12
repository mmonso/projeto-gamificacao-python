import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { sair } from "@/app/(conta)/acoes";
import { BotaoEnviar } from "@/componentes/formulario";
import { Icone } from "@/componentes/Icone";
import { InstalarApp } from "@/componentes/InstalarApp";
import { CartaoMeta, Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { DIAS_DE_VISITANTE } from "@/modulos/conta/conta";
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
        {perfil.visitante && <AvisoVisitante criadoEm={perfil.criadoEm} fuso={perfil.fuso} />}
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

        <InstalarApp />

        <Preferencias nome={perfil.nome} meta={perfil.metaDiaria} fuso={perfil.fuso} fusoPendente={perfil.fusoPendente} som={perfil.som} />

        <section className="cartao pilha" aria-labelledby="titulo-conta">
          <h2 id="titulo-conta">Conta</h2>
          {!perfil.visitante && (
            <a className="botao botao-secundario" href="/api/perfil/exportacao" download>
              Exportar meu histórico
            </a>
          )}
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

/** Visitante: o acesso some sozinho, e sair encerra de vez (não há e-mail nem senha para voltar). */
function AvisoVisitante({ criadoEm, fuso }: { criadoEm: Date; fuso: string }) {
  const fim = new Date(criadoEm.getTime() + DIAS_DE_VISITANTE * 86_400_000);
  const data = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long", timeZone: fuso }).format(fim);
  return (
    <section className="cartao pilha" aria-labelledby="titulo-visitante">
      <h2 id="titulo-visitante">Você está como visitante</h2>
      <p>
        Este acesso e todo o progresso serão apagados em {data}. Se sair, não dá para voltar a ele. Para guardar o progresso de verdade, saia e crie uma conta com e-mail.
      </p>
    </section>
  );
}

export default function PaginaPerfil() {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Perfil />
    </Suspense>
  );
}
