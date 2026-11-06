"use client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { CHAVE_INTRODUCAO, NOME_MAXIMO, SENHA_MINIMA } from "@/modulos/conta/conta";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { cadastrar, type EstadoFormulario } from "../acoes";

type Introducao = { nome: string; meta: string; fuso: string };

/** Escolhas da introdução guardadas no navegador e fuso sugerido por ele (FL-01, FL-02). */
function lerIntroducao(): Introducao {
  const fuso = Intl.DateTimeFormat().resolvedOptions().timeZone ?? "";
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    return { nome: typeof salvo.nome === "string" ? salvo.nome : "", meta: String(salvo.meta ?? ""), fuso };
  } catch {
    return { nome: "", meta: "", fuso };
  }
}

export function FormularioCadastro() {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(cadastrar, {});
  const [introducao, setIntroducao] = useState<Introducao>({ nome: "", meta: "", fuso: "" });
  const [aceitou, setAceitou] = useState(false);

  // localStorage só existe no navegador: lido depois da hidratação.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setIntroducao(lerIntroducao()), []);

  return (
    <form action={acao} className="formulario" noValidate>
      <input type="hidden" name="metaDiaria" value={introducao.meta} />
      <input type="hidden" name="fuso" value={introducao.fuso} />
      <div className="campo">
        <label htmlFor="nome">Nome ou apelido (opcional)</label>
        <input id="nome" name="nome" autoComplete="nickname" maxLength={NOME_MAXIMO} defaultValue={estado.valores?.nome ?? introducao.nome} key={introducao.nome} />
      </div>
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={estado.valores?.email} />
      </div>
      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="new-password" minLength={SENHA_MINIMA} required aria-describedby="ajuda-senha" />
        <p className="ajuda" id="ajuda-senha">
          Pelo menos {SENHA_MINIMA} caracteres.
        </p>
      </div>
      <label className="caixa-termos">
        <input type="checkbox" name="termos" checked={aceitou} onChange={(e) => setAceitou(e.target.checked)} />
        <span>
          Tenho {DOCUMENTOS.idadeMinima} anos ou mais e aceito os <Link href="/termos?de=cadastro">termos de uso</Link> e a{" "}
          <Link href="/privacidade?de=cadastro">política de privacidade</Link>.
        </span>
      </label>
      <Mensagens erro={estado.erro} />
      <BotaoEnviar desabilitado={!aceitou}>Criar conta</BotaoEnviar>
    </form>
  );
}
