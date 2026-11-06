// Exportação do histórico do aluno (F-32, CA-115): baixa um JSON só com os próprios dados.
import { alunoDoPedido } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { exportarHistorico } from "@/servidor/perfis/preferencias";

export async function GET() {
  const aluno = await alunoDoPedido("raro");
  if (aluno instanceof Response) return aluno;
  const historico = await exportarHistorico(banco(), aluno.id);
  return new Response(JSON.stringify({ email: aluno.email, ...historico }, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="sibi-historico-${new Date().toISOString().slice(0, 10)}.json"`,
      "Cache-Control": "private, no-store",
    },
  });
}
