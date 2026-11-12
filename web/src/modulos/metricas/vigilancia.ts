// Vigilância de abuso (npm run db:vigilancia): números do banco comparados com limites que uma fase de teste com
// amigos não deveria passar. Regras puras; o script lê os números e imprime os alertas.
import { FRACAO_DE_ATENCAO, LIMITE_DE_CONTAS } from "../conta/vagas";

export type Medidas = {
  /** Visitantes (perfis) criados nas últimas 24 horas. */
  visitantes24h: number;
  /** Usuários anônimos do Supabase criados nas últimas 24 horas sem perfil: login direto pela API, sem passar pelo site. */
  anonimosSemPerfil24h: number;
  /** Usuários anônimos que existem agora (a limpeza diária apaga os de mais de 7 dias). */
  anonimosTotal: number;
  /** Chaves (endereço ou aluno) que estouraram o limite por minuto na última hora. */
  chavesNoLimite: number;
  /** Maior número de pedidos de uma única chave num minuto, na última hora. */
  picoPorMinuto: number;
  /** Eventos de produto gravados nas últimas 24 horas. */
  eventos24h: number;
  /** Desafios do dia começados nas últimas 24 horas. */
  desafios24h: number;
  /** Tamanho do banco, em MB (o plano gratuito do Supabase vai até 500 MB). */
  bancoMb: number;
  /** Contas com e-mail (visitantes fora), comparadas com o teto do teste em modulos/conta/vagas.ts. */
  contas: number;
};

export type Nivel = "alerta" | "atencao";
export type Achado = { nivel: Nivel; texto: string };

/** Limites da fase de teste com amigos. Passar de "atencao" pede olhar; passar de "alerta" pede agir (captcha, bloqueio). */
export const LIMITES_VIGILANCIA = {
  visitantes24h: { atencao: 30, alerta: 100 },
  anonimosSemPerfil24h: { atencao: 10, alerta: 50 },
  anonimosTotal: { atencao: 200, alerta: 1000 },
  chavesNoLimite: { atencao: 1, alerta: 5 },
  eventos24h: { atencao: 20_000, alerta: 100_000 },
  desafios24h: { atencao: 500, alerta: 3_000 },
  bancoMb: { atencao: 250, alerta: 400 },
  contas: { atencao: Math.ceil(LIMITE_DE_CONTAS * FRACAO_DE_ATENCAO), alerta: LIMITE_DE_CONTAS },
} as const satisfies Partial<Record<keyof Medidas, { atencao: number; alerta: number }>>;

const TEXTOS: Record<keyof typeof LIMITES_VIGILANCIA, (n: number) => string> = {
  visitantes24h: (n) => `${n} visitantes entraram nas últimas 24 h. Se não houve divulgação, pode ser robô: considere o captcha.`,
  anonimosSemPerfil24h: (n) => `${n} logins anônimos nas últimas 24 h nunca abriram o site: alguém está chamando o Supabase direto. Considere o captcha.`,
  anonimosTotal: (n) => `${n} usuários anônimos guardados. A limpeza diária está rodando? (veja /api/manutencao no painel da Vercel)`,
  chavesNoLimite: (n) => `${n} endereço(s) ou aluno(s) bateram no limite de pedidos por minuto na última hora: repetição automática.`,
  eventos24h: (n) => `${n} eventos nas últimas 24 h, bem acima do esperado para o teste com amigos.`,
  desafios24h: (n) => `${n} desafios do dia começados nas últimas 24 h. Ótimo se foi divulgação; estranho se não foi.`,
  bancoMb: (n) => `O banco tem ${n} MB, perto do limite de 500 MB do plano gratuito.`,
  contas: (n) =>
    n >= LIMITE_DE_CONTAS
      ? `${n} contas: o teto de ${LIMITE_DE_CONTAS} foi atingido e o cadastro está fechado. Para abrir mais vagas, aumente LIMITE_DE_CONTAS.`
      : `${n} contas de ${LIMITE_DE_CONTAS}: o cadastro fecha sozinho ao chegar no teto.`,
};

export function avaliar(m: Medidas): Achado[] {
  const achados: Achado[] = [];
  for (const chave of Object.keys(LIMITES_VIGILANCIA) as (keyof typeof LIMITES_VIGILANCIA)[]) {
    const valor = m[chave];
    const { atencao, alerta } = LIMITES_VIGILANCIA[chave];
    if (valor >= alerta) achados.push({ nivel: "alerta", texto: TEXTOS[chave](valor) });
    else if (valor >= atencao) achados.push({ nivel: "atencao", texto: TEXTOS[chave](valor) });
  }
  return achados.sort((a, b) => (a.nivel === b.nivel ? 0 : a.nivel === "alerta" ? -1 : 1));
}
