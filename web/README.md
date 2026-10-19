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
| `src/modulos/conta` | Validação de cadastro e login, destino seguro após entrar e mensagens neutras de erro |
| `src/modulos/conteudo` | Formato dos exercícios e separação entre parte pública e gabarito |
| `src/modulos/aprendizagem` | Corretores e fila da sessão |
| `src/modulos/gamificacao` | Regras de XP, corações, meta, sequência, fuso, conquistas e revisão |
| `src/servidor/auth` | Supabase Auth: cliente com cookies, renovação da sessão no proxy e camada de acesso (`obterAluno`, `exigirAluno`, `obterPerfilAtual`) |
| `src/servidor/perfis` | Perfil do aluno, criado no primeiro acesso com os dados do cadastro |
| `src/servidor/db` | Esquema do banco (Drizzle) e conexão criada no primeiro uso |
| `src/app/(conta)` | Telas e ações de cadastro, verificação de e-mail, login, recuperação e nova senha |
| `src/servidor/conteudo` | Leitura e publicação do conteúdo de `../conteudo` |
| `drizzle/` | Migrações SQL versionadas |

Os módulos de domínio são funções puras; serviços e rotas aplicam essas regras dentro de transações no servidor.

Autorização: todo acesso a dados do aluno passa pela camada de acesso em `src/servidor/auth/sessao.ts`, que verifica o token e entrega só o identificador do aluno aos serviços. Nenhum serviço aceita identificador de aluno vindo da requisição.

## Ambiente

Copie `.env.example` para `.env.local`. O projeto de desenvolvimento no Supabase é `sibi-dev` (região sa-east-1). As tabelas ficam com RLS ativo e sem políticas: só o servidor, pela conexão PostgreSQL, lê e grava dados.

### Supabase Auth

No painel do projeto, em Authentication:

- **URL Configuration**: Site URL `http://localhost:3000` em desenvolvimento e, em Redirect URLs, `http://localhost:3000/auth/confirmar**`.
- **Providers > Email**: confirmação de e-mail ligada e senha mínima de 8 caracteres.
- **Email Templates** (opcional): trocar `{{ .ConfirmationURL }}` por `{{ .SiteURL }}/auth/confirmar?token_hash={{ .TokenHash }}&type=email&proximo=/perfil` no de confirmação, e por `...&type=recovery&proximo=/nova-senha` no de redefinição de senha. Assim o link funciona mesmo quando aberto em outro navegador; sem a troca, o fluxo padrão (PKCE) confirma o e-mail mas só abre a sessão no navegador do cadastro.

