// Autorização da manutenção diária (/api/manutencao), chamada pelo Cron da Vercel.
import { timingSafeEqual } from "node:crypto";

/** O Cron da Vercel envia "Authorization: Bearer <CRON_SECRET>". Sem segredo, ou com segredo curto, nada passa. */
export function manutencaoAutorizada(cabecalho: string | null, segredo: string | undefined) {
  if (!segredo || segredo.length < 16 || !cabecalho) return false;
  const esperado = Buffer.from(`Bearer ${segredo}`);
  const recebido = Buffer.from(cabecalho);
  return recebido.length === esperado.length && timingSafeEqual(recebido, esperado);
}
