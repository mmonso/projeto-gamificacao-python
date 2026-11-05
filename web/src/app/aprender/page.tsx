import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icone } from "@/componentes/Icone";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { obterTrilha, type NoTrilha } from "@/servidor/licoes/servico";
import { OfertaTransferencia } from "./OfertaTransferencia";

export const metadata: Metadata = { title: "Aprender" };

// Trilha sinuosa (F-07; protótipo E03.3).
const DESLOCAMENTOS = [0, 56, 84, 56, 0, -56, -84, -56];
const NOME_ESTADO = { concluida: "concluída", atual: "lição atual", bloqueada: "bloqueada" } as const;
/** Pontos de revisão (F-09): depois da segunda e da última lição de cada unidade. */
const REVISAO_DEPOIS = [2, 5];

function No({ licao, posicao }: { licao: NoTrilha; posicao: number }) {
  const icone = licao.estado === "concluida" ? "check" : licao.estado === "bloqueada" ? "cadeado" : licao.desafio ? "trofeu" : "estrela";
  const rotulo = `${licao.desafio ? "Desafio final" : `Lição ${licao.ordem}`}: ${licao.titulo}, ${NOME_ESTADO[licao.estado]}`;
  return (
    <li className={licao.estado === "atual" ? "li-atual" : ""} style={{ transform: `translateX(${DESLOCAMENTOS[posicao % DESLOCAMENTOS.length]}px)` }}>
      {licao.estado === "atual" && (
        <span className="etiqueta-atual" aria-hidden="true">
          {licao.sessaoAberta ? "Continuar" : "Começar"}
        </span>
      )}
      <Link href={`/licao/${licao.id}`} className={`no ${licao.estado} ${licao.estado === "atual" ? "atual" : ""}`} aria-label={rotulo}>
        <Icone nome={icone} />
      </Link>
      <span className="no-rotulo" aria-hidden="true">
        {licao.titulo}
      </span>
    </li>
  );
}

function PontoRevisao({ liberada, posicao, depois }: { liberada: boolean; posicao: number; depois: number }) {
  return (
    <li style={{ transform: `translateX(${DESLOCAMENTOS[posicao % DESLOCAMENTOS.length]}px)` }}>
      {liberada ? (
        <Link href="/praticar" className="no revisao" aria-label="Revisão dos conceitos vistos">
          <Icone nome="revisao" />
        </Link>
      ) : (
        <span className="no revisao bloqueada" role="img" aria-label={`Revisão, bloqueada até concluir a lição ${depois}`}>
          <Icone nome="cadeado" />
        </span>
      )}
      <span className="no-rotulo" aria-hidden="true">
        Revisão
      </span>
    </li>
  );
}

async function Trilha() {
  const { perfil } = await obterPerfilAtual();
  const [unidades, resumo] = await Promise.all([obterTrilha(banco(), perfil.id), resumoDoAluno(banco(), perfil)]);
  return (
    <Moldura atual="aprender" resumo={resumo}>
      <h1 className="so-leitor">Aprender</h1>
      <OfertaTransferencia />
      {perfil.nome && <p className="subtitulo">Olá, {perfil.nome}!</p>}
      {resumo.coracoes === 0 && (
        <div className="aviso-conta">
          <div>
            <p>Você está sem corações. Uma revisão rápida de 5 exercícios devolve 2.</p>
            <Link className="botao botao-pequeno" href="/praticar">
              Recuperar corações
            </Link>
          </div>
        </div>
      )}
      {unidades.map((u) => {
        const liberada = u.licoes.some((l) => l.estado !== "bloqueada");
        const itens: React.ReactNode[] = [];
        u.licoes.forEach((l, i) => {
          itens.push(<No key={l.id} licao={l} posicao={itens.length} />);
          if (REVISAO_DEPOIS.includes(i + 1)) {
            itens.push(<PontoRevisao key={`revisao-${l.id}`} liberada={l.estado === "concluida"} posicao={itens.length} depois={i + 1} />);
          }
        });
        return (
          <section key={u.id} aria-labelledby={`unidade-${u.id}`}>
            <div className={`unidade-banner ${liberada ? "" : "bloqueada"}`}>
              <p className="rotulo">Unidade {u.ordem}</p>
              <h2 id={`unidade-${u.id}`}>{u.titulo}</h2>
              <p>{u.descricao}</p>
            </div>
            <ol className="trilha" aria-label={`Lições da unidade ${u.ordem}`}>
              {itens}
            </ol>
          </section>
        );
      })}
    </Moldura>
  );
}

export default function PaginaAprender() {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Trilha />
    </Suspense>
  );
}
