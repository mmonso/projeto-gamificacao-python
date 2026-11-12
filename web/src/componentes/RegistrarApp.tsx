"use client";
// Registra o service worker do app (public/sw.js), que só mostra a página "sem conexão" quando a rede falha,
// e guarda o convite de instalação do navegador (Chrome, Edge, Android) para o cartão Instalar o Sibi.
// Fora do site publicado (desenvolvimento), não registra: um service worker velho atrapalharia os testes.
import { useEffect } from "react";

/** Evento beforeinstallprompt, que só alguns navegadores têm. */
export type ConviteInstalacao = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

declare global {
  interface Window {
    sibiConviteInstalacao?: ConviteInstalacao | null;
  }
}

export const EVENTO_CONVITE = "sibi:convite-instalacao";

export function RegistrarApp() {
  useEffect(() => {
    const guardar = (e: Event) => {
      window.sibiConviteInstalacao = e as ConviteInstalacao;
      window.dispatchEvent(new Event(EVENTO_CONVITE));
    };
    const instalado = () => {
      window.sibiConviteInstalacao = null;
      window.dispatchEvent(new Event(EVENTO_CONVITE));
    };
    window.addEventListener("beforeinstallprompt", guardar);
    window.addEventListener("appinstalled", instalado);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator && location.hostname !== "localhost") {
      navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {
        // Sem service worker, o app funciona igual; só não há a página "sem conexão".
      });
    }
    return () => {
      window.removeEventListener("beforeinstallprompt", guardar);
      window.removeEventListener("appinstalled", instalado);
    };
  }, []);
  return null;
}
