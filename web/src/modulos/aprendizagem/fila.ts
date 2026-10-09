// Fila de itens de uma sessão (FL-03): itens errados voltam ao fim até serem resolvidos.

export type EstadoFila = {
  fila: string[];
  /** Itens com pelo menos uma resposta incorreta; preserva o desempenho da primeira tentativa. */
  errados: string[];
  resolvidos: string[];
};

export function iniciarFila(itens: string[]): EstadoFila {
  return { fila: [...itens], errados: [], resolvidos: [] };
}

export type ResultadoItem = {
  estado: EstadoFila;
  primeiraTentativa: boolean;
  concluida: boolean;
};

export function registrarResultado(estado: EstadoFila, itemId: string, correta: boolean): ResultadoItem {
  if (estado.fila[0] !== itemId) throw new Error(`O item ${itemId} não é o atual da fila`);
  const primeiraTentativa = !estado.errados.includes(itemId);
  const [, ...resto] = estado.fila;
  const novo: EstadoFila = correta
    ? { fila: resto, errados: estado.errados, resolvidos: [...estado.resolvidos, itemId] }
    : { fila: [...resto, itemId], errados: primeiraTentativa ? [...estado.errados, itemId] : estado.errados, resolvidos: estado.resolvidos };
  return { estado: novo, primeiraTentativa, concluida: novo.fila.length === 0 };
}

export function acertosDePrimeira(estado: EstadoFila): number {
  return estado.resolvidos.filter((id) => !estado.errados.includes(id)).length;
}
