// Ícones do manifesto do app (src/app/manifest.ts), gerados no build.
import { ImageResponse } from "next/og";
import { desenhoDoIcone } from "../desenho";

const ICONES: Record<string, { tamanho: number; mascaravel: boolean }> = {
  "sibi-192.png": { tamanho: 192, mascaravel: false },
  "sibi-512.png": { tamanho: 512, mascaravel: false },
  "sibi-mascaravel-512.png": { tamanho: 512, mascaravel: true },
};

export function generateStaticParams() {
  return Object.keys(ICONES).map((nome) => ({ nome }));
}

export async function GET(_pedido: Request, contexto: RouteContext<"/icones/[nome]">) {
  const { nome } = await contexto.params;
  const icone = ICONES[nome];
  if (!icone) return new Response("Não encontrado", { status: 404 });
  return new ImageResponse(desenhoDoIcone(icone.tamanho, icone.mascaravel), { width: icone.tamanho, height: icone.tamanho });
}
