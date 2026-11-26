// "Meus erros recentes" (design/MELHORIAS_UX.md, D4): os últimos exercícios que o aluno errou, com a resposta
// certa e a explicação, para rever com calma fora da lição. Só sai daqui o que o feedback já mostrou ao errar.
import { and, desc, eq, gt, inArray } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { solucaoDoGabarito, type Solucao } from "@/modulos/aprendizagem/contrato";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import * as t from "@/servidor/db/esquema";

type Db = Pick<PgDatabase<PgQueryResultHKT, typeof t>, "select">;

export type ErroRecente = {
  exercicioId: string;
  licaoId: string;
  exercicio: ExercicioPublico;
  solucao: Solucao;
  explicacao: string;
  /** Depois do último erro, o aluno acertou este exercício. */
  corrigido: boolean;
};

const DIAS = 30;
const MAXIMO = 8;

/** Erros dos últimos 30 dias, do mais recente para o mais antigo, um por exercício. */
export async function errosRecentes(db: Db, alunoId: string, agora = new Date()): Promise<ErroRecente[]> {
  const desde = new Date(agora.getTime() - DIAS * 86_400_000);
  const respostas = await db
    .select({ exercicioId: t.submissoes.exercicioId, correta: t.submissoes.correta })
    .from(t.submissoes)
    .innerJoin(t.sessoes, eq(t.sessoes.id, t.submissoes.sessaoId))
    .where(and(eq(t.sessoes.alunoId, alunoId), gt(t.submissoes.criadoEm, desde)))
    .orderBy(desc(t.submissoes.criadoEm))
    .limit(400);

  // Do mais recente para trás: um acerto visto antes do erro (mais recente que ele) marca o erro como corrigido.
  const acertouDepois = new Set<string>();
  const escolhidos: { exercicioId: string; corrigido: boolean }[] = [];
  for (const r of respostas) {
    if (escolhidos.some((e) => e.exercicioId === r.exercicioId)) continue;
    if (r.correta) acertouDepois.add(r.exercicioId);
    else escolhidos.push({ exercicioId: r.exercicioId, corrigido: acertouDepois.has(r.exercicioId) });
    if (escolhidos.length >= MAXIMO) break;
  }
  if (!escolhidos.length) return [];

  // Versão publicada mais recente de cada exercício (a que o aluno encontraria de novo).
  const ids = escolhidos.map((e) => e.exercicioId);
  const linhas = await db
    .select({ exercicioId: t.exercicios.exercicioId, versaoLicaoId: t.exercicios.versaoLicaoId, publico: t.exercicios.publico, gabarito: t.gabaritos.gabarito, explicacao: t.gabaritos.explicacao })
    .from(t.exercicios)
    .innerJoin(t.gabaritos, and(eq(t.gabaritos.versaoLicaoId, t.exercicios.versaoLicaoId), eq(t.gabaritos.exercicioId, t.exercicios.exercicioId)))
    .where(inArray(t.exercicios.exercicioId, ids))
    .orderBy(desc(t.exercicios.versaoLicaoId));
  const porId = new Map<string, (typeof linhas)[number]>();
  for (const l of linhas) if (!porId.has(l.exercicioId)) porId.set(l.exercicioId, l);

  return escolhidos.flatMap(({ exercicioId, corrigido }) => {
    const l = porId.get(exercicioId);
    if (!l) return [];
    const exercicio = l.publico as ExercicioPublico;
    return [{ exercicioId, licaoId: exercicioId.replace(/-[er]\d+$/, ""), exercicio, solucao: solucaoDoGabarito(l.gabarito as Gabarito), explicacao: l.explicacao, corrigido }];
  });
}
