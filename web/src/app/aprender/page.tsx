import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Icone, type NomeIcone } from "@/componentes/Icone";
import { Mascote } from "@/componentes/Mascote";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { obterTrilha, type NoTrilha, type UnidadeTrilha } from "@/servidor/licoes/servico";
import { estadoMiniteste } from "@/servidor/miniteste";
import { OfertaTransferencia } from "./OfertaTransferencia";
import { RolarParaAtual } from "./RolarParaAtual";

export const metadata: Metadata = { title: "Aprender" };

// Trilha sinuosa (F-07; design/ANALISE_UX_GAMIFICACAO.md, seção 5): cada item tem altura fixa, o que permite
// desenhar no servidor o caminho que liga os centros dos nós, sólido no trecho feito e pontilhado no resto.
const DESLOCAMENTOS = [0, 56, 84, 56, 0, -56, -84, -56];
const ALTURA = 132;
const CENTRO = 38;
const NOME_ESTADO = { concluida: "concluída", atual: "lição atual", bloqueada: "bloqueada" } as const;
/** Pontos de revisão (F-09): depois da segunda e da última lição de cada unidade. */
const REVISAO_DEPOIS = [2, 5];

type Item =
  | { tipo: "licao"; licao: NoTrilha }
  | { tipo: "revisao"; liberada: boolean; depois: number; chave: string }
  | { tipo: "trofeu"; ganho: boolean };

function itensDa(u: UnidadeTrilha): Item[] {
  const itens: Item[] = [];
  u.licoes.forEach((l, i) => {
    itens.push({ tipo: "licao", licao: l });
    if (REVISAO_DEPOIS.includes(i + 1)) itens.push({ tipo: "revisao", liberada: l.estado === "concluida", depois: i + 1, chave: `revisao-${l.id}` });
  });
  itens.push({ tipo: "trofeu", ganho: u.licoes.every((l) => l.estado === "concluida") });
  return itens;
}

const deslocamento = (i: number) => DESLOCAMENTOS[i % DESLOCAMENTOS.length];

/** Caminho entre os centros dos itens `de` a `ate`, em curvas suaves. */
function caminho(de: number, ate: number): string {
  let d = `M ${deslocamento(de)} ${de * ALTURA + CENTRO}`;
  for (let i = de + 1; i <= ate; i++) {
    const [x0, x1] = [deslocamento(i - 1), deslocamento(i)];
    const [y0, y1] = [(i - 1) * ALTURA + CENTRO, i * ALTURA + CENTRO];
    const ym = (y0 + y1) / 2;
    d += ` C ${x0} ${ym}, ${x1} ${ym}, ${x1} ${y1}`;
  }
  return d;
}

function Caminho({ total, feito }: { total: number; feito: number }) {
  return (
    <svg className="caminho" viewBox={`-120 0 240 ${total * ALTURA}`} width="240" height={total * ALTURA} aria-hidden="true">
      {feito < total - 1 && <path className="caminho-resto" d={caminho(Math.max(feito, 0), total - 1)} />}
      {feito > 0 && <path className="caminho-feito" d={caminho(0, feito)} />}
    </svg>
  );
}

function No({ licao, nome }: { licao: NoTrilha; nome: string }) {
  const icone: NomeIcone = licao.perfeita ? "coroa" : licao.estado === "concluida" ? "check" : licao.estado === "bloqueada" ? "cadeado" : licao.desafio ? "bandeira" : "estrela";
  const rotulo = `${licao.desafio ? "Desafio final" : `Lição ${licao.ordem}`}: ${licao.titulo}, ${NOME_ESTADO[licao.estado]}${licao.perfeita ? ", perfeita" : ""}`;
  return (
    <>
      <Link href={`/licao/${licao.id}`} className={`no ${licao.estado} ${licao.perfeita ? "perfeita" : ""}`} aria-label={rotulo}>
        <Icone nome={icone} />
      </Link>
      {licao.estado === "atual" && (
        <span className="mascote-trilha" aria-hidden="true">
          <span className="balao">{licao.sessaoAberta ? "Continuar" : nome ? `Bora, ${nome}?` : "Começar"}</span>
          <Mascote humor="incentivo" tamanho="pequeno" />
        </span>
      )}
      <span className="no-rotulo" aria-hidden="true">
        {licao.titulo}
      </span>
    </>
  );
}

