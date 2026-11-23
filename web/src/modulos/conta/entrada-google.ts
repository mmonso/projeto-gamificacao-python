// Entrada com Google (FL-02) pelo botão oficial do Google na própria página (Google Identity Services). O Google
// entrega ao navegador um token de identidade; o servidor o passa ao Supabase (signInWithIdToken), que o confere.
// Assim a janela do Google mostra o endereço do Sibi, e não o do Supabase.
import { z } from "zod";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { fusoValido } from "@/modulos/gamificacao/dias";

/** ID público do cliente OAuth "Sibi web" (Google Cloud, projeto sibi-515617). Não é segredo. */
export const GOOGLE_CLIENT_ID = "279650063060-23h4m581ntc9huug6f2jprtcge5b8b9a.apps.googleusercontent.com";

/** Dados do Sibi que o Google não envia e que entram no perfil de uma conta nova. */
export type EntradaGoogle = { meta_diaria: number; fuso: string; termos_aceitos_em: string };

const esquemaPedido = z.object({
  credencial: z.string().min(20).max(8192),
  nonce: z.string().min(16).max(128),
  metaDiaria: z.coerce.number().int().min(1).max(3).catch(PARAMETROS.metaPadrao),
  fuso: z.string().refine(fusoValido).catch(PARAMETROS.fusoPadrao),
});

export type PedidoGoogle = z.infer<typeof esquemaPedido>;

/** Pedido vindo do botão: token e nonce obrigatórios; meta e fuso inválidos voltam ao padrão. */
export function lerPedidoGoogle(entrada: Record<string, unknown>): PedidoGoogle | null {
  const r = esquemaPedido.safeParse(entrada);
  return r.success ? r.data : null;
}
