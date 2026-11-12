// Camada de acesso: único ponto que lê a sessão. Páginas, ações e Route Handlers obtêm
// o aluno daqui e passam só o identificador verificado aos serviços (E04.6).
import "server-only";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";
import { banco } from "@/servidor/db/cliente";
import { obterOuCriarPerfil, type Perfil } from "@/servidor/perfis/servico";
import { criarClienteSupabase } from "./supabase";

/** visitante: sessão anônima do Supabase ("Entrar como visitante"), sem e-mail nem senha. */
export type Aluno = { id: string; email: string | null; metadados: unknown; visitante: boolean };

/** Aluno da sessão atual, com o token verificado, ou null. Uma leitura por requisição. */
export const obterAluno = cache(async (): Promise<Aluno | null> => {
  // A validade do token depende da hora da requisição: nada daqui entra em pré-renderização.
  await connection();
  const supabase = await criarClienteSupabase();
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims?.sub) return null;
  const { sub, email, user_metadata, is_anonymous } = data.claims;
  return { id: sub, email: typeof email === "string" && email ? email : null, metadados: user_metadata, visitante: is_anonymous === true };
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
  const perfil = await obterOuCriarPerfil(banco(), aluno.id, aluno.metadados, aluno.visitante);
  return { aluno, perfil };
});
