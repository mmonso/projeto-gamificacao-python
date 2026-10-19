"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { SENHA_MINIMA } from "@/modulos/conta/conta";
import { definirNovaSenha, type EstadoFormulario } from "../acoes";

export function FormularioNovaSenha() {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(definirNovaSenha, {});
  return (
    <form action={acao} className="formulario" noValidate>
      <div className="campo">
        <label htmlFor="senha">Nova senha</label>
        <input id="senha" name="senha" type="password" autoComplete="new-password" minLength={SENHA_MINIMA} required aria-describedby="ajuda-senha" />
        <p className="ajuda" id="ajuda-senha">
          Pelo menos {SENHA_MINIMA} caracteres.
        </p>
      </div>
      <div className="campo">
        <label htmlFor="confirmacao">Repita a nova senha</label>
        <input id="confirmacao" name="confirmacao" type="password" autoComplete="new-password" required />
      </div>
      <Mensagens erro={estado.erro} />
      <BotaoEnviar>Salvar e entrar</BotaoEnviar>
    </form>
  );
}
