"use client";
// Botão "Entrar como visitante": experimentar o app inteiro sem cadastro (login anônimo do Supabase).
// Entrar equivale a declarar a idade mínima e aceitar os documentos, por isso o aviso fica logo abaixo do botão.
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { entrarComoVisitante, type EstadoFormulario } from "@/app/(conta)/acoes";
import { DIAS_DE_VISITANTE } from "@/modulos/conta/conta";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { BotaoEnviar, Mensagens } from "./formulario";

export function EntrarComoVisitante({ origem }: { origem: "inicio" | "entrar" }) {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(entrarComoVisitante, {});
  const [fuso, setFuso] = useState("");
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFuso(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
  }, []);

  return (
    <form action={acao} className="pilha visitante">
      <input type="hidden" name="fuso" value={fuso} />
      <BotaoEnviar classe="botao botao-secundario">Entrar como visitante</BotaoEnviar>
      <Mensagens erro={estado.erro} />
      <p className="links-documentos">
        Sem cadastro: o acesso e o progresso são apagados em {DIAS_DE_VISITANTE} dias. Ao entrar, você confirma ter {DOCUMENTOS.idadeMinima} anos ou mais e
        aceita os <Link href={`/termos?de=${origem}`}>termos de uso</Link> e a <Link href={`/privacidade?de=${origem}`}>política de privacidade</Link>.
      </p>
    </form>
  );
}
