import type { Metadata } from "next";
import { Voltar } from "@/componentes/formulario";
import { Experimente } from "@/componentes/python/Experimente";

export const metadata: Metadata = { title: "Laboratório de Python" };

const EXEMPLO = `nome = "Ana"
idade = 30
print("Olá,", nome)
print("Daqui a 5 anos você terá", idade + 5, "anos")`;

// Laboratório (design/MELHORIAS_UX.md, E): Python livre, rodando no próprio aparelho, para testar o que quiser.
export default function PaginaLaboratorio() {
  return (
    <main className="tela-centro laboratorio" id="conteudo-principal">
      <Voltar href="/praticar" />
      <h1>Laboratório de Python</h1>
      <p className="subtitulo">Escreva qualquer programa e aperte Rodar. O Python roda aqui no seu aparelho, numa caixa fechada: nada do que você escreve é enviado.</p>
      <Experimente codigoInicial={EXEMPLO} aberto />
      <div className="dicas-laboratorio">
        <p className="rotulo-bloco">Ideias para testar</p>
        <ul>
          <li>Troque o nome e a idade e rode de novo.</li>
          <li>
            Use <code>input(&quot;Qual é o seu nome? &quot;)</code> para o programa perguntar algo.
          </li>
          <li>Apague um parêntese de propósito e veja como o Python avisa o erro.</li>
        </ul>
      </div>
    </main>
  );
}
