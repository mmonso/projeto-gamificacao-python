import type { Metadata } from "next";
import { Voltar } from "@/componentes/formulario";

export const metadata: Metadata = { title: "Política de privacidade" };

// Texto definitivo em E08.9, antes do beta.
export default function PaginaPrivacidade() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/cadastro" />
      <h1>Política de privacidade</h1>
      <p className="subtitulo">
        A política de privacidade está sendo redigida e será publicada antes da abertura do beta. Por enquanto, guardamos apenas o e-mail, o nome que você escolher e o seu progresso nas lições.
      </p>
    </main>
  );
}
