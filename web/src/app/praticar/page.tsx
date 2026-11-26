import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { BotaoComecar, BotaoRecuperar, BotaoRevisao } from "@/app/licao/[id]/botao";
import { Icone } from "@/componentes/Icone";
import { Mascote } from "@/componentes/Mascote";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { CartaoDesafio } from "@/app/desafio/CartaoDesafio";
import { NOMES_DEGRAU } from "@/modulos/gamificacao/dominio";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { errosRecentes } from "@/servidor/licoes/erros";
import { estadoPraticar } from "@/servidor/licoes/revisao";
import { BlocoCodigo } from "@/componentes/licao/Codigo";
import { RespostaCorreta } from "@/componentes/licao/Exercicios";

export const metadata: Metadata = { title: "Praticar" };

async function Praticar() {
  const { perfil } = await obterPerfilAtual();
  const [resumo, praticar, erros] = await Promise.all([resumoDoAluno(banco(), perfil), estadoPraticar(banco(), perfil), errosRecentes(banco(), perfil.id)]);
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

          <Link className="cartao cartao-desafio" href="/laboratorio">
            <span className="cartao-desafio-corpo">
              <strong>Laboratório de Python</strong>
              <span className="cartao-desafio-texto">Escreva o programa que quiser e rode Python de verdade, aqui no aparelho.</span>
            </span>
            <span className="cartao-desafio-jogar">
              Abrir <Icone nome="seta" pequeno />
            </span>
          </Link>

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

          {erros.length > 0 && (
            <section className="cartao" aria-labelledby="titulo-erros">
              <h2 id="titulo-erros">
                Meus erros recentes <span className="contagem-conquistas">{erros.length}</span>
              </h2>
              <p className="ajuda mb-3">Errar é como se aprende. Toque num erro para ver a resposta certa e a explicação.</p>
              <ul className="lista-erros">
                {erros.map((e) => (
                  <li key={e.exercicioId}>
                    <details className="erro-recente">
                      <summary>
                        <span>{e.exercicio.enunciado}</span>
                        {e.corrigido && <span className="selo-estado consolidando">Já acertou depois</span>}
                      </summary>
                      <div className="erro-recente-corpo">
                        {e.exercicio.codigo && e.exercicio.tipo !== "completar_lacuna" && <BlocoCodigo codigo={e.exercicio.codigo} />}
                        <p className="rotulo-bloco">Resposta certa</p>
                        <RespostaCorreta ex={e.exercicio} solucao={e.solucao} />
                        <p>{e.explicacao}</p>
                        <BotaoComecar licaoId={e.licaoId} rotulo="Praticar esta lição" classe="botao botao-secundario botao-pequeno" />
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="cartao">
            <h2>
              Seus conceitos <span className="contagem-conquistas">{praticar.conceitos.length} de {praticar.totalConceitos} vistos</span>
            </h2>
            <p className="ajuda mb-3">Acertar na revisão, sem dica, sobe um degrau. Toque num conceito para rever o cartão.</p>
            <Link className="botao botao-secundario botao-pequeno mb-3" href="/caderno">
              <Icone nome="livro" /> Abrir o caderno de conceitos
            </Link>
            <ul className="lista-conceitos">
              {praticar.conceitos.map((c) => (
                <li key={c.id}>
                  <Link className="conceito-nome" href={`/caderno/${c.id}`}>
                    {c.nome}
                  </Link>
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
