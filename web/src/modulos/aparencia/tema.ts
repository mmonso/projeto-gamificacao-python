// Tema do app: escuro por padrão, claro como opção no Perfil (componentes/Tema.tsx). Fica fora do componente
// de cliente porque o layout, que é de servidor, precisa do texto do script.

export const CHAVE_TEMA = "sibi-tema";
/** Cor da barra do navegador e do sistema em cada tema. */
export const COR_DA_BARRA = { escuro: "#131f24", claro: "#ffffff" } as const;

/** Roda no <head>, antes de pintar: só o tema claro precisa de marcação, o escuro é o padrão do CSS. */
export const SCRIPT_TEMA = `try{if(localStorage.getItem("${CHAVE_TEMA}")==="claro"){document.documentElement.dataset.tema="claro";var m=document.querySelector('meta[name="theme-color"]');if(m)m.content="${COR_DA_BARRA.claro}"}}catch(e){}`;
