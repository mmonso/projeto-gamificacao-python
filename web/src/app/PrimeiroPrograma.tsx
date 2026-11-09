"use client";
// Primeiro programa na tela inicial (design/ANALISE_UX_GAMIFICACAO.md, 2A): a pessoa escreve o próprio nome
// dentro de um print e vê a saída na hora. O nome fica guardado para o cadastro, como na introdução.
import { useState } from "react";
import { CHAVE_INTRODUCAO, NOME_MAXIMO } from "@/modulos/conta/conta";

function guardarNome(nome: string) {
  try {
    const atual = JSON.parse(localStorage.getItem(CHAVE_INTRODUCAO) ?? "{}");
    localStorage.setItem(CHAVE_INTRODUCAO, JSON.stringify({ ...atual, nome: nome.trim() }));
  } catch {
    // Sem armazenamento no navegador: o nome só não fica guardado.
  }
}

export function PrimeiroPrograma() {
  const [nome, setNome] = useState("");
  const saida = nome.trim() ? `Olá, ${nome.trim()}!` : "Olá, ___!";
  return (
    <div className="terminal" aria-label="Seu primeiro programa em Python">
      <label className="terminal-linha">
        <span className="t-kw">print</span>(<span className="t-str">&quot;Olá, </span>
        <input
          className="terminal-nome"
          value={nome}
          maxLength={NOME_MAXIMO}
          placeholder="seu nome"
          aria-label="Escreva seu nome dentro do programa"
          autoComplete="given-name"
          onChange={(e) => {
            setNome(e.target.value);
            guardarNome(e.target.value);
          }}
        />
        <span className="t-str">!&quot;</span>)
      </label>
      <p className={`terminal-saida ${nome.trim() ? "rodou" : ""}`} aria-live="polite">
        <span aria-hidden="true">&gt;&gt;&gt; </span>
        {saida}
      </p>
    </div>
  );
}
