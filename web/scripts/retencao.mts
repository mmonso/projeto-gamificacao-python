// Retenção D1, D7 e D30 e funil da fase de teste, lidos do banco em DATABASE_URL.
// Conta só contas com e-mail: visitantes ficam de fora (são apagados em poucos dias) e as contas de teste
// de .env.local (TESTE_EMAIL_1, TESTE_EMAIL_2) também. Não imprime nomes nem e-mails, só números.
// Uso: npm run db:retencao
import postgres from "postgres";
import { type AlunoCoorte, formatarTaxa, MARCOS, METAS, retencao, retencaoPorSemana } from "../src/modulos/metricas/retencao";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada em .env.local");
const sql = postgres(url, { prepare: false, max: 1 });

const emailsDeTeste = [process.env.TESTE_EMAIL_1, process.env.TESTE_EMAIL_2].filter((e): e is string => !!e).map((e) => e.toLowerCase());

try {
  const [{ hoje }] = await sql<{ hoje: string }[]>`select to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM-DD') as hoje`;

  const linhas = await sql<{ id: string; dia0: string; dias: string[] | null; licoes: number; unidade1: boolean }[]>`
    with u1 as (
      select l.id from licoes l join unidades u on u.id = l.unidade_id where u.ordem = (select min(ordem) from unidades)
    ),
    contas as (
      select p.id, to_char(p.criado_em at time zone p.fuso, 'YYYY-MM-DD') as dia0
      from perfis p
      left join auth.users au on au.id = p.id
      where not p.visitante and (au.email is null or lower(au.email) <> all(${emailsDeTeste}::text[]))
    )
    select c.id, c.dia0,
      (select array_agg(to_char(a.dia, 'YYYY-MM-DD')) from atividade_diaria a where a.aluno_id = c.id and a.sessoes > 0) as dias,
      (select count(*)::int from conclusoes_licao cl where cl.aluno_id = c.id) as licoes,
      (select count(*) from conclusoes_licao cl where cl.aluno_id = c.id and cl.licao_id in (select id from u1)) = (select count(*) from u1) as unidade1
    from contas c`;

  const [{ visitantes }] = await sql<{ visitantes: number }[]>`select count(*)::int as visitantes from perfis where visitante`;

  const alunos: AlunoCoorte[] = linhas.map((l) => ({ dia0: l.dia0, diasAtivos: l.dias ?? [] }));
  const total = linhas.length;
  const pct = (n: number) => (total ? `${Math.round((n / total) * 100)}%` : "—");
  const primeira = linhas.filter((l) => l.licoes > 0).length;
  const unidade1 = linhas.filter((l) => l.unidade1).length;

  console.log(`Retenção do Sibi em ${hoje} (fuso de cada aluno; contas de teste e visitantes fora)\n`);
  console.log(`Contas: ${total}   Visitantes ativos agora: ${visitantes}\n`);
  console.log("Funil (meta da fase 1)");
  console.log(`  concluíram a 1ª lição:  ${pct(primeira)} (${primeira}/${total})   meta 70%`);
  console.log(`  concluíram a unidade 1: ${pct(unidade1)} (${unidade1}/${total})   meta 50%\n`);

  console.log("Retenção (estudou exatamente no dia N depois de criar a conta)");
  for (const linha of retencao(alunos, hoje)) {
    console.log(`  D${String(linha.marco).padEnd(3)} ${formatarTaxa(linha).padEnd(16)} meta ${Math.round(METAS[linha.marco] * 100)}%`);
  }

  const semanas = retencaoPorSemana(alunos, hoje);
  if (semanas.length) {
    console.log("\nPor semana de entrada (segunda-feira)");
    console.log(`  ${"semana".padEnd(11)} ${"contas".padEnd(7)} ${MARCOS.map((m) => `D${m}`.padEnd(16)).join(" ")}`);
    for (const s of semanas) {
      console.log(`  ${s.semana.padEnd(11)} ${String(s.alunos).padEnd(7)} ${s.linhas.map((l) => formatarTaxa(l).padEnd(16)).join(" ")}`);
    }
  }
  if (total < 20) console.log("\nCom menos de 20 contas, as porcentagens ainda oscilam muito: leia os números absolutos.");
} finally {
  await sql.end();
}
