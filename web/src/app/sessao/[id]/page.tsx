import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Voltar } from "@/componentes/formulario";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { obterSessaoAtual } from "@/servidor/licoes/servico";

export const metadata: Metadata = { title: "Lição" };

// Exibição do exercício atual. A interação (responder, dicas, feedback) entra no motor de lições (E05).
function Exercicio({ ex }: { ex: ExercicioPublico }) {
  return (
    <section className="grid gap-4" aria-labelledby="enunciado">
      <h2 id="enunciado">{ex.enunciado}</h2>
      {ex.codigo && <pre className="cartao overflow-x-auto font-mono text-[0.95rem] whitespace-pre">{ex.codigo}</pre>}
      {ex.saidaEsperada && (
        <div>
          <p className="ajuda font-extrabold">Saída esperada</p>
          <pre className="cartao overflow-x-auto font-mono text-[0.95rem]">{ex.saidaEsperada}</pre>
        </div>
      )}
      {ex.tipo === "escolher_resultado" && (
        <ul className="grid gap-2">
          {ex.opcoes.map((o) => (
            <li key={o.id} className={`cartao ${ex.opcoesSao === "texto" ? "" : "font-mono"}`}>
              {o.erro ? "O programa dá erro" : o.texto}
            </li>
          ))}
        </ul>
      )}
      {ex.tipo === "completar_lacuna" && (
        <p className="ajuda">
          {ex.lacunas.length === 1 ? "1 lacuna" : `${ex.lacunas.length} lacunas`} para completar com: {ex.lacunas.flatMap((l) => l.opcoes).join(", ")}
        </p>
      )}
      {ex.tipo === "ordenar_blocos" && (
        <ul className="grid gap-2">
          {ex.blocos.map((b) => (
            <li key={b.id} className="cartao font-mono">
              {b.codigo}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

async function SessaoAtual({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { aluno } = await obterPerfilAtual();
  const sessao = await obterSessaoAtual(banco(), aluno.id, id);
  if (!sessao) notFound();

  const numero = Math.min(sessao.resolvidos + 1, sessao.totalItens);
  return (
    <>
      <p className="ajuda font-extrabold uppercase tracking-wide">
        {sessao.licao.unidadeTitulo} · {sessao.licao.titulo}
      </p>
      <div
        className="h-3.5 overflow-hidden rounded-full bg-[var(--fundo-suave)]"
        role="progressbar"
        aria-label="Progresso da lição"
        aria-valuemin={0}
        aria-valuemax={sessao.totalItens}
        aria-valuenow={sessao.resolvidos}
      >
        <span className="block h-full rounded-full bg-[var(--verde)]" style={{ width: `${(sessao.resolvidos / sessao.totalItens) * 100}%` }} />
      </div>
      <p className="ajuda">
        Exercício {numero} de {sessao.totalItens}
      </p>
      {sessao.exercicio ? <Exercicio ex={sessao.exercicio} /> : <p>Lição concluída.</p>}
      <p className="mensagem-aviso">Em breve você poderá responder aqui. Sua lição fica guardada e continua deste ponto.</p>
    </>
  );
}

export default function PaginaSessao({ params }: PageProps<"/sessao/[id]">) {
  return (
    <main className="tela-centro justify-start" id="conteudo-principal">
      <Voltar href="/perfil" />
      <Suspense fallback={<div className="esqueleto h-96" aria-busy="true" />}>
        <SessaoAtual params={params} />
      </Suspense>
    </main>
  );
}
