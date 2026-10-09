// Formato dos exercícios, espelhando conteudo/FORMATO.md.
// O verificador em Python valida o conteúdo antes da publicação; este esquema
// valida de novo na importação e define a separação entre parte pública e gabarito (F-15).
import { z } from "zod";

const texto = z.string().min(1);

const base = {
  id: z.string().regex(/^u\d+-l\d+-[er]\d{2}$/),
  versao: z.number().int().min(1),
  objetivo: texto,
  conceitos: z.array(texto).min(1),
  dificuldade: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  enunciado: texto.max(200),
  codigo: texto.optional(),
  saida_esperada: texto.optional(),
  dicas: z.array(texto).min(1).max(3),
  explicacao: texto,
  variacao_de: z.string().optional(),
};

const opcao = z.object({
  id: texto,
  texto: texto.optional(),
  erro: z.boolean().optional(),
  feedback: texto.optional(),
});

export const exercicioEsquema = z.discriminatedUnion("tipo", [
  z.object({
    ...base,
    tipo: z.literal("escolher_resultado"),
    opcoes_sao: z.enum(["saida", "codigo", "texto"]),
    opcoes: z.array(opcao).min(3).max(4),
    resposta: texto,
  }),
  z.object({
    ...base,
    tipo: z.literal("completar_lacuna"),
    codigo: texto,
    saida_esperada: texto,
    lacunas: z.array(z.object({ id: texto, opcoes: z.array(texto).min(2).max(4), resposta: texto })).min(1).max(3),
  }),
  z.object({
    ...base,
    tipo: z.literal("ordenar_blocos"),
    saida_esperada: texto,
    codigo_antes: texto.optional(),
    codigo_depois: texto.optional(),
    blocos: z.array(z.object({ id: texto, codigo: texto })).min(2).max(7),
    resposta: z.array(z.array(texto).min(1)).min(1),
  }),
  z.object({
    ...base,
    tipo: z.literal("localizar_erro"),
    codigo: texto,
    erro: z.enum(["SyntaxError", "IndentationError", "NameError", "TypeError", "saida_incorreta"]),
    resposta: z.number().int().min(1),
    correcao: texto,
  }),
]);

export type Exercicio = z.infer<typeof exercicioEsquema>;
export type TipoExercicio = Exercicio["tipo"];

export const licaoEsquema = z.object({
  id: z.string().regex(/^u\d+-l\d+$/),
  unidade: texto,
  ordem: z.number().int().min(1),
  versao: z.number().int().min(1),
  titulo: texto,
  objetivo: texto,
  conceitos: z.array(texto).min(1),
  exercicios: z.array(exercicioEsquema).min(5).max(8),
  revisao: z.array(exercicioEsquema).default([]),
});

export type Licao = z.infer<typeof licaoEsquema>;

/** Gabarito: tudo o que só pode sair do servidor depois da submissão. */
export type Gabarito =
  | { tipo: "escolher_resultado"; opcao: string; feedbackOpcoes: Record<string, string> }
  | { tipo: "completar_lacuna"; lacunas: Record<string, string> }
  | { tipo: "ordenar_blocos"; ordens: string[][] }
  | { tipo: "localizar_erro"; linha: number; correcao: string };

/** Parte que o aluno pode ver antes de responder. As dicas são entregues uma a uma, a pedido. */
export type ExercicioPublico =
  | (PublicoBase & { tipo: "escolher_resultado"; opcoesSao: "saida" | "codigo" | "texto"; opcoes: { id: string; texto?: string; erro?: boolean }[] })
  | (PublicoBase & { tipo: "completar_lacuna"; lacunas: { id: string; opcoes: string[] }[] })
  | (PublicoBase & { tipo: "ordenar_blocos"; blocos: { id: string; codigo: string }[]; codigoAntes?: string; codigoDepois?: string })
  | (PublicoBase & { tipo: "localizar_erro" });

type PublicoBase = { id: string; versao: number; enunciado: string; codigo?: string; saidaEsperada?: string; totalDicas: number };

export function separarExercicio(ex: Exercicio): { publico: ExercicioPublico; gabarito: Gabarito; explicacao: string; dicas: string[] } {
  const comum: PublicoBase = {
    id: ex.id,
    versao: ex.versao,
    enunciado: ex.enunciado,
    codigo: ex.codigo,
    saidaEsperada: ex.saida_esperada,
    totalDicas: ex.dicas.length,
  };
  const resto = { explicacao: ex.explicacao, dicas: ex.dicas };
  switch (ex.tipo) {
    case "escolher_resultado":
      return {
        ...resto,
        publico: { ...comum, tipo: ex.tipo, opcoesSao: ex.opcoes_sao, opcoes: ex.opcoes.map(({ id, texto, erro }) => ({ id, texto, erro })) },
        gabarito: {
          tipo: ex.tipo,
          opcao: ex.resposta,
          feedbackOpcoes: Object.fromEntries(ex.opcoes.filter((o) => o.feedback).map((o) => [o.id, o.feedback as string])),
        },
      };
    case "completar_lacuna":
      return {
        ...resto,
        publico: { ...comum, tipo: ex.tipo, lacunas: ex.lacunas.map(({ id, opcoes }) => ({ id, opcoes })) },
        gabarito: { tipo: ex.tipo, lacunas: Object.fromEntries(ex.lacunas.map((l) => [l.id, l.resposta])) },
      };
    case "ordenar_blocos":
      return {
        ...resto,
        publico: { ...comum, tipo: ex.tipo, blocos: ex.blocos, codigoAntes: ex.codigo_antes, codigoDepois: ex.codigo_depois },
        gabarito: { tipo: ex.tipo, ordens: ex.resposta },
      };
    case "localizar_erro":
      return {
        ...resto,
        publico: { ...comum, tipo: ex.tipo },
        gabarito: { tipo: ex.tipo, linha: ex.resposta, correcao: ex.correcao },
      };
  }
}
