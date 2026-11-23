// Entrada com Google: criação do perfil de uma conta nova, com o teto de contas do teste (modulos/conta/vagas.ts).
import "server-only";
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import type { EntradaGoogle } from "@/modulos/conta/entrada-google";
import { cadastroAberto } from "@/modulos/conta/vagas";
import * as t from "@/servidor/db/esquema";
import { obterOuCriarPerfil } from "@/servidor/perfis/servico";
import { contarContas } from "@/servidor/perfis/vagas";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

/** O que importa do usuário do Supabase Auth logo depois de entrar. */
export type UsuarioDoProvedor = { id: string; app_metadata?: { provider?: string }; user_metadata?: Record<string, unknown> };

/**
 * Prepara o perfil de quem acabou de entrar pelo Google. Conta que já tem perfil: nada muda.
 * Conta nova: só ganha perfil se houver vaga no teste; o perfil leva o primeiro nome do Google e a meta,
 * o fuso e o aceite enviados pelo botão. Entradas por e-mail seguem o caminho de sempre (perfil no 1º acesso).
 */
export async function prepararPerfilDoProvedor(db: Db, usuario: UsuarioDoProvedor, entrada: EntradaGoogle | null): Promise<"ok" | "sem-vagas"> {
  if (usuario.app_metadata?.provider !== "google") return "ok";
  const [existente] = await db.select({ id: t.perfis.id }).from(t.perfis).where(eq(t.perfis.id, usuario.id));
  if (existente) return "ok";
  if (!cadastroAberto(await contarContas(db))) return "sem-vagas";
  await obterOuCriarPerfil(db, usuario.id, { ...usuario.user_metadata, ...entrada }, false);
  return "ok";
}
