// Estado atual da sessão, para a interface se atualizar depois de outra aba ou aparelho (FL-04).
import { erro } from "@/servidor/api";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { obterSessaoAtual } from "@/servidor/licoes/servico";

export async function GET(_request: Request, ctx: RouteContext<"/api/sessoes/[id]">) {
  const { id } = await ctx.params;
  const aluno = await obterAluno();
  if (!aluno) return erro("nao_autenticado", "Sua sessão expirou. Entre de novo para continuar.");
  const sessao = await obterSessaoAtual(banco(), aluno.id, id);
  if (!sessao) return erro("sessao_inexistente", "Sessão não encontrada.");
  return Response.json(sessao, { headers: { "Cache-Control": "private, no-store" } });
}
