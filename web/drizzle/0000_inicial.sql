CREATE TABLE "atividade_diaria" (
	"aluno_id" uuid NOT NULL,
	"dia" date NOT NULL,
	"sessoes" smallint DEFAULT 0 NOT NULL,
	"praticas_recompensadas" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "atividade_diaria_aluno_id_dia_pk" PRIMARY KEY("aluno_id","dia")
);
--> statement-breakpoint
CREATE TABLE "conceitos" (
	"id" text PRIMARY KEY NOT NULL,
	"unidade_id" text NOT NULL,
	"nome" text NOT NULL,
	"descricao" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "conclusoes_licao" (
	"aluno_id" uuid NOT NULL,
	"licao_id" text NOT NULL,
	"sessao_id" uuid,
	"concluida_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conclusoes_licao_aluno_id_licao_id_pk" PRIMARY KEY("aluno_id","licao_id")
);
--> statement-breakpoint
CREATE TABLE "conquistas_aluno" (
	"aluno_id" uuid NOT NULL,
	"conquista" text NOT NULL,
	"concedida_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "conquistas_aluno_aluno_id_conquista_pk" PRIMARY KEY("aluno_id","conquista")
);
--> statement-breakpoint
CREATE TABLE "estado_conceitos" (
	"aluno_id" uuid NOT NULL,
	"conceito_id" text NOT NULL,
	"intervalo_dias" smallint DEFAULT 1 NOT NULL,
	"proxima_revisao" date NOT NULL,
	"revisoes" integer DEFAULT 0 NOT NULL,
	"estado" text DEFAULT 'iniciado' NOT NULL,
	CONSTRAINT "estado_conceitos_aluno_id_conceito_id_pk" PRIMARY KEY("aluno_id","conceito_id")
);
--> statement-breakpoint
CREATE TABLE "eventos_produto" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"aluno_id" uuid,
	"dados" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exercicios" (
	"versao_licao_id" integer NOT NULL,
	"exercicio_id" text NOT NULL,
	"versao" integer NOT NULL,
	"uso" text NOT NULL,
	"posicao" smallint NOT NULL,
	"tipo" text NOT NULL,
	"conceitos" text[] NOT NULL,
	"dificuldade" smallint NOT NULL,
	"variacao_de" text,
	"publico" jsonb NOT NULL,
	"dicas" jsonb NOT NULL,
	CONSTRAINT "exercicios_versao_licao_id_exercicio_id_pk" PRIMARY KEY("versao_licao_id","exercicio_id")
);
--> statement-breakpoint
CREATE TABLE "gabaritos" (
	"versao_licao_id" integer NOT NULL,
	"exercicio_id" text NOT NULL,
	"gabarito" jsonb NOT NULL,
	"explicacao" text NOT NULL,
	CONSTRAINT "gabaritos_versao_licao_id_exercicio_id_pk" PRIMARY KEY("versao_licao_id","exercicio_id")
);
--> statement-breakpoint
CREATE TABLE "itens_sessao" (
	"sessao_id" uuid NOT NULL,
	"exercicio_id" text NOT NULL,
	"versao_licao_id" integer NOT NULL,
	"posicao_original" smallint NOT NULL,
	"tentativas" smallint DEFAULT 0 NOT NULL,
	"dicas_usadas" smallint DEFAULT 0 NOT NULL,
	"errou_primeira" boolean,
	"resolvido" boolean DEFAULT false NOT NULL,
	CONSTRAINT "itens_sessao_sessao_id_exercicio_id_pk" PRIMARY KEY("sessao_id","exercicio_id")
);
--> statement-breakpoint
CREATE TABLE "lancamentos" (
	"id" serial PRIMARY KEY NOT NULL,
	"aluno_id" uuid NOT NULL,
	"moeda" text DEFAULT 'xp' NOT NULL,
	"causa" text NOT NULL,
	"valor" integer NOT NULL,
	"dia_estudo" date NOT NULL,
	"evento_id" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lancamentos_evento_id_unique" UNIQUE("evento_id")
);
--> statement-breakpoint
CREATE TABLE "licoes" (
	"id" text PRIMARY KEY NOT NULL,
	"unidade_id" text NOT NULL,
	"ordem" smallint NOT NULL,
	"titulo" text NOT NULL,
	"objetivo" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "limites_frequencia" (
	"chave" text NOT NULL,
	"janela" timestamp with time zone NOT NULL,
	"contagem" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "limites_frequencia_chave_janela_pk" PRIMARY KEY("chave","janela")
);
--> statement-breakpoint
CREATE TABLE "perfis" (
	"id" uuid PRIMARY KEY NOT NULL,
	"nome" text DEFAULT '' NOT NULL,
	"meta_diaria" smallint DEFAULT 1 NOT NULL,
	"fuso" text DEFAULT 'America/Sao_Paulo' NOT NULL,
	"fuso_pendente" text,
	"pendente_a_partir_de" date,
	"som" boolean DEFAULT true NOT NULL,
	"coracoes" smallint DEFAULT 5 NOT NULL,
	"xp_total" integer DEFAULT 0 NOT NULL,
	"sequencia_atual" integer DEFAULT 0 NOT NULL,
	"maior_sequencia" integer DEFAULT 0 NOT NULL,
	"ultimo_dia_estudo" date,
	"termos_aceitos_em" timestamp with time zone,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "perfis_coracoes_faixa" CHECK ("perfis"."coracoes" between 0 and 5),
	CONSTRAINT "perfis_meta_faixa" CHECK ("perfis"."meta_diaria" between 1 and 3)
);
--> statement-breakpoint
CREATE TABLE "sessoes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"aluno_id" uuid NOT NULL,
	"tipo" text NOT NULL,
	"licao_id" text,
	"versao_licao_id" integer,
	"estado" text DEFAULT 'aberta' NOT NULL,
	"fila" jsonb NOT NULL,
	"total_itens" smallint NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"atualizado_em" timestamp with time zone DEFAULT now() NOT NULL,
	"concluida_em" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "submissoes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"sessao_id" uuid NOT NULL,
	"exercicio_id" text NOT NULL,
	"resposta" jsonb NOT NULL,
	"correta" boolean NOT NULL,
	"perdeu_coracao" boolean DEFAULT false NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transferencias_demo" (
	"aluno_id" uuid PRIMARY KEY NOT NULL,
	"resultado" text NOT NULL,
	"criado_em" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "unidades" (
	"id" text PRIMARY KEY NOT NULL,
	"ordem" smallint NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	CONSTRAINT "unidades_ordem_unique" UNIQUE("ordem")
);
--> statement-breakpoint
CREATE TABLE "versoes_licao" (
	"id" serial PRIMARY KEY NOT NULL,
	"licao_id" text NOT NULL,
	"versao" integer NOT NULL,
	"publicada_em" timestamp with time zone DEFAULT now() NOT NULL,
	"retirada_em" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "atividade_diaria" ADD CONSTRAINT "atividade_diaria_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conceitos" ADD CONSTRAINT "conceitos_unidade_id_unidades_id_fk" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conclusoes_licao" ADD CONSTRAINT "conclusoes_licao_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conclusoes_licao" ADD CONSTRAINT "conclusoes_licao_licao_id_licoes_id_fk" FOREIGN KEY ("licao_id") REFERENCES "public"."licoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conquistas_aluno" ADD CONSTRAINT "conquistas_aluno_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estado_conceitos" ADD CONSTRAINT "estado_conceitos_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "estado_conceitos" ADD CONSTRAINT "estado_conceitos_conceito_id_conceitos_id_fk" FOREIGN KEY ("conceito_id") REFERENCES "public"."conceitos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exercicios" ADD CONSTRAINT "exercicios_versao_licao_id_versoes_licao_id_fk" FOREIGN KEY ("versao_licao_id") REFERENCES "public"."versoes_licao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "itens_sessao" ADD CONSTRAINT "itens_sessao_sessao_id_sessoes_id_fk" FOREIGN KEY ("sessao_id") REFERENCES "public"."sessoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "licoes" ADD CONSTRAINT "licoes_unidade_id_unidades_id_fk" FOREIGN KEY ("unidade_id") REFERENCES "public"."unidades"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_licao_id_licoes_id_fk" FOREIGN KEY ("licao_id") REFERENCES "public"."licoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessoes" ADD CONSTRAINT "sessoes_versao_licao_id_versoes_licao_id_fk" FOREIGN KEY ("versao_licao_id") REFERENCES "public"."versoes_licao"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "submissoes" ADD CONSTRAINT "submissoes_sessao_id_sessoes_id_fk" FOREIGN KEY ("sessao_id") REFERENCES "public"."sessoes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "transferencias_demo" ADD CONSTRAINT "transferencias_demo_aluno_id_perfis_id_fk" FOREIGN KEY ("aluno_id") REFERENCES "public"."perfis"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "versoes_licao" ADD CONSTRAINT "versoes_licao_licao_id_licoes_id_fk" FOREIGN KEY ("licao_id") REFERENCES "public"."licoes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "estado_conceitos_vencidos" ON "estado_conceitos" USING btree ("aluno_id","proxima_revisao");--> statement-breakpoint
CREATE INDEX "eventos_nome_data" ON "eventos_produto" USING btree ("nome","criado_em");--> statement-breakpoint
CREATE INDEX "lancamentos_aluno_dia" ON "lancamentos" USING btree ("aluno_id","dia_estudo");--> statement-breakpoint
CREATE UNIQUE INDEX "licoes_unidade_ordem" ON "licoes" USING btree ("unidade_id","ordem");--> statement-breakpoint
CREATE UNIQUE INDEX "sessoes_principal_aberta" ON "sessoes" USING btree ("aluno_id","licao_id") WHERE "sessoes"."tipo" = 'principal' and "sessoes"."estado" in ('aberta', 'pausada');--> statement-breakpoint
CREATE INDEX "sessoes_aluno" ON "sessoes" USING btree ("aluno_id","estado");--> statement-breakpoint
CREATE INDEX "submissoes_sessao" ON "submissoes" USING btree ("sessao_id");--> statement-breakpoint
CREATE UNIQUE INDEX "versoes_licao_unica" ON "versoes_licao" USING btree ("licao_id","versao");