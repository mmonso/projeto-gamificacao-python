// Apoio aos Route Handlers da interface: autenticação, validação do corpo e erros no formato do contrato.
import "server-only";
import type { z } from "zod";
import type { ErroApi } from "@/modulos/aprendizagem/contrato";
import { obterAluno, type Aluno } from "@/servidor/auth/sessao";
import { ErroEstudo } from "@/servidor/licoes/estudo";

const STATUS: Record<ErroApi["erro"], number> = {
  nao_autenticado: 401,
  sessao_inexistente: 404,
  desatualizada: 409,
  incompleta: 409,
  invalida: 400,
  limite: 429,
};

export function erro(codigo: ErroApi["erro"], mensagem: string) {
  return Response.json({ erro: codigo, mensagem } satisfies ErroApi, { status: STATUS[codigo] });
}

/**
 * Executa uma ação do aluno autenticado. Só aceita corpo JSON: formulários de outros sites
 * não conseguem enviar esse tipo sem permissão do navegador, e os cookies de sessão são SameSite=Lax.
 */
export async function acaoDoAluno<T extends z.ZodType>(
  request: Request,
  esquema: T,
  acao: (aluno: Aluno, corpo: z.infer<T>) => Promise<unknown>,
): Promise<Response> {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return erro("invalida", "Envie os dados em JSON.");
  const aluno = await obterAluno();
  if (!aluno) return erro("nao_autenticado", "Sua sessão expirou. Entre de novo para continuar.");

  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro("invalida", "Pedido malformado.");
  }
  const dados = esquema.safeParse(corpo);
  if (!dados.success) return erro("invalida", "Pedido inválido.");

  try {
    return Response.json(await acao(aluno, dados.data));
  } catch (e) {
    if (e instanceof ErroEstudo) return erro(e.codigo, e.message);
    throw e;
  }
}
