// Dicas da demonstração, uma a uma.
import { z } from "zod";
import { erro } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { dicaDemo } from "@/servidor/demo/servico";
import { acaoAnonima } from "../anonimo";

const pedido = z.object({ versaoLicaoId: z.number().int().positive(), exercicioId: z.string().min(1).max(40), numero: z.number().int().min(1).max(3) });

export async function POST(request: Request) {
  return acaoAnonima(request, pedido, async ({ versaoLicaoId, exercicioId, numero }) => {
    const dica = await dicaDemo(banco(), versaoLicaoId, exercicioId, numero);
    return dica ? Response.json({ dica }) : erro("invalida", "Não há mais dicas para este exercício.");
  });
}
