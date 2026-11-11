// Nomes e descrições das conquistas (4.7), usados no perfil e na celebração. O catálogo está em conquistas.ts.
import { REGRAS_CONQUISTAS, type Conquista } from "./conquistas";

export const CONQUISTAS = Object.fromEntries(Object.entries(REGRAS_CONQUISTAS).map(([id, { nome, descricao }]) => [id, { nome, descricao }])) as Record<Conquista, { nome: string; descricao: string }>;
