// Correção anônima da demonstração (D-02): não grava progresso nem devolve o gabarito antes da resposta.
import { erro } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { corrigirDemo, pedidoCorrecaoDemo } from "@/servidor/demo/servico";
import { acaoAnonima } from "../anonimo";

export async function POST(request: Request) {
  return acaoAnonima(request, pedidoCorrecaoDemo, async (pedido) => {
    const resultado = await corrigirDemo(banco(), pedido);
    return resultado ? Response.json(resultado) : erro("invalida", "Exercício fora da demonstração.");
  });
}
