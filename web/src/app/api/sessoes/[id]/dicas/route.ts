// Próxima dica do exercício atual (FL-03, passo 3).
import { pedidoDica } from "@/modulos/aprendizagem/contrato";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { pedirDica } from "@/servidor/licoes/estudo";

export async function POST(request: Request, ctx: RouteContext<"/api/sessoes/[id]/dicas">) {
  const { id } = await ctx.params;
  return acaoDoAluno(request, pedidoDica, async (aluno, { exercicioId, numero }) => ({ dica: await pedirDica(banco(), aluno.id, id, exercicioId, numero) }));
}
