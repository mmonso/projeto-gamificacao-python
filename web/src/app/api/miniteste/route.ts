// Mini-teste da unidade 1: corrige no servidor e guarda só o número de acertos (servidor/miniteste.ts).
import { z } from "zod";
import { MOMENTOS, PERGUNTAS_MINITESTE } from "@/modulos/aprendizagem/miniteste";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { registrarMiniteste } from "@/servidor/miniteste";

const pedido = z.object({
  momento: z.enum(MOMENTOS),
  respostas: z.array(z.number().int().min(0).max(3)).length(PERGUNTAS_MINITESTE.length),
});

export async function POST(request: Request) {
  return acaoDoAluno(request, pedido, (aluno, { momento, respostas }) => registrarMiniteste(banco(), aluno.id, momento, respostas));
}
