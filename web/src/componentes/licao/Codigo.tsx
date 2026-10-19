// Realce simples de Python para os trechos curtos das lições (strings, números e palavras reservadas).
import type { ReactNode } from "react";

const TOKEN = /("[^"\n]*"?|'[^'\n]*'?|\b\d+(?:\.\d+)?\b|\b(?:print|input|int|float|str|len|if|elif|else|and|or|not|True|False|None)\b)/g;

export function realcar(codigo: string): ReactNode[] {
  return codigo.split(TOKEN).map((parte, i) => {
    if (i % 2 === 0 || !parte) return parte;
    if (/^["']/.test(parte)) return <span key={i} className="t-str">{parte}</span>;
    if (/^\d/.test(parte)) return <span key={i} className="t-num">{parte}</span>;
    return <span key={i} className="t-kw">{parte}</span>;
  });
}

export function BlocoCodigo({ codigo }: { codigo: string }) {
  return <pre className="codigo">{realcar(codigo)}</pre>;
}

export function BlocoSaida({ texto, rotulo = "Saída esperada" }: { texto: string; rotulo?: string }) {
  return (
    <>
      <p className="rotulo-bloco">{rotulo}</p>
      <pre className="saida">{texto}</pre>
    </>
  );
}
