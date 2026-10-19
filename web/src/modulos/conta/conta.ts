// Regras de conta (ESPECIFICACAO_MVP.md, FL-02; F-04, F-05). Funções puras: as ações do servidor
// chamam o Supabase Auth e usam estas regras para validar entradas e escolher mensagens.
import { z } from "zod";
import { fusoValido } from "@/modulos/gamificacao/dias";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";

export const SENHA_MINIMA = 8;
export const NOME_MAXIMO = 40;

/** Chave do navegador em que a introdução guarda nome e meta até o cadastro (FL-01, passo 2). */
export const CHAVE_INTRODUCAO = "sibi-introducao";

const email = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido."));
const senha = z.string().min(SENHA_MINIMA, `A senha precisa ter pelo menos ${SENHA_MINIMA} caracteres.`).max(72, "A senha pode ter no máximo 72 caracteres.");
const nome = z.string().trim().max(NOME_MAXIMO, `O nome pode ter no máximo ${NOME_MAXIMO} caracteres.`);

// Valores vindos do navegador que não impedem o cadastro: inválidos voltam ao padrão.
const metaDiaria = z.coerce.number().int().min(1).max(3).catch(PARAMETROS.metaPadrao);
const fuso = z.string().refine(fusoValido).catch(PARAMETROS.fusoPadrao);

export const esquemaCadastro = z.object({
  nome: nome.default(""),
  email,
  senha,
  termos: z.literal("on", "Aceite os termos de uso e a política de privacidade para continuar."),
  metaDiaria,
  fuso,
});

export const esquemaEntrar = z.object({ email, senha: z.string().min(1) });
export const esquemaEmail = z.object({ email });
export const esquemaNovaSenha = z
  .object({ senha, confirmacao: z.string() })
  .refine((d) => d.senha === d.confirmacao, { message: "As senhas não são iguais.", path: ["confirmacao"] });

/** Primeira mensagem de erro de uma validação, para exibir no formulário. */
export function primeiroErro(erro: z.ZodError): string {
  return erro.issues[0]?.message ?? "Confira os dados informados.";
}

/** Metadados gravados no usuário do Supabase Auth no cadastro e copiados para o perfil no primeiro acesso. */
export type MetadadosCadastro = {
  nome: string;
  meta_diaria: number;
  fuso: string;
  termos_aceitos_em: string;
};

const esquemaMetadados = z.object({
  nome: nome.catch(""),
  meta_diaria: metaDiaria,
  fuso,
  termos_aceitos_em: z.iso.datetime({ offset: true }).nullable().catch(null),
});

/** Dados iniciais do perfil a partir dos metadados do usuário, que podem estar ausentes ou incompletos. */
export function dadosIniciaisDoPerfil(metadados: unknown) {
  const m = esquemaMetadados.parse(metadados && typeof metadados === "object" ? metadados : {});
  return {
    nome: m.nome,
    metaDiaria: m.meta_diaria,
    fuso: m.fuso,
    termosAceitosEm: m.termos_aceitos_em ? new Date(m.termos_aceitos_em) : null,
  };
}

/**
 * Caminho interno para onde voltar depois de entrar (FL-02, saída e retomada, passo 4).
 * Recusa endereços externos e caminhos ambíguos para não servir de redirecionamento aberto.
 */
export function destinoSeguro(valor: unknown, padrao = "/aprender"): string {
  if (typeof valor !== "string" || !valor.startsWith("/") || valor.startsWith("//") || valor.includes("\\")) return padrao;
  try {
    const url = new URL(valor, "http://sibi.local");
    if (url.origin !== "http://sibi.local") return padrao;
    return url.pathname + url.search;
  } catch {
    return padrao;
  }
}

export const MENSAGENS = {
  credenciais: "E-mail ou senha incorretos.",
  emailNaoConfirmado: "Confirme seu e-mail antes de entrar. Podemos enviar um novo link.",
  muitasTentativas: "Muitas tentativas seguidas. Espere alguns minutos e tente de novo.",
  senhaFraca: "Escolha uma senha mais difícil de adivinhar.",
  mesmaSenha: "A nova senha precisa ser diferente da anterior.",
  recuperacaoEnviada: "Se houver uma conta com esse e-mail, o link chega em alguns minutos.",
  linkReenviado: "Se esse e-mail estiver aguardando confirmação, enviamos um novo link.",
  falhaGenerica: "Não foi possível concluir agora. Tente de novo em instantes.",
} as const;

/**
 * Mensagem para um erro do Supabase Auth. Nunca revela se um e-mail está cadastrado:
 * qualquer falha de login vira a mesma mensagem de credenciais.
 */
export function mensagemDeErroAuth(codigo: string | undefined, contexto: "entrar" | "cadastro" | "senha" | "email"): string {
  switch (codigo) {
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return MENSAGENS.muitasTentativas;
    case "weak_password":
      return MENSAGENS.senhaFraca;
    case "same_password":
      return MENSAGENS.mesmaSenha;
    case "email_not_confirmed":
      return contexto === "entrar" ? MENSAGENS.emailNaoConfirmado : MENSAGENS.falhaGenerica;
  }
  return contexto === "entrar" ? MENSAGENS.credenciais : MENSAGENS.falhaGenerica;
}
