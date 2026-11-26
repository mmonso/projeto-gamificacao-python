// Tamanho do texto (design/MELHORIAS_UX.md, D2): Normal, Grande ou Maior, escolhido no Perfil e guardado neste
// aparelho. Muda o tamanho da raiz (html), e tudo o que é medido em rem acompanha, inclusive o código.

export const CHAVE_TEXTO = "sibi-texto";
export const TAMANHOS_TEXTO = ["normal", "grande", "maior"] as const;
export type TamanhoTexto = (typeof TAMANHOS_TEXTO)[number];
export const ROTULO_TEXTO: Record<TamanhoTexto, string> = { normal: "Normal", grande: "Grande", maior: "Maior" };

/** Roda no <head>, antes de pintar, como o do tema: só os tamanhos maiores precisam de marcação. */
export const SCRIPT_TEXTO = `try{var t=localStorage.getItem("${CHAVE_TEXTO}");if(t==="grande"||t==="maior")document.documentElement.dataset.texto=t}catch(e){}`;
