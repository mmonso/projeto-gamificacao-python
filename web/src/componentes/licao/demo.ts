// Demonstração anônima no navegador (FL-01, passos 3 a 7; D-02 a D-04).
// O progresso fica guardado no navegador: identificadores dos itens, versão, respostas e uso de dicas.
// O servidor só corrige; nada é gravado nele até a transferência para a conta (FL-02).
import type { PedidoSubmissao, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { Resposta } from "@/modulos/aprendizagem/corretor";
import { acertosDePrimeira, iniciarFila, registrarResultado, type EstadoFila } from "@/modulos/aprendizagem/fila";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { chamar, type Motor } from "./motor";

export const CHAVE_DEMO = "sibi-demo";

type ItemDemo = { errouPrimeira: boolean | null; dicas: number; resposta: Resposta | null };

export type EstadoDemo = {
  licaoId: string;
  titulo: string;
  versaoLicaoId: number;
  /** Exercícios da versão em que a demonstração começou: ela termina nessa versão (FL-01). */
  exercicios: ExercicioPublico[];
  fila: EstadoFila;
  itens: Record<string, ItemDemo>;
  /** Último envio corrigido, devolvido de novo num reenvio com o mesmo id. */
  ultimo: { id: string; resultado: ResultadoSubmissao } | null;
  concluida: boolean;
};

// Sem armazenamento no navegador, a demonstração vale até a página ser fechada (CA-07).
let naMemoria: EstadoDemo | null = null;
let armazenamentoOk = true;

export function lerDemo(): EstadoDemo | null {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_DEMO) ?? "null");
    if (v && typeof v.versaoLicaoId === "number" && Array.isArray(v.exercicios) && v.fila && v.itens) return v as EstadoDemo;
    return null;
  } catch {
    armazenamentoOk = false;
    return naMemoria;
  }
}

function gravarDemo(estado: EstadoDemo | null) {
  naMemoria = estado;
  try {
    if (estado) localStorage.setItem(CHAVE_DEMO, JSON.stringify(estado));
    else localStorage.removeItem(CHAVE_DEMO);
  } catch {
    armazenamentoOk = false;
  }
}

export const apagarDemo = () => gravarDemo(null);

/** A demonstração ficou guardada no navegador e poderá ser transferida. */
export const demoGuardavel = () => armazenamentoOk;

export function novaDemo(licao: { licaoId: string; titulo: string; versaoLicaoId: number; exercicios: ExercicioPublico[] }): EstadoDemo {
  const estado: EstadoDemo = {
    ...licao,
    fila: iniciarFila(licao.exercicios.map((e) => e.id)),
    itens: Object.fromEntries(licao.exercicios.map((e) => [e.id, { errouPrimeira: null, dicas: 0, resposta: null }])),
    ultimo: null,
    concluida: false,
  };
  gravarDemo(estado);
  return estado;
}

export function exercicioAtual(estado: EstadoDemo): ExercicioPublico | null {
  return estado.exercicios.find((e) => e.id === estado.fila.fila[0]) ?? null;
}

/** Itens resolvidos para a transferência: a resposta que resolveu cada um, o primeiro erro e as dicas. */
export function itensParaTransferir(estado: EstadoDemo) {
  return estado.fila.resolvidos.map((id) => ({
    exercicioId: id,
    resposta: estado.itens[id].resposta!,
    errouPrimeira: estado.itens[id].errouPrimeira === true,
    dicas: estado.itens[id].dicas,
  }));
}

export function resultadoDaDemo(estado: EstadoDemo): ResultadoConclusao {
  return {
    tipo: "principal",
    licaoId: estado.licaoId,
    total: estado.exercicios.length,
    acertosPrimeira: acertosDePrimeira(estado.fila),
    primeiraConclusao: true,
    // Provisório: só vale depois da transferência para a conta (FL-01, passo 7).
    xp: PARAMETROS.xpPrimeiraConclusao,
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

/** Motor local da demonstração: sem corações (D-03) e com erros voltando ao fim da fila, como na lição normal. */
export function motorDemo(): Motor {
  const desatualizada = { ok: false as const, erro: { erro: "desatualizada" as const, mensagem: "A demonstração mudou em outra aba." } };
  return {
    async submeter(pedido: PedidoSubmissao) {
      const estado = lerDemo();
      if (!estado) return desatualizada;
      if (estado.ultimo?.id === pedido.id) return { ok: true, dados: estado.ultimo.resultado };
      if (estado.fila.fila[0] !== pedido.exercicioId) return desatualizada;
      const r = await chamar<{ correta: boolean; solucao: ResultadoSubmissao["solucao"]; explicacao: string; feedbackOpcao?: string }>("/api/demo/correcao", {
        versaoLicaoId: estado.versaoLicaoId,
        exercicioId: pedido.exercicioId,
        resposta: pedido.resposta,
      });
      if (!r.ok) return r;
      const { estado: fila, primeiraTentativa } = registrarResultado(estado.fila, pedido.exercicioId, r.dados.correta);
      const item = estado.itens[pedido.exercicioId];
      const itens = {
        ...estado.itens,
        [pedido.exercicioId]: { ...item, errouPrimeira: primeiraTentativa ? !r.dados.correta : item.errouPrimeira, resposta: r.dados.correta ? pedido.resposta : item.resposta },
      };
      const exercicio = estado.exercicios.find((e) => e.id === pedido.exercicioId)!;
      const resultado: ResultadoSubmissao = {
        submissaoId: pedido.id,
        exercicioId: pedido.exercicioId,
        exercicio,
        resposta: pedido.resposta,
        correta: r.dados.correta,
        primeiraTentativa,
        perdeuCoracao: false,
        coracoes: null,
        pausada: false,
        solucao: r.dados.solucao,
        explicacao: r.dados.explicacao,
        feedbackOpcao: r.dados.feedbackOpcao,
        resolvidos: fila.resolvidos.length,
        total: estado.exercicios.length,
        concluida: fila.fila.length === 0,
        proximo: estado.exercicios.find((e) => e.id === fila.fila[0]) ?? null,
      };
      gravarDemo({ ...estado, fila, itens, ultimo: { id: pedido.id, resultado } });
      return { ok: true, dados: resultado };
    },
    async dica(exercicioId, numero) {
      const estado = lerDemo();
      if (!estado || estado.fila.fila[0] !== exercicioId) return desatualizada;
      const r = await chamar<{ dica: string }>("/api/demo/dica", { versaoLicaoId: estado.versaoLicaoId, exercicioId, numero });
      if (r.ok) {
        const item = estado.itens[exercicioId];
        gravarDemo({ ...estado, itens: { ...estado.itens, [exercicioId]: { ...item, dicas: Math.max(item.dicas, numero) } } });
      }
      return r;
    },
    async concluir() {
      const estado = lerDemo();
      if (!estado || estado.fila.fila.length > 0) return desatualizada;
      gravarDemo({ ...estado, concluida: true });
      return { ok: true, dados: resultadoDaDemo(estado) };
    },
    async estado() {
      const estado = lerDemo();
      if (!estado) return desatualizada;
      return { ok: true, dados: { exercicio: exercicioAtual(estado), resolvidos: estado.fila.resolvidos.length, totalItens: estado.exercicios.length } };
    },
    async som() {},
  };
}
