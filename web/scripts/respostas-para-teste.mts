// Respostas certas de todos os exercícios, em termos visíveis na tela (texto do bloco, valor da lacuna,
// número da linha), para a verificação no navegador (ferramentas/verificar_navegador.mjs).
// Os textos dos blocos valem para qualquer versão publicada, ao contrário dos identificadores.
// Uso: npx tsx scripts/respostas-para-teste.mts > respostas.json
import { join } from "node:path";
import { carregarCurso } from "../src/servidor/conteudo/carregar";

const curso = carregarCurso(join(import.meta.dirname, "../../conteudo"));
const mapa: Record<string, unknown> = {};
for (const ex of curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao]))) {
  // `saida`: o texto da opção certa, para quando a revisão ou a prática mostra o item para digitar.
  if (ex.tipo === "escolher_resultado") mapa[ex.id] = { tipo: ex.tipo, opcao: ex.resposta, saida: ex.opcoes.find((o) => o.id === ex.resposta)?.texto };
  else if (ex.tipo === "completar_lacuna") mapa[ex.id] = { tipo: ex.tipo, lacunas: Object.fromEntries(ex.lacunas.map((l) => [l.id, l.resposta])) };
  else if (ex.tipo === "ordenar_blocos") mapa[ex.id] = { tipo: ex.tipo, codigos: ex.resposta[0].map((id) => ex.blocos.find((b) => b.id === id)!.codigo) };
  else mapa[ex.id] = { tipo: ex.tipo, linha: ex.resposta };
}
process.stdout.write(JSON.stringify(mapa));
