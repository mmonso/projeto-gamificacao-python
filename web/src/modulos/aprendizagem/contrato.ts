// Contrato entre a interface da lição e a API (PLANO, seção 9; FL-03, FL-04).
// Usado pelos Route Handlers para validar pedidos e pela interface para tipar as respostas.
import { z } from "zod";
import type { ExercicioPublico, Gabarito } from "@/modulos/conteudo/esquema";
import { respostaEsquema, type Resposta } from "./corretor";

export const pedidoSubmissao = z.object({
  /** Gerado pela interface antes do envio; o reenvio usa o mesmo valor (FL-04). */
  id: z.uuid(),
  exercicioId: z.string().min(1).max(40),
  resposta: respostaEsquema,
});
export type PedidoSubmissao = z.infer<typeof pedidoSubmissao>;

export const pedidoDica = z.object({ exercicioId: z.string().min(1).max(40), numero: z.number().int().min(1).max(3) });

/** Resposta correta, revelada só depois da submissão. Nunca inclui o feedback das outras opções. */
export type Solucao =
  | { tipo: "escolher_resultado"; opcao: string }
  | { tipo: "completar_lacuna"; lacunas: Record<string, string> }
  | { tipo: "ordenar_blocos"; blocos: string[] }
  | { tipo: "localizar_erro"; linha: number; correcao: string };

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
  /** Primeira resposta deste item na sessão: define acertos de primeira e, no E06, a perda de coração. */
  primeiraTentativa: boolean;
  solucao: Solucao;
  explicacao: string;
  /** Comentário da opção escolhida, quando o conteúdo traz um (escolher_resultado). */
  feedbackOpcao?: string;
};

export type ResultadoConclusao = {
  licaoId: string;
  total: number;
  acertosPrimeira: number;
  /** Primeira vez que o aluno conclui esta lição: é o que concede o XP de primeira conclusão. */
  primeiraConclusao: boolean;
  /** XP lançado por esta conclusão, já gravado no servidor. Zero depois do limite diário de prática. */
  xp: number;
  proximaLicaoId: string | null;
};

export type ErroApi = { erro: "nao_autenticado" | "sessao_inexistente" | "desatualizada" | "invalida" | "incompleta" | "limite"; mensagem: string };
