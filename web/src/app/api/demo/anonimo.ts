// Apoio às rotas anônimas da demonstração: corpo JSON validado e limite de frequência por endereço (CA-06).
import "server-only";
import type { z } from "zod";
import { erro } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { dentroDoLimite } from "@/servidor/demo/servico";

/** Pedidos por minuto e endereço: uma lição tem cerca de dez exercícios, com dicas e novas tentativas. */
const LIMITE_POR_MINUTO = 40;

function endereco(request: Request) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
}

export async function acaoAnonima<T extends z.ZodType>(request: Request, esquema: T, acao: (corpo: z.infer<T>) => Promise<Response>) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) return erro("invalida", "Envie os dados em JSON.");
  if (!(await dentroDoLimite(banco(), `demo:${endereco(request)}`, LIMITE_POR_MINUTO))) {
    return erro("limite", "Muitas respostas em pouco tempo. Espere um minuto e tente de novo.");
  }
  let corpo: unknown;
  try {
    corpo = await request.json();
  } catch {
    return erro("invalida", "Pedido malformado.");
  }
  const dados = esquema.safeParse(corpo);
  if (!dados.success) return erro("invalida", "Pedido inválido.");
  return acao(dados.data);
}
