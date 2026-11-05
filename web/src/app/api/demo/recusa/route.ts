// A pessoa preferiu não salvar a demonstração na conta (FL-02).
import { z } from "zod";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { recusarDemo } from "@/servidor/demo/servico";

export async function POST(request: Request) {
  return acaoDoAluno(request, z.object({}), async (aluno) => {
    await recusarDemo(banco(), aluno.id);
    return { ok: true };
  });
}
