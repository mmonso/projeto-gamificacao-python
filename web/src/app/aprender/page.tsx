import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icone } from "@/componentes/Icone";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { obterTrilha, type NoTrilha } from "@/servidor/licoes/servico";

export const metadata: Metadata = { title: "Aprender" };

// Trilha sinuosa (F-07; protótipo E03.3).
const DESLOCAMENTOS = [0, 56, 84, 56, 0, -56, -84, -56];
const NOME_ESTADO = { concluida: "concluída", atual: "lição atual", bloqueada: "bloqueada" } as const;

function No({ licao, posicao }: { licao: NoTrilha; posicao: number }) {
  const icone = licao.estado === "concluida" ? "check" : licao.estado === "bloqueada" ? "cadeado" : licao.desafio ? "trofeu" : "estrela";
  const rotulo = `Lição ${licao.ordem}: ${licao.titulo}, ${NOME_ESTADO[licao.estado]}`;
  return (
    <li className={licao.estado === "atual" ? "li-atual" : ""} style={{ transform: `translateX(${DESLOCAMENTOS[posicao % DESLOCAMENTOS.length]}px)` }}>
      {licao.estado === "atual" && (
        <span className="etiqueta-atual" aria-hidden="true">
          {licao.sessaoAberta ? "Continuar" : "Começar"}
        </span>
      )}
      {licao.estado === "bloqueada" ? (
        <span className="no bloqueada" role="img" aria-label={rotulo}>
          <Icone nome={icone} />
        </span>
      ) : (
        <Link href={`/licao/${licao.id}`} className={`no ${licao.estado}`} aria-label={rotulo}>
          <Icone nome={icone} />
        </Link>
      )}
      <span className="no-rotulo" aria-hidden="true">
        {licao.titulo}
      </span>
    </li>
  );
}

async function Trilha() {
  const { aluno, perfil } = await obterPerfilAtual();
  const unidades = await obterTrilha(banco(), aluno.id);
  return (
    <>
      <header className="barra-topo">
        <p className="marca text-[1.4rem]">Sibi</p>
        <div className="indicadores">
          <span className="indicador indicador-sequencia">
            <Icone nome="chama" />
            {perfil.sequenciaAtual}
            <span className="so-leitor">{perfil.sequenciaAtual === 1 ? "dia seguido" : "dias seguidos"}</span>
          </span>
          <span className="indicador indicador-xp">
            <Icone nome="raio" />
            {perfil.xpTotal}
            <span className="so-leitor">XP</span>
          </span>
          <span className="indicador indicador-coracoes">
            <Icone nome="coracao" />
            {perfil.coracoes}
            <span className="so-leitor">corações</span>
          </span>
          <Link href="/perfil" className="botao-icone" aria-label="Perfil">
            <Icone nome="pessoa" />
          </Link>
        </div>
      </header>
      <main className="principal" id="conteudo-principal">
        <h1 className="so-leitor">Aprender</h1>
        {perfil.nome && <p className="subtitulo">Olá, {perfil.nome}!</p>}
        {unidades.map((u) => {
          const liberada = u.licoes.some((l) => l.estado !== "bloqueada");
          return (
            <section key={u.id} aria-labelledby={`unidade-${u.id}`}>
              <div className={`unidade-banner ${liberada ? "" : "bloqueada"}`}>
                <p className="rotulo">Unidade {u.ordem}</p>
                <h2 id={`unidade-${u.id}`}>{u.titulo}</h2>
                <p>{u.descricao}</p>
              </div>
              <ol className="trilha" aria-label={`Lições da unidade ${u.ordem}`}>
                {u.licoes.map((l, i) => (
                  <No key={l.id} licao={l} posicao={i} />
                ))}
              </ol>
            </section>
          );
        })}
      </main>
    </>
  );
}

export default function PaginaAprender() {
  return (
    <Suspense
      fallback={
        <main className="principal" id="conteudo-principal">
          <div className="carregando" aria-busy="true">
            <div className="esqueleto h-24" />
            <div className="esqueleto mx-auto h-[76px] w-[76px] rounded-full" />
            <div className="esqueleto mx-auto h-[76px] w-[76px] rounded-full" />
          </div>
        </main>
      }
    >
      <Trilha />
    </Suspense>
  );
}
