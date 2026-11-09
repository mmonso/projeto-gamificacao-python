# Onde paramos

Passagem de trabalho em 8 de novembro de 2026, para continuar numa nova sessão. Leia este arquivo primeiro. Depois leia `design/ANALISE_UX_GAMIFICACAO.md`, seção 5 (decisões), e `design/ESTRATEGIA_DE_CRESCIMENTO.md`.

## Como trabalhar neste projeto

- **Decisões:** o dono do produto é leigo e não quer ser consultado sobre produto, design, conteúdo ou regras. Monte um painel de agentes especialistas (gamificação, ciência da aprendizagem, crescimento, UX), sintetize, registre a decisão em `design/` e implemente. Ideias que surgirem durante o trabalho são executadas na hora.
- **Só leve ao dono:** dinheiro, contas e senhas pessoais, dados legais e ações irreversíveis fora do repositório.
- **Git:** commits direto no `main`, sem branch, com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. Cada push no `main` publica o site.
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

  Os testes automáticos (138), os tipos e o lint passaram. **Falta rodar o roteiro de navegador** (`ferramentas/verificar_navegador.mjs tudo`) contra a versão de produção ou o site publicado e corrigir o que aparecer.

## Próximos passos, em ordem

1. **Verificar a 2A no site publicado:** rodar o roteiro com `BASE=https://sibi-three.vercel.app` e revisar as capturas do celular (trilha, popovers do topo, tela inicial).
2. **Parte 2C, cartões "Conceito novo":** os 25 cartões já estão escritos em `conteudo/cartoes-rascunho.json`, pelo especialista em aprendizagem.
   - **Conteúdo:** mover cada cartão para o campo `cartao` do conceito no `unidade.yaml`. O verificador `ferramentas/verificar_conteudo.py` deve rodar o exemplo e conferir a saída.
   - **Banco:** coluna `cartao jsonb` em `conceitos`, numa migração nova. A publicação (`npm run db:publicar`) deve passar a gravá-la.
   - **Tela:**
     - antes do primeiro exercício de cada conceito ainda não visto (sem linha em `estado_conceitos` e ainda não mostrado nesta sessão), só na sessão principal e na demonstração;
     - saída escondida até "Ver a saída";
     - botão "Conceito" ao lado de "Dica".
   - **Regra:** na revisão e na prática, abrir o cartão antes de responder conta como dica na agenda.
3. **Parte 2B, recompensas:**
   - as 18 conquistas da tabela na seção 5 da análise; o campo `conquista` é texto, sem migração;
   - tela de desbloqueio e grade no perfil, com progresso;
   - meta com os nomes Leve, Firme e Intensa;
   - celebração nos marcos de sequência de 3, 7, 14 e 30 dias.
4. **Parte 2D, hábito:**
   - dia livre (`perfis.dias_livres`, o primeiro aos 3 dias, depois 1 a cada 7 dias de estudo, no máximo 2);
   - mapa de domínio com 4 degraus e selo "para revisar".
5. **Depois, pela estratégia:**
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
