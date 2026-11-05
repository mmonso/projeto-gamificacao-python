// Transferência da demonstração concluída para a conta (FL-02; CA-17 a CA-19).
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { pedidoTransferencia, transferirDemo } from "@/servidor/demo/servico";

export async function POST(request: Request) {
  return acaoDoAluno(request, pedidoTransferencia, (aluno, pedido) => transferirDemo(banco(), aluno.id, pedido));
}
