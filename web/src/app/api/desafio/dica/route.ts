// Dica de um item do desafio do dia.
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { erro } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { dicaDesafio, pedidoDicaDesafio } from "@/servidor/desafio/servico";

export async function POST(request: Request) {
  return acaoAnonima(request, pedidoDicaDesafio, async (pedido) => {
    const dica = await dicaDesafio(banco(), pedido);
    return dica ? Response.json({ dica }) : erro("invalida", "Não há mais dicas para este exercício.");
  });
}
