// Exportação do histórico do aluno (F-32, CA-115): baixa um JSON só com os próprios dados.
import { erro } from "@/servidor/api";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { exportarHistorico } from "@/servidor/perfis/preferencias";

export async function GET() {
  const aluno = await obterAluno();
  if (!aluno) return erro("nao_autenticado", "Entre na sua conta para exportar o histórico.");
  const historico = await exportarHistorico(banco(), aluno.id);
  return new Response(JSON.stringify({ email: aluno.email, ...historico }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="sibi-historico-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "no-store",
    },
  });
}
