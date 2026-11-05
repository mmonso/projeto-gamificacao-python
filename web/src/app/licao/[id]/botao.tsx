"use client";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { comecarLicao, comecarRevisao, recuperarCoracoes, type EstadoInicio } from "../acoes";

export function BotaoComecar({ licaoId, rotulo, classe }: { licaoId: string; rotulo: string; classe?: string }) {
  const [estado, acao] = useActionState<EstadoInicio>(() => comecarLicao(licaoId), {});
  return (
    <form action={acao} className={classe ? undefined : "acoes"}>
      <Mensagens erro={estado.erro} />
      <BotaoEnviar classe={classe}>{rotulo}</BotaoEnviar>
    </form>
  );
}

export function BotaoRecuperar({ classe }: { classe?: string }) {
  const [estado, acao] = useActionState<EstadoInicio>(() => recuperarCoracoes(), {});
  return (
    <form action={acao} className="acoes">
      <Mensagens erro={estado.erro} />
      <BotaoEnviar classe={classe}>Recuperar corações</BotaoEnviar>
    </form>
  );
}

export function BotaoRevisao({ rotulo }: { rotulo: string }) {
  const [estado, acao] = useActionState<EstadoInicio>(() => comecarRevisao(), {});
  return (
    <form action={acao} className="acoes">
      <Mensagens erro={estado.erro} />
      <BotaoEnviar>{rotulo}</BotaoEnviar>
    </form>
  );
}
