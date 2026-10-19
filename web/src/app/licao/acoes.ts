"use server";
import { redirect } from "next/navigation";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { iniciarSessao } from "@/servidor/licoes/servico";

export type EstadoInicio = { erro?: string };

/** Começa ou retoma a lição e leva à sessão. O aluno vem da sessão verificada, nunca do formulário. */
export async function comecarLicao(licaoId: string): Promise<EstadoInicio> {
  const { aluno } = await obterPerfilAtual();
  const resultado = await iniciarSessao(banco(), aluno.id, licaoId);
  if (!resultado.ok) {
    return { erro: resultado.motivo === "bloqueada" ? "Conclua a lição anterior para liberar esta." : "Essa lição não está disponível." };
  }
  redirect(`/sessao/${resultado.sessaoId}`);
}
