"use client";
// Texto com palavras técnicas que se explicam ao toque (design/MELHORIAS_UX.md, D5): a palavra fica sublinhada
// com pontilhado e, tocada, abre a definição logo abaixo do parágrafo.
import { Fragment, useState } from "react";
import { marcarTermos, type Termo } from "@/modulos/aprendizagem/glossario";

export function TextoGlossario({ texto, limite = 2 }: { texto: string; limite?: number }) {
  const [aberto, setAberto] = useState<Termo | null>(null);
  const pedacos = marcarTermos(texto, limite);
  return (
    <>
      {pedacos.map((p, i) =>
        typeof p === "string" ? (
          <Fragment key={i}>{p}</Fragment>
        ) : (
          <button
            key={i}
            type="button"
            className="termo"
            aria-expanded={aberto?.id === p.termo.id}
            onClick={() => setAberto(aberto?.id === p.termo.id ? null : p.termo)}
          >
            {p.texto}
          </button>
        ),
      )}
      {aberto && (
        <span className="termo-definicao" role="note">
          <strong>{aberto.nome}:</strong> {aberto.definicao}
          {aberto.exemplo && <span className="termo-exemplo"> Exemplo: {aberto.exemplo}</span>}
        </span>
      )}
    </>
  );
}
