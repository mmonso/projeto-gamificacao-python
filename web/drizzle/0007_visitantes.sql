ALTER TABLE "perfis" ADD COLUMN "visitante" boolean DEFAULT false NOT NULL;--> statement-breakpoint
CREATE INDEX "perfis_visitantes" ON "perfis" USING btree ("criado_em") WHERE "perfis"."visitante";