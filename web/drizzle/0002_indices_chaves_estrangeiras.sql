CREATE INDEX "conceitos_unidade" ON "conceitos" USING btree ("unidade_id");--> statement-breakpoint
CREATE INDEX "conclusoes_licao_licao" ON "conclusoes_licao" USING btree ("licao_id");--> statement-breakpoint
CREATE INDEX "estado_conceitos_conceito" ON "estado_conceitos" USING btree ("conceito_id");--> statement-breakpoint
CREATE INDEX "sessoes_licao" ON "sessoes" USING btree ("licao_id");--> statement-breakpoint
CREATE INDEX "sessoes_versao_licao" ON "sessoes" USING btree ("versao_licao_id");