# Onde paramos

Passagem de trabalho em 8 de novembro de 2026, para continuar numa nova sessão. Leia este arquivo primeiro. Depois leia `design/ANALISE_UX_GAMIFICACAO.md`, seção 5 (decisões), e `design/ESTRATEGIA_DE_CRESCIMENTO.md`.

## Como trabalhar neste projeto

- **Decisões:** o dono do produto prefere não ser consultado sobre produto, design, conteúdo ou regras. Monte um painel de agentes especialistas (gamificação, ciência da aprendizagem, crescimento, UX), sintetize, registre a decisão em `design/` e implemente. Ideias que surgirem durante o trabalho são executadas na hora.
- **Só leve ao dono:** dinheiro, contas e senhas pessoais, dados legais e ações irreversíveis fora do repositório.
- **Git:** commits direto no `main`, sem branch, com `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`. **Publicação:** desde 12/11/2026 o projeto `sibi` da Vercel está ligado ao GitHub, e cada push no `main` publica o site sozinho (aparece o endereço `sibi-git-main-…`). Se precisar publicar à mão, rode da raiz do repositório `npx vercel@latest deploy --prod --yes --scope team_0zSAVILLco3gZHnizEuZEnKu` (a pasta `.vercel/` na raiz, ignorada pelo git, liga ao projeto `sibi`; o diretório raiz do projeto na Vercel é `web`, então nunca rode de dentro de `web/`).
- **Sessões longas e autônomas:** não parar para perguntar a cada etapa.
- **Vigiar abuso:** no começo de toda sessão, rode `npm run db:vigilancia` (em `web/`) e conte ao dono o resultado. Ele pediu isso quando abriu o acesso de visitante. Os limites e as mensagens ficam em `web/src/modulos/metricas/vigilancia.ts`; ATENÇÃO pede olhar, ALERTA pede agir (captcha Turnstile no Supabase, que exige o dono criar a conta no Cloudflare).

## Estado do produto

- **Sibi:** app web (Next.js 16 em `web/`, Supabase e Vercel) que ensina Python a adultos brasileiros, com gamificação.
- **No ar:** https://sibi-three.vercel.app (projeto `sibi` na Vercel, banco `sibi-dev`, ambiente "homologacao").
- **Conteúdo:** 4 unidades, 20 lições e 192 exercícios. A unidade 4 (Listas e repetição: listas, posições, `append`, `for` e acumulador, com o desafio "gastos da semana") está na versão 1; das outras, as lições estão na versão 3 e a u1-l4 na versão 4.
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

