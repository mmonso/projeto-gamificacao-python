// Motor da lição: de onde a tela tira correção, dicas e conclusão. Na conta, é a API da sessão;
// na demonstração, um motor local que só pede a correção ao servidor (componentes/licao/demo.ts).
import type { ErroApi, PedidoSubmissao, ResultadoConclusao, ResultadoSubmissao } from "@/modulos/aprendizagem/contrato";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";

export type Chamada<T> = { ok: true; dados: T } | { ok: false; erro: ErroApi | null };

/** Chamada à API em JSON. Falha de rede devolve erro null, que a tela trata como falta de conexão. */
export async function chamar<T>(url: string, corpo?: unknown): Promise<Chamada<T>> {
  try {
    const r = await fetch(url, corpo === undefined ? { cache: "no-store" } : { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(corpo) });
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
