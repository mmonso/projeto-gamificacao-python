// Correção anônima do desafio do dia: não grava nada nem devolve o gabarito antes da resposta.
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { erro } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { corrigirDesafio, pedidoCorrecaoDesafio } from "@/servidor/desafio/servico";

export async function POST(request: Request) {
  return acaoAnonima(request, pedidoCorrecaoDesafio, async (pedido) => {
    const resultado = await corrigirDesafio(banco(), pedido);
    return resultado ? Response.json(resultado) : erro("desatualizada", "Este desafio já acabou. Abra o desafio de hoje.");
  });
}
