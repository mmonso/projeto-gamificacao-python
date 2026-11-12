// Prévia do link do desafio do dia no WhatsApp: a pergunta, um trecho de código e os quadradinhos do placar.
// O gerador apaga espaços nas pontas de cada trecho, por isso os do código são espaços sem quebra.
import { ImageResponse } from "next/og";

export const alt = "Desafio do dia do Sibi: qual é a saída?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const QUADRADOS = ["#2FA85E", "#2FA85E", "#FFC23D", "#D93A3A", "#2FA85E"];

export default function Imagem() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", background: "#1B7F45", padding: "0 90px", color: "#FFFFFF" }}>
        <div style={{ fontSize: 40, fontWeight: 800, color: "#FFC23D" }}>Sibi · Desafio do dia</div>
        <div style={{ fontSize: 84, fontWeight: 800, lineHeight: 1.05, marginTop: 14 }}>Qual é a saída?</div>
        <div style={{ display: "flex", flexDirection: "column", marginTop: 34, background: "#1E2A32", borderRadius: 18, padding: "22px 30px", fontSize: 36, color: "#E9EEF1", width: 640 }}>
          <div style={{ display: "flex" }}>
            <span>{"nome = "}</span>
            <span style={{ color: "#A8E6A3" }}>&quot;Ana&quot;</span>
          </div>
          <div style={{ display: "flex" }}>
            <span style={{ color: "#8CC8FF" }}>print</span>
            <span>{"(nome * "}</span>
            <span style={{ color: "#FFD580" }}>2</span>
            <span>)</span>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 38, gap: 14 }}>
          {QUADRADOS.map((cor, i) => (
            <div key={i} style={{ width: 56, height: 56, borderRadius: 10, background: cor, border: "4px solid #FFFFFF" }} />
          ))}
          <div style={{ fontSize: 34, marginLeft: 22, color: "#E3F6EA" }}>5 perguntas · sem cadastro</div>
        </div>
      </div>
    ),
    size,
  );
}
