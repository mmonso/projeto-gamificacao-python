// Boas-vindas (lição 0) vistas neste aparelho: quem já passou por elas vai direto para a lição.

const CHAVE = "sibi-boas-vindas";

export function boasVindasVistas(): boolean {
  try {
    return localStorage.getItem(CHAVE) === "1";
  } catch {
    return false;
  }
}

export function marcarBoasVindasVistas() {
  try {
    localStorage.setItem(CHAVE, "1");
  } catch {
    // Sem armazenamento: as boas-vindas só voltam a aparecer no próximo "Começar grátis".
  }
}
