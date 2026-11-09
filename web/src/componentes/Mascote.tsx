// Mascote Sibi nos quatro estados (design/DESIGN.md, E03.1). Mesmo desenho do protótipo.
export type Humor = "incentivo" | "comemoracao" | "atencao" | "descanso";

const DESCRICAO: Record<Humor, string> = {
  incentivo: "Sibi, a cobrinha, sorrindo",
  comemoracao: "Sibi comemorando",
  atencao: "Sibi em alerta",
  descanso: "Sibi descansando",
};

const TAMANHO = { grande: 180, medio: 120, pequeno: 72, mini: 52 } as const;

function Olhos({ humor }: { humor: Humor }) {
  switch (humor) {
    case "incentivo":
      return (
        <>
          <circle cx="76" cy="34" r="6" fill="#fff" />
          <circle cx="94" cy="34" r="6" fill="#fff" />
          <circle cx="77.5" cy="35" r="3" fill="#1E2A32" />
          <circle cx="95.5" cy="35" r="3" fill="#1E2A32" />
        </>
      );
    case "comemoracao":
      return <path d="M70 36q6-8 12 0M88 36q6-8 12 0" fill="none" stroke="#1E2A32" strokeWidth="3.2" strokeLinecap="round" />;
    case "atencao":
      return (
        <>
          <circle cx="76" cy="35" r="6.5" fill="#fff" />
          <circle cx="94" cy="35" r="6.5" fill="#fff" />
          <circle cx="76" cy="36" r="3" fill="#1E2A32" />
          <circle cx="94" cy="36" r="3" fill="#1E2A32" />
          <path d="M69 25l12 3M101 25l-12 3" stroke="#1E2A32" strokeWidth="3" strokeLinecap="round" />
        </>
      );
    case "descanso":
      return <path d="M70 36q6 5 12 0M88 36q6 5 12 0" fill="none" stroke="#1E2A32" strokeWidth="3" strokeLinecap="round" />;
  }
}

function Boca({ humor }: { humor: Humor }) {
  switch (humor) {
    case "incentivo":
      return <path d="M77 46q8 7 16 0" fill="none" stroke="#1E2A32" strokeWidth="3" strokeLinecap="round" />;
    case "comemoracao":
      return (
        <>
          <path d="M75 44q10 13 20 0z" fill="#B3263A" />
          <path d="M85 52v9l-3 3M85 61l3 3" fill="none" stroke="#D93A3A" strokeWidth="2.2" strokeLinecap="round" />
        </>
      );
    case "atencao":
      return <ellipse cx="85" cy="48" rx="4" ry="5" fill="#1E2A32" />;
    case "descanso":
      return <path d="M80 47h10" stroke="#1E2A32" strokeWidth="3" strokeLinecap="round" />;
  }
}

function Extra({ humor }: { humor: Humor }) {
  switch (humor) {
    case "comemoracao":
      return (
        <>
          <path d="M30 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FFC23D" />
          <path d="M110 64l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#FFC23D" />
        </>
      );
    case "atencao":
      return (
        <>
          <rect x="104" y="6" width="12" height="24" rx="6" fill="#D93A3A" />
          <circle cx="110" cy="23" r="2.5" fill="#fff" />
          <rect x="108.5" y="10" width="3" height="9" rx="1.5" fill="#fff" />
        </>
      );
    case "descanso":
      return (
        <>
          <text x="104" y="22" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="15" fill="#55636D">
            z
          </text>
          <text x="112" y="12" fontFamily="Nunito, sans-serif" fontWeight="900" fontSize="11" fill="#55636D">
            z
          </text>
        </>
      );
    default:
      return null;
  }
}

/** Com `soCabeca`, o desenho é enquadrado só na cabeça, para caber legível em espaços pequenos. */
export function Mascote({ humor = "incentivo", tamanho = "medio", soCabeca = false }: { humor?: Humor; tamanho?: keyof typeof TAMANHO; soCabeca?: boolean }) {
  const lado = TAMANHO[tamanho];
  return (
    <svg width={lado} height={lado} viewBox={soCabeca ? "55 6 60 62" : "0 0 120 120"} role="img" aria-label={DESCRICAO[humor]} className="mx-auto block shrink-0">
      <path d="M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4" fill="none" stroke="#12592F" strokeWidth="22" strokeLinecap="round" />
      <path d="M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4" fill="none" stroke="#2FA85E" strokeWidth="17" strokeLinecap="round" />
      <circle cx="30" cy="96" r="2.6" fill="#1B7F45" />
      <circle cx="47" cy="82" r="2.6" fill="#1B7F45" />
      <circle cx="52" cy="58" r="2.6" fill="#1B7F45" />
      <ellipse cx="85" cy="38" rx="25" ry="22" fill="#12592F" />
      <ellipse cx="85" cy="37" rx="23" ry="20" fill="#2FA85E" />
      <ellipse cx="70" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
      <ellipse cx="100" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
      <Olhos humor={humor} />
      <Boca humor={humor} />
      <Extra humor={humor} />
    </svg>
  );
}