- **Acesso de visitante, 12/11/2026:** botão "Entrar como visitante" na tela inicial e em `/entrar` (`web/src/componentes/EntrarComoVisitante.tsx`, ação `entrarComoVisitante` em `app/(conta)/acoes.ts`), para recrutadores e curiosos usarem o app inteiro sem cadastro. Usa o login anônimo do Supabase (ligado no painel: Authentication → Sign In / Providers → "Allow anonymous sign-ins"); o aviso abaixo do botão vale como declaração de 18+ e aceite dos documentos, e o aceite fica em `termos_aceitos_em`. O perfil ganha `perfis.visitante` (migração 0007) e o evento `visitante_entrou` em vez de `conta_criada`; no Perfil aparece a data em que tudo será apagado e some o "Exportar meu histórico". A limpeza (`servidor/perfis/visitantes.ts`, `DIAS_DE_VISITANTE = 7`) apaga perfil, progresso, eventos e o usuário anônimo do `auth.users`. Ela roda no Cron da Vercel (`web/vercel.json`, todo dia às 9h UTC) pela rota `/api/manutencao`, que só aceita `Authorization: Bearer <CRON_SECRET>` (variável cadastrada na Vercel em produção, valor não guardado em lugar nenhum; para trocar, gere outro e rode `vercel env add CRON_SECRET production`). A mesma rota limpa janelas antigas do limite de frequência e, por tocar o banco todo dia, impede o Supabase gratuito de pausar. Pendente: captcha no login anônimo, se aparecer abuso. Revisado em 12/11/2026 por outra sessão: a rota recusa pedidos sem o segredo (401), o Cron está registrado na Vercel e a publicação atual já tem o `CRON_SECRET`. O roteiro de navegador ganhou o modo `visitante` (fora do `tudo`, porque cria um usuário anônimo de verdade), e no desafio do dia o visitante volta à trilha em vez de ser convidado para a demonstração.
- **Retenção, 12/11/2026:** `npm run db:retencao` (em `web/`) mostra o funil da fase 1 (1ª lição, unidade 1) e D1, D7 e D30, no total e por semana de entrada. Regras puras em `web/src/modulos/metricas/retencao.ts`; o script tira visitantes e as contas de teste de `.env.local` e não imprime nomes nem e-mails.
- **Digitar a saída, 12/11/2026:** sem conteúdo novo. Na revisão (sempre) e na prática (metade dos itens, escolhida de forma estável pela sessão), um "escolher a saída" curto (até 4 linhas de 40 caracteres, sem opção de erro) aparece como campo para digitar; 69 dos 77 itens desse tipo se qualificam. A lição principal e a recuperação continuam com opções. Regras em `web/src/modulos/aprendizagem/digitar.ts`: a comparação ignora espaços no fim das linhas e as aspas e travessões que o celular troca sozinho, mas não maiúsculas nem espaços no meio; uma resposta quase certa recebe um comentário ("Confira as maiúsculas…"). A transformação acontece ao servir o item e ao corrigir (`estudo.ts`, `servico.ts`), então nada mudou no banco nem no formato do conteúdo.
- **Desafio do dia, 12/11/2026:** `/desafio`, sem conta. São 5 perguntas de "qual é a saída?" (77 candidatas, das versões vigentes), iguais para todos no dia de Brasília, do #1 em 12/11/2026. Os candidatos são embaralhados com semente fixa e cada dia pega o bloco seguinte, então nada se repete por uns 15 dias. Uma tentativa por pergunta; o placar marca 🟩 de primeira, 🟨 com dica ou cartão, 🟥 erro. No fim: "Mandar no WhatsApp" (link `/desafio?c=1`), copiar, compartilhar do sistema, contagem até o próximo e convite para a primeira lição. Não dá XP nem grava progresso; só os eventos `desafio_iniciado` e `desafio_concluido` (sem aluno, com `compartilhado`), que aparecem no `npm run db:retencao`. Entradas: tela inicial e Praticar. Regras em `web/src/modulos/desafio/desafio.ts`, servidor em `web/src/servidor/desafio/servico.ts`, motor local em `web/src/componentes/licao/desafio.ts` (a tela é a mesma `Licao.tsx`, com a prop `desafio`). O roteiro de navegador tem o modo `desafio` (também roda em `tudo`) e não registra eventos.
- **PWA, 12/11/2026:** dá para instalar o Sibi na tela inicial (o Chrome confirma, sem erros de instalação). Manifesto em `web/src/app/manifest.ts` (abre em `/aprender?origem=app`, atalhos para Desafio e Praticar), ícones gerados de `web/src/app/icones/desenho.tsx` (192, 512 e mascarável) e `apple-icon.tsx`. O service worker (`web/public/sw.js`) não guarda telas nem dados: só mostra `offline.html` quando uma navegação falha sem rede; ele só é registrado no site publicado, nunca em localhost. O cartão "Coloque o Sibi na tela inicial" fica no Perfil: botão onde o navegador oferece instalação, passo a passo no iPhone, some quando já está instalado. Notificações ainda não: pedem chaves VAPID, guardar inscrições e um agendador de envio.
- **Unidade 4, 12/11/2026:** `conteudo/unidade-4` (decisões em `UNIDADE.md`: sem `range`, sem cópia de listas, `IndexError` só como opção de erro). Publicada com `npm run db:publicar`. A trilha agora alterna quatro cores (a 4ª é laranja) e os testes contam 4 unidades e 20 lições.
- **Pesquisa do Duolingo, 12/11/2026:** `reports/Estratégias de aprendizagem do Duolingo.md` (notas em `research_notes/`). Termina com 21 ações priorizadas; já existiam no Sibi: exercício errado volta no fim, cartão reabrível, marcos de sequência, dia livre.
- **Tema escuro, 12/11/2026:** padrão do app; o claro é opção em Perfil (`componentes/Tema.tsx`, guardado no aparelho e aplicado por script no `<head>`, sem piscar). Cores do CSS são tokens com duas paletas em `globals.css`; cor nova sempre como token.
- **Entenda melhor, 12/11/2026:** os 30 conceitos têm explicação em camadas (texto, passo a passo, erros comuns) em `conteudo/unidade-N/entenda.yaml`, conferida pelo verificador e mostrada fechada embaixo do cartão. Abrir gera `entenda_aberto` (navegador automatizado não conta); `npm run db:retencao` compara o acerto de primeira depois de abrir com os demais casos. Próximo: vídeo piloto do `print` no estúdio de motion, esperando o dono aprovar a direção.

## Próximos passos, em ordem

**Feito nesta rodada (12/11/2026, sem o dono):**
- Tempo de cada resposta gravado (`submissoes.tempo_ms`, migração 0008). Base para medir dificuldade.
- Painel diário de estados (novo, corrente, reativado, em risco, inativo) e retenção de correntes em `npm run db:retencao`.
- Relatório de dificuldade (`npm run db:dificuldade`): exercícios confusos e fáceis demais, com tempo mediano.
- Previsão antes de ver a saída no cartão de conceito (opcional, não é gravada).
- Resultado da lição com "Mandar no WhatsApp" e "Copiar resultado".
- Já existiam: erro volta no fim da lição, cartão reabrível durante o exercício, celebração de marcos da sequência.

