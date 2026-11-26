import type { Metadata } from "next";
import { Voltar } from "@/componentes/formulario";
import { TERMOS } from "@/modulos/aprendizagem/glossario";

export const metadata: Metadata = { title: "Palavras do Python" };

// "Palavras do Python" (design/MELHORIAS_UX.md, D5): as palavras técnicas que aparecem nas lições, em ordem de
// aparição no curso, com uma frase cada. As mesmas se explicam ao toque no cartão e no feedback.
export default function PaginaGlossario() {
  return (
    <main className="tela-centro glossario" id="conteudo-principal">
      <Voltar href="/caderno" />
      <h1>Palavras do Python</h1>
      <p className="subtitulo">As palavras técnicas que aparecem nas lições, explicadas em uma frase. Nas lições, toque numa palavra sublinhada para ver a explicação.</p>
      <dl className="lista-glossario">
        {TERMOS.map((t) => (
          <div key={t.id} id={t.id}>
            <dt>{t.nome}</dt>
            <dd>
              {t.definicao}
              {t.exemplo && (
                <span className="termo-exemplo">
                  {" "}
                  Exemplo: <code>{t.exemplo}</code>
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
