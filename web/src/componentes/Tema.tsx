"use client";
// Tema do app: escuro por padrão, claro como opção no Perfil. A escolha fica neste aparelho (localStorage) e é
// aplicada pelo script SCRIPT_TEMA no <head> antes da primeira pintura, para a tela nunca piscar no tema errado.
import { useEffect, useState } from "react";
import { CHAVE_TEMA, COR_DA_BARRA } from "@/modulos/aparencia/tema";

function aplicar(claro: boolean) {
  const raiz = document.documentElement;
  if (claro) raiz.dataset.tema = "claro";
  else delete raiz.dataset.tema;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", claro ? COR_DA_BARRA.claro : COR_DA_BARRA.escuro);
  try {
    if (claro) localStorage.setItem(CHAVE_TEMA, "claro");
    else localStorage.removeItem(CHAVE_TEMA);
  } catch {
    // Sem armazenamento, o tema vale só até fechar a página.
  }
}

/** Alternador "Tema claro" do Perfil. */
export function AlternarTema() {
  const [claro, setClaro] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setClaro(document.documentElement.dataset.tema === "claro");
  }, []);

  return (
    <div className="alternador">
      <span id="rotulo-tema" className="font-extrabold">
        Tema claro
      </span>
      <button
        type="button"
        aria-pressed={claro}
        aria-labelledby="rotulo-tema"
        onClick={() => {
          aplicar(!claro);
          setClaro(!claro);
        }}
      />
    </div>
  );
}
