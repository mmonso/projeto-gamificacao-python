// Página da caixa do Python (design/MELHORIAS_UX.md, E). Carregada num iframe com sandbox="allow-scripts", sem
// allow-same-origin: a origem fica opaca, então o código do aluno não alcança cookies, armazenamento nem a API do
// Sibi. A CSP só deixa carregar os scripts da caixa e do Pyodide e buscar os arquivos do Pyodide.

export function GET(request: Request) {
  const origem = new URL(request.url).origin;
  const csp = [
    "default-src 'none'",
    `script-src ${origem}/python/ ${origem}/pyodide/ blob: 'wasm-unsafe-eval'`,
    "worker-src blob:",
    `connect-src ${origem}/python/ ${origem}/pyodide/`,
    "base-uri 'none'",
    "form-action 'none'",
    "frame-ancestors 'self'",
  ].join("; ");
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Python do Sibi</title></head><body><script src="${origem}/python/caixa.js"></script></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Security-Policy": csp,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "no-referrer",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
