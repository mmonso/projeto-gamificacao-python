"use client";
// Lembrete diário na agenda do celular (design/MELHORIAS_UX.md, D3). O aluno escolhe a hora e o Sibi abre o
// Google Agenda já preenchido, ou baixa um arquivo de calendário (iPhone e outros). Nada passa pelo servidor.
import { useEffect, useState } from "react";
import { arquivoIcs, linkGoogleAgenda } from "@/modulos/aprendizagem/lembrete";
import { Icone } from "./Icone";

const HORAS = [7, 8, 12, 13, 18, 19, 20, 21, 22];
const CHAVE = "sibi-lembrete";

function lerHora(): number {
  try {
    const h = Number(localStorage.getItem(CHAVE));
    return HORAS.includes(h) ? h : 20;
  } catch {
    return 20;
  }
}

/** Já criou um lembrete neste aparelho: o resultado da lição deixa de oferecer. */
export function lembreteCriado(): boolean {
  try {
    return localStorage.getItem(CHAVE) !== null;
  } catch {
    return false;
  }
}

export function LembreteAgenda({ compacto = false }: { compacto?: boolean }) {
  const [hora, setHora] = useState(20);
  const [feito, setFeito] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHora(lerHora());
  }, []);

  function lembrar() {
    try {
      localStorage.setItem(CHAVE, String(hora));
    } catch {
      // Sem armazenamento: só não lembra a hora escolhida.
    }
    setFeito(true);
  }

  function google() {
    lembrar();
    const fuso = Intl.DateTimeFormat().resolvedOptions().timeZone || "America/Sao_Paulo";
    window.open(linkGoogleAgenda(new Date(), hora, fuso, location.origin), "_blank", "noopener,noreferrer");
  }

  function baixarIcs() {
    lembrar();
    const url = URL.createObjectURL(new Blob([arquivoIcs(new Date(), hora, location.origin)], { type: "text/calendar;charset=utf-8" }));
    const a = Object.assign(document.createElement("a"), { href: url, download: "lembrete-sibi.ics" });
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }

  return (
    <div className={`lembrete-agenda${compacto ? " compacto" : ""}`}>
      <p className="lembrete-titulo">
        <Icone nome="relogio" /> {compacto ? "Quer um lembrete todo dia?" : "Lembrete diário"}
      </p>
      <p className="ajuda">Quem estuda no mesmo horário cria o hábito mais rápido. O lembrete vai para a agenda do seu celular.</p>
      <label className="lembrete-hora">
        Todo dia às
        <select value={hora} onChange={(e) => setHora(Number(e.target.value))}>
          {HORAS.map((h) => (
            <option key={h} value={h}>
              {h}h
            </option>
          ))}
        </select>
      </label>
      <div className="lembrete-botoes">
        <button type="button" className="botao botao-secundario botao-pequeno" onClick={google}>
          Google Agenda
        </button>
        <button type="button" className="botao botao-secundario botao-pequeno" onClick={baixarIcs}>
          iPhone e outros
        </button>
      </div>
      {feito && (
        <p className="ajuda lembrete-ok" role="status">
          <Icone nome="check" pequeno /> Confirme o evento na agenda que abriu. Até amanhã às {hora}h!
        </p>
      )}
    </div>
  );
}
