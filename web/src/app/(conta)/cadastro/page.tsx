import type { Metadata } from "next";
import Link from "next/link";
import { EntrarComGoogle } from "@/componentes/EntrarComGoogle";
import { Voltar } from "@/componentes/formulario";
import { FormularioCadastro } from "./formulario";

export const metadata: Metadata = { title: "Criar conta" };

export default function PaginaCadastro() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <Voltar href="/" />
      <h1>Crie sua conta</h1>
      <p className="subtitulo">Para salvar seu progresso e continuar em qualquer aparelho.</p>
      <EntrarComGoogle origem="cadastro" />
      <p className="divisor-ou">ou com e-mail</p>
      <FormularioCadastro />
      <p className="text-center">
        Já tem conta? <Link href="/entrar">Entrar</Link>
      </p>
    </main>
  );
}
