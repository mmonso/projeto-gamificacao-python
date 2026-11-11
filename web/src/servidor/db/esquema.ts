// Esquema do banco (PLANO, seção 7; ESPECIFICACAO_MVP, seção 4). Única cadeia de migrações: Drizzle.
// As tabelas não são expostas pela API de dados do Supabase; o acesso é só pelo servidor (ESPECIFICACAO, 6.1).
import { sql } from "drizzle-orm";
import type { z } from "zod";
import type { cartaoEsquema } from "@/modulos/conteudo/esquema";
import type { Conquista } from "@/modulos/gamificacao/conquistas";
import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  smallint,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

const criadoEm = () => timestamp("criado_em", { withTimezone: true }).notNull().defaultNow();

/* Identidade */

export const perfis = pgTable(
  "perfis",
  {
    // Mesmo identificador do usuário no Supabase Auth.
    id: uuid("id").primaryKey(),
    nome: text("nome").notNull().default(""),
    metaDiaria: smallint("meta_diaria").notNull().default(1),
    fuso: text("fuso").notNull().default("America/Sao_Paulo"),
    fusoPendente: text("fuso_pendente"),
    pendenteAPartirDe: date("pendente_a_partir_de"),
    som: boolean("som").notNull().default(true),
    coracoes: smallint("coracoes").notNull().default(5),
    xpTotal: integer("xp_total").notNull().default(0),
    sequenciaAtual: integer("sequencia_atual").notNull().default(0),
    maiorSequencia: integer("maior_sequencia").notNull().default(0),
    ultimoDiaEstudo: date("ultimo_dia_estudo"),
    termosAceitosEm: timestamp("termos_aceitos_em", { withTimezone: true }),
    criadoEm: criadoEm(),
  },
  (t) => [
    check("perfis_coracoes_faixa", sql`${t.coracoes} between 0 and 5`),
    check("perfis_meta_faixa", sql`${t.metaDiaria} between 1 and 3`),
  ],
);

/* Conteúdo publicado */

export const unidades = pgTable("unidades", {
  id: text("id").primaryKey(),
  ordem: smallint("ordem").notNull().unique(),
  titulo: text("titulo").notNull(),
  descricao: text("descricao").notNull(),
});

export const conceitos = pgTable(
  "conceitos",
  {
    id: text("id").primaryKey(),
    unidadeId: text("unidade_id").notNull().references(() => unidades.id),
    nome: text("nome").notNull(),
    descricao: text("descricao").notNull(),
    /** Cartão "Conceito novo": regra, exemplo, saída e o primeiro exercício em que aparece. */
    cartao: jsonb("cartao").$type<z.infer<typeof cartaoEsquema>>(),
  },
  (t) => [index("conceitos_unidade").on(t.unidadeId)],
);

export const licoes = pgTable(
  "licoes",
  {
    id: text("id").primaryKey(),
    unidadeId: text("unidade_id").notNull().references(() => unidades.id),
    ordem: smallint("ordem").notNull(),
    titulo: text("titulo").notNull(),
    objetivo: text("objetivo").notNull(),
  },
  (t) => [uniqueIndex("licoes_unidade_ordem").on(t.unidadeId, t.ordem)],
);

export const versoesLicao = pgTable(
  "versoes_licao",
  {
    id: serial("id").primaryKey(),
    licaoId: text("licao_id").notNull().references(() => licoes.id),
    versao: integer("versao").notNull(),
    publicadaEm: timestamp("publicada_em", { withTimezone: true }).notNull().defaultNow(),
    // Versão retirada por erro grave (FL-04): sessões abertas nela são encerradas.
    retiradaEm: timestamp("retirada_em", { withTimezone: true }),
  },
  (t) => [uniqueIndex("versoes_licao_unica").on(t.licaoId, t.versao)],
);

