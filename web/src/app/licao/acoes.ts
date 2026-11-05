"use server";
import { redirect } from "next/navigation";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { iniciarRevisao } from "@/servidor/licoes/revisao";
import { iniciarRecuperacao, iniciarSessao } from "@/servidor/licoes/servico";

export type EstadoInicio = { erro?: string };

const ERROS_INICIO = {
  bloqueada: "Conclua a lição anterior para liberar esta.",
  inexistente: "Essa lição não está disponível.",
  sem_coracoes: "Você está sem corações. Faça uma revisão rápida para recuperar.",
};

/** Começa ou retoma a lição e leva à sessão. O aluno vem da sessão verificada, nunca do formulário. */
export async function comecarLicao(licaoId: string): Promise<EstadoInicio> {
  const { aluno } = await obterPerfilAtual();
  const resultado = await iniciarSessao(banco(), aluno.id, licaoId);
  if (!resultado.ok) return { erro: ERROS_INICIO[resultado.motivo] };
  redirect(`/sessao/${resultado.sessaoId}`);
}

/** Monta (ou retoma) a revisão recomendada (FL-05) e leva a ela. */
export async function comecarRevisao(): Promise<EstadoInicio> {
  const { aluno } = await obterPerfilAtual();
  const resultado = await iniciarRevisao(banco(), aluno.id);
  if (!resultado.ok) return { erro: "As revisões aparecem depois da sua primeira lição." };
  redirect(`/sessao/${resultado.sessaoId}`);
}

/** Monta uma revisão de recuperação de corações (FL-06) e leva a ela. */
export async function recuperarCoracoes(): Promise<EstadoInicio> {
  const { aluno } = await obterPerfilAtual();
  const resultado = await iniciarRecuperacao(banco(), aluno.id);
  if (!resultado.ok) {
    return { erro: resultado.motivo === "coracoes_cheios" ? "Seus corações já estão cheios." : "Ainda não há exercícios suficientes para uma revisão." };
  }
  redirect(`/sessao/${resultado.sessaoId}`);
}
