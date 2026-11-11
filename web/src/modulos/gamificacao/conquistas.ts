// As 18 conquistas (design/ANALISE_UX_GAMIFICACAO.md, seção 5). Funções puras: o servidor lê as métricas do
// aluno no banco e estas regras dizem quais conquistas valem e quanto falta para cada uma.
// Nenhuma exige "zero dica", porque dica não pune; contagens usam exercícios ou dias distintos.

/** Métricas do aluno de que as conquistas dependem. */
export type Metricas = {
  licoesConcluidas: number;
  totalLicoes: number;
  /** Alguma unidade com todas as lições concluídas. */
  unidadeCompleta: boolean;
  /** Maior sequência de dias já alcançada. */
  maiorSequencia: number;
  /** Dias em que a meta diária foi cumprida. */
  diasDeMeta: number;
  /** Sessões concluídas com tudo certo de primeira. */
  sessoesPerfeitas: number;
  /** Lições diferentes com uma sessão perfeita (a coroa da trilha). */
  licoesComCoroa: number;
  /** Exercícios "encontre o erro" distintos acertados de primeira. */
  acertosEncontreErro: number;
  /** Exercícios "monte o programa" distintos acertados de primeira. */
  acertosMonteOPrograma: number;
  revisoesConcluidas: number;
  diasDeRevisao: number;
  conceitosConsolidando: number;
  xpTotal: number;
  recuperacoesConcluidas: number;
};

type Regra = { nome: string; descricao: string; meta: (m: Metricas) => number; valor: (m: Metricas) => number };

const fixa = (n: number) => () => n;

/** Catálogo na ordem em que aparece no perfil. Os três primeiros ids já existiam e foram mantidos. */
export const REGRAS_CONQUISTAS = {
  "primeira-licao": { nome: "Olá, mundo", descricao: "Concluir a primeira lição", meta: fixa(1), valor: (m) => m.licoesConcluidas },
  "primeira-unidade": { nome: "Pacote completo", descricao: "Concluir as 5 lições de uma unidade", meta: fixa(1), valor: (m) => Number(m.unidadeCompleta) },
  "tres-dias": { nome: "Pegando o ritmo", descricao: "Estudar 3 dias seguidos", meta: fixa(3), valor: (m) => m.maiorSequencia },
  "sete-dias": { nome: "Semana completa", descricao: "Estudar 7 dias seguidos", meta: fixa(7), valor: (m) => m.maiorSequencia },
  "catorze-dias": { nome: "Hábito instalado", descricao: "Estudar 14 dias seguidos", meta: fixa(14), valor: (m) => m.maiorSequencia },
  "trinta-dias": { nome: "Rodando há um mês", descricao: "Estudar 30 dias seguidos", meta: fixa(30), valor: (m) => m.maiorSequencia },
  "meta-cinco": { nome: "Combinado é combinado", descricao: "Cumprir a meta do dia em 5 dias", meta: fixa(5), valor: (m) => m.diasDeMeta },
  "primeira-coroa": { nome: "Rodou de primeira", descricao: "Terminar uma sessão com tudo certo de primeira", meta: fixa(1), valor: (m) => m.sessoesPerfeitas },
  "cinco-coroas": { nome: "Zero bugs", descricao: "Ganhar a coroa em 5 lições diferentes", meta: fixa(5), valor: (m) => m.licoesComCoroa },
  "caca-bugs": { nome: "Caça-bugs", descricao: "Acertar de primeira 10 exercícios diferentes de encontrar o erro", meta: fixa(10), valor: (m) => m.acertosEncontreErro },
  encaixou: { nome: "Encaixou!", descricao: "Acertar de primeira 8 exercícios diferentes de montar o programa", meta: fixa(8), valor: (m) => m.acertosMonteOPrograma },
  "primeira-revisao": { nome: "Salvo na memória", descricao: "Concluir a primeira revisão", meta: fixa(1), valor: (m) => m.revisoesConcluidas },
  "revisor-constante": { nome: "Constante", descricao: "Fazer revisão em 5 dias diferentes", meta: fixa(5), valor: (m) => m.diasDeRevisao },
  "sabe-de-cor": { nome: "Sabe de cor", descricao: "Ter um conceito consolidando", meta: fixa(1), valor: (m) => m.conceitosConsolidando },
  "biblioteca-propria": { nome: "Biblioteca própria", descricao: "Ter 10 conceitos consolidando", meta: fixa(10), valor: (m) => m.conceitosConsolidando },
  "cem-xp": { nome: "Contador ligado", descricao: "Chegar a 100 XP", meta: fixa(100), valor: (m) => m.xpTotal },
  "folego-novo": { nome: "Fôlego novo", descricao: "Recuperar corações pela primeira vez", meta: fixa(1), valor: (m) => m.recuperacoesConcluidas },
  "curso-completo": { nome: "Saída esperada", descricao: "Concluir todas as lições do curso", meta: (m) => Math.max(1, m.totalLicoes), valor: (m) => m.licoesConcluidas },
} satisfies Record<string, Regra>;

export type Conquista = keyof typeof REGRAS_CONQUISTAS;
export const IDS_CONQUISTAS = Object.keys(REGRAS_CONQUISTAS) as Conquista[];

export type ProgressoConquista = { id: Conquista; nome: string; descricao: string; atual: number; meta: number; conquistada: boolean };

/** Progresso de cada conquista, na ordem do catálogo. Uma conquista já concedida nunca volta a bloqueada. */
export function progressoDasConquistas(m: Metricas, concedidas: readonly Conquista[] = []): ProgressoConquista[] {
  return IDS_CONQUISTAS.map((id) => {
    const { nome, descricao, meta, valor } = REGRAS_CONQUISTAS[id] as Regra;
    const alvo = meta(m);
    const conquistada = concedidas.includes(id) || valor(m) >= alvo;
    return { id, nome, descricao, meta: alvo, atual: conquistada ? alvo : Math.min(valor(m), alvo), conquistada };
  });
}

/** Conquistas que as métricas merecem e o aluno ainda não tem. */
export function novasConquistas(existentes: readonly Conquista[], m: Metricas): Conquista[] {
  return progressoDasConquistas(m)
    .filter((p) => p.conquistada && !existentes.includes(p.id))
    .map((p) => p.id);
}
