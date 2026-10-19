// Conclusão da lição (FL-03, passo 7). Pedidos repetidos devolvem o mesmo resultado.
import { z } from "zod";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { concluir } from "@/servidor/licoes/estudo";

export async function POST(request: Request, ctx: RouteContext<"/api/sessoes/[id]/conclusao">) {
  const { id } = await ctx.params;
  return acaoDoAluno(request, z.object({}), (aluno) => concluir(banco(), aluno.id, id));
}
