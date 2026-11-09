// Estrutura das telas com menu (F-33; protótipo E03.3): no desktop, menu lateral, conteúdo e painel de metas;
// no celular, uma coluna com indicadores no topo e navegação inferior.
import Link from "next/link";
import { nomeDoDia, proximoMarco } from "@/modulos/gamificacao/semana";
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

type ResumoTopo = Pick<ResumoAluno, "sequencia" | "maiorSequencia" | "estudouHoje" | "coracoes" | "xpTotal" | "meta" | "sessoesHoje" | "semana">;

/** Semana de domingo a sábado: dia estudado em dourado, hoje pendente tracejado, dia perdido em cinza (nunca vermelho). */
export function CalendarioSemana({ semana }: { semana: ResumoAluno["semana"] }) {
  return (
    <ol className="calendario" aria-label="Dias de estudo desta semana">
      {semana.map((d) => {
        const estado = d.estudou ? "estudou" : d.futuro ? "futuro" : d.hoje ? "pendente" : "perdido";
        const descricao = d.estudou ? "estudou" : d.futuro ? "ainda não chegou" : d.hoje ? "hoje, ainda sem estudo" : "sem estudo";
        return (
          <li key={d.dia} className={estado} aria-label={`${nomeDoDia(d.dia)}: ${descricao}`}>
            <span className="bolinha" aria-hidden="true">
              {d.estudou && <Icone nome="chama" />}
            </span>
            <span aria-hidden="true">{d.letra}</span>
          </li>
        );
      })}
    </ol>
  );
}

/** Anel da meta do dia: trilho vazio, arco parcial e disco dourado quando cumprida. */
function AnelMeta({ feitas, meta }: { feitas: number; meta: number }) {
  const cheia = feitas >= meta;
  const parte = Math.min(100, Math.round((feitas / meta) * 100));
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" className={cheia ? "cheia" : ""}>
      <circle className="trilho" cx="18" cy="18" r="15" pathLength={100} />
      {!cheia && parte > 0 && <circle className="arco" cx="18" cy="18" r="15" pathLength={100} strokeDasharray={`${parte} 100`} transform="rotate(-90 18 18)" />}
      {cheia ? (
        <path d="m11.5 18.5 4.5 4.5 8.5-9" fill="none" stroke="#8A5A00" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m18 10.5 2.2 4.6 5 .7-3.6 3.5.9 5-4.5-2.4-4.5 2.4.9-5-3.6-3.5 5-.7L18 10.5z" fill="#B8C4CB" />
      )}
    </svg>
  );
}

/**
 * Indicadores do topo (celular) e do painel (desktop). Meta e sequência abrem um painel nativo (popover),
 * que fecha com Esc ou com um toque fora; `local` diferencia os ids das duas cópias da página.
 */
export function Indicadores({ resumo, local }: { resumo: ResumoTopo; local: "topo" | "painel" }) {
  const feitas = Math.min(resumo.sessoesHoje, resumo.meta);
  const faltam = resumo.meta - feitas;
  const marco = proximoMarco(resumo.sequencia);
  return (
    <div className="indicadores" aria-label="Seus indicadores">
      <button type="button" className="indicador anel-meta" popoverTarget={`meta-${local}`} aria-label={`Meta do dia: ${feitas} de ${resumo.meta}`}>
        <AnelMeta feitas={feitas} meta={resumo.meta} />
      </button>
      <button
        type="button"
        className="indicador indicador-sequencia"
        popoverTarget={`sequencia-${local}`}
        aria-label={`${resumo.sequencia} ${plural(resumo.sequencia, "dia de sequência", "dias de sequência")}`}
      >
        <Icone nome="chama" />
        <span aria-hidden="true">{resumo.sequencia}</span>
      </button>
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

      <div id={`meta-${local}`} popover="auto" className="pop" aria-label="Meta do dia">
        <p className="pop-titulo">Meta do dia</p>
        <p>
          {feitas} de {resumo.meta} {plural(resumo.meta, "sessão", "sessões")}
        </p>
        <div className="progresso-meta" aria-hidden="true">
          <span style={{ width: `${(feitas / resumo.meta) * 100}%` }} />
        </div>
        <p className="ajuda">{faltam <= 0 ? "Meta cumprida! Volte amanhã para manter a sequência." : `${faltam === 1 ? "Falta 1 sessão" : `Faltam ${faltam} sessões`} hoje.`}</p>
        <div className="pop-acoes">
          {faltam > 0 && (
            <Link className="botao botao-pequeno" href="/aprender">
              Estudar agora
            </Link>
          )}
          <Link className="link-discreto" href="/perfil">
            Mudar a meta
          </Link>
        </div>
      </div>

      <div id={`sequencia-${local}`} popover="auto" className="pop" aria-label="Sequência">
        <p className="pop-numero">
          <Icone nome="chama" /> {resumo.sequencia}
          <span>{plural(resumo.sequencia, "dia de sequência", "dias de sequência")}</span>
        </p>
        <CalendarioSemana semana={resumo.semana} />
        <p className="ajuda">
          {resumo.sequencia === 0 ? "Conclua uma lição para começar sua sequência." : resumo.estudouHoje ? "Você já estudou hoje." : "Estude hoje para manter a sequência."}
          {marco && ` Próximo marco: ${marco} dias.`} Maior sequência: {resumo.maiorSequencia} {plural(resumo.maiorSequencia, "dia", "dias")}.
        </p>
      </div>
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
      <Indicadores resumo={resumo} local="painel" />
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
        <CalendarioSemana semana={resumo.semana} />
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
          <Indicadores resumo={resumo} local="topo" />
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
