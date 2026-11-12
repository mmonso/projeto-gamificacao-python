# Sibi

Aplicativo web que ensina Python a adultos brasileiros em sessões curtas, com gamificação. **Projeto em andamento**: está no ar e evolui toda semana.

**Experimente:** <https://sibi-three.vercel.app>. Use o botão **"Entrar como visitante"** para usar o app inteiro sem cadastro (o acesso de visitante é apagado depois de 7 dias).

Desenvolvido por Marcelo Monsó com IA (Claude Code), da especificação à publicação.

## O que o app faz

- **Lições curtas:** 4 unidades, 20 lições e 192 exercícios (prever a saída, completar e corrigir código), escritos em português e versionados em `conteudo/`.
- **Aprendizagem:** revisão espaçada, prática dos conceitos mais fracos, cartões de conceito novo, dicas em dois níveis e respostas digitadas na revisão.
- **Gamificação:** XP, meta diária, sequência de dias com dia livre, conquistas e um desafio do dia compartilhável, sem ranking nem perfil público.
- **Acesso:** conta com e-mail e senha ou visitante anônimo, lição de demonstração sem conta e instalação como app (PWA).

## Stack

Next.js 16 (App Router, Server Actions) · React 19 · TypeScript · Supabase (Auth e PostgreSQL) · Drizzle ORM · zod · Vitest com PGlite · Vercel (hospedagem e Cron) · GitHub Actions.

## Decisões de arquitetura

- **O banco só é acessado pelo servidor.** O navegador não lê nem grava tabelas: o RLS fica ligado sem políticas e os papéis `anon` e `authenticated` não têm privilégios (migrações `0001` e `0003`). O id do aluno vem da sessão verificada, e toda consulta filtra por ele.
- **Gabarito fora do navegador.** O conteúdo é separado em parte pública e gabarito (`web/src/modulos/conteudo`); a correção acontece no servidor.
- **Regras puras, separadas do servidor.** XP, sequência, meta, conquistas e corretores ficam em `web/src/modulos` como funções sem acesso a banco, testadas isoladamente; `web/src/servidor` cuida de persistência e autenticação.
- **Limite de requisições no Postgres,** por aluno e por IP (guardado só como hash), sem serviço extra.
- **Manutenção diária** pelo Cron da Vercel (`/api/manutencao`, protegida por segredo): apaga visitantes vencidos e janelas antigas do limite.
- **Conteúdo como dado.** As lições ficam em YAML, são conferidas por `ferramentas/verificar_conteudo.py` e publicadas no banco com versão, sem alterar o progresso já salvo.

## Qualidade

- 189 testes automáticos (Vitest): regras de domínio e integração com um PostgreSQL embutido (PGlite), rodando as migrações reais.
- Tipos, lint, testes e build a cada envio (`.github/workflows/verificar.yml`).
- Roteiro de navegador (`ferramentas/verificar_navegador.mjs`) que percorre o app no celular e no desktop, com teclado, redução de movimento e queda de conexão.

## Organização

| Pasta | Conteúdo |
| --- | --- |
| `web/` | O aplicativo Next.js (detalhes e comandos em [`web/README.md`](web/README.md)) |
| `conteudo/` | Unidades e lições em YAML, com o formato em `FORMATO.md` |
| `design/` | Análise de UX e gamificação, sistema visual e estratégia de crescimento |
| `ferramentas/` | Verificação do conteúdo e roteiro de testes no navegador |
| `ESPECIFICACAO_MVP.md`, `PLANO_PRODUTO_E_ARQUITETURA.md` | Especificação e plano do produto |

## Rodar localmente

Requer Node.js 24 (a versão usada na verificação automática) e um projeto Supabase. Copie `web/.env.example` para `web/.env.local`, preencha as variáveis e rode, dentro de `web/`:

```bash
npm install
npm run db:migrar     # cria as tabelas
npm run db:publicar   # publica o conteúdo das lições
npm run dev
```

Os testes (`npm test`) não precisam de banco externo.

## Direitos

© 2026 Marcelo Linhares Monsó. Todos os direitos reservados. O código está aberto para leitura e avaliação; copiar, redistribuir ou usar o código ou o conteúdo das lições em outro produto exige autorização por escrito. Veja [LICENSE](LICENSE).
