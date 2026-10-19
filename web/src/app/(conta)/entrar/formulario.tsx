"use client";
import Link from "next/link";
import { useActionState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { entrar, type EstadoFormulario } from "../acoes";

export function FormularioEntrar({ voltar }: { voltar?: string }) {
  const [estado, acao] = useActionState<EstadoFormulario, FormData>(entrar, {});
  return (
    <form action={acao} className="formulario" noValidate>
      {voltar && <input type="hidden" name="voltar" value={voltar} />}
      <div className="campo">
        <label htmlFor="email">E-mail</label>
        <input id="email" name="email" type="email" autoComplete="email" required defaultValue={estado.valores?.email} />
      </div>
      <div className="campo">
        <label htmlFor="senha">Senha</label>
        <input id="senha" name="senha" type="password" autoComplete="current-password" required />
      </div>
      <Mensagens erro={estado.erro} />
      {estado.reenviar && (
        <Link className="botao botao-secundario" href="/verificar-email">
          Reenviar link de confirmação
        </Link>
      )}
      <BotaoEnviar>Entrar</BotaoEnviar>
    </form>
  );
}
