import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Com o encaminhamento ligado, cada log do navegador gravado em .next/dev/logs fazia o
  // servidor recompilar e recarregar a página, em loop (Windows, Next 16.4).
  logging: { browserToTerminal: false },
  // O service worker precisa ser buscado de novo a cada visita, para que uma versão nova chegue logo.
  async headers() {
    return [
      { source: "/sw.js", headers: [{ key: "Cache-Control", value: "no-cache, no-store, must-revalidate" }] },
      // A caixa do Python roda com origem opaca (iframe em sandbox): ela só lê estes arquivos com CORS liberado.
      // O Pyodide fica numa pasta com a versão no nome, então pode ficar guardado no aparelho por um ano.
      {
        source: "/pyodide/:caminho*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      { source: "/python/:arquivo*", headers: [{ key: "Access-Control-Allow-Origin", value: "*" }] },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
