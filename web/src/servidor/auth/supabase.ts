// Cliente do Supabase Auth no servidor, com a sessão em cookies (ESPECIFICACAO_MVP, 6.1).
// Usado só para autenticação: dados do aluno são lidos pela conexão PostgreSQL do servidor.
import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export function configuracaoSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const chave = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) throw new Error("NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY precisam estar configuradas (veja web/.env.example)");
  return { url, chave };
}

export async function criarClienteSupabase() {
  const { url, chave } = configuracaoSupabase();
  const armazenamento = await cookies();
  return createServerClient(url, chave, {
    cookies: {
      getAll: () => armazenamento.getAll(),
      setAll(cookiesParaGravar) {
        try {
          for (const { name, value, options } of cookiesParaGravar) armazenamento.set(name, value, options);
        } catch {
          // Componentes de servidor não gravam cookies; o proxy renova a sessão a cada requisição.
        }
      },
    },
  });
}

/** Endereço público do site, usado nos links dos e-mails de conta. Precisa estar na lista de redirecionamento do Supabase. */
export async function origemDoSite(): Promise<string> {
  if (process.env.URL_DO_SITE) return process.env.URL_DO_SITE.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const protocolo = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocolo}://${host}`;
}
