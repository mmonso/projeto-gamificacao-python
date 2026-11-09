"use client";
// Leva a lição atual para o meio da tela quando ela começa fora da vista (design/ANALISE_UX_GAMIFICACAO.md, 2A).
import { useEffect } from "react";

export function RolarParaAtual() {
  useEffect(() => {
    const atual = document.querySelector(".li-atual");
    if (!atual) return;
    const { top, bottom } = atual.getBoundingClientRect();
    if (top >= 0 && bottom <= window.innerHeight * 0.8) return;
    const reduzir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    atual.scrollIntoView({ block: "center", behavior: reduzir ? "auto" : "smooth" });
  }, []);
  return null;
}
