// Configuração por ambiente (E04.2). Lida e validada uma vez, no primeiro uso, a partir das variáveis
// descritas em web/.env.example. As mensagens de erro citam só os nomes das variáveis, nunca os valores.
// Sem "server-only": o proxy também a usa, e fora do servidor as variáveis secretas simplesmente não existem.
import { z } from "zod";

export type Ambiente = "desenvolvimento" | "homologacao" | "producao";

const endereco = z.string().refine((v) => URL.canParse(v) && /^https?:\/\//.test(v), "precisa ser um endereço completo, como https://…");

const esquema = z
  .object({
    NODE_ENV: z.string().optional(),
    /** Homologação precisa ser declarada: na Vercel, ela também roda com NODE_ENV=production. */
    SIBI_AMBIENTE: z.enum(["desenvolvimento", "homologacao", "producao"], "precisa ser desenvolvimento, homologacao ou producao").optional(),
    DATABASE_URL: z
      .string()
      .refine((v) => /^postgres(ql)?:\/\//.test(v), "precisa começar com postgresql://")
      .refine((v) => !/:6543(\/|\?|$)/.test(v), "usa a porta 6543 (pooler em modo transação), que perdia respostas de consultas paralelas; use o modo sessão, porta 5432"),
    NEXT_PUBLIC_SUPABASE_URL: endereco,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(20, "parece incompleta"),
    URL_DO_SITE: endereco.optional(),
  })
  .transform((e, ctx) => {
    const ambiente: Ambiente = e.SIBI_AMBIENTE ?? (e.NODE_ENV === "production" ? "producao" : "desenvolvimento");
    if (ambiente !== "desenvolvimento" && !e.URL_DO_SITE) {
      ctx.addIssue({ code: "custom", path: ["URL_DO_SITE"], message: `obrigatória em ${ambiente}: os links dos e-mails de conta não podem depender do endereço da requisição` });
    }
    if (ambiente === "producao" && e.URL_DO_SITE && !e.URL_DO_SITE.startsWith("https://")) {
      ctx.addIssue({ code: "custom", path: ["URL_DO_SITE"], message: "precisa usar https em produção" });
    }
    return {
      ambiente,
      bancoUrl: e.DATABASE_URL,
      supabaseUrl: e.NEXT_PUBLIC_SUPABASE_URL,
      supabaseChave: e.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
      urlDoSite: e.URL_DO_SITE?.replace(/\/$/, "") ?? null,
    };
  });

export type Configuracao = z.output<typeof esquema>;

/** Valida um conjunto de variáveis. Valores vazios contam como ausentes, como nas linhas em branco do .env. */
export function lerConfiguracao(env: Record<string, string | undefined>): Configuracao {
  const r = esquema.safeParse(Object.fromEntries(Object.entries(env).map(([k, v]) => [k, v?.trim() ? v : undefined])));
  if (r.success) return r.data;
  const problemas = r.error.issues.map((i) => `- ${String(i.path[0])}: ${i.code === "invalid_type" ? "não configurada" : i.message}`);
  throw new Error(`Configuração do Sibi incompleta (veja web/.env.example):\n${problemas.join("\n")}`);
}

let atual: Configuracao | undefined;

/** Configuração do processo, validada no primeiro uso para que o build não dependa dela. */
export function configuracao(): Configuracao {
  atual ??= lerConfiguracao(process.env);
  return atual;
}