function Unidade({ u, nome }: { u: UnidadeTrilha; nome: string }) {
  const itens = itensDa(u);
  const feitas = u.licoes.filter((l) => l.estado === "concluida").length;
  const liberada = u.licoes.some((l) => l.estado !== "bloqueada");
  const atual = itens.findIndex((i) => i.tipo === "licao" && i.licao.estado === "atual");
  const feito = atual >= 0 ? atual : liberada ? itens.length - 1 : 0;
  return (
    <section className={`unidade u${((u.ordem - 1) % 4) + 1} ${liberada ? "" : "bloqueada"}`} aria-labelledby={`unidade-${u.id}`}>
      <div className="unidade-cabeca">
        <p className="rotulo">
          Unidade {u.ordem} · {feitas} de {u.licoes.length}
        </p>
        <h2 id={`unidade-${u.id}`}>{u.titulo}</h2>
        <span className="unidade-progresso" aria-hidden="true">
          <span style={{ width: `${(feitas / u.licoes.length) * 100}%` }} />
        </span>
      </div>
      <p className="unidade-descricao">{u.descricao}</p>
      <div className="trilha-area">
        <Caminho total={itens.length} feito={feito} />
        <ol className="trilha" aria-label={`Lições da unidade ${u.ordem}`}>
          {itens.map((item, i) => {
            const lado = deslocamento(i) > 0 ? "lado-esq" : "lado-dir";
            const estilo = { transform: `translateX(${deslocamento(i)}px)` };
            if (item.tipo === "licao") {
              return (
                <li key={item.licao.id} className={`${item.licao.estado === "atual" ? "li-atual" : ""} ${lado}`} style={estilo}>
                  <No licao={item.licao} nome={nome} />
                </li>
              );
            }
            if (item.tipo === "revisao") {
              return (
                <li key={item.chave} style={estilo}>
                  {item.liberada ? (
                    <Link href="/praticar" className="no revisao" aria-label="Revisão dos conceitos vistos">
                      <Icone nome="revisao" />
                    </Link>
                  ) : (
                    <span className="no revisao bloqueada" role="img" aria-label={`Revisão, bloqueada até concluir a lição ${item.depois}`}>
                      <Icone nome="cadeado" />
                    </span>
                  )}
                  <span className="no-rotulo" aria-hidden="true">
                    Revisão
                  </span>
                </li>
              );
            }
            return (
              <li key="trofeu" style={estilo}>
                <span className={`no trofeu ${item.ganho ? "ganho" : "bloqueada"}`} role="img" aria-label={item.ganho ? `Troféu da unidade ${u.ordem}, conquistado` : `Troféu da unidade ${u.ordem}, ao concluir todas as lições`}>
                  <Icone nome="trofeu" />
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

async function Trilha() {
  const { perfil } = await obterPerfilAtual();
  const [unidades, resumo, miniteste] = await Promise.all([obterTrilha(banco(), perfil.id), resumoDoAluno(banco(), perfil), estadoMiniteste(banco(), perfil.id)]);
  // Mini-teste da unidade 1: o "antes" vale até a lição 1 (a da demonstração), porque as perguntas tratam de
  // números e variáveis, vistos só a partir da lição 2. O "depois" aparece ao concluir a unidade.
  const u1 = unidades[0]?.licoes ?? [];
  const feitasU1 = u1.filter((l) => l.estado === "concluida").length;
  const convite = miniteste.antes === null && feitasU1 <= 1 ? "antes" : miniteste.antes !== null && miniteste.depois === null && u1.length > 0 && feitasU1 === u1.length ? "depois" : null;
  return (
    <Moldura atual="aprender" resumo={resumo}>
      <h1 className="so-leitor">Aprender</h1>
      <OfertaTransferencia licao1NaConta={unidades[0]?.licoes[0]?.estado === "concluida"} />
      {convite && (
        <div className="aviso-conta convite-miniteste">
          <div>
            <p>
              {convite === "antes" ? (
                <>
                  <strong>Antes de seguir:</strong> 5 perguntas rápidas, sem nota, para marcar de onde você parte.
                </>
              ) : (
                <>
                  <strong>Unidade 1 concluída!</strong> Refaça as 5 perguntas do começo e veja quanto você aprendeu.
                </>
              )}
            </p>
            <Link className="botao botao-pequeno" href={convite === "antes" ? "/miniteste" : "/miniteste?momento=depois"}>
              {convite === "antes" ? "Responder (1 minuto)" : "Ver quanto aprendi"}
            </Link>
          </div>
        </div>
      )}
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
      {unidades.map((u) => (
        <Unidade key={u.id} u={u} nome={perfil.nome} />
      ))}
      <RolarParaAtual />
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
