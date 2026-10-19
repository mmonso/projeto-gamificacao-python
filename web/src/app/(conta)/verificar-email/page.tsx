import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Mascote } from "@/componentes/Mascote";
import { lerEmailPendente } from "@/servidor/auth/email-pendente";
import { FormularioReenviar } from "./formulario";

export const metadata: Metadata = { title: "Confira seu e-mail" };

async function Destinatario() {
  const email = await lerEmailPendente();
  return email ? <strong className="break-all">{email}</strong> : <>seu e-mail</>;
}

export default function PaginaVerificarEmail() {
  return (
    <main className="tela-centro text-center" id="conteudo-principal">
      <Mascote humor="incentivo" />
      <h1>Confira seu e-mail</h1>
      <p className="subtitulo">
        Enviamos um link para{" "}
        <Suspense fallback={<>seu e-mail</>}>
          <Destinatario />
        </Suspense>
        . Abra o link para ativar sua conta.
      </p>
      <p className="ajuda">
        Se você já tinha uma conta com esse e-mail, <Link href="/entrar">entre</Link> ou <Link href="/recuperar">recupere o acesso</Link>.
      </p>
      <FormularioReenviar />
    </main>
  );
}
