"use client";
// Pergunta curta no resultado da lição: como foi e, se foi difícil, o que atrapalhou. Opcional e de toque.
// Na fase de teste, é o que substitui assistir alguém usando o app.
import { useState } from "react";
import { MOTIVOS, NIVEIS, ROTULO_MOTIVO, ROTULO_NIVEL, type Motivo, type Nivel } from "@/modulos/aprendizagem/avaliacao";

function enviar(corpo: { licaoId: string; nivel: Nivel; motivo?: Motivo; demo: boolean }) {
  // Navegador controlado por automação (testes, robôs) não entra na métrica.
  if (navigator.webdriver) return;
  void fetch("/api/eventos/avaliacao", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(corpo) }).catch(() => {});
}

export function AvaliarLicao({ licaoId, demo }: { licaoId: string; demo: boolean }) {
  const [nivel, setNivel] = useState<Nivel | null>(null);
  const [pronto, setPronto] = useState(false);

  function escolherNivel(n: Nivel) {
    setNivel(n);
    if (n === "dificil") return; // O envio espera o motivo, ou o "Pular".
    enviar({ licaoId, nivel: n, demo });
    setPronto(true);
  }

  function escolherMotivo(m: Motivo | null) {
    enviar({ licaoId, nivel: "dificil", demo, ...(m ? { motivo: m } : {}) });
    setPronto(true);
  }

  if (pronto) {
    return (
      <p className="avaliar-licao avaliar-obrigado" role="status">
        Obrigado! Isso ajuda a melhorar as próximas lições.
      </p>
    );
  }

  return (
    <div className="avaliar-licao">
      {nivel !== "dificil" ? (
        <fieldset>
          <legend>Como foi esta lição?</legend>
          <div className="avaliar-opcoes">
            {NIVEIS.map((n) => (
              <button key={n} type="button" className="botao botao-fantasma" onClick={() => escolherNivel(n)}>
                {ROTULO_NIVEL[n]}
              </button>
            ))}
          </div>
        </fieldset>
      ) : (
        <fieldset>
          <legend>O que mais atrapalhou?</legend>
          <div className="avaliar-opcoes avaliar-motivos">
            {MOTIVOS.map((m) => (
              <button key={m} type="button" className="botao botao-fantasma" onClick={() => escolherMotivo(m)}>
                {ROTULO_MOTIVO[m]}
              </button>
            ))}
            <button type="button" className="botao botao-fantasma" onClick={() => escolherMotivo(null)}>
              Pular
            </button>
          </div>
        </fieldset>
      )}
    </div>
  );
}
