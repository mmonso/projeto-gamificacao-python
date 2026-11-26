"use client";
// Índice do caderno com busca: filtra por nome e descrição, sem diferenciar acentos nem maiúsculas.
import Link from "next/link";
import { useState } from "react";
import { Icone } from "@/componentes/Icone";
import type { UnidadeCaderno } from "@/servidor/conceitos/caderno";

const simplificar = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export function ListaCaderno({ unidades }: { unidades: UnidadeCaderno[] }) {
  const [busca, setBusca] = useState("");
  const termo = simplificar(busca.trim());
  const filtradas = unidades
    .map((u) => ({ ...u, conceitos: u.conceitos.filter((c) => !termo || simplificar(`${c.nome} ${c.descricao}`).includes(termo)) }))
    .filter((u) => u.conceitos.length > 0);

  return (
    <div className="pilha">
      <label className="busca-caderno">
        <Icone nome="busca" />
        <span className="so-leitor">Buscar conceito</span>
        <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar: print, lista, if…" autoCapitalize="off" autoCorrect="off" spellCheck={false} />
      </label>
      {filtradas.length === 0 && <p className="ajuda">Nenhum conceito com “{busca.trim()}”.</p>}
      {filtradas.map((u) => (
        <section key={u.id} id={u.id} className={`cartao caderno-unidade u${((u.ordem - 1) % 4) + 1}`} aria-labelledby={`caderno-${u.id}`}>
          <h2 id={`caderno-${u.id}`}>
            <span className="caderno-selo">{u.ordem}</span> {u.titulo}
          </h2>
          <ul className="caderno-lista">
            {u.conceitos.map((c) =>
              c.visto ? (
                <li key={c.id}>
                  <Link href={`/caderno/${c.id}`} className="caderno-item">
                    <span>
                      <strong>{c.nome}</strong>
                      <span className="caderno-descricao">{c.descricao}</span>
                    </span>
                    <Icone nome="seta" pequeno />
                  </Link>
                </li>
              ) : (
                <li key={c.id} className="caderno-item bloqueado">
                  <span>
                    <strong>{c.nome}</strong>
                    <span className="caderno-descricao">{c.licaoTitulo ? `Aparece na lição “${c.licaoTitulo}”.` : "Ainda não visto."}</span>
                  </span>
                  <Icone nome="cadeado" pequeno />
                </li>
              ),
            )}
          </ul>
        </section>
      ))}
    </div>
  );
}
