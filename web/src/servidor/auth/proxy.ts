// Renovação da sessão a cada requisição. Componentes de servidor não gravam cookies,
// então o token expirado é renovado aqui e repassado ao servidor e ao navegador.
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { configuracao } from "@/servidor/config";

/** Áreas que exigem conta. A verificação definitiva fica na camada de acesso (servidor/auth/sessao). */
const AREAS_DO_ALUNO = ["/perfil", "/nova-senha", "/aprender", "/praticar", "/licao", "/sessao"];

export async function atualizarSessao(request: NextRequest) {
  let resposta = NextResponse.next({ request });

  const { supabaseUrl, supabaseChave } = configuracao();
  const supabase = createServerClient(supabaseUrl, supabaseChave, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesParaGravar, cabecalhos) {
        for (const { name, value } of cookiesParaGravar) request.cookies.set(name, value);
        resposta = NextResponse.next({ request });
        for (const { name, value, options } of cookiesParaGravar) resposta.cookies.set(name, value, options);
        for (const [chave, valor] of Object.entries(cabecalhos)) resposta.headers.set(chave, valor);
      },
    },
  });

  // Nada entre a criação do cliente e getClaims: é aqui que o token é renovado.
  const { data } = await supabase.auth.getClaims();

  // Verificação otimista: sem sessão, a área do aluno leva ao login e volta à tela pedida (FL-02).
  const { pathname, search } = request.nextUrl;
  if (!data?.claims && AREAS_DO_ALUNO.some((area) => pathname === area || pathname.startsWith(`${area}/`))) {
    const login = request.nextUrl.clone();
    login.pathname = "/entrar";
    login.search = "";
    login.searchParams.set("voltar", pathname + search);
    const redirecionamento = NextResponse.redirect(login);
    for (const cookie of resposta.cookies.getAll()) redirecionamento.cookies.set(cookie);
    return redirecionamento;
  }

  return resposta;
}
