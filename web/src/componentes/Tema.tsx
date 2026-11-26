"use client";
// Tema do app: escuro por padrão, claro como opção no Perfil. A escolha fica neste aparelho (localStorage) e é
// aplicada pelo script SCRIPT_TEMA no <head> antes da primeira pintura, para a tela nunca piscar no tema errado.
import { useEffect, useState } from "react";
import { CHAVE_TEMA, COR_DA_BARRA } from "@/modulos/aparencia/tema";
import { CHAVE_TEXTO, ROTULO_TEXTO, TAMANHOS_TEXTO, type TamanhoTexto } from "@/modulos/aparencia/texto";

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

function aplicarTamanho(t: TamanhoTexto) {
  const raiz = document.documentElement;
  if (t === "normal") delete raiz.dataset.texto;
  else raiz.dataset.texto = t;
  try {
    if (t === "normal") localStorage.removeItem(CHAVE_TEXTO);
    else localStorage.setItem(CHAVE_TEXTO, t);
  } catch {
    // Sem armazenamento, o tamanho vale só até fechar a página.
  }
}

/** Escolha do tamanho do texto no Perfil (design/MELHORIAS_UX.md, D2), aplicada na hora e guardada neste aparelho. */
export function EscolherTamanhoTexto() {
  const [tamanho, setTamanho] = useState<TamanhoTexto>("normal");
  useEffect(() => {
    const atual = document.documentElement.dataset.texto;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTamanho(atual === "grande" || atual === "maior" ? atual : "normal");
  }, []);

  function escolher(t: TamanhoTexto) {
    setTamanho(t);
    aplicarTamanho(t);
  }

  return (
    <div className="campo">
      <span id="rotulo-texto" className="font-extrabold">
        Tamanho do texto
      </span>
      <div className="segmentado" role="group" aria-labelledby="rotulo-texto">
        {TAMANHOS_TEXTO.map((t) => (
          <button key={t} type="button" aria-pressed={tamanho === t} className={`segmento texto-${t}`} onClick={() => escolher(t)}>
            {ROTULO_TEXTO[t]}
          </button>
        ))}
      </div>
    </div>
  );
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
