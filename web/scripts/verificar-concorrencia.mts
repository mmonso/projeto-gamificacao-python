// Verificação de concorrência no PostgreSQL configurado em DATABASE_URL (E08.1).
// Os testes de integração usam PGlite, que executa uma transação por vez; aqui pedidos simultâneos
// disputam as mesmas linhas, como duas abas, cliques repetidos ou reenvios depois de falha de rede.
// Cria dois perfis temporários, sem conta de autenticação, e apaga tudo o que eles geraram no fim.
// Uso: npm run db:concorrencia
import { randomUUID } from "node:crypto";
import { join } from "node:path";
import { isDeepStrictEqual } from "node:util";
import { and, count, eq, sum } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import type { Resposta } from "../src/modulos/aprendizagem/corretor";
import type { Exercicio } from "../src/modulos/conteudo/esquema";
import { carregarCurso } from "../src/servidor/conteudo/carregar";
import * as t from "../src/servidor/db/esquema";
import { licaoDemo, transferirDemo } from "../src/servidor/demo/servico";
import { concluir, ErroEstudo, submeter } from "../src/servidor/licoes/estudo";
import { iniciarRevisao } from "../src/servidor/licoes/revisao";
import { iniciarRecuperacao, iniciarSessao, obterSessaoAtual } from "../src/servidor/licoes/servico";
import { dentroDoLimite, limparJanelasAntigas } from "../src/servidor/limites";
import { excluirDadosDoAluno } from "../src/servidor/perfis/preferencias";
import { respostaCorreta } from "../src/testes/respostas";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL não configurada em .env.local");

const PARALELOS = 6;
const conexao = postgres(url, { prepare: false, max: PARALELOS });
const db = drizzle({ client: conexao, schema: t });

const curso = carregarCurso(join(import.meta.dirname, "../../conteudo"));
const exercicios = new Map<string, Exercicio>(curso.flatMap((u) => u.licoes.flatMap((l) => [...l.exercicios, ...l.revisao])).map((e) => [e.id, e]));
const correta = (id: string) => respostaCorreta(exercicios.get(id)!);
function errada(id: string): Resposta {
  const ex = exercicios.get(id)!;
  return ex.tipo === "localizar_erro" ? { tipo: ex.tipo, linha: ex.resposta === 1 ? 2 : 1 } : { tipo: "localizar_erro", linha: 99 };
}

/** Todos iguais ao primeiro, sem depender da ordem das chaves (o resultado guardado em jsonb volta reordenado). */
const iguais = (lista: unknown[]) => lista.every((x) => isDeepStrictEqual(x, lista[0]));
const vezes = <T,>(f: () => Promise<T>) => Promise.all(Array.from({ length: PARALELOS }, f));
const desfecho = (p: Promise<unknown>) => p.then(() => "aceita", (e) => (e instanceof ErroEstudo ? e.codigo : `erro: ${e}`));
const falhas: string[] = [];
function conferir(certo: boolean, texto: string, detalhe?: unknown) {
  console.log(`${certo ? "ok   " : "FALHA"} ${texto}${certo || detalhe === undefined ? "" : ` → ${JSON.stringify(detalhe)}`}`);
  if (!certo) falhas.push(texto);
}

async function resolver(alunoId: string, sessaoId: string) {
  for (let s = await obterSessaoAtual(db, alunoId, sessaoId); s?.exercicio; s = await obterSessaoAtual(db, alunoId, sessaoId)) {
    await submeter(db, alunoId, sessaoId, { id: randomUUID(), exercicioId: s.exercicio.id, resposta: correta(s.exercicio.id) });
  }
}

const xpTotal = async (alunoId: string) =>
  Number((await db.select({ xp: sum(t.lancamentos.valor) }).from(t.lancamentos).where(and(eq(t.lancamentos.alunoId, alunoId), eq(t.lancamentos.moeda, "xp"))))[0].xp ?? 0);
const coracoes = async (alunoId: string) => (await db.select({ c: t.perfis.coracoes }).from(t.perfis).where(eq(t.perfis.id, alunoId)))[0].c;
const abertas = async (alunoId: string, tipo: "principal" | "pratica" | "revisao" | "recuperacao") =>
  (await db.select({ n: count() }).from(t.sessoes).where(and(eq(t.sessoes.alunoId, alunoId), eq(t.sessoes.tipo, tipo), eq(t.sessoes.estado, "aberta"))))[0].n;

const ana = randomUUID();
const bia = randomUUID();
await db.insert(t.perfis).values([
  { id: ana, nome: "Concorrência A" },
  { id: bia, nome: "Concorrência B" },
]);

