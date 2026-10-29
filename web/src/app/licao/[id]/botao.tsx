"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { comecarLicao, recuperarCoracoes, type EstadoInicio } from "../acoes";

export function BotaoComecar({ licaoId, rotulo }: { licaoId: string; rotulo: string }) {
  const [estado, acao] = useActionState<EstadoInicio>(() => comecarLicao(licaoId), {});
  return (
    <form action={acao} className="acoes">
      <Mensagens erro={estado.erro} />
      <BotaoEnviar>{rotulo}</BotaoEnviar>
    </form>
  );
}

export function BotaoRecuperar() {
  const [estado, acao] = useActionState<EstadoInicio>(() => recuperarCoracoes(), {});
  return (
    <form action={acao} className="acoes">
      <Mensagens erro={estado.erro} />
      <BotaoEnviar>Recuperar corações</BotaoEnviar>
    </form>
  );
}
