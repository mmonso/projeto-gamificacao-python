// Motor da lição: de onde a tela tira correção, dicas e conclusão. Na conta, é a API da sessão;
// na demonstração, um motor local que só pede a correção ao servidor (componentes/licao/demo.ts).
import type { ErroApi, PedidoSubmissao, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";

export type Chamada<T> = { ok: true; dados: T } | { ok: false; erro: ErroApi | null };

/**
 * Tempo máximo de espera por uma resposta. Numa conexão que trava em vez de cair, a tela desiste e oferece
 * Tentar novamente; se o pedido tiver chegado ao servidor, o reenvio com o mesmo id devolve o que foi gravado.
 */
export const PRAZO_MS = 15_000;

/** Chamada à API em JSON. Falha de rede ou prazo esgotado devolve erro null, que a tela trata como falta de conexão. */
export async function chamar<T>(url: string, corpo?: unknown): Promise<Chamada<T>> {
  try {
    const signal = AbortSignal.timeout(PRAZO_MS);
    const r = await fetch(
      url,
      corpo === undefined ? { cache: "no-store", signal } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo), signal },
    );
    const dados = await r.json();
    return r.ok ? { ok: true, dados } : { ok: false, erro: dados as ErroApi };
  } catch {
    return { ok: false, erro: null };
  }
}

export type EstadoSessao = { exercicio: ExercicioPublico | null; resolvidos: number; totalItens: number };

export type Motor = {
  submeter(pedido: PedidoSubmissao): Promise<Chamada<ResultadoSubmissao>>;
  dica(exercicioId: string, numero: number): Promise<Chamada<{ dica: string }>>;
  concluir(): Promise<Chamada<ResultadoConclusao>>;
  estado(): Promise<Chamada<EstadoSessao>>;
  som(ligado: boolean): Promise<unknown>;
};

export function motorDaSessao(sessaoId: string): Motor {
  const api = `/api/sessoes/${sessaoId}`;
  return {
    submeter: (pedido) => chamar(`${api}/submissoes`, pedido),
    dica: (exercicioId, numero) => chamar(`${api}/dicas`, { exercicioId, numero }),
    concluir: () => chamar(`${api}/conclusao`, {}),
    estado: () => chamar(api),
    som: (ligado) => chamar(`/api/perfil/som`, { som: ligado }),
  };
}
