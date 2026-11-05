"use client";
// Oferta de transferência da demonstração (FL-02): aparece no primeiro acesso em que o navegador tem uma
// demonstração concluída. Demonstração iniciada e não concluída é apagada sem oferta (CA-21).
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apagarDemo, itensParaTransferir, lerDemo, type EstadoDemo } from "@/componentes/licao/demo";
import { chamar } from "@/componentes/licao/motor";
import { celebracoesDe, TelaCelebracao } from "@/componentes/licao/Resultado";
import { Mascote } from "@/componentes/Mascote";
import type { ResultadoTransferencia } from "@/servidor/demo/servico";

type Fase = { tipo: "nada" } | { tipo: "oferta"; demo: EstadoDemo; enviando: boolean; falha: string | null } | { tipo: "aviso"; texto: string } | { tipo: "celebrar"; fila: ReturnType<typeof celebracoesDe> };

const AVISOS: Record<Exclude<ResultadoTransferencia["resultado"], "registrada">, string> = {
  ja_concluida: "A lição 1 já está na sua conta. O resultado da demonstração não foi somado de novo.",
  invalida: "Não foi possível confirmar as respostas da demonstração. A lição 1 continua disponível para você.",
  ja_processada: "A demonstração já foi tratada nesta conta. A trilha mostra seu progresso salvo.",
  recusada: "Tudo bem. A lição 1 continua disponível.",
};

/** `licao1NaConta`: a conta já concluiu a lição da demonstração; não há o que transferir (CA-20). */
export function OfertaTransferencia({ licao1NaConta }: { licao1NaConta: boolean }) {
  const router = useRouter();
  const [fase, setFase] = useState<Fase>({ tipo: "nada" });

  useEffect(() => {
    const demo = lerDemo();
    if (!demo) return;
    if (!demo.concluida) return apagarDemo();
    if (licao1NaConta) {
      apagarDemo();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      return setFase({ tipo: "aviso", texto: AVISOS.ja_concluida });
    }
    setFase({ tipo: "oferta", demo, enviando: false, falha: null });
  }, [licao1NaConta]);

  async function salvar(demo: EstadoDemo) {
    setFase({ tipo: "oferta", demo, enviando: true, falha: null });
    const r = await chamar<ResultadoTransferencia>("/api/demo/transferencia", { versaoLicaoId: demo.versaoLicaoId, itens: itensParaTransferir(demo) });
    if (!r.ok) {
      // A oferta reaparece no próximo acesso; o servidor processa uma única vez (FL-02).
      return setFase({ tipo: "oferta", demo, enviando: false, falha: "Não foi possível salvar agora. Tente de novo em instantes." });
    }
    apagarDemo();
    if (r.dados.resultado === "registrada") {
      const fila = celebracoesDe(r.dados.conclusao);
      fila.unshift({ titulo: "Lição salva na sua conta!", texto: `Você recebeu ${r.dados.conclusao.xp} XP e liberou a lição 2.` });
      setFase({ tipo: "celebrar", fila });
    } else {
      setFase({ tipo: "aviso", texto: AVISOS[r.dados.resultado] });
    }
    router.refresh();
  }

  async function recusar() {
    apagarDemo();
    setFase({ tipo: "aviso", texto: AVISOS.recusada });
    await chamar("/api/demo/recusa", {});
  }

  if (fase.tipo === "nada") return null;
  if (fase.tipo === "aviso") {
    return (
      <div className="aviso-conta" role="status">
        <div>
          <p>{fase.texto}</p>
          <button type="button" className="botao botao-secundario botao-pequeno" onClick={() => setFase({ tipo: "nada" })}>
            Entendi
          </button>
        </div>
      </div>
    );
  }
  if (fase.tipo === "celebrar") {
    return <TelaCelebracao celebracao={fase.fila[0]} som={false} aoContinuar={() => setFase(fase.fila.length > 1 ? { tipo: "celebrar", fila: fase.fila.slice(1) } : { tipo: "nada" })} />;
  }
  return (
    <div className="fundo-modal">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="titulo-transferencia">
        <Mascote humor="comemoracao" tamanho="medio" />
        <h2 id="titulo-transferencia">Salvar sua primeira lição?</h2>
        <p>Você concluiu a lição 1 na demonstração. Podemos salvar o resultado na sua conta e liberar a lição 2.</p>
        {fase.falha && (
          <p className="mensagem-erro" role="alert">
            {fase.falha}
          </p>
        )}
        <button type="button" className="botao" autoFocus disabled={fase.enviando} onClick={() => void salvar(fase.demo)}>
          {fase.enviando ? "Salvando…" : "Salvar na minha conta"}
        </button>
        <button type="button" className="botao botao-fantasma" disabled={fase.enviando} onClick={() => void recusar()}>
          Não salvar
        </button>
      </div>
    </div>
  );
}
