import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CartaoConceito } from "@/app/sessao/[id]/CartaoConceito";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { cartaoParaConsulta } from "@/servidor/conceitos/caderno";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";

export const metadata: Metadata = { title: "Caderno de conceitos" };

// Um conceito do caderno: o mesmo cartão da lição, com a saída à vista e o "Entenda melhor" aberto.
async function Conceito({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { perfil } = await obterPerfilAtual();
  const [resumo, cartao] = await Promise.all([resumoDoAluno(banco(), perfil), cartaoParaConsulta(banco(), id)]);
  if (!cartao) notFound();
  return (
    <Moldura atual="praticar" resumo={resumo}>
      <p className="mb-3">
        <Link className="link-discreto" href="/caderno">
          ← Caderno de conceitos
        </Link>
      </p>
      <CartaoConceito cartao={cartao} posicao={1} total={1} vendo consulta />
    </Moldura>
  );
}

export default function PaginaConceito({ params }: PageProps<"/caderno/[id]">) {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Conceito params={params} />
    </Suspense>
  );
}
