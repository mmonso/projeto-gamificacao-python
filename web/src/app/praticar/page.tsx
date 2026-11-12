import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BotaoComecar, BotaoRecuperar, BotaoRevisao } from "@/app/licao/[id]/botao";
import { Icone } from "@/componentes/Icone";
import { Mascote } from "@/componentes/Mascote";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { diaDoDesafio, numeroDoDia } from "@/modulos/desafio/desafio";
import { NOMES_DEGRAU } from "@/modulos/gamificacao/dominio";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { estadoPraticar } from "@/servidor/licoes/revisao";

export const metadata: Metadata = { title: "Praticar" };

async function Praticar() {
  const { perfil } = await obterPerfilAtual();
  const [resumo, praticar] = await Promise.all([resumoDoAluno(banco(), perfil), estadoPraticar(banco(), perfil)]);
  const vazio = praticar.conceitos.length === 0;

  return (
    <Moldura atual="praticar" resumo={resumo}>
      <h1 className="mb-4">Praticar</h1>
      {vazio ? (
        <div className="pilha">
          <div className="estado-vazio cartao">
            <Mascote humor="descanso" tamanho="medio" />
            <h2>Nada para revisar ainda</h2>
            <p>As revisões aparecem depois da sua primeira lição.</p>
            <Link className="botao botao-pequeno" href="/aprender">
              Ir para a trilha
            </Link>
          </div>
          <CartaoDesafio />
          {resumo.coracoes < 5 && <CartaoCoracoes coracoes={resumo.coracoes} />}
        </div>
      ) : (
        <div className="pilha">
          <div className="cartao cartao-destaque">
            <h2>
              <Icone nome="revisao" /> {praticar.conceitosVencidos > 0 ? "Revisão recomendada" : "Revisão geral"}
            </h2>
            <p className="mb-3">
              {praticar.conceitosVencidos > 0
                ? `${praticar.conceitosVencidos} ${praticar.conceitosVencidos === 1 ? "conceito está" : "conceitos estão"} no ponto de revisar. Exercícios novos sobre o que você já viu, sem gastar corações.`
                : "Nada para revisar hoje. Uma revisão geral reforça o que você já viu, sem gastar corações."}
            </p>
            <BotaoRevisao rotulo={praticar.revisaoAberta ? "Continuar revisão" : "Começar revisão"} />
          </div>

          <CartaoDesafio />

          {resumo.coracoes < 5 ? (
            <CartaoCoracoes coracoes={resumo.coracoes} />
          ) : (
            <p className="cartao flex items-center gap-2">
              <span className="indicador-coracoes">
                <Icone nome="coracao" pequeno />
              </span>
              Seus corações estão cheios.
            </p>
          )}

          {praticar.licoesConcluidas.length > 0 && (
            <section className="cartao">
              <h2>Lições concluídas</h2>
              <p className="ajuda mb-3">Praticar uma lição não gasta corações e rende XP de prática até três vezes por dia.</p>
              <ul className="lista-licoes">
                {praticar.licoesConcluidas.map((l) => (
                  <li key={l.id}>
                    <span>
                      <span className="ajuda block">
                        Unidade {l.unidadeOrdem} · {l.ordem === 5 ? "Desafio" : `Lição ${l.ordem}`}
                      </span>
                      {l.titulo}
                    </span>
                    <BotaoComecar licaoId={l.id} rotulo="Praticar" classe="botao botao-secundario botao-pequeno" />
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="cartao">
            <h2>
              Seus conceitos <span className="contagem-conquistas">{praticar.conceitos.length} de {praticar.totalConceitos} vistos</span>
            </h2>
            <p className="ajuda mb-3">
              Cada acerto na revisão, sem dica, sobe um degrau: Visto, Praticando, Firmando e Consolidando. A revisão volta depois de 1, 3 e 7 dias; erros e dicas trazem o conceito de volta mais cedo.
            </p>
            <ul className="lista-conceitos">
              {praticar.conceitos.map((c) => (
                <li key={c.id}>
                  <span className="conceito-nome">{c.nome}</span>
                  <span className="degraus" role="img" aria-label={`${NOMES_DEGRAU[c.degrau]}, degrau ${c.degrau} de 4`}>
                    {[1, 2, 3, 4].map((n) => (
                      <i key={n} className={n <= c.degrau ? "cheio" : ""} />
                    ))}
                  </span>
                  <span className={`selo-estado ${c.vencido ? "vencido" : c.estado}`}>{c.vencido ? "Para revisar" : NOMES_DEGRAU[c.degrau]}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </Moldura>
  );
}

function CartaoCoracoes({ coracoes }: { coracoes: number }) {
  return (
    <div className="cartao">
      <h2>
        <span className="indicador-coracoes">
          <Icone nome="coracao" />
        </span>
        Recuperar corações
      </h2>
      <p className="mb-3">Você tem {coracoes} de 5. Uma revisão de 5 exercícios devolve 2 corações.</p>
      <BotaoRecuperar classe="botao botao-secundario" />
    </div>
  );
}

export default function PaginaPraticar() {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Praticar />
    </Suspense>
  );
}

/** Desafio do dia: o mesmo para todo mundo, sem XP, feito para jogar e mandar aos amigos. */
function CartaoDesafio() {
  return (
    <Link className="cartao cartao-desafio" href="/desafio">
      <span className="cartao-desafio-quadrados" aria-hidden="true">
        🟩🟨🟥
      </span>
      <span>
        <strong>Desafio do dia #{numeroDoDia(diaDoDesafio())}</strong>
        <span className="block">5 perguntas de &quot;qual é a saída?&quot;, iguais para todo mundo. Jogue e mande o placar aos amigos.</span>
      </span>
    </Link>
  );
}
