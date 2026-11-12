// Vigilância de abuso: lê do banco os números que denunciam robôs e uso fora do normal e compara com os limites
// de web/src/modulos/metricas/vigilancia.ts. Não imprime e-mails, nomes nem endereços, só contagens.
// Uso: npm run db:vigilancia (rodar no começo de cada sessão de trabalho no Sibi).
import postgres from "postgres";
import { LIMITES } from "../src/servidor/limites";
import { avaliar, type Medidas } from "../src/modulos/metricas/vigilancia";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada em .env.local");
const sql = postgres(url, { prepare: false, max: 1 });

try {
  const [m] = await sql<Medidas[]>`
    select
      (select count(*)::int from perfis where visitante and criado_em > now() - interval '24 hours') as "visitantes24h",
      (select count(*)::int from auth.users u where u.is_anonymous and u.created_at > now() - interval '24 hours'
         and not exists (select 1 from perfis p where p.id = u.id)) as "anonimosSemPerfil24h",
      (select count(*)::int from auth.users where is_anonymous) as "anonimosTotal",
      (select count(distinct chave)::int from limites_frequencia
         where (chave like 'demo:%' and contagem > ${LIMITES.demo}) or (chave like 'aluno:%' and contagem > ${LIMITES.aluno})
            or (chave like 'raro:%' and contagem > ${LIMITES.raro})) as "chavesNoLimite",
      (select coalesce(max(contagem), 0)::int from limites_frequencia) as "picoPorMinuto",
      (select count(*)::int from eventos_produto where criado_em > now() - interval '24 hours') as "eventos24h",
      (select count(*)::int from eventos_produto where nome = 'desafio_iniciado' and criado_em > now() - interval '24 hours') as "desafios24h",
      (select round(pg_database_size(current_database()) / 1048576.0)::int) as "bancoMb"`;

  const [{ agora }] = await sql<{ agora: string }[]>`select to_char(now() at time zone 'America/Sao_Paulo', 'DD/MM/YYYY HH24:MI') as agora`;
  console.log(`Vigilância de abuso do Sibi em ${agora} (horário de Brasília)\n`);
  console.log(`  visitantes nas últimas 24 h:            ${m.visitantes24h}`);
  console.log(`  logins anônimos sem abrir o site (24 h): ${m.anonimosSemPerfil24h}`);
  console.log(`  usuários anônimos guardados:            ${m.anonimosTotal}`);
  console.log(`  quem bateu no limite por minuto (1 h):  ${m.chavesNoLimite} (pico de ${m.picoPorMinuto} pedidos num minuto)`);
  console.log(`  eventos nas últimas 24 h:               ${m.eventos24h}`);
  console.log(`  desafios do dia começados (24 h):       ${m.desafios24h}`);
  console.log(`  tamanho do banco:                       ${m.bancoMb} MB de 500 MB\n`);

  const achados = avaliar(m);
  if (!achados.length) console.log("Tudo normal: nenhum sinal de abuso.");
  for (const a of achados) console.log(`${a.nivel === "alerta" ? "ALERTA " : "ATENÇÃO"} ${a.texto}`);
  process.exitCode = achados.some((a) => a.nivel === "alerta") ? 2 : 0;
} finally {
  await sql.end();
}