export const exercicios = pgTable(
  "exercicios",
  {
    versaoLicaoId: integer("versao_licao_id").notNull().references(() => versoesLicao.id),
    exercicioId: text("exercicio_id").notNull(),
    versao: integer("versao").notNull(),
    uso: text("uso", { enum: ["principal", "revisao"] }).notNull(),
    posicao: smallint("posicao").notNull(),
    tipo: text("tipo").notNull(),
    conceitos: text("conceitos").array().notNull(),
    dificuldade: smallint("dificuldade").notNull(),
    variacaoDe: text("variacao_de"),
    // Só o que o aluno vê antes de responder (ExercicioPublico).
    publico: jsonb("publico").notNull(),
    dicas: jsonb("dicas").$type<string[]>().notNull(),
  },
  (t) => [primaryKey({ columns: [t.versaoLicaoId, t.exercicioId] })],
);

// Tabela separada para que nenhuma consulta de exercício traga o gabarito por acidente (F-15).
export const gabaritos = pgTable(
  "gabaritos",
  {
    versaoLicaoId: integer("versao_licao_id").notNull(),
    exercicioId: text("exercicio_id").notNull(),
    gabarito: jsonb("gabarito").notNull(),
    explicacao: text("explicacao").notNull(),
  },
  (t) => [primaryKey({ columns: [t.versaoLicaoId, t.exercicioId] })],
);

/* Aprendizagem */

export const sessoes = pgTable(
  "sessoes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    tipo: text("tipo", { enum: ["principal", "pratica", "revisao", "recuperacao"] }).notNull(),
    licaoId: text("licao_id").references(() => licoes.id),
    versaoLicaoId: integer("versao_licao_id").references(() => versoesLicao.id),
    estado: text("estado", { enum: ["aberta", "pausada", "concluida", "descartada"] }).notNull().default("aberta"),
    // Estado da fila (EstadoFila): itens pendentes, errados e resolvidos.
    fila: jsonb("fila").notNull(),
    totalItens: smallint("total_itens").notNull(),
    criadoEm: criadoEm(),
    atualizadoEm: timestamp("atualizado_em", { withTimezone: true }).notNull().defaultNow(),
    concluidaEm: timestamp("concluida_em", { withTimezone: true }),
    // Resultado confirmado na conclusão (ResultadoConclusao): pedidos repetidos devolvem o mesmo (4.9).
    resultado: jsonb("resultado"),
  },
  (t) => [
    // D-07: no máximo uma sessão principal aberta por aluno e lição.
    uniqueIndex("sessoes_principal_aberta")
      .on(t.alunoId, t.licaoId)
      .where(sql`${t.tipo} = 'principal' and ${t.estado} in ('aberta', 'pausada')`),
    index("sessoes_aluno").on(t.alunoId, t.estado),
    index("sessoes_licao").on(t.licaoId),
    index("sessoes_versao_licao").on(t.versaoLicaoId),
  ],
);

export const itensSessao = pgTable(
  "itens_sessao",
  {
    sessaoId: uuid("sessao_id").notNull().references(() => sessoes.id, { onDelete: "cascade" }),
    exercicioId: text("exercicio_id").notNull(),
    versaoLicaoId: integer("versao_licao_id").notNull(),
    posicaoOriginal: smallint("posicao_original").notNull(),
    tentativas: smallint("tentativas").notNull().default(0),
    dicasUsadas: smallint("dicas_usadas").notNull().default(0),
    errouPrimeira: boolean("errou_primeira"),
    resolvido: boolean("resolvido").notNull().default(false),
  },
  (t) => [primaryKey({ columns: [t.sessaoId, t.exercicioId] })],
);

export const submissoes = pgTable(
  "submissoes",
  {
    // Gerado pela interface; reenvios com o mesmo id devolvem o resultado gravado (FL-04).
    id: uuid("id").primaryKey(),
    sessaoId: uuid("sessao_id").notNull().references(() => sessoes.id, { onDelete: "cascade" }),
    exercicioId: text("exercicio_id").notNull(),
    resposta: jsonb("resposta").notNull(),
    correta: boolean("correta").notNull(),
    perdeuCoracao: boolean("perdeu_coracao").notNull().default(false),
    criadoEm: criadoEm(),
  },
  (t) => [index("submissoes_sessao").on(t.sessaoId)],
);

