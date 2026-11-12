// Acessos de visitante (login anônimo): duram poucos dias e são apagados pela manutenção diária,
// junto com tudo o que o visitante fez. Assim o banco gratuito não enche e ninguém guarda dados à toa.
import { and, eq, lt, sql } from "drizzle-orm";
import type { PgDatabase, PgQueryResultHKT } from "drizzle-orm/pg-core";
import { DIAS_DE_VISITANTE } from "@/modulos/conta/conta";
import * as t from "@/servidor/db/esquema";
import { excluirDadosDoAluno } from "./preferencias";

type Db = PgDatabase<PgQueryResultHKT, typeof t>;

/** Momento antes do qual um visitante já venceu. */
export function limiteDeVisitante(agora = new Date()) {
  return new Date(agora.getTime() - DIAS_DE_VISITANTE * 86_400_000);
}

/** O esquema auth só existe no Supabase; nos testes com PostgreSQL embutido, a limpeza fica no esquema public. */
async function temAuth(db: Pick<Db, "execute">) {
  const linhas = (await db.execute(sql`select to_regclass('auth.users') is not null as existe`)) as unknown as
    | { existe: boolean }[]
    | { rows: { existe: boolean }[] };
  const lista = Array.isArray(linhas) ? linhas : linhas.rows;
  return lista[0]?.existe === true;
}

/**
 * Apaga os visitantes criados há mais de DIAS_DE_VISITANTE dias: perfil (com progresso em cascata), eventos
 * e o usuário anônimo do Supabase Auth. Também apaga usuários anônimos que nunca chegaram a ter perfil.
 * Contas com e-mail nunca entram aqui: o filtro exige perfis.visitante e auth.users.is_anonymous.
 */
export async function limparVisitantes(db: Db, agora = new Date()) {
  const limite = limiteDeVisitante(agora);
  const vencidos = await db
    .select({ id: t.perfis.id })
    .from(t.perfis)
    .where(and(eq(t.perfis.visitante, true), lt(t.perfis.criadoEm, limite)));

  const auth = await temAuth(db);
  for (const { id } of vencidos) {
    await db.transaction(async (tx) => {
      await excluirDadosDoAluno(tx, id);
      if (auth) await tx.execute(sql`delete from auth.users where id = ${id} and is_anonymous`);
    });
  }

  let semPerfil = 0;
  if (auth) {
    const apagados = (await db.execute(
      sql`delete from auth.users u where u.is_anonymous and u.created_at < ${limite.toISOString()}::timestamptz
          and not exists (select 1 from public.perfis p where p.id = u.id) returning u.id`,
    )) as unknown as unknown[] | { rows: unknown[] };
    semPerfil = Array.isArray(apagados) ? apagados.length : apagados.rows.length;
  }
  return { visitantes: vencidos.length, semPerfil };
}
