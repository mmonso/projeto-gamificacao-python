// Ícone do app (tela inicial do celular, PWA): o Sibi sorrindo num círculo branco sobre o verde da marca.
// O gerador de imagens só aceita elementos simples dentro de <svg>; as formas são as de componentes/Mascote.tsx.
const CORPO = "M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4";

/**
 * `mascaravel`: o sistema pode recortar o ícone em círculo ou gota, então o desenho fica dentro dos 80%
 * centrais (zona segura) e o fundo verde vai até a borda.
 */
export function desenhoDoIcone(tamanho: number, mascaravel = false) {
  const circulo = Math.round(tamanho * (mascaravel ? 0.62 : 0.8));
  const sibi = Math.round(circulo * 0.8);
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#1B7F45" }}>
      <div style={{ display: "flex", width: circulo, height: circulo, borderRadius: circulo / 2, background: "#FFFFFF", alignItems: "center", justifyContent: "center" }}>
        <svg width={sibi} height={sibi} viewBox="0 0 120 120">
          <path d={CORPO} fill="none" stroke="#12592F" strokeWidth="22" strokeLinecap="round" />
          <path d={CORPO} fill="none" stroke="#2FA85E" strokeWidth="17" strokeLinecap="round" />
          <circle cx="30" cy="96" r="2.6" fill="#1B7F45" />
          <circle cx="47" cy="82" r="2.6" fill="#1B7F45" />
          <circle cx="52" cy="58" r="2.6" fill="#1B7F45" />
          <ellipse cx="85" cy="38" rx="25" ry="22" fill="#12592F" />
          <ellipse cx="85" cy="37" rx="23" ry="20" fill="#2FA85E" />
          <ellipse cx="70" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
          <ellipse cx="100" cy="45" rx="4" ry="2.6" fill="#F7A8B8" />
          <circle cx="76" cy="34" r="6" fill="#FFFFFF" />
          <circle cx="94" cy="34" r="6" fill="#FFFFFF" />
          <circle cx="77.5" cy="35" r="3" fill="#1E2A32" />
          <circle cx="95.5" cy="35" r="3" fill="#1E2A32" />
          <path d="M75 44q10 11 20 0" fill="none" stroke="#1E2A32" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
