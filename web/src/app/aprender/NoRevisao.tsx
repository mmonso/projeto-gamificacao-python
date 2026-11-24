"use client";
// Nó de revisão da trilha: começa a revisão recomendada direto, sem passar pela aba Praticar
// (design/MELHORIAS_UX.md, C5).
import { useActionState } from "react";
import { comecarRevisao, type EstadoInicio } from "@/app/licao/acoes";
import { Icone } from "@/componentes/Icone";

export function NoRevisao() {
  const [estado, acao, pendente] = useActionState<EstadoInicio>(() => comecarRevisao(), {});
  return (
    <form action={acao}>
      <button type="submit" className="no revisao" aria-label="Começar a revisão dos conceitos vistos" aria-busy={pendente} disabled={pendente}>
        <Icone nome="revisao" />
      </button>
      {estado.erro && (
        <span className="no-erro" role="alert">
          {estado.erro}
        </span>
      )}
    </form>
  );
}
