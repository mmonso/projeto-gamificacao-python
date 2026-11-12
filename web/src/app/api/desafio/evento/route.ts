// Início e fim do desafio do dia, só para os eventos de produto (sem aluno, sem respostas).
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { banco } from "@/servidor/db/cliente";
import { pedidoEventoDesafio } from "@/servidor/desafio/servico";
import { registrarEvento } from "@/servidor/eventos";

export async function POST(request: Request) {
  return acaoAnonima(request, pedidoEventoDesafio, async ({ numero, evento, compartilhado, acertos }) => {
    await registrarEvento(banco(), evento === "iniciado" ? "desafio_iniciado" : "desafio_concluido", null, {
      numero,
      compartilhado,
      ...(acertos === undefined ? {} : { acertos }),
    });
    return Response.json({ ok: true });
  });
}
