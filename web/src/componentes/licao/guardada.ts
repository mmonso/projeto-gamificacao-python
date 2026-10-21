// Resposta guardada no navegador durante a lição (FL-04, passos 1 a 3; CA-50, CA-52, CA-53).
// O servidor continua sendo a referência: o que fica aqui só devolve a resposta à tela ou é reenviado.
import { respostaEsquema, type Resposta } from "@/modulos/aprendizagem/corretor";
import type { ExercicioPublico } from "@/modulos/conteudo/esquema";

/**
 * Rascunho do exercício mostrado e, depois de Verificar, o id do envio. O id fica guardado até o aluno
 * tocar Continuar: numa recarga, o reenvio com ele devolve o resultado gravado ou corrige pela primeira vez.
 */
export type Guardada = { exercicio: ExercicioPublico; resposta: Resposta; envioId: string | null };
export type Envio = Guardada & { envioId: string };

export type Retomada = { acao: "reenviar"; envio: Envio } | { acao: "rascunho"; resposta: Resposta } | { acao: "nenhuma" };

/** Lê o valor guardado. Um valor malformado ou de outra versão da interface é ignorado. */
export function interpretar(texto: string | null): Guardada | null {
  try {
    const v = JSON.parse(texto ?? "null");
    const resposta = respostaEsquema.safeParse(v?.resposta);
    if (!resposta.success || typeof v.exercicio?.id !== "string" || v.exercicio.tipo !== resposta.data.tipo) return null;
    if (v.envioId !== null && typeof v.envioId !== "string") return null;
    return { exercicio: v.exercicio, resposta: resposta.data, envioId: v.envioId };
  } catch {
    return null;
  }
}

/**
 * O que fazer com o valor guardado ao abrir a sessão, cujo exercício atual no servidor é `atual`.
 * Um envio é sempre reenviado: se o servidor já o gravou, o feedback volta à tela (CA-52); se a sessão
 * mudou em outro lugar, o servidor pede recarga. Um rascunho só volta se for do exercício atual (CA-53).
 */
export function retomar(guardada: Guardada | null, atual: ExercicioPublico | null): Retomada {
  if (!guardada) return { acao: "nenhuma" };
  if (guardada.envioId) return { acao: "reenviar", envio: { ...guardada, envioId: guardada.envioId } };
  if (atual?.id === guardada.exercicio.id) return { acao: "rascunho", resposta: guardada.resposta };
  return { acao: "nenhuma" };
}

export function lerGuardada(chave: string): Guardada | null {
  try {
    return interpretar(localStorage.getItem(chave));
  } catch {
    return null;
  }
}

export function guardar(chave: string, valor: Guardada | null) {
  try {
    if (valor) localStorage.setItem(chave, JSON.stringify(valor));
    else localStorage.removeItem(chave);
  } catch {
    // Armazenamento indisponível: rascunho e reenvio só valem até a página ser recarregada.
  }
}
