import { describe, expect, it } from "vitest";
import { lerConfiguracao } from "./config";

const base = {
  DATABASE_URL: "postgresql://usuario:segredo-do-banco@aws-0-sa-east-1.pooler.supabase.com:5432/postgres",
  NEXT_PUBLIC_SUPABASE_URL: "https://abcdefgh.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_0123456789abcdef",
};

function erroDe(env: Record<string, string | undefined>): string {
  try {
    lerConfiguracao(env);
  } catch (e) {
    return (e as Error).message;
  }
  throw new Error("deveria ter recusado a configuração");
}

describe("configuração por ambiente (E04.2)", () => {
  it("em desenvolvimento, aceita o mínimo e deixa o endereço do site para a requisição", () => {
    expect(lerConfiguracao(base)).toEqual({
      ambiente: "desenvolvimento",
      bancoUrl: base.DATABASE_URL,
      supabaseUrl: base.NEXT_PUBLIC_SUPABASE_URL,
      supabaseChave: base.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      urlDoSite: null,
    });
  });

  it("lista todas as variáveis que faltam, e linhas vazias do .env contam como ausentes", () => {
    const msg = erroDe({ DATABASE_URL: "", NEXT_PUBLIC_SUPABASE_URL: "  " });
    expect(msg).toContain("DATABASE_URL: não configurada");
    expect(msg).toContain("NEXT_PUBLIC_SUPABASE_URL: não configurada");
    expect(msg).toContain("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: não configurada");
  });

  it("recusa o pooler em modo transação sem mostrar a senha", () => {
    const msg = erroDe({ ...base, DATABASE_URL: base.DATABASE_URL.replace(":5432/", ":6543/") });
    expect(msg).toContain("porta 6543");
    expect(msg).not.toContain("segredo-do-banco");
  });

  it("homologação e produção exigem o endereço do site; produção, com https", () => {
    expect(erroDe({ ...base, SIBI_AMBIENTE: "homologacao" })).toContain("URL_DO_SITE: obrigatória em homologacao");
    expect(erroDe({ ...base, NODE_ENV: "production" })).toContain("URL_DO_SITE: obrigatória em producao");
    expect(erroDe({ ...base, NODE_ENV: "production", URL_DO_SITE: "http://sibi.app" })).toContain("https");
    expect(lerConfiguracao({ ...base, NODE_ENV: "production", SIBI_AMBIENTE: "homologacao", URL_DO_SITE: "https://homolog.sibi.app/" })).toMatchObject({
      ambiente: "homologacao",
      urlDoSite: "https://homolog.sibi.app",
    });
  });

  it("recusa ambiente desconhecido e endereços malformados", () => {
    expect(erroDe({ ...base, SIBI_AMBIENTE: "staging" })).toContain("SIBI_AMBIENTE");
    expect(erroDe({ ...base, NEXT_PUBLIC_SUPABASE_URL: "abcdefgh.supabase.co" })).toContain("NEXT_PUBLIC_SUPABASE_URL: precisa ser um endereço completo");
  });
});
