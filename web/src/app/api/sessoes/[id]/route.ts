// Estado atual da sessão, para a interface se atualizar depois de outra aba ou aparelho (FL-04).
import { alunoDoPedido, erro, SEM_CACHE } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { obterSessaoAtual } from "@/servidor/licoes/servico";

export async function GET(_request: Request, ctx: RouteContext<"/api/sessoes/[id]">) {
  const { id } = await ctx.params;
  const aluno = await alunoDoPedido();
  if (aluno instanceof Response) return aluno;
  const sessao = await obterSessaoAtual(banco(), aluno.id, id);
  if (!sessao) return erro("sessao_inexistente", "Sessão não encontrada.");
  return Response.json(sessao, { headers: SEM_CACHE });
}
