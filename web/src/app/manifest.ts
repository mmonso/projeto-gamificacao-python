// Manifesto do app (PWA): o Sibi pode ser instalado na tela inicial e abre sem a barra do navegador.
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sibi: Python em 5 minutos por dia",
    short_name: "Sibi",
    description: "A academia diária de Python, em português.",
    lang: "pt-BR",
    start_url: "/aprender?origem=app",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#131F24",
    theme_color: "#1B7F45",
    categories: ["education"],
    icons: [
      { src: "/icones/sibi-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icones/sibi-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icones/sibi-mascaravel-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Desafio do dia", url: "/desafio", icons: [{ src: "/icones/sibi-192.png", sizes: "192x192" }] },
      { name: "Praticar", url: "/praticar", icons: [{ src: "/icones/sibi-192.png", sizes: "192x192" }] },
    ],
  };
}
