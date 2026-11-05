"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { fusoValido } from "@/modulos/gamificacao/dias";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { criarClienteSupabase } from "@/servidor/auth/supabase";
import { banco } from "@/servidor/db/cliente";
import { excluirDadosDoAluno, excluirUsuarioAuth, mudarFuso, mudarMeta, mudarNome } from "@/servidor/perfis/preferencias";

export type EstadoPreferencia = { erro?: string; aviso?: string };

const meta = z.coerce.number().int().min(1).max(3);

export async function salvarMeta(_: EstadoPreferencia, dados: FormData): Promise<EstadoPreferencia> {
  const { aluno } = await obterPerfilAtual();
  const valor = meta.safeParse(dados.get("meta"));
  if (!valor.success) return { erro: "Escolha uma meta de 1 a 3 sessões." };
  await mudarMeta(banco(), aluno.id, valor.data);
  revalidatePath("/perfil");
  return { aviso: "Meta atualizada. Ela vale a partir de hoje." };
}

export async function salvarFuso(_: EstadoPreferencia, dados: FormData): Promise<EstadoPreferencia> {
  const { aluno, perfil } = await obterPerfilAtual();
  const fuso = String(dados.get("fuso") ?? "");
  if (!fusoValido(fuso)) return { erro: "Fuso horário inválido." };
  await mudarFuso(banco(), aluno.id, fuso);
  revalidatePath("/perfil");
  return { aviso: fuso === perfil.fuso ? "Fuso mantido." : "Fuso salvo. Ele passa a valer a partir do próximo dia de estudo." };
}

export async function salvarNome(_: EstadoPreferencia, dados: FormData): Promise<EstadoPreferencia> {
  const { aluno } = await obterPerfilAtual();
  const nome = z.string().trim().max(40).safeParse(dados.get("nome") ?? "");
  if (!nome.success) return { erro: "O nome pode ter no máximo 40 caracteres." };
  await mudarNome(banco(), aluno.id, nome.data);
  revalidatePath("/perfil");
  return { aviso: "Nome atualizado." };
}

/** Exclui a conta e todos os dados (F-32, CA-116). Exige digitar EXCLUIR para confirmar. */
export async function excluirConta(_: EstadoPreferencia, dados: FormData): Promise<EstadoPreferencia> {
  const { aluno } = await obterPerfilAtual();
  if (String(dados.get("confirmacao") ?? "").trim().toUpperCase() !== "EXCLUIR") return { erro: "Digite EXCLUIR para confirmar." };
  try {
    await banco().transaction(async (tx) => {
      await excluirDadosDoAluno(tx, aluno.id);
      await excluirUsuarioAuth(tx, aluno.id);
    });
  } catch {
    return { erro: "Não foi possível excluir a conta agora. Tente de novo em instantes." };
  }
  const supabase = await criarClienteSupabase();
  await supabase.auth.signOut();
  redirect("/?conta=excluida");
}
