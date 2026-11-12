// "Entenda melhor" aberto (só evento de produto): mede quem abre a explicação e se isso muda o acerto depois.
// Vale com ou sem conta (demonstração e desafio do dia); com conta, o evento leva o aluno e a sessão.
import { z } from "zod";
import { acaoAnonima } from "@/app/api/demo/anonimo";
import { obterAluno } from "@/servidor/auth/sessao";
import { banco } from "@/servidor/db/cliente";
import { registrarEvento } from "@/servidor/eventos";

const pedido = z.object({
  conceitoId: z.string().min(1).max(40),
  exercicioId: z.string().min(1).max(40),
  /** Sessão de estudo da conta; ausente na demonstração e no desafio. */
  sessaoId: z.uuid().optional(),
  contexto: z.enum(["principal", "pratica", "revisao", "recuperacao", "demo", "desafio"]),
});

export async function POST(request: Request) {
  return acaoAnonima(request, pedido, async ({ conceitoId, exercicioId, sessaoId, contexto }) => {
    const aluno = await obterAluno();
    await registrarEvento(banco(), "entenda_aberto", aluno?.id ?? null, { conceitoId, exercicioId, contexto, ...(sessaoId ? { sessaoId } : {}) });
    return Response.json({ ok: true });
  });
}
