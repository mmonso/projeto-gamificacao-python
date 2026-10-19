"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { pedirRecuperacao, type EstadoFormulario } from "../acoes";

export function FormularioRecuperar() {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(pedirRecuperacao, {});
  return (
    <form action={acao} className="formulario" noValidate>
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={estado.valores?.email} />
      </div>
      <Mensagens erro={estado.erro} aviso={estado.aviso} />
      <BotaoEnviar>Enviar link</BotaoEnviar>
    </form>
  );
}
