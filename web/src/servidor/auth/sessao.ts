// Camada de acesso: único ponto que lê a sessão. Páginas, ações e Route Handlers obtêm
// o aluno daqui e passam só o identificador verificado aos serviços (E04.6).
import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import { banco } from "@/servidor/db/cliente";
import { obterOuCriarPerfil, type Perfil } from "@/servidor/perfis/servico";
import { criarClienteSupabase } from "./supabase";

export type Aluno = { id: string; email: string | null; metadados: unknown };

/** Aluno da sessão atual, com o token verificado, ou null. Uma leitura por requisição. */
export const obterAluno = cache(async (): Promise<Aluno | null> => {
  const supabase = await criarClienteSupabase();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  const { sub, email, user_metadata } = data.claims;
  return { id: sub, email: typeof email === "string" ? email : null, metadados: user_metadata };
});

/** Aluno autenticado; sem sessão, leva ao login. */
export async function exigirAluno(): Promise<Aluno> {
  const aluno = await obterAluno();
  if (!aluno) redirect("/entrar");
  return aluno;
}

/** Perfil do aluno autenticado, criado no primeiro acesso. */
export const obterPerfilAtual = cache(async (): Promise<{ aluno: Aluno; perfil: Perfil }> => {
  const aluno = await exigirAluno();
  const perfil = await obterOuCriarPerfil(banco(), aluno.id, aluno.metadados);
  return { aluno, perfil };
});
