// "Algo errado nesta questão?" (só evento de produto): motivo de toque, exercício e, com conta, a sessão.
// Vale com ou sem conta (demonstração e desafio do dia também mostram o link).
import { z } from "zod";
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { MOTIVOS_REPORTE } from "@/modulos/aprendizagem/reporte";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { registrarEvento } from "@/servidor/eventos";

const pedido = z.object({
  exercicioId: z.string().regex(/^u\d+-l\d+-[er]\d{2}$/),
  motivo: z.enum(MOTIVOS_REPORTE),
  contexto: z.enum(["principal", "pratica", "revisao", "recuperacao", "demo", "desafio"]),
  sessaoId: z.uuid().optional(),
  correta: z.boolean(),
});

export async function POST(request: Request) {
  return acaoAnonima(request, pedido, async ({ exercicioId, motivo, contexto, sessaoId, correta }) => {
    const aluno = contexto === "demo" || contexto === "desafio" ? null : await obterAluno();
    await registrarEvento(banco(), "questao_reportada", aluno?.id ?? null, { exercicioId, motivo, contexto, correta, ...(aluno && sessaoId ? { sessaoId } : {}) });
    return Response.json({ ok: true });
  });
}
