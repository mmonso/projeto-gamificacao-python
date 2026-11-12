// Avaliação da lição no resultado (só evento de produto): "Fácil", "Na medida" ou "Difícil" e, no difícil, o motivo.
// Vale com ou sem conta (a demonstração também pergunta); com conta, o evento leva o aluno.
import { z } from "zod";
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { MOTIVOS, NIVEIS } from "@/modulos/aprendizagem/avaliacao";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { registrarEvento } from "@/servidor/eventos";

const pedido = z.object({
  licaoId: z.string().regex(/^u\d+-l\d+$/),
  nivel: z.enum(NIVEIS),
  motivo: z.enum(MOTIVOS).optional(),
  demo: z.boolean(),
});

export async function POST(request: Request) {
  return acaoAnonima(request, pedido, async ({ licaoId, nivel, motivo, demo }) => {
    const aluno = demo ? null : await obterAluno();
    await registrarEvento(banco(), "licao_avaliada", aluno?.id ?? null, { licaoId, nivel, demo, ...(motivo ? { motivo } : {}) });
    return Response.json({ ok: true });
  });
}
