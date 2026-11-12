"use server";
// Ações de conta (FL-02). Cada ação valida a entrada, chama o Supabase Auth e devolve
// uma mensagem neutra: nenhuma resposta revela se um e-mail está cadastrado.
import { redirect } from "next/navigation";
import {
  MENSAGENS,
  NOME_DE_VISITANTE,
  destinoSeguro,
  esquemaCadastro,
  esquemaEmail,
  esquemaEntrar,
  esquemaNovaSenha,
  mensagemDeErroAuth,
  primeiroErro,
  type MetadadosCadastro,
} from "@/modulos/conta/conta";
import { cadastroAberto, MENSAGEM_SEM_VAGAS } from "@/modulos/conta/vagas";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { banco } from "@/servidor/db/cliente";
import { contarContas } from "@/servidor/perfis/vagas";
import { guardarEmailPendente, lerEmailPendente } from "@/servidor/auth/email-pendente";
import { criarClienteSupabase, origemDoSite } from "@/servidor/auth/supabase";

export type EstadoFormulario = {
  erro?: string;
  aviso?: string;
  /** O login foi recusado por e-mail não confirmado: oferecer reenvio do link. */
  reenviar?: boolean;
  valores?: Record<string, string>;
};

async function linkDeConfirmacao(proximo: string) {
  return `${await origemDoSite()}/auth/confirmar?proximo=${encodeURIComponent(proximo)}`;
}

export async function cadastrar(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const entrada = Object.fromEntries(form);
  const valores = { nome: String(entrada.nome ?? ""), email: String(entrada.email ?? "") };
  const dados = esquemaCadastro.safeParse(entrada);
  if (!dados.success) return { erro: primeiroErro(dados.error), valores };

  // Teto do teste com amigos: sem vaga, nenhum e-mail é enviado e nenhuma conta é criada.
  if (!cadastroAberto(await contarContas(banco()))) return { erro: MENSAGEM_SEM_VAGAS, valores };

  const { nome, email, senha, metaDiaria, fuso } = dados.data;
  const metadados: MetadadosCadastro = { nome, meta_diaria: metaDiaria, fuso, termos_aceitos_em: new Date().toISOString() };
  const supabase = await criarClienteSupabase();
  const { data, error } = await supabase.auth.signUp({
    email,
    password: senha,
    options: { emailRedirectTo: await linkDeConfirmacao("/aprender"), data: metadados },
  });
  if (error) return { erro: mensagemDeErroAuth(error.code, "cadastro"), valores };

  // Com a confirmação de e-mail desligada no projeto, o Supabase já devolve a sessão.
  if (data.session) redirect("/aprender");

  // E-mail já cadastrado também chega aqui, sem erro: a tela seguinte é a mesma (mensagem neutra).
  await guardarEmailPendente(email);
  redirect("/verificar-email");
}

export async function entrar(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const entrada = Object.fromEntries(form);
  const valores = { email: String(entrada.email ?? "") };
  const dados = esquemaEntrar.safeParse(entrada);
  if (!dados.success) return { erro: MENSAGENS.credenciais, valores };

  const supabase = await criarClienteSupabase();
  const { error } = await supabase.auth.signInWithPassword({ email: dados.data.email, password: dados.data.senha });
  if (error) {
    if (error.code === "email_not_confirmed") {
      await guardarEmailPendente(dados.data.email);
      return { erro: mensagemDeErroAuth(error.code, "entrar"), reenviar: true, valores };
    }
    return { erro: mensagemDeErroAuth(error.code, "entrar"), valores };
  }
  redirect(destinoSeguro(entrada.voltar));
}

/**
 * Entra como visitante: login anônimo do Supabase, sem e-mail nem senha. O botão diz que entrar
 * equivale a declarar a idade mínima e aceitar os documentos, e o aceite fica registrado como no cadastro.
 * O acesso e o progresso são apagados pela manutenção diária depois de DIAS_DE_VISITANTE dias.
 */
export async function entrarComoVisitante(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const fuso = esquemaCadastro.shape.fuso.parse(form.get("fuso"));
  const metadados: MetadadosCadastro = {
    nome: NOME_DE_VISITANTE,
    meta_diaria: PARAMETROS.metaPadrao,
    fuso,
    termos_aceitos_em: new Date().toISOString(),
  };
  const supabase = await criarClienteSupabase();
  const { error } = await supabase.auth.signInAnonymously({ options: { data: metadados } });
  if (error) return { erro: mensagemDeErroAuth(error.code, "visitante") };
  redirect("/aprender");
}

export async function reenviarConfirmacao(): Promise<EstadoFormulario> {
  const email = await lerEmailPendente();
  if (!email) return { erro: "Não encontramos o e-mail do cadastro neste navegador. Entre com seu e-mail e senha para pedir um novo link." };

  const supabase = await criarClienteSupabase();
  const { error } = await supabase.auth.resend({ type: "signup", email, options: { emailRedirectTo: await linkDeConfirmacao("/aprender") } });
  if (error && error.code?.startsWith("over_")) return { erro: MENSAGENS.muitasTentativas };
  return { aviso: MENSAGENS.linkReenviado };
}

export async function pedirRecuperacao(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const valores = { email: String(form.get("email") ?? "") };
  const dados = esquemaEmail.safeParse(Object.fromEntries(form));
  if (!dados.success) return { erro: primeiroErro(dados.error), valores };

  const supabase = await criarClienteSupabase();
  const { error } = await supabase.auth.resetPasswordForEmail(dados.data.email, { redirectTo: await linkDeConfirmacao("/nova-senha") });
  if (error && error.code?.startsWith("over_")) return { erro: MENSAGENS.muitasTentativas, valores };
  return { aviso: MENSAGENS.recuperacaoEnviada };
}

export async function definirNovaSenha(_anterior: EstadoFormulario, form: FormData): Promise<EstadoFormulario> {
  const dados = esquemaNovaSenha.safeParse(Object.fromEntries(form));
  if (!dados.success) return { erro: primeiroErro(dados.error) };

  const supabase = await criarClienteSupabase();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect("/entrar?voltar=/nova-senha");

  const { error } = await supabase.auth.updateUser({ password: dados.data.senha });
  if (error) return { erro: mensagemDeErroAuth(error.code, "senha") };
  redirect("/aprender");
}

export async function sair() {
  const supabase = await criarClienteSupabase();
  await supabase.auth.signOut({ scope: "local" });
  redirect("/");
}
