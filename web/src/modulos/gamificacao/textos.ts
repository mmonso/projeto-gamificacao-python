// Nomes e descrições das conquistas (4.7), usados no perfil e na celebração.
import type { Conquista } from "./regras";

export const CONQUISTAS: Record<Conquista, { nome: string; descricao: string }> = {
  "primeira-licao": { nome: "Primeira lição", descricao: "Concluiu a primeira lição" },
  "primeira-unidade": { nome: "Primeira unidade", descricao: "Concluiu as cinco lições de uma unidade" },
  "sete-dias": { nome: "Sete dias", descricao: "Estudou sete dias seguidos" },
};
