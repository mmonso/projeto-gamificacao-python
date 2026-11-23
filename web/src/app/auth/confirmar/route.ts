// Destino dos links de e-mail: verificação de cadastro e recuperação de acesso (FL-02).
// Aceita o formato com token_hash (modelo de e-mail do servidor) e o código PKCE (modelo padrão do Supabase).
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { destinoSeguro } from "@/modulos/conta/conta";
import { COOKIE_EMAIL_PENDENTE } from "@/servidor/auth/email-pendente";
import { criarClienteSupabase } from "@/servidor/auth/supabase";

const TIPOS: EmailOtpType[] = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  const proximo = destinoSeguro(parametros.get("proximo"));
  const tokenHash = parametros.get("token_hash");
  const tipo = parametros.get("type") as EmailOtpType | null;
  const codigo = parametros.get("code");

  let confirmado = false;
  if (!parametros.has("error")) {
    const supabase = await criarClienteSupabase();
    if (tokenHash && tipo && TIPOS.includes(tipo)) {
      confirmado = !(await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash })).error;
    } else if (codigo) {
      confirmado = !(await supabase.auth.exchangeCodeForSession(codigo)).error;
    }
  }

  const destino = request.nextUrl.clone();
  destino.search = "";
  if (confirmado) {
    const [caminho, consulta] = proximo.split("?");
    destino.pathname = caminho;
    destino.search = consulta ? `?${consulta}` : "";
    const resposta = NextResponse.redirect(destino);
    resposta.cookies.delete(COOKIE_EMAIL_PENDENTE);
    return resposta;
  }

  // Link expirado, já usado ou aberto em outro navegador (no fluxo PKCE, o e-mail fica confirmado mesmo assim).
  destino.pathname = "/link-invalido";
  if (proximo === "/nova-senha") destino.searchParams.set("tipo", "senha");
  return NextResponse.redirect(destino);
}
