// Estrutura das telas com menu (F-33; protótipo E03.3): no desktop, menu lateral, conteúdo e painel de metas;
// no celular, uma coluna com indicadores no topo e navegação inferior.
import Link from "next/link";
import type { ResumoAluno } from "@/servidor/gamificacao/efeitos";
import { Icone, type NomeIcone } from "./Icone";

type Aba = "aprender" | "praticar" | "perfil";

const ABAS: [Aba, string, NomeIcone][] = [
  ["aprender", "Aprender", "casa"],
  ["praticar", "Praticar", "halter"],
  ["perfil", "Perfil", "pessoa"],
];

const plural = (n: number, um: string, varios: string) => (n === 1 ? um : varios);

function ItensNav({ atual }: { atual: Aba }) {
  return ABAS.map(([aba, nome, icone]) => (
    <Link key={aba} className="nav-item" href={`/${aba}`} aria-current={aba === atual ? "page" : undefined}>
      <Icone nome={icone} />
      <span>{nome}</span>
    </Link>
  ));
}

export function Indicadores({ resumo }: { resumo: Pick<ResumoAluno, "sequencia" | "coracoes" | "xpTotal"> }) {
  return (
    <div className="indicadores" aria-label="Seus indicadores">
      <span className="indicador indicador-sequencia" title="Sequência">
        <Icone nome="chama" />
        <span>{resumo.sequencia}</span>
        <span className="so-leitor">{plural(resumo.sequencia, "dia de sequência", "dias de sequência")}</span>
      </span>
      <span className="indicador indicador-coracoes" title="Corações">
        <Icone nome="coracao" />
        <span>{resumo.coracoes}</span>
        <span className="so-leitor">corações</span>
      </span>
      <span className="indicador indicador-xp" title="XP">
        <Icone nome="raio" />
        <span>{resumo.xpTotal}</span>
        <span className="so-leitor">XP</span>
      </span>
    </div>
  );
}

export function CartaoMeta({ resumo }: { resumo: Pick<ResumoAluno, "meta" | "sessoesHoje"> }) {
  const feitas = Math.min(resumo.sessoesHoje, resumo.meta);
  return (
    <div className="cartao">
      <h3>
        <span className="indicador-sequencia">
          <Icone nome="estrela" />
        </span>
        Meta do dia
      </h3>
      <p>
        {feitas} de {resumo.meta} {plural(resumo.meta, "sessão", "sessões")}
        {feitas >= resumo.meta ? ". Meta cumprida!" : ""}
      </p>
      <div className="progresso-meta" role="progressbar" aria-label="Meta do dia" aria-valuemin={0} aria-valuemax={resumo.meta} aria-valuenow={feitas}>
        <span style={{ width: `${(feitas / resumo.meta) * 100}%` }} />
      </div>
    </div>
  );
}

function Painel({ resumo }: { resumo: ResumoAluno }) {
  return (
    <aside className="painel" aria-label="Seu progresso">
      <Indicadores resumo={resumo} />
      <div className="cartao">
        <h3>
          <span className="indicador-sequencia">
            <Icone nome="chama" />
          </span>
          Sequência
        </h3>
        <p>
          {resumo.sequencia === 0
            ? "Conclua uma lição para começar sua sequência."
            : `${resumo.sequencia} ${plural(resumo.sequencia, "dia seguido", "dias seguidos")}. ${resumo.estudouHoje ? "Você já estudou hoje." : "Estude hoje para manter."}`}
        </p>
      </div>
      <CartaoMeta resumo={resumo} />
      <div className="cartao">
        <h3>
          <span className="indicador-coracoes">
            <Icone nome="coracao" />
          </span>
          Corações
        </h3>
        <p>
          {resumo.coracoes} de 5.{" "}
          {resumo.coracoes < 5 ? <Link href="/praticar">Recuperar com uma revisão</Link> : "Seus corações estão cheios."}
        </p>
      </div>
    </aside>
  );
}

export function Moldura({ atual, resumo, children }: { atual: Aba; resumo: ResumoAluno; children: React.ReactNode }) {
  return (
    <div className="layout">
      <nav className="nav-lateral" aria-label="Navegação principal">
        <p className="marca">Sibi</p>
        <ItensNav atual={atual} />
      </nav>
      <div className="coluna-central">
        <header className="barra-topo so-celular">
          <p className="marca text-[1.4rem]">Sibi</p>
          <Indicadores resumo={resumo} />
        </header>
        <main className="principal" id="conteudo-principal">
          {children}
        </main>
      </div>
      <Painel resumo={resumo} />
      <nav className="nav-inferior" aria-label="Navegação principal">
        <ItensNav atual={atual} />
      </nav>
    </div>
  );
}

/** Esqueleto das telas com menu, enquanto os dados do aluno carregam. */
export function MolduraCarregando() {
  return (
    <main className="principal" id="conteudo-principal">
      <div className="carregando" aria-busy="true">
        <div className="esqueleto h-24" />
        <div className="esqueleto mx-auto h-[76px] w-[76px] rounded-full" />
        <div className="esqueleto mx-auto h-[76px] w-[76px] rounded-full" />
      </div>
    </main>
  );
}