**Preparação do teste com amigos (12/11/2026, depois da troca para o Opus):**
- Teto de 50 contas com e-mail (`modulos/conta/vagas.ts`): o cadastro fecha sozinho, e a vigilância avisa com 40 e com 50. O dono pediu para não crescer antes de conseguir acompanhar.
- O dono **não vai observar** os amigos usando. Isso foi substituído por: avaliação no fim de cada lição (fácil, na medida, difícil e o motivo, só de toque) e mini-teste da unidade 1 antes e depois (`/miniteste`). As duas coisas aparecem no `db:retencao`.
- Revisão dos commits feitos com o modelo mais barato: o tempo de resposta recusava envios acima de 1 hora, o que travava o aluno (corrigido), e o cronômetro zerava ao reabrir o cartão (agora pausa).
- **Rotina:** quando o dono perguntar "como está o Sibi?", rodar `db:vigilancia`, `db:retencao` e `db:dificuldade` e responder com números e o que mudar.

**E-mail (12/11/2026, 17h):** o dono criou o Gmail do Sibi e configurou o SMTP no Supabase. Teste feito: um e-mail
de recuperação de senha para a conta de teste 1 foi aceito e registrado (`auth.users.recovery_sent_at` às 20:05 UTC),
sem erro de SMTP. **Falta, e o dono pediu para eu fazer pelo navegador na próxima sessão** (ele autorizou estas mudanças
no painel do Supabase):
1. Conferir com o dono se o e-mail de teste chegou e se caiu no spam.
2. Supabase → Authentication → Rate Limits → "Rate limit for sending emails" = 100 por hora.
3. Supabase → Authentication → Emails → Templates: "Confirm signup" e "Reset Password" com os textos de
   `PASSO_A_PASSO_EMAIL.md`, parte 4.
4. Conferir Authentication → URL Configuration (Site URL e Redirect URLs, parte 3 do passo a passo).
5. Testar um cadastro de ponta a ponta e só então liberar o link para os amigos.

**Pendente da pesquisa do Duolingo, para decidir em outra rodada:**
- Ação 6, dica ligada ao erro: precisa de conteúdo novo (2 ou 3 erros comuns por exercício).
- Ação 8, quebra sem alarme com recuperação "3 sessões em até 2 dias": muda a regra da sequência no servidor. Pede teste de regra e decisão sobre o texto.
- Ações 9 a 11 e 14 a 21: lembrete por e-mail (depende do SMTP), compromisso na primeira sessão, meia-vida por aluno, micro-vídeos, modo fim de semana, mini-teste de unidade, etc.
- Unidade 5 (textos e f-strings): conteúdo novo e publicação no banco compartilhado com produção, então precisa de revisão antes.

Abaixo, a lista anterior, sem alterações:

1. **Depois, pela estratégia:**
   - SMTP próprio: **esperando o dono** seguir `PASSO_A_PASSO_EMAIL.md` (senha de app do Gmail colada no painel do Supabase). Quando ele disser "pronto", criar uma conta com endereço novo, conferir se o e-mail chega e se o link abre, e tirar o aviso de e-mail abaixo;
   - lembrete por e-mail na hora escolhida pelo aluno (depende do SMTP; a estratégia pede a partir da 3ª semana do teste);
   - cartão de resultado da lição como imagem ("Meus programas": o programa do desafio de cada unidade com o nome do aluno). Já feito em texto: o resultado da lição principal tem "Mandar no WhatsApp" e "Copiar resultado", sem nome nem respostas (`modulos/aprendizagem/compartilhar.ts`). Falta a imagem;
   - unidade 5 (textos e f-strings, projeto "mensagens personalizadas");
   - Python rodando no navegador (Pyodide) no modo "rode e mude um número", a partir da unidade 4;
   - login com Google (o dono precisa criar o cliente OAuth no Google Cloud e colar no Supabase);
   - notificações do PWA (chaves VAPID, inscrições no banco e um agendador).

## Avisos do ambiente

- **Arquivos fora do repositório:** `web/.env.local` não está no git; numa máquina nova, o dono precisa fornecer as variáveis (veja `web/.env.example`). As contas de teste ficam nesse arquivo (`TESTE_EMAIL_1`, `TESTE_EMAIL_2`, `TESTE_SENHA`). Nunca escreva a senha em chat ou em arquivo do repositório.
- **Banco:** o pooler do Supabase tem só 15 conexões, divididas entre o site, o servidor local e os scripts (veja `web/src/servidor/db/cliente.ts`). O projeto gratuito pausa depois de 7 dias sem uso; a manutenção diária (/api/manutencao) evita isso.
- **E-mail:** o envio padrão do Supabase só entrega para membros da organização, no máximo 2 por hora. Amigos ainda não conseguem criar conta.
- **Vercel:** o conector MCP da Vercel enxergava outra conta. A CLI (`npx vercel@latest`) foi logada só no computador do dono. A `DATABASE_URL` da Vercel foi colada pelo próprio dono, e não se digitam senhas em serviços externos.
- **Servidor local:** o de desenvolvimento ficou muito lento no computador do dono. Para testes de navegador, use `npm run build` e depois `npx next start -p 3100`.
- **Next.js 16:** traz mudanças incompatíveis com versões anteriores. Antes de usar uma API nova, consulte `web/node_modules/next/dist/docs/`.
