// Responder o exercício atual (FL-03, passo 4). Reenvio com o mesmo id devolve o resultado gravado.
import { pedidoSubmissao } from "@/modulos/aprendizagem/contrato";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { submeter } from "@/servidor/licoes/estudo";

export async function POST(request: Request, ctx: RouteContext<"/api/sessoes/[id]/submissoes">) {
  const { id } = await ctx.params;
  return acaoDoAluno(request, pedidoSubmissao, (aluno, pedido) => submeter(banco(), aluno.id, id, pedido));
}
