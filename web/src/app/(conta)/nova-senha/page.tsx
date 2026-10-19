import type { Metadata } from "next";
import { Suspense } from "react";
import { exigirAluno } from "@/servidor/auth/sessao";
import { FormularioNovaSenha } from "./formulario";

export const metadata: Metadata = { title: "Nova senha" };

// Chega aqui pelo link de recuperação, que já abre a sessão (FL-02, recuperação, passo 2).
async function Formulario() {
  await exigirAluno();
  return <FormularioNovaSenha />;
}

export default function PaginaNovaSenha() {
  return (
    <main className="tela-centro" id="conteudo-principal">
      <h1>Crie uma nova senha</h1>
      <Suspense fallback={<div className="esqueleto h-60" />}>
        <Formulario />
      </Suspense>
    </main>
  );
}