export const conclusoesLicao = pgTable(
  "conclusoes_licao",
  {
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    licaoId: text("licao_id").notNull().references(() => licoes.id),
    sessaoId: uuid("sessao_id"),
    concluidaEm: timestamp("concluida_em", { withTimezone: true }).notNull().defaultNow(),
  },
  // Uma recompensa de primeira conclusão por aluno e lição.
  (t) => [primaryKey({ columns: [t.alunoId, t.licaoId] }), index("conclusoes_licao_licao").on(t.licaoId)],
);

export const estadoConceitos = pgTable(
  "estado_conceitos",
  {
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    conceitoId: text("conceito_id").notNull().references(() => conceitos.id),
    intervaloDias: smallint("intervalo_dias").notNull().default(1),
    proximaRevisao: date("proxima_revisao").notNull(),
    revisoes: integer("revisoes").notNull().default(0),
    estado: text("estado", { enum: ["iniciado", "praticando", "consolidando"] }).notNull().default("iniciado"),
  },
  (t) => [primaryKey({ columns: [t.alunoId, t.conceitoId] }), index("estado_conceitos_vencidos").on(t.alunoId, t.proximaRevisao), index("estado_conceitos_conceito").on(t.conceitoId)],
);

/* Gamificação */

export const lancamentos = pgTable(
  "lancamentos",
  {
    id: serial("id").primaryKey(),
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    // XP concedido ou corações devolvidos por uma recuperação.
    moeda: text("moeda", { enum: ["xp", "coracoes"] }).notNull().default("xp"),
    causa: text("causa").notNull(),
    valor: integer("valor").notNull(),
    diaEstudo: date("dia_estudo").notNull(),
    // Identificador único do evento que gerou o lançamento, como "conclusao:<sessao>".
    eventoId: text("evento_id").notNull().unique(),
    criadoEm: criadoEm(),
  },
  (t) => [index("lancamentos_aluno_dia").on(t.alunoId, t.diaEstudo)],
);

export const atividadeDiaria = pgTable(
  "atividade_diaria",
  {
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    dia: date("dia").notNull(),
    sessoes: smallint("sessoes").notNull().default(0),
    praticasRecompensadas: smallint("praticas_recompensadas").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.alunoId, t.dia] })],
);

export const conquistasAluno = pgTable(
  "conquistas_aluno",
  {
    alunoId: uuid("aluno_id").notNull().references(() => perfis.id, { onDelete: "cascade" }),
    conquista: text("conquista").$type<Conquista>().notNull(),
    concedidaEm: timestamp("concedida_em", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.alunoId, t.conquista] })],
);

/* Operação */

export const transferenciasDemo = pgTable("transferencias_demo", {
  // Uma transferência por conta (FL-02).
  alunoId: uuid("aluno_id").primaryKey().references(() => perfis.id, { onDelete: "cascade" }),
  resultado: text("resultado", { enum: ["registrada", "recusada", "invalida", "ja_concluida"] }).notNull(),
  criadoEm: criadoEm(),
});

export const limitesFrequencia = pgTable(
  "limites_frequencia",
  {
    chave: text("chave").notNull(),
    janela: timestamp("janela", { withTimezone: true }).notNull(),
    contagem: integer("contagem").notNull().default(0),
  },
  (t) => [primaryKey({ columns: [t.chave, t.janela] })],
);

export const eventosProduto = pgTable(
  "eventos_produto",
  {
    id: serial("id").primaryKey(),
    nome: text("nome").notNull(),
    alunoId: uuid("aluno_id"),
    // Só identificadores de lição, exercício e conceito; nunca respostas ou dados pessoais (CA-117).
    dados: jsonb("dados").notNull().default({}),
    criadoEm: criadoEm(),
  },
  (t) => [index("eventos_nome_data").on(t.nome, t.criadoEm)],
);
