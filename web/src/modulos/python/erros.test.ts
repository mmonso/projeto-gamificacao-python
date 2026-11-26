import { describe, expect, it } from "vitest";
import { avisoDeRecursos, endireitarAspas, traduzirErroPython } from "./erros";

const t = (tipo: string, mensagem: string, linha: number | null = 1) => traduzirErroPython({ tipo, mensagem, linha });

describe("erros do Python em português", () => {
  it("traduz os erros de escrita mais comuns", () => {
    expect(t("SyntaxError", "'(' was never closed").explicacao).toBe("Um ( abriu e não fechou.");
    expect(t("SyntaxError", "unterminated string literal (detected at line 1)").explicacao).toContain("aspas");
    expect(t("SyntaxError", "Missing parentheses in call to 'print'. Did you mean print(...)?").explicacao).toContain("print(...)");
    expect(t("SyntaxError", "expected ':'").explicacao).toContain("dois-pontos");
    expect(t("SyntaxError", "invalid character '“' (U+201C)").explicacao).toContain("curva");
    expect(t("SyntaxError", "invalid syntax. Perhaps you forgot a comma?").explicacao).toContain("vírgula");
    expect(t("IndentationError", "expected an indented block after 'if' statement on line 1", 2).explicacao).toContain("recuo");
    expect(t("IndentationError", "unexpected indent").explicacao).toContain("sobrando");
  });

  it("traduz erros de execução e mostra a linha", () => {
    const nome = t("NameError", "name 'pirnt' is not defined. Did you mean: 'print'?", 2);
    expect(nome.titulo).toBe("Linha 2: NameError (nome que o Python não conhece)");
    expect(nome.explicacao).toContain("pirnt");
    expect(nome.explicacao).toContain("Você quis dizer print?");
    expect(t("TypeError", 'can only concatenate str (not "int") to str').explicacao).toContain("str()");
    expect(t("TypeError", "unsupported operand type(s) for -: 'str' and 'int'").explicacao).toContain("texto e número inteiro");
    expect(t("ValueError", "invalid literal for int() with base 10: 'dois'").explicacao).toContain("'dois'");
    expect(t("ZeroDivisionError", "division by zero").explicacao).toContain("zero");
    expect(t("IndexError", "list index out of range").explicacao).toContain("começa do 0");
  });

  it("tem mensagens próprias para tempo, saída grande e import", () => {
    expect(t("Tempo", "", null).titulo).toBe("O programa demorou demais");
    expect(t("Importacao", "", 1).explicacao).toContain("Python básico");
    expect(t("ErroQualquer", "algo", 3).titulo).toBe("Linha 3: ErroQualquer");
  });

  it("endireita aspas do celular", () => {
    expect(endireitarAspas("print(“Oi”) e ‘a’")).toBe("print(\"Oi\") e 'a'");
  });

  it("avisa, sem bloquear, quando o código vai além da unidade", () => {
    expect(avisoDeRecursos(["For"], 2)).toContain("unidade 4");
    expect(avisoDeRecursos(["For"], 4)).toBeNull();
    expect(avisoDeRecursos(["While"], 4)).toContain("além do que o curso");
    expect(avisoDeRecursos(["For"], undefined)).toBeNull();
  });
});
