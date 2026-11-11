// Ícones da interface (design/DESIGN.md, E03.2). Mesmos desenhos do protótipo; sempre decorativos.
const ICONES = {
  coracao: <path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="currentColor" />,
  chama: (
    <>
      <path d="M12 2c1 3.2 4.6 5.4 4.6 10a4.6 4.6 0 0 1-9.2 0c0-2.1 1-3.5 2.1-4.6.2 1.7 1 2.8 2.2 3.3C11 8.5 10.9 5 12 2z" fill="currentColor" />
      <path d="M12 22a7 7 0 0 1-7-7c0-3.2 2-5.4 3.4-6.9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  raio: <path d="M13.5 2 4 13.5h7L9.5 22 20 9.5h-7L13.5 2z" fill="currentColor" />,
  check: <path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />,
  x: <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />,
  cadeado: (
    <>
      <rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor" />
      <path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
    </>
  ),
  estrela: <path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8z" fill="currentColor" />,
  trofeu: (
    <>
      <path d="M7 3h10v5a5 5 0 0 1-10 0V3z" fill="currentColor" />
      <path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10M17 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M10 13h4v3h2v4H8v-4h2v-3z" fill="currentColor" />
    </>
  ),
  coroa: <path d="M3 8l4.5 3.5L12 5l4.5 6.5L21 8l-2 11H5L3 8z" fill="currentColor" />,
  bandeira: (
    <>
      <path d="M6 21V4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 4h11l-2.5 4L17 12H6V4z" fill="currentColor" />
    </>
  ),
  pessoa: (
    <>
      <circle cx="12" cy="8" r="4" fill="currentColor" />
      <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7H4z" fill="currentColor" />
    </>
  ),
  casa: <path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9z" fill="currentColor" />,
  halter: <path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />,
  revisao: <path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />,
  lampada: <path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />,
  livro: <path d="M12 6.5C10.2 5 7.6 4.5 4 4.5v13c3.6 0 6.2.5 8 2m0-13c1.8-1.5 4.4-2 8-2v13c-3.6 0-6.2.5-8 2m0-13v13" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />,
  som: (
    <>
      <path d="M4 9h4l5-4v14l-5-4H4V9z" fill="currentColor" />
      <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  semSom: (
    <>
      <path d="M4 9h4l5-4v14l-5-4H4V9z" fill="currentColor" />
      <path d="m16 9 5 6M21 9l-5 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </>
  ),
  semRede: (
    <>
      <path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </>
  ),
} as const;

export type NomeIcone = keyof typeof ICONES;

export function Icone({ nome, pequeno }: { nome: NomeIcone; pequeno?: boolean }) {
  return (
    <svg className={pequeno ? "icone icone-pequeno" : "icone"} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {ICONES[nome]}
    </svg>
  );
}
