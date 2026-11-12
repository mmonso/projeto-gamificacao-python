"use client";
// Cartão "Coloque o Sibi na tela inicial" (PWA): com um toque onde o navegador permite (Chrome, Edge, Android)
// e com o passo a passo no iPhone, onde a instalação é pelo menu Compartilhar. Já instalado, não aparece.
import { useEffect, useState } from "react";
import { Icone } from "./Icone";
import { EVENTO_CONVITE } from "./RegistrarApp";

type Modo = "nada" | "botao" | "iphone";

function modoAtual(): Modo {
  const instalado = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (instalado) return "nada";
  if (window.sibiConviteInstalacao) return "botao";
  const iphone = /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  return iphone ? "iphone" : "nada";
}

export function InstalarApp() {
  const [modo, setModo] = useState<Modo>("nada");

  useEffect(() => {
    const atualizar = () => setModo(modoAtual());
    atualizar();
    window.addEventListener(EVENTO_CONVITE, atualizar);
    return () => window.removeEventListener(EVENTO_CONVITE, atualizar);
  }, []);

  async function instalar() {
    const convite = window.sibiConviteInstalacao;
    if (!convite) return;
    await convite.prompt();
    const { outcome } = await convite.userChoice;
    // O convite só vale uma vez; se a pessoa recusar, o navegador oferece de novo mais tarde.
    window.sibiConviteInstalacao = null;
    setModo(outcome === "accepted" ? "nada" : modoAtual());
  }

  if (modo === "nada") return null;
  return (
    <section className="cartao instalar-app" aria-labelledby="titulo-instalar">
      <h2 id="titulo-instalar">
        <Icone nome="casa" /> Coloque o Sibi na tela inicial
      </h2>
      <p>Abre direto na trilha, como um aplicativo, sem procurar o site. Fica mais fácil manter a sequência.</p>
      {modo === "botao" ? (
        <button type="button" className="botao botao-pequeno" onClick={() => void instalar()}>
          Instalar o Sibi
        </button>
      ) : (
        <ol className="passos-instalar">
          <li>
            No Safari, toque em <strong>Compartilhar</strong> (o quadrado com a seta para cima).
          </li>
          <li>
            Escolha <strong>Adicionar à Tela de Início</strong> e toque em <strong>Adicionar</strong>.
          </li>
        </ol>
      )}
    </section>
  );
}
