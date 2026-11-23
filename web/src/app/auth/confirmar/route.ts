// Destino dos links de e-mail (verificação de cadastro e recuperação de acesso) e da volta do Google (FL-02).
// Aceita o formato com token_hash (modelo de e-mail do servidor) e o código PKCE (modelo padrão do Supabase e Google).
import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse, type NextRequest } from "next/server";
import { destinoSeguro } from "@/modulos/conta/conta";
import { COOKIE_ENTRADA_GOOGLE, lerEntradaGoogle } from "@/modulos/conta/entrada-google";
import { COOKIE_EMAIL_PENDENTE } from "@/servidor/auth/email-pendente";
import { prepararPerfilDoProvedor } from "@/servidor/auth/entrada-google";
import { criarClienteSupabase } from "@/servidor/auth/supabase";
import { banco } from "@/servidor/db/cliente";

const TIPOS: EmailOtpType[] = ["signup", "email", "recovery", "invite", "magiclink", "email_change"];

export async function GET(request: NextRequest) {
  const parametros = request.nextUrl.searchParams;
  const proximo = destinoSeguro(parametros.get("proximo"));
  const tokenHash = parametros.get("token_hash");
  const tipo = parametros.get("type") as EmailOtpType | null;
  const codigo = parametros.get("code");
  // Presente só quando o aluno saiu daqui para o Google (ação entrarComGoogle).
  const cookieGoogle = request.cookies.get(COOKIE_ENTRADA_GOOGLE)?.value;
  const vindoDoGoogle = cookieGoogle !== undefined;

  let confirmado = false;
  let semVagas = false;
  if (!parametros.has("error")) {
    const supabase = await criarClienteSupabase();
    if (tokenHash && tipo && TIPOS.includes(tipo)) {
      confirmado = !(await supabase.auth.verifyOtp({ type: tipo, token_hash: tokenHash })).error;
    } else if (codigo) {
      confirmado = !(await supabase.auth.exchangeCodeForSession(codigo)).error;
      if (confirmado) {
        const { data } = await supabase.auth.getUser();
        if (data.user && (await prepararPerfilDoProvedor(banco(), data.user, lerEntradaGoogle(cookieGoogle))) === "sem-vagas") {
          // Conta nova do Google sem vaga no teste: sai da sessão e explica na tela de entrar.
          await supabase.auth.signOut({ scope: "local" });
          confirmado = false;
          semVagas = true;
        }
      }
    }
  }

  const destino = request.nextUrl.clone();
  destino.search = "";
  let resposta: NextResponse;
  if (confirmado) {
    const [caminho, consulta] = proximo.split("?");
    destino.pathname = caminho;
    destino.search = consulta ? `?${consulta}` : "";
    resposta = NextResponse.redirect(destino);
    resposta.cookies.delete(COOKIE_EMAIL_PENDENTE);
  } else if (semVagas || vindoDoGoogle) {
    // Sem vaga, Google cancelado ou falha na troca do código: voltar a entrar, com o motivo.
    destino.pathname = "/entrar";
    destino.searchParams.set("aviso", semVagas ? "sem-vagas" : "google");
    resposta = NextResponse.redirect(destino);
  } else {
    // Link expirado, já usado ou aberto em outro navegador (no fluxo PKCE, o e-mail fica confirmado mesmo assim).
    destino.pathname = "/link-invalido";
    if (proximo === "/nova-senha") destino.searchParams.set("tipo", "senha");
    resposta = NextResponse.redirect(destino);
  }
  if (vindoDoGoogle) resposta.cookies.delete(COOKIE_ENTRADA_GOOGLE);
  return resposta;
}
