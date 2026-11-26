import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Moldura, MolduraCarregando } from "@/componentes/Moldura";
import { obterPerfilAtual } from "@/servidor/auth/sessao";
import { cadernoDoAluno } from "@/servidor/conceitos/caderno";
import { banco } from "@/servidor/db/cliente";
import { resumoDoAluno } from "@/servidor/gamificacao/efeitos";
import { ListaCaderno } from "./ListaCaderno";

export const metadata: Metadata = { title: "Caderno de conceitos" };

// Caderno de conceitos (design/MELHORIAS_UX.md, D1): consulta de qualquer cartão já visto, com busca.
async function Caderno() {
  const { perfil } = await obterPerfilAtual();
  const [resumo, unidades] = await Promise.all([resumoDoAluno(banco(), perfil), cadernoDoAluno(banco(), perfil.id)]);
  const vistos = unidades.reduce((n, u) => n + u.conceitos.filter((c) => c.visto).length, 0);
  const total = unidades.reduce((n, u) => n + u.conceitos.length, 0);
  return (
    <Moldura atual="praticar" resumo={resumo}>
      <h1 className="mb-1">Caderno de conceitos</h1>
      <p className="ajuda mb-3">
        Tudo o que você já aprendeu, para consultar quando quiser: {vistos} de {total} conceitos.
      </p>
      <p className="mb-4">
        <Link className="link-discreto" href="/glossario">
          Palavras do Python: o glossário
        </Link>
      </p>
      <ListaCaderno unidades={unidades} />
    </Moldura>
  );
}

export default function PaginaCaderno() {
  return (
    <Suspense fallback={<MolduraCarregando />}>
      <Caderno />
    </Suspense>
  );
}
