"use client";
// "Algo errado nesta questão?" no feedback (design/MELHORIAS_UX.md, C3): um link discreto que abre três
// motivos de toque. Como o dono não acompanha os amigos usando, é o jeito de saber de uma correção injusta.
import { useState } from "react";
import { MOTIVOS_REPORTE, ROTULO_REPORTE, type MotivoReporte } from "@/modulos/aprendizagem/reporte";
import { chamar } from "./motor";

type Props = { exercicioId: string; contexto: string; sessaoId?: string; correta: boolean };

export function ReportarQuestao({ exercicioId, contexto, sessaoId, correta }: Props) {
  const [estado, setEstado] = useState<"fechado" | "aberto" | "enviado">("fechado");

  function enviar(motivo: MotivoReporte) {
    setEstado("enviado");
    // Navegador controlado por automação (testes, robôs) não entra na métrica.
    if (navigator.webdriver) return;
    void chamar("/api/eventos/reporte", { exercicioId, motivo, contexto, correta, ...(sessaoId ? { sessaoId } : {}) });
  }

  if (estado === "enviado") {
    return (
      <p className="reportar-obrigado" role="status">
        Obrigado! Vamos conferir esta questão.
      </p>
    );
  }
  if (estado === "fechado") {
    return (
      <button type="button" className="reportar-link" onClick={() => setEstado("aberto")}>
        Algo errado nesta questão?
      </button>
    );
  }
  return (
    <div className="reportar-opcoes" role="group" aria-label="O que houve com esta questão?">
      {MOTIVOS_REPORTE.filter((m) => !(correta && m === "resposta_certa")).map((m) => (
        <button key={m} type="button" className="botao botao-secundario botao-pequeno" onClick={() => enviar(m)}>
          {ROTULO_REPORTE[m]}
        </button>
      ))}
    </div>
  );
}
