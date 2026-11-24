// Placar do desafio do dia guardado no aparelho, para o cartão do Praticar dizer "feito hoje"
// (design/MELHORIAS_UX.md, C6). Só o número do desafio e os quadradinhos, nunca as respostas.

const CHAVE = "sibi-desafio-feito";

export function guardarPlacarDeHoje(numero: number, placar: string) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify({ numero, placar }));
  } catch {
    // Sem armazenamento: o cartão só não mostra o placar.
  }
}

export function lerPlacarDeHoje(numero: number): string | null {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE) ?? "null");
    return v && v.numero === numero && typeof v.placar === "string" ? v.placar : null;
  } catch {
    return null;
  }
}
