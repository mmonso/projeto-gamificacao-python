// E-mail aguardando confirmação, guardado no navegador do cadastro para a tela
// "Confira seu e-mail" e o reenvio do link. Não sai do servidor em nenhuma resposta além dessa tela.
import "server-only";
import { cookies } from "next/headers";

export const COOKIE_EMAIL_PENDENTE = "sibi-email-pendente";

export async function guardarEmailPendente(email: string) {
  (await cookies()).set(COOKIE_EMAIL_PENDENTE, email, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function lerEmailPendente(): Promise<string | null> {
  return (await cookies()).get(COOKIE_EMAIL_PENDENTE)?.value ?? null;
}