try {
  console.log(`${PARALELOS} pedidos simultâneos em cada etapa\n`);

  const inicios = await vezes(() => iniciarSessao(db, ana, "u1-l1"));
  const sessaoId = inicios[0].ok ? inicios[0].sessaoId : "";
  conferir(inicios.every((r) => r.ok && r.sessaoId === sessaoId), "inícios simultâneos da lição 1 dão a mesma sessão", inicios);

  const primeiro = (await obterSessaoAtual(db, ana, sessaoId))!.exercicio!.id;
  const mesmoId = randomUUID();
  const reenvios = await vezes(() => submeter(db, ana, sessaoId, { id: mesmoId, exercicioId: primeiro, resposta: errada(primeiro) }));
  conferir(iguais(reenvios), "reenvios simultâneos com o mesmo id devolvem o mesmo resultado");
  conferir((await coracoes(ana)) === 4, "e custam um único coração", await coracoes(ana));

  const atual = (await obterSessaoAtual(db, ana, sessaoId))!.exercicio!.id;
  const abas = await vezes(() => desfecho(submeter(db, ana, sessaoId, { id: randomUUID(), exercicioId: atual, resposta: errada(atual) })));
  conferir(abas.filter((d) => d === "aceita").length === 1 && abas.every((d) => d === "aceita" || d === "desatualizada"), "respostas de várias abas ao mesmo item: uma vale, as outras pedem recarga", abas);
  conferir((await coracoes(ana)) === 3, "e só ela custa coração", await coracoes(ana));

  await resolver(ana, sessaoId);
  const conclusoes = await vezes(() => concluir(db, ana, sessaoId));
  conferir(iguais(conclusoes) && conclusoes[0].xp === 20, "conclusões simultâneas devolvem o mesmo resultado, com 20 XP", conclusoes);
  conferir((await xpTotal(ana)) === 20, "e lançam o XP uma única vez", await xpTotal(ana));
  const [atividade] = await db.select().from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, ana));
  conferir(atividade?.sessoes === 1, "e contam uma única sessão no dia", atividade);

  const praticas = await vezes(() => iniciarSessao(db, ana, "u1-l1"));
  conferir((await abertas(ana, "pratica")) === 1, "inícios simultâneos de prática deixam uma única prática aberta", { abertas: await abertas(ana, "pratica"), praticas });

  const revisoes = await vezes(() => iniciarRevisao(db, ana));
  conferir(revisoes.every((r) => r.ok && r.ok === revisoes[0].ok && r.sessaoId === (revisoes[0].ok ? revisoes[0].sessaoId : "")), "inícios simultâneos de revisão dão a mesma sessão", revisoes);
  conferir((await abertas(ana, "revisao")) === 1, "e deixam uma única revisão aberta", await abertas(ana, "revisao"));

  // Prática e revisão concluídas juntas disputam a atividade do dia, a meta e a sequência do mesmo perfil.
  const pratica = praticas[0].ok ? praticas[0].sessaoId : "";
  const revisao = revisoes[0].ok ? revisoes[0].sessaoId : "";
  await Promise.all([resolver(ana, pratica), resolver(ana, revisao)]);
  const [rp, rr] = await Promise.all([concluir(db, ana, pratica), concluir(db, ana, revisao)]);
  const [dia] = await db.select().from(t.atividadeDiaria).where(eq(t.atividadeDiaria.alunoId, ana));
  conferir(dia?.sessoes === 3 && rp.xp + rr.xp === 20, "prática e revisão concluídas juntas somam duas sessões no dia e 10 XP cada", { dia, xp: [rp.xp, rr.xp] });
  conferir((await xpTotal(ana)) === 40, "e o saldo de XP fica coerente com os lançamentos", await xpTotal(ana));

  const recuperacoes = await vezes(() => iniciarRecuperacao(db, ana));
  conferir(recuperacoes.every((r) => r.ok), "inícios simultâneos de recuperação são aceitos", recuperacoes);
  conferir((await abertas(ana, "recuperacao")) === 1, "e deixam uma única recuperação aberta", await abertas(ana, "recuperacao"));

  const demo = (await licaoDemo(db))!;
  const pedido = {
    versaoLicaoId: demo.versaoLicaoId,
    itens: demo.exercicios.map((e) => ({ exercicioId: e.id, resposta: correta(e.id), errouPrimeira: false, dicas: 0 })),
  };
  const transferencias = await vezes(() => transferirDemo(db, bia, pedido));
  const registradas = transferencias.filter((r) => r.resultado === "registrada").length;
  conferir(registradas === 1, "transferências simultâneas da demonstração registram uma única vez", transferencias.map((r) => r.resultado));
  conferir((await xpTotal(bia)) === 20, "e lançam 20 XP uma única vez", await xpTotal(bia));

  // Contador de pedidos: contagens simultâneas não se perdem, e a limpeza de janelas antigas roda no PostgreSQL.
  const chave = `verificacao:${ana}`;
  const contagens = await vezes(() => dentroDoLimite(db, chave, PARALELOS - 1));
  conferir(contagens.filter((x) => !x).length === 1, `${PARALELOS} pedidos simultâneos com limite ${PARALELOS - 1}: exatamente um é recusado`, contagens);
  const limpeza = await limparJanelasAntigas(db, new Date(Date.now() + 2 * 3_600_000)).then(() => "ok", (e) => String(e));
  conferir(limpeza === "ok", "a limpeza das janelas antigas roda sem erro", limpeza);
  const [{ restantes }] = await db.select({ restantes: count() }).from(t.limitesFrequencia).where(eq(t.limitesFrequencia.chave, chave));
  conferir(restantes === 0, "e apaga as janelas vencidas", restantes);
} finally {
  await db.transaction(async (tx) => {
    await excluirDadosDoAluno(tx, ana);
    await excluirDadosDoAluno(tx, bia);
  });
  const [{ sobras }] = await db.select({ sobras: count() }).from(t.sessoes).where(eq(t.sessoes.alunoId, ana));
  console.log(`\nPerfis temporários apagados (sessões restantes: ${sobras}).`);
  await conexao.end();
}

if (falhas.length) {
  console.log(`\n${falhas.length} verificação(ões) falharam.`);
  process.exit(1);
}
console.log("\nTodas as verificações passaram.");
