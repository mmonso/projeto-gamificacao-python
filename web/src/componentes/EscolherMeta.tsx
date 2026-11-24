"use client";
// Meta diária escolhida no fim da primeira lição, antes de criar a conta (design/MELHORIAS_UX.md, B1):
// é o momento do compromisso, logo depois do primeiro acerto. Fica no navegador até o cadastro levá-la à conta.
import { useEffect, useState } from "react";
import { CHAVE_INTRODUCAO } from "@/modulos/conta/conta";
import { NOMES_META, PARAMETROS } from "@/modulos/gamificacao/parametros";

function ler(): number {
  try {
    const v = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    return [1, 2, 3].includes(v.meta) ? v.meta : PARAMETROS.metaPadrao;
  } catch {
    return PARAMETROS.metaPadrao;
  }
}

function salvar(meta: number) {
  try {
    const atual = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    localStorage.setItem(CHAVE_INTRODUCAO, JSON.stringify({ ...atual, meta }));
  } catch {
    // Sem armazenamento: o cadastro usa a meta padrão.
  }
}

export function EscolherMeta() {
  const [meta, setMeta] = useState<number>(PARAMETROS.metaPadrao);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMeta(ler());
  }, []);
  return (
    <fieldset className="escolher-meta">
      <legend>Quanto você quer estudar por dia?</legend>
      <div className="escolher-meta-opcoes">
        {PARAMETROS.opcoesMeta.map((n) => (
          <button
            key={n}
            type="button"
            aria-pressed={meta === n}
            className="opcao opcao-meta"
            onClick={() => {
              setMeta(n);
              salvar(n);
            }}
          >
            <strong>{NOMES_META[n].nome}</strong>
            <span>
              {n} {n === 1 ? "lição" : "lições"} · {NOMES_META[n].tempo.replace("cerca de ", "")}
            </span>
          </button>
        ))}
      </div>
      <p className="ajuda">Dá para mudar depois, no Perfil.</p>
    </fieldset>
  );
}
