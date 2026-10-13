-- Tabelas acessadas só pelo servidor (ESPECIFICACAO_MVP, 6.1). RLS ativo e sem políticas:
-- a API de dados do Supabase não devolve nada para visitantes ou alunos.
ALTER TABLE "atividade_diaria" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conceitos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conclusoes_licao" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "conquistas_aluno" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "estado_conceitos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "eventos_produto" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "exercicios" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "gabaritos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "itens_sessao" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "lancamentos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "licoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "limites_frequencia" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "perfis" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "sessoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "submissoes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "transferencias_demo" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "unidades" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "versoes_licao" ENABLE ROW LEVEL SECURITY;
