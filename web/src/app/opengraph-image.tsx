// Imagem de prévia dos links do Sibi (WhatsApp, redes sociais), gerada no build (design/ESTRATEGIA_DE_CRESCIMENTO.md).
// O gerador só aceita elementos simples dentro de <svg>, por isso o Sibi comemorando é redesenhado aqui,
// com as mesmas formas de componentes/Mascote.tsx.
import { ImageResponse } from "next/og";

export const alt = "Sibi: a academia diária de Python, em português";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CORPO = "M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4";

export default function Imagem() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", background: "#1B7F45", padding: "0 80px", gap: 56 }}>
        <div style={{ display: "flex", width: 320, height: 320, borderRadius: 160, background: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
          <svg width="250" height="250" viewBox="0 0 120 120">
            <path d={CORPO} fill="none" stroke="#12592F" strokeWidth="22" strokeLinecap="round" />
            <path d={CORPO} fill="none" stroke="#2FA85E" strokeWidth="17" strokeLinecap="round" />
            <circle cx="30" cy="96" r="2.6" fill="#1B7F45" />
            <circle cx="47" cy="82" r="2.6" fill="#1B7F45" />
            <circle cx="52" cy="58" r="2.6" fill="#1B7F45" />
            <ellipse cx="85" cy="38" rx="25" ry="22" fill="#12592F" />
            <ellipse cx="85" cy="37" rx="23" ry="20" fill="#2FA85E" />
            <ellipse cx="70" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
            <ellipse cx="100" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
            <path d="M70 36q6-8 12 0M88 36q6-8 12 0" fill="none" stroke="#1E2A32" strokeWidth="3.2" strokeLinecap="round" />
            <path d="M75 44q10 13 20 0z" fill="#B3263A" />
            <path d="M85 52v9l-3 3M85 61l3 3" fill="none" stroke="#D93A3A" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M30 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FFC23D" />
            <path d="M110 64l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#FFC23D" />
          </svg>
        </div>
        <div style={{ display: "flex", flexDirection: "column", flex: 1, color: "#FFFFFF" }}>
          <div style={{ fontSize: 44, fontWeight: 800, color: "#FFC23D" }}>Sibi</div>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.1, marginTop: 12 }}>A academia diária de Python, em português</div>
          <div style={{ fontSize: 34, marginTop: 24, color: "#E3F6EA" }}>5 minutos por dia · grátis</div>
          <div style={{ display: "flex", marginTop: 36, background: "#1E2A32", borderRadius: 16, padding: "16px 24px", fontSize: 32, color: "#E9EEF1" }}>
            <span style={{ color: "#8CC8FF" }}>print</span>
            <span>(</span>
            <span style={{ color: "#A8E6A3" }}>&quot;Olá, você!&quot;</span>
            <span>)</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
