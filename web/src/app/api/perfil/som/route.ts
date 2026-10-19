// Preferência de som (F-31), alterada no topo da lição ou no perfil.
import { eq } from "drizzle-orm";
import { z } from "zod";
import { acaoDoAluno } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { perfis } from "@/servidor/db/esquema";

export async function POST(request: Request) {
  return acaoDoAluno(request, z.object({ som: z.boolean() }), async (aluno, { som }) => {
    await banco().update(perfis).set({ som }).where(eq(perfis.id, aluno.id));
    return { som };
  });
}
