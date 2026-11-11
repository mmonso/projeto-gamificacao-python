# Onde paramos

Passagem de trabalho em 8 de novembro de 2026, para continuar numa nova sessão. Leia este arquivo primeiro. Depois leia `design/ANALISE_UX_GAMIFICACAO.md`, seção 5 (decisões), e `design/ESTRATEGIA_DE_CRESCIMENTO.md`.

## Como trabalhar neste projeto

- **Decisões:** o dono do produto é leigo e não quer ser consultado sobre produto, design, conteúdo ou regras. Monte um painel de agentes especialistas (gamificação, ciência da aprendizagem, crescimento, UX), sintetize, registre a decisão em `design/` e implemente. Ideias que surgirem durante o trabalho são executadas na hora.
- **Só leve ao dono:** dinheiro, contas e senhas pessoais, dados legais e ações irreversíveis fora do repositório.
- **Git:** commits direto no `main`, sem branch, com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **O push no `main` NÃO publica o site:** o projeto `sibi` da Vercel não está ligado ao GitHub. Publique da raiz do repositório com `npx vercel@latest deploy --prod --yes --scope team_0zSAVILLco3gZHnizEuZEnKu` (a pasta `.vercel/` na raiz, ignorada pelo git, liga ao projeto `sibi`; o diretório raiz do projeto na Vercel é `web`, então nunca rode de dentro de `web/`).
- **Sessões longas e autônomas:** não parar para perguntar a cada etapa.

## Estado do produto

- **Sibi:** app web (Next.js 16 em `web/`, Supabase e Vercel) que ensina Python a adultos brasileiros, com gamificação.
- **No ar:** https://sibi-three.vercel.app (projeto `sibi` na Vercel, banco `sibi-dev`, ambiente "homologacao").
- **Conteúdo:** 3 unidades, 15 lições e 143 exercícios. Lições na versão 3; a u1-l4 está na versão 4.
- **Feito:**
  - onda 1: som, animações de acerto e erro, contagem de acertos seguidos, resultado animado, dicas em dois níveis;
  - termos de uso e política de privacidade, conta só para maiores de 18 anos;
  - publicação na Vercel.
- **Parte 2A, neste commit:**
  - trilha nova: cor por unidade, caminho, coroa de lição perfeita, mascote, troféu, cabeçalho fixo;
  - anel da meta e calendário da sequência no topo;
  - tela inicial com o "primeiro programa" e "Começar grátis" direto na demonstração;
  - imagem de prévia dos links (`web/src/app/opengraph-image.tsx`);
  - ajustes de clareza na lição e no resultado.

  Os testes automáticos (138), os tipos e o lint passaram. Publicada em 11/11/2026 e verificada no site com o roteiro de navegador (`ferramentas/verificar_navegador.mjs tudo`, todas as checagens passaram).

- **Parte 2C, publicada em 11/11/2026:** cartões "Conceito novo" (25 conceitos). O cartão fica em `cartao` de cada conceito no `unidade.yaml` (formato em `conteudo/FORMATO.md`, verificado por `verificar_conteudo.py`), na coluna `conceitos.cartao` (migração 0005), e `servidor/licoes/cartoes.ts` o anexa ao exercício. Abre sozinho só na sessão principal e na demonstração; o botão "Conceito" reabre; na revisão e na prática conta como dica (`dicas` com `numero: 0`).

- **Parte 2B, publicada em 11/11/2026:** 18 conquistas (`web/src/modulos/gamificacao/conquistas.ts`, regras puras com progresso; `web/src/servidor/gamificacao/conquistas.ts` lê as métricas e concede), grade com progresso no perfil, nomes da meta (Leve, Firme, Intensa, em `parametros.ts`) e celebração própria dos marcos de 3, 7, 14 e 30 dias (`Resultado.tsx`). A tela de desbloqueio é a celebração que já existia, agora com uma tela por conquista.

- **Parte 2D, publicada em 11/11/2026:** dia livre (`modulos/gamificacao/diaslivres.ts`; colunas `perfis.dias_livres` e `dias_livres_usados`, migração 0006; ganho aos 3 dias e depois a cada 7, máximo 2, uso automático ao faltar, escudo azul no calendário) e mapa de domínio na tela Praticar (`dominio.ts`: Visto, Praticando, Firmando, Consolidando, selo "Para revisar").

## Próximos passos, em ordem

1. **Depois, pela estratégia:**
   - SMTP próprio (Gmail com senha de app; o dono precisa criar a senha e colá-la no painel do Supabase);
   - consulta de D1, D7 e D30;
   - novo tipo de exercício "digitar a saída";
   - desafio do dia compartilhável;
   - PWA;
   - unidade 4 (listas e `for`).

## Avisos do ambiente

- **Arquivos fora do repositório:** `web/.env.local` não está no git; numa máquina nova, o dono precisa fornecer as variáveis (veja `web/.env.example`). As contas de teste ficam nesse arquivo (`TESTE_EMAIL_1`, `TESTE_EMAIL_2`, `TESTE_SENHA`). Nunca escreva a senha em chat ou em arquivo do repositório.
- **Banco:** o pooler do Supabase tem só 15 conexões, divididas entre o site, o servidor local e os scripts (veja `web/src/servidor/db/cliente.ts`). O projeto gratuito pausa depois de 7 dias sem uso.
- **E-mail:** o envio padrão do Supabase só entrega para membros da organização, no máximo 2 por hora. Amigos ainda não conseguem criar conta.
- **Vercel:** o conector MCP da Vercel enxergava outra conta. A CLI (`npx vercel@latest`) foi logada só no computador do dono. A `DATABASE_URL` da Vercel foi colada pelo próprio dono, e não se digitam senhas em serviços externos.
- **Servidor local:** o de desenvolvimento ficou muito lento no computador do dono. Para testes de navegador, use `npm run build` e depois `npx next start -p 3100`.
- **Next.js 16:** traz mudanças incompatíveis com versões anteriores. Antes de usar uma API nova, consulte `web/node_modules/next/dist/docs/`.

- **Projeto sobrando na Vercel:** `web` (prj_dk9s4Hjzcr4RUZYWUxletqDhqlxz) foi criado por engano em 11/11/2026 e está vazio; o dono deve apagá-lo no painel.
