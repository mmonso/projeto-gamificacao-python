import { describe, expect, it } from "vitest";
import {
  MENSAGENS,
  dadosIniciaisDoPerfil,
  destinoSeguro,
  esquemaCadastro,
  esquemaNovaSenha,
  mensagemDeErroAuth,
  primeiroErro,
} from "./conta";

describe("cadastro (F-04)", () => {
  const base = { nome: "  Ana ", email: " Ana@Exemplo.com ", senha: "segredo123", termos: "on", metaDiaria: "2", fuso: "America/Manaus" };

  it("normaliza nome e e-mail e aceita meta e fuso vindos do navegador", () => {
    expect(esquemaCadastro.parse(base)).toEqual({ nome: "Ana", email: "ana@exemplo.com", senha: "segredo123", termos: "on", metaDiaria: 2, fuso: "America/Manaus" });
  });

  it("exige o aceite dos termos", () => {
    const r = esquemaCadastro.safeParse({ ...base, termos: undefined });
    expect(r.success).toBe(false);
    expect(primeiroErro(r.error!)).toMatch(/termos de uso/);
  });

  it("exige senha com pelo menos 8 caracteres", () => {
    const r = esquemaCadastro.safeParse({ ...base, senha: "1234567" });
    expect(primeiroErro(r.error!)).toMatch(/8 caracteres/);
  });

  it("volta ao padrão quando meta ou fuso são inválidos, sem impedir o cadastro", () => {
    const r = esquemaCadastro.parse({ ...base, metaDiaria: "9", fuso: "Lua/Base" });
    expect(r).toMatchObject({ metaDiaria: 1, fuso: "America/Sao_Paulo" });
  });
});

describe("nova senha", () => {
  it("exige confirmação igual", () => {
    const r = esquemaNovaSenha.safeParse({ senha: "segredo123", confirmacao: "segredo124" });
    expect(primeiroErro(r.error!)).toBe("As senhas não são iguais.");
  });
});

describe("dados iniciais do perfil", () => {
  it("copia nome, meta, fuso e aceite dos metadados do cadastro", () => {
    const d = dadosIniciaisDoPerfil({ nome: "Ana", meta_diaria: 3, fuso: "Europe/Lisbon", termos_aceitos_em: "2026-10-18T12:00:00.000Z" });
    expect(d).toEqual({ nome: "Ana", metaDiaria: 3, fuso: "Europe/Lisbon", termosAceitosEm: new Date("2026-10-18T12:00:00.000Z") });
  });

  it("usa padrões quando os metadados faltam ou foram adulterados", () => {
    expect(dadosIniciaisDoPerfil(undefined)).toEqual({ nome: "", metaDiaria: 1, fuso: "America/Sao_Paulo", termosAceitosEm: null });
    expect(dadosIniciaisDoPerfil({ nome: "x".repeat(200), meta_diaria: 50, fuso: 1, termos_aceitos_em: "ontem" })).toEqual({
      nome: "",
      metaDiaria: 1,
      fuso: "America/Sao_Paulo",
      termosAceitosEm: null,
    });
  });
});

describe("destino depois de entrar (FL-02, passo 4)", () => {
  it("mantém caminhos internos com consulta", () => {
    expect(destinoSeguro("/licao/u1-l2?x=1")).toBe("/licao/u1-l2?x=1");
  });

  it.each(["https://evil.com", "//evil.com", "/\\evil.com", "javascript:alert(1)", "", null, 42])("recusa %s", (valor) => {
    expect(destinoSeguro(valor)).toBe("/aprender");
  });
});

describe("mensagens de erro do Auth", () => {
  it("não revela se o e-mail existe no login", () => {
    expect(mensagemDeErroAuth("invalid_credentials", "entrar")).toBe(MENSAGENS.credenciais);
    expect(mensagemDeErroAuth("user_not_found", "entrar")).toBe(MENSAGENS.credenciais);
    expect(mensagemDeErroAuth(undefined, "entrar")).toBe(MENSAGENS.credenciais);
  });

  it("oferece reenvio quando o e-mail não foi confirmado", () => {
    expect(mensagemDeErroAuth("email_not_confirmed", "entrar")).toBe(MENSAGENS.emailNaoConfirmado);
  });

  it("trata limite de tentativas e senha fraca", () => {
    expect(mensagemDeErroAuth("over_email_send_rate_limit", "email")).toBe(MENSAGENS.muitasTentativas);
    expect(mensagemDeErroAuth("weak_password", "cadastro")).toBe(MENSAGENS.senhaFraca);
  });
});
