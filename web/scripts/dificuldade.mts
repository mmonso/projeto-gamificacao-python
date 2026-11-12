// Relatório de dificuldade dos exercícios: quais estão confusos (menos da metade acerta de primeira) e quais
// estão fáceis demais, com o tempo mediano de resposta. Lido do banco em DATABASE_URL.
// Só primeira tentativa, sem visitantes nem contas de teste de .env.local. Não imprime nomes nem respostas.
// Uso: npm run db:dificuldade
import postgres from "postgres";
import { MIN_RESPOSTAS, ordenarDificuldade, type ResumoExercicio } from "../src/modulos/metricas/dificuldade";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada em .env.local");
const sql = postgres(url, { prepare: false, max: 1 });

const emailsDeTeste = [process.env.TESTE_EMAIL_1, process.env.TESTE_EMAIL_2].filter((e): e is string => !!e).map((e) => e.toLowerCase());

try {
  // Primeira tentativa de cada exercício em cada sessão: a ordem de criado_em define qual é a primeira.
  const linhas = await sql<{ exercicio_id: string; respostas: number; acertos: number; tempo_mediano: number | null }[]>`
    with primeiras as (
      select s.exercicio_id, s.correta, s.tempo_ms,
        row_number() over (partition by s.sessao_id, s.exercicio_id order by s.criado_em) as ordem
      from submissoes s
      join sessoes se on se.id = s.sessao_id
      join perfis p on p.id = se.aluno_id
      left join auth.users au on au.id = p.id
      where not p.visitante and (au.email is null or lower(au.email) <> all(${emailsDeTeste}::text[]))
    )
    select exercicio_id,
      count(*)::int as respostas,
      count(*) filter (where correta)::int as acertos,
      percentile_cont(0.5) within group (order by tempo_ms) filter (where tempo_ms is not null)::float as tempo_mediano
    from primeiras
    where ordem = 1
    group by exercicio_id`;

  const resumos: ResumoExercicio[] = linhas.map((l) => ({
    exercicioId: l.exercicio_id,
    respostas: l.respostas,
    acertosPrimeira: l.acertos,
    tempoMedianoMs: l.tempo_mediano === null ? null : Math.round(l.tempo_mediano),
  }));
  const ordenados = ordenarDificuldade(resumos);
  const sinalizados = ordenados.filter((r) => r.sinal);

  console.log(`Dificuldade dos exercícios (primeira tentativa; mínimo de ${MIN_RESPOSTAS} respostas para sinalizar)\n`);
  console.log(`Exercícios com resposta: ${resumos.length}   com sinal: ${sinalizados.length}\n`);
  if (sinalizados.length === 0) console.log("Nenhum sinal ainda. Os números ganham sentido com mais alunos.");
  for (const r of sinalizados) {
    const tempo = r.tempoMedianoMs === null ? "tempo —" : `mediana ${(r.tempoMedianoMs / 1000).toFixed(1)} s`;
    const rotulo = r.sinal === "confuso" ? "CONFUSO " : "FÁCIL    ";
    console.log(`  ${rotulo} ${r.exercicioId.padEnd(16)} ${Math.round(r.taxa * 100)}% de primeira (${r.acertosPrimeira}/${r.respostas})  ${tempo}`);
  }
  if (sinalizados.length) console.log("\nConfuso: revisar o enunciado ou a dica. Fácil: subir a dificuldade ou pular o item.");
} finally {
  await sql.end();
}
