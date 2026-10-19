import type { Metadata } from "next";
import { Voltar } from "@/componentes/formulario";

export const metadata: Metadata = { title: "Termos de uso" };

// Texto definitivo em E08.9, antes do beta.
export default function PaginaTermos() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/cadastro" />
      <h1>Termos de uso</h1>
      <p className="subtitulo">Os termos de uso estão sendo redigidos e serão publicados antes da abertura do beta.</p>
    </main>
  );
}
