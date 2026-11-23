"use client";
// Botão "Continuar com Google": entra ou cria a conta com o Google (FL-02). Como no visitante, continuar equivale
// a declarar a idade mínima e aceitar os documentos, por isso o aviso fica logo abaixo do botão.
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { entrarComGoogle, type EstadoFormulario } from "@/app/(conta)/acoes";
import { CHAVE_INTRODUCAO } from "@/modulos/conta/conta";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { BotaoEnviar, Mensagens } from "./formulario";

/** Logotipo do Google nas cores oficiais, como pedem as regras de marca do botão de login. */
function LogoGoogle() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

export function EntrarComGoogle({ origem, voltar }: { origem: "entrar" | "cadastro"; voltar?: string }) {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(entrarComGoogle, {});
  const [fuso, setFuso] = useState("");
  const [meta, setMeta] = useState("");
  useEffect(() => {
    // Fuso do navegador e meta escolhida na introdução: só existem depois da hidratação.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFuso(Intl.DateTimeFormat().resolvedOptions().timeZone ?? "");
    try {
      setMeta(String(JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}").meta ?? ""));
    } catch {
      // Sem a introdução, a meta fica no padrão.
    }
  }, []);

  return (
    <form action={acao} className="pilha entrar-google">
      <input type="hidden" name="fuso" value={fuso} />
      <input type="hidden" name="metaDiaria" value={meta} />
      {voltar && <input type="hidden" name="voltar" value={voltar} />}
      <BotaoEnviar classe="botao botao-google">
        <LogoGoogle />
        Continuar com Google
      </BotaoEnviar>
      <Mensagens erro={estado.erro} />
      <p className="links-documentos">
        Ao continuar com o Google, você confirma ter {DOCUMENTOS.idadeMinima} anos ou mais e aceita os{" "}
        <Link href={`/termos?de=${origem}`}>termos de uso</Link> e a <Link href={`/privacidade?de=${origem}`}>política de privacidade</Link>.
      </p>
    </form>
  );
}
