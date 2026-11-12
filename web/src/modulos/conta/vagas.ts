// Vagas do teste com amigos: um teto de contas com e-mail para o Sibi não crescer antes de o dono poder
// acompanhar. Visitantes não contam (são apagados em 7 dias). Para fechar o cadastro, LIMITE_DE_CONTAS = 0;
// para abrir mais vagas, aumente o número e publique. A vigilância avisa ao chegar perto do teto.

export const LIMITE_DE_CONTAS = 50;

/** A partir desta fração do teto, a vigilância pede atenção. */
export const FRACAO_DE_ATENCAO = 0.8;

export const MENSAGEM_SEM_VAGAS =
  "As vagas do teste do Sibi estão preenchidas por enquanto. Enquanto isso, você pode entrar como visitante ou jogar o desafio do dia.";

export function cadastroAberto(contas: number, limite: number = LIMITE_DE_CONTAS): boolean {
  return contas < limite;
}

export function vagasRestantes(contas: number, limite: number = LIMITE_DE_CONTAS): number {
  return Math.max(0, limite - contas);
}
