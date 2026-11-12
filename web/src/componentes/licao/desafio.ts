// Motor local do desafio do dia: guarda o andamento no navegador e só pede a correção ao servidor.
// Diferente da lição, cada pergunta vale uma tentativa: errar mostra a resposta e segue para a próxima,
// como num jogo do dia. O placar marca acerto de primeira, acerto com dica (ou cartão) e erro.
import type { PedidoSubmissao, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import type { Marca } from "@/modulos/desafio/desafio";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { chamar, type Motor } from "./motor";

export const CHAVE_DESAFIO = "sibi-desafio";

export type EstadoDesafio = {
  numero: number;
  exercicios: ExercicioPublico[];
  /** Perguntas respondidas, na ordem, com a marca de cada uma. */
  respondidas: { id: string; marca: Marca }[];
  /** Dicas e cartões pedidos por pergunta: um acerto com ajuda vira amarelo. */
  ajudas: Record<string, number>;
  ultimo: { id: string; resultado: ResultadoSubmissao } | null;
  concluido: boolean;
  /** Veio de um link compartilhado: vai junto nos eventos de início e fim. */
  compartilhado: boolean;
};

let naMemoria: EstadoDesafio | null = null;

export function lerDesafio(): EstadoDesafio | null {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_DESAFIO) ?? "null");
    if (v && typeof v.numero === "number" && Array.isArray(v.exercicios) && Array.isArray(v.respondidas)) return v as EstadoDesafio;
    return null;
  } catch {
    return naMemoria;
  }
}

function gravar(estado: EstadoDesafio) {
  naMemoria = estado;
  try {
    localStorage.setItem(CHAVE_DESAFIO, JSON.stringify(estado));
  } catch {
    // Sem armazenamento, o desafio vale até a página ser fechada.
  }
}

export function novoDesafio(numero: number, exercicios: ExercicioPublico[], compartilhado: boolean): EstadoDesafio {
  const estado: EstadoDesafio = { numero, exercicios, respondidas: [], ajudas: {}, ultimo: null, concluido: false, compartilhado };
  gravar(estado);
  return estado;
}

export function perguntaAtual(estado: EstadoDesafio): ExercicioPublico | null {
  return estado.exercicios[estado.respondidas.length] ?? null;
}

export const marcasDo = (estado: EstadoDesafio): Marca[] => estado.respondidas.map((r) => r.marca);

/** A tela da lição pede um resultado de conclusão; no desafio, ele não é mostrado (a tela própria lê o estado). */
function conclusaoDe(estado: EstadoDesafio): ResultadoConclusao {
  return {
    tipo: "principal",
    licaoId: null,
    total: estado.exercicios.length,
    acertosPrimeira: estado.respondidas.filter((r) => r.marca === "certa").length,
    primeiraConclusao: false,
    xp: 0,
    coracoesRecuperados: 0,
    limitePratica: false,
    voltarSessaoId: null,
    proximaLicaoId: null,
    sequencia: 0,
    sequenciaAumentou: false,
    meta: { feitas: 0, meta: PARAMETROS.metaPadrao, cumpridaAgora: false },
    conquistas: [],
    unidadeConcluida: null,
  };
}

export function registrarEventoDesafio(estado: EstadoDesafio, evento: "iniciado" | "concluido") {
  const acertos = estado.respondidas.filter((r) => r.marca !== "errada").length;
  void chamar("/api/desafio/evento", { numero: estado.numero, evento, compartilhado: estado.compartilhado, ...(evento === "concluido" ? { acertos } : {}) });
}

export function motorDesafio(): Motor {
  const desatualizado = { ok: false as const, erro: { erro: "desatualizada" as const, mensagem: "O desafio mudou em outra aba." } };
  return {
    async submeter(pedido: PedidoSubmissao) {
      const estado = lerDesafio();
      if (!estado) return desatualizado;
      if (estado.ultimo?.id === pedido.id) return { ok: true, dados: estado.ultimo.resultado };
      const atual = perguntaAtual(estado);
      if (!atual || atual.id !== pedido.exercicioId) return desatualizado;
      const r = await chamar<{ correta: boolean; solucao: ResultadoSubmissao["solucao"]; explicacao: string; feedbackOpcao?: string }>("/api/desafio/correcao", {
        numero: estado.numero,
        exercicioId: pedido.exercicioId,
        resposta: pedido.resposta,
      });
      if (!r.ok) return r;
      const marca: Marca = !r.dados.correta ? "errada" : estado.ajudas[atual.id] ? "dica" : "certa";
      const respondidas = [...estado.respondidas, { id: atual.id, marca }];
      const proximo = estado.exercicios[respondidas.length] ?? null;
      const resultado: ResultadoSubmissao = {
        submissaoId: pedido.id,
        exercicioId: atual.id,
        exercicio: atual,
        resposta: pedido.resposta,
        correta: r.dados.correta,
        primeiraTentativa: true,
        perdeuCoracao: false,
        coracoes: null,
        pausada: false,
        solucao: r.dados.solucao,
        explicacao: r.dados.explicacao,
        feedbackOpcao: r.dados.feedbackOpcao,
        resolvidos: respondidas.length,
        total: estado.exercicios.length,
        concluida: proximo === null,
        proximo,
      };
      gravar({ ...estado, respondidas, ultimo: { id: pedido.id, resultado } });
      return { ok: true, dados: resultado };
    },
    async dica(exercicioId, numero) {
      const estado = lerDesafio();
      if (!estado || perguntaAtual(estado)?.id !== exercicioId) return desatualizado;
      const ajudas = { ...estado.ajudas, [exercicioId]: Math.max(estado.ajudas[exercicioId] ?? 0, numero || 1) };
      gravar({ ...estado, ajudas });
      // Número 0 é o cartão do conceito: conta como ajuda, mas não há o que buscar no servidor.
      if (numero === 0) return { ok: true, dados: { dica: "" } };
      return chamar<{ dica: string }>("/api/desafio/dica", { numero: estado.numero, exercicioId, numeroDica: numero });
    },
    async concluir() {
      const estado = lerDesafio();
      if (!estado || estado.respondidas.length < estado.exercicios.length) return desatualizado;
      if (!estado.concluido) {
        gravar({ ...estado, concluido: true });
        registrarEventoDesafio(estado, "concluido");
      }
      return { ok: true, dados: conclusaoDe(estado) };
    },
    async estado() {
      const estado = lerDesafio();
      if (!estado) return desatualizado;
      return { ok: true, dados: { exercicio: perguntaAtual(estado), resolvidos: estado.respondidas.length, totalItens: estado.exercicios.length } };
    },
    async som() {},
  };
}
