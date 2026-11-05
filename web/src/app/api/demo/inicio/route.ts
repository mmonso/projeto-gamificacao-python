// Início da demonstração, só para o evento de produto (PLANO, seção 16). Não grava progresso.
import { z } from "zod";
import { banco } from "@/servidor/db/cliente";
import { registrarEvento } from "@/servidor/eventos";
import { acaoAnonima } from "../anonimo";

export async function POST(request: Request) {
  return acaoAnonima(request, z.object({ licaoId: z.string().min(1).max(40) }), async ({ licaoId }) => {
    await registrarEvento(banco(), "demonstracao_iniciada", null, { licaoId });
    return Response.json({ ok: true });
  });
}
