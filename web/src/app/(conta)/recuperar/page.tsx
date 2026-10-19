import type { Metadata } from "next";
import { Voltar } from "@/componentes/formulario";
import { FormularioRecuperar } from "./formulario";

export const metadata: Metadata = { title: "Recuperar acesso" };

export default function PaginaRecuperar() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/entrar" />
      <h1>Recuperar acesso</h1>
      <p className="subtitulo">Informe seu e-mail. Se houver uma conta com ele, você vai receber um link para criar uma nova senha.</p>
      <FormularioRecuperar />
    </main>
  );
}
