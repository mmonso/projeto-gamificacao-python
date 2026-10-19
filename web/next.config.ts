import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Com o encaminhamento ligado, cada log do navegador gravado em .next/dev/logs fazia o
  // servidor recompilar e recarregar a página, em loop (Windows, Next 16.4).
  logging: { browserToTerminal: false },
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
