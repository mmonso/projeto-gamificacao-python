// Mini-teste da unidade 1: as mesmas 5 perguntas antes de começar e depois de concluir a unidade, para medir se
// a pessoa aprendeu (pesquisa do Duolingo, ação 17). Aqui ficam só as perguntas públicas: o gabarito e a correção
// moram no servidor (servidor/miniteste.ts), para não irem ao navegador. Respostas conferidas rodando Python.

export const UNIDADE_MINITESTE = "u1";

export const MOMENTOS = ["antes", "depois"] as const;
export type Momento = (typeof MOMENTOS)[number];

export type PerguntaMiniteste = { id: string; codigo: string; opcoes: readonly string[] };

export const PERGUNTAS_MINITESTE: readonly PerguntaMiniteste[] = [
  { id: "texto-ou-conta", codigo: 'print("5 + 3")', opcoes: ["8", "5 + 3", '"5 + 3"', "Erro"] },
  { id: "varios-valores", codigo: 'print("Total:", 4 * 2)', opcoes: ["Total: 8", "Total:8", "Total: 4 * 2", "Total:, 8"] },
  { id: "variavel-ou-texto", codigo: 'cidade = "Recife"\nprint("cidade")', opcoes: ["Recife", '"Recife"', "cidade", "Erro"] },
  { id: "trocar-valor", codigo: "pontos = 10\npontos = 25\nprint(pontos)", opcoes: ["10", "35", "10\n25", "25"] },
  { id: "atualizar", codigo: "saldo = 50\nsaldo = saldo - 20\nprint(saldo)", opcoes: ["50", "-20", "30", "saldo - 20"] },
];
