// Entrada com Google (FL-02): o Google não envia meta diária, fuso nem o aceite dos documentos. O site guarda
// esses dados num cookie curto antes de ir ao Google e os grava no perfil quando o aluno volta.
import { z } from "zod";
import { PARAMETROS } from "@/modulos/gamificacao/parametros";
import { fusoValido } from "@/modulos/gamificacao/dias";

export const COOKIE_ENTRADA_GOOGLE = "sibi-entrada-google";

/** Tempo para escolher a conta no Google e voltar. */
export const VALIDADE_ENTRADA_GOOGLE_S = 10 * 60;

export type EntradaGoogle = { meta_diaria: number; fuso: string; termos_aceitos_em: string };

const esquema = z.object({
  meta_diaria: z.coerce.number().int().min(1).max(3).catch(PARAMETROS.metaPadrao),
  fuso: z.string().refine(fusoValido).catch(PARAMETROS.fusoPadrao),
  termos_aceitos_em: z.iso.datetime({ offset: true }),
});

/** Conteúdo do cookie, ou null se faltar, estiver corrompido ou sem a data do aceite. */
export function lerEntradaGoogle(valor: string | undefined): EntradaGoogle | null {
  if (!valor) return null;
  try {
    const r = esquema.safeParse(JSON.parse(valor));
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}
