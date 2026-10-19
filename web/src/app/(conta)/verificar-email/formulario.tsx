"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { reenviarConfirmacao, type EstadoFormulario } from "../acoes";

export function FormularioReenviar() {
  const [estado, acao] = useActionState<EstadoFormulario>(reenviarConfirmacao, {});
  return (
    <form action={acao} className="acoes text-left">
      <Mensagens erro={estado.erro} aviso={estado.aviso} />
      <BotaoEnviar classe="botao botao-secundario">Reenviar link</BotaoEnviar>
    </form>
  );
}
