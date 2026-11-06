"use client";
// Aviso persistente de falta de conexão (F-35, CA-61): fica visível enquanto o navegador estiver offline.
import { useSyncExternalStore } from "react";
import { Icone } from "./Icone";

function assinar(aviso: () => void) {
  window.addEventListener("online", aviso);
  window.addEventListener("offline", aviso);
  return () => {
    window.removeEventListener("online", aviso);
    window.removeEventListener("offline", aviso);
  };
}

export function AvisoConexao() {
  const online = useSyncExternalStore(assinar, () => navigator.onLine, () => true);
  if (online) return null;
  return (
    <p className="faixa-offline" role="status">
      <Icone nome="semRede" />
      <span>Sem conexão. Seu progresso fica salvo; nada avança até a conexão voltar.</span>
    </p>
  );
}
