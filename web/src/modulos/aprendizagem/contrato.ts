// Contrato entre a interface da lição e a API (PLANO, seção 9; FL-03, FL-04).
// Usado pelos Route Handlers para validar pedidos e pela interface para tipar as respostas.
import { z } from "zod";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import type { Conquista } from "@/modulos/gamificacao/conquistas";
import { respostaEsquema, type Resposta } from "./corretor";

export const pedidoSubmissao = z.object({
  /** Gerado pela interface antes do envio; o reenvio usa o mesmo valor (FL-04). */
  id: z.uuid(),
  exercicioId: z.string().min(1).max(40),
  resposta: respostaEsquema,
});
export type PedidoSubmissao = z.infer<typeof pedidoSubmissao>;

export const pedidoDica = z.object({ exercicioId: z.string().min(1).max(40), /** Número 0: o aluno abriu o cartão do conceito (conta como dica fora da sessão principal). */
  numero: z.number().int().min(0).max(3) });

/** Resposta correta, revelada só depois da submissão. Nunca inclui o feedback das outras opções. */
export type Solucao =
  | { tipo: "escolher_resultado"; opcao: string }
  | { tipo: "completar_lacuna"; lacunas: Record<string, string> }
  | { tipo: "ordenar_blocos"; blocos: string[] }
  | { tipo: "localizar_erro"; linha: number; correcao: string }
  | { tipo: "digitar_saida"; saida: string };

export function solucaoDoGabarito(g: Gabarito): Solucao {
  switch (g.tipo) {
    case "escolher_resultado":
      return { tipo: g.tipo, opcao: g.opcao };
    case "completar_lacuna":
      return { tipo: g.tipo, lacunas: g.lacunas };
    case "ordenar_blocos":
      return { tipo: g.tipo, blocos: g.ordens[0] };
    case "localizar_erro":
      return { tipo: g.tipo, linha: g.linha, correcao: g.correcao };
    case "digitar_saida":
      return { tipo: g.tipo, saida: g.saida };
  }
}

export type Progresso = { resolvidos: number; total: number; concluida: boolean; proximo: ExercicioPublico | null };

export type ResultadoSubmissao = Progresso & {
  submissaoId: string;
  exercicioId: string;
  /** Exercício respondido, para mostrar o feedback depois de uma recarga (FL-04, passo 3). */
  exercicio: ExercicioPublico;
  /** Resposta gravada. Num reenvio, é a do primeiro envio, mesmo que o aluno a tenha alterado depois da falha. */
  resposta: Resposta;
  correta: boolean;
  /** Primeira resposta deste item na sessão: define acertos de primeira e a perda de coração. */
  primeiraTentativa: boolean;
  perdeuCoracao: boolean;
  /** Saldo depois da resposta, nas sessões que usam corações (só a principal); null nas demais. */
  coracoes: number | null;
  /** O saldo chegou a zero: depois do feedback, a sessão fica pausada até a recuperação (FL-06). */
  pausada: boolean;
  solucao: Solucao;
  explicacao: string;
  /** Comentário da opção escolhida, quando o conteúdo traz um (escolher_resultado), ou da saída quase certa (digitar_saida). */
  feedbackOpcao?: string;
};

export type ResultadoConclusao = {
  tipo: "principal" | "pratica" | "revisao" | "recuperacao";
  /** Lição da sessão; null numa recuperação, que junta itens de várias lições. */
  licaoId: string | null;
  total: number;
  acertosPrimeira: number;
  /** Primeira vez que o aluno conclui esta lição: é o que concede o XP de primeira conclusão. */
  primeiraConclusao: boolean;
  /** XP lançado por esta conclusão, já gravado no servidor. Zero depois do limite diário de prática. */
  xp: number;
  /** Corações devolvidos por uma recuperação; zero nas demais sessões. */
  coracoesRecuperados: number;
  /** Prática, revisão ou recuperação concluída depois das três recompensadas do dia (4.2). */
  limitePratica: boolean;
  /** Depois de uma recuperação, a sessão principal aberta para onde Voltar à lição leva (FL-06, passo 5). */
  voltarSessaoId: string | null;
  proximaLicaoId: string | null;
  /** Sequência depois da conclusão e se ela aumentou agora, na primeira sessão do dia (4.5). */
  sequencia: number;
  sequenciaAumentou: boolean;
  /** Dia livre ganho agora e dias sem estudo cobertos por dias livres nesta sessão. Ausente em resultados antigos. */
  diasLivres?: { ganhou: boolean; usados: number };
  /** Meta do dia depois da conclusão; cumpridaAgora só na sessão que a completa (4.4). */
  meta: { feitas: number; meta: number; cumpridaAgora: boolean };
  /** Conquistas concedidas por esta conclusão (4.7). */
  conquistas: Conquista[];
  /** Unidade que esta conclusão completou, para a celebração (CA-44). */
  unidadeConcluida: { id: string; titulo: string } | null;
};

export type ErroApi = {
  erro: "nao_autenticado" | "sessao_inexistente" | "desatualizada" | "invalida" | "incompleta" | "sem_coracoes" | "limite";
  mensagem: string;
};
