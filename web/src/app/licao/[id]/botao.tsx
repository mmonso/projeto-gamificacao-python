"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { comecarLicao, type EstadoInicio } from "../acoes";

export function BotaoComecar({ licaoId, rotulo }: { licaoId: string; rotulo: string }) {
  const [estado, acao] = useActionState<EstadoInicio>(() => comecarLicao(licaoId), {});
  return (
    <form action={acao} className="acoes">
      <Mensagens erro={estado.erro} />
      <BotaoEnviar>{rotulo}</BotaoEnviar>
    </form>
  );
}
