import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  // Testes com PGlite ficam lentos em disco lento; 5 s padrão gerava falhas intermitentes.
  test: { environment: "node", include: ["src/**/*.test.ts"], testTimeout: 20_000 },
});
