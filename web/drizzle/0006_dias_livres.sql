ALTER TABLE "perfis" ADD COLUMN "dias_livres" smallint DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "perfis" ADD COLUMN "dias_livres_usados" text[] DEFAULT '{}'::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "perfis" ADD CONSTRAINT "perfis_dias_livres_faixa" CHECK ("perfis"."dias_livres" between 0 and 2);