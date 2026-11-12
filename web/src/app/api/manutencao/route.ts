// Manutenção diária, chamada pelo Cron da Vercel (vercel.json). Apaga visitantes vencidos e janelas antigas do
// limite de frequência. Como toca o banco todo dia, também impede que o projeto gratuito do Supabase pause por
// falta de uso. Só responde a quem traz o segredo CRON_SECRET; sem o segredo configurado, recusa tudo.
import { SEM_CACHE, falhaInesperada } from "@/servidor/api";
import { banco } from "@/servidor/db/cliente";
import { limparJanelasAntigas } from "@/servidor/limites";
import { manutencaoAutorizada } from "@/servidor/manutencao";
import { limparVisitantes } from "@/servidor/perfis/visitantes";

export async function GET(request: Request) {
  if (!manutencaoAutorizada(request.headers.get("authorization"), process.env.CRON_SECRET)) {
    return Response.json({ erro: "nao_autorizado" }, { status: 401, headers: SEM_CACHE });
  }
  try {
    const db = banco();
    const resultado = await limparVisitantes(db);
    await limparJanelasAntigas(db);
    return Response.json({ ok: true, ...resultado }, { headers: SEM_CACHE });
  } catch (e) {
    return falhaInesperada("/api/manutencao", e);
  }
}
