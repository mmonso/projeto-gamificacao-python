import type { Metadata } from "next";
import Link from "next/link";
import { Voltar } from "@/componentes/formulario";
import { FormularioCadastro } from "./formulario";

export const metadata: Metadata = { title: "Criar conta" };

export default function PaginaCadastro() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/" />
      <h1>Crie sua conta</h1>
      <p className="subtitulo">Para salvar seu progresso e continuar em qualquer aparelho.</p>
      <FormularioCadastro />
      <p className="text-center">
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </main>
  );
}
