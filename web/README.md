# Sibi — aplicativo web

Aplicação Next.js do MVP. Planejamento em [../PLANO_PRODUTO_E_ARQUITETURA.md](../PLANO_PRODUTO_E_ARQUITETURA.md) e regras em [../ESPECIFICACAO_MVP.md](../ESPECIFICACAO_MVP.md).

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm test` | Testes de domínio e de integração com PostgreSQL embutido (PGlite) |
| `npm run typecheck` | Verificação de tipos |
| `npm run lint` | Lint |
| `npm run build` | Build de produção |
| `npm run db:gerar` | Gera uma migração a partir de `src/servidor/db/esquema.ts` |
| `npm run db:migrar` | Aplica as migrações pendentes no banco de `DATABASE_URL_MIGRACOES` |
| `npm run db:publicar` | Publica o conteúdo de `../conteudo` no mesmo banco; versões já publicadas são mantidas |

## Organização

| Pasta | Conteúdo |
| --- | --- |
| `src/modulos/conteudo` | Formato dos exercícios e separação entre parte pública e gabarito |
| `src/modulos/aprendizagem` | Corretores e fila da sessão |
| `src/modulos/gamificacao` | Regras de XP, corações, meta, sequência, fuso, conquistas e revisão |
| `src/servidor/db` | Esquema do banco (Drizzle) |
| `src/servidor/conteudo` | Leitura e publicação do conteúdo de `../conteudo` |
| `drizzle/` | Migrações SQL versionadas |

Os módulos de domínio são funções puras; serviços e rotas aplicam essas regras dentro de transações no servidor.

## Ambiente

Copie `.env.example` para `.env.local`. O projeto de desenvolvimento no Supabase é `sibi-dev` (região sa-east-1). As tabelas ficam com RLS ativo e sem políticas: só o servidor, pela conexão PostgreSQL, lê e grava dados.
