// Entrada com Google: cookie com meta, fuso e aceite (modulos/conta/entrada-google.ts) e criação do perfil
// na volta do Google, com o teto de contas do teste (modulos/conta/vagas.ts).
import "server-only";
import { eq } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { cookies } from "next/headers";
import { COOKIE_ENTRADA_GOOGLE, VALIDADE_ENTRADA_GOOGLE_S, type EntradaGoogle } from "@/modulos/conta/entrada-google";
import { cadastroAberto } from "@/modulos/conta/vagas";
import * as t from "@/servidor/db/esquema";
import { obterOuCriarPerfil } from "@/servidor/perfis/servico";
import { contarContas } from "@/servidor/perfis/vagas";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

export async function guardarEntradaGoogle(entrada: EntradaGoogle) {
  (await cookies()).set(COOKIE_ENTRADA_GOOGLE, JSON.stringify(entrada), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: VALIDADE_ENTRADA_GOOGLE_S,
    path: "/",
  });
}

/** O que importa do usuário do Supabase Auth logo depois da troca do código. */
export type UsuarioDoProvedor = { id: string; app_metadata?: { provider?: string }; user_metadata?: Record<string, unknown> };

/**
 * Prepara o perfil de quem acabou de voltar de um provedor (Google). Conta que já tem perfil: nada muda.
 * Conta nova: só ganha perfil se houver vaga no teste; o perfil leva o primeiro nome do Google e a meta,
 * o fuso e o aceite guardados no cookie. Entradas por e-mail seguem o caminho de sempre (perfil no 1º acesso).
 */
export async function prepararPerfilDoProvedor(db: Db, usuario: UsuarioDoProvedor, entrada: EntradaGoogle | null): Promise<"ok" | "sem-vagas"> {
  if (usuario.app_metadata?.provider !== "google") return "ok";
  const [existente] = await db.select({ id: t.perfis.id }).from(t.perfis).where(eq(t.perfis.id, usuario.id));
  if (existente) return "ok";
  if (!cadastroAberto(await contarContas(db))) return "sem-vagas";
  await obterOuCriarPerfil(db, usuario.id, { ...usuario.user_metadata, ...entrada }, false);
  return "ok";
}
