# Melhorias de experiência, 24/11/2026

Análise do app inteiro antes do teste com amigos, pedida pelo dono: "deixar o programa mais gostoso de usar".
Feita com capturas do site publicado (celular 360 px e desktop) e com a leitura do código. Participaram quatro
especialistas: design visual, ensino para adultos leigos, engenharia e segurança, e uso diário.

Esforço: P = menos de 1 hora, M = meio dia, G = 1 dia ou mais.

## A. Cartão de conceito e "Entenda melhor"

| # | O quê | Esforço |
|---|---|---|
| A1 | Separar as três partes do "Entenda melhor". A **analogia** vira um texto de conversa, com ícone de lâmpada. O **passo a passo** ganha etapas numeradas. Os **erros comuns** vão para uma caixa própria (fundo vermelho-claro, borda vermelha, título "Cuidado com estes erros"): o código errado com ✗ e logo abaixo o certo com ✓, o que pede o campo `certo` no `entenda.yaml`. No título fechado, a prévia "analogia · passo a passo · 2 erros comuns". | M |
| A2 | Quando o "Entenda melhor" abre, a tela rola até ele, e um degradê acima do botão fixo mostra que há mais conteúdo. Hoje só aparecem 3 linhas, e o resto fica escondido atrás do botão. | P |
| A3 | Enquanto a saída não foi revelada, o botão verde de baixo é "Ver a saída"; só depois vira "Próximo conceito". Hoje quem é leigo pula a revelação sem ver. Se o palpite bater, mostrar ✓. | P |
| A4 | Deixar o "Repare" com cara de dica (amarelo, com ícone), diferente do "Entenda melhor". | P |
| A5 | Traduzir os nomes dos erros: "NameError (nome que o Python não conhece)", "SyntaxError (o Python não entendeu a frase)". | P |

## B. Pegar pela mão no começo

| # | O quê | Esforço |
|---|---|---|
| B1 | Lição 0, "Boas-vindas", com 3 telas e o botão "Já sei o básico, pular". **1:** o que é um programa (uma receita que o computador segue; o app do banco e o WhatsApp são programas), com ponte para o `print` que a pessoa escreveu na tela inicial. **2:** o que é Python e o mapa do que ela vai conseguir fazer em cada unidade. **3:** como funciona aqui (ler programas curtos e adivinhar o que aparece; errar faz parte), com 3 palavras: código, saída, comando. A tela `/introducao` já existe, mas nada leva até ela: "Começar grátis" vai direto para `/demo`. | M |
| B2 | Chegar ao primeiro exercício depois de 1 cartão, não de 2. No `unidade.yaml`, o conceito `string-aspas` passa a estrear em `u1-l1-e04`. | P |
| B3 | No resultado da lição, "Hoje você aprendeu" (os conceitos da lição) e "Na próxima: …". | P |
| B4 | Usar os mesmos nomes da meta em todo lugar: a introdução diz "Regular, 3 lições", o perfil diz "Firme, sessões". Trocar "sessões" por "estudos". | P |
| B5 | Explicar o XP na primeira vez ("pontos de estudo"). Na tela inicial, trocar "ler, prever e corrigir código" por algo mais simples. | P |

## C. Fim da lição e uso diário

| # | O quê | Esforço |
|---|---|---|
| C1 | **"Como foi esta lição?" antes do botão Continuar.** Hoje fica abaixo dele, fora da tela no celular, e quase ninguém vai ver. É a avaliação que substitui observar os amigos. | P |
| C2 | Botão "Próxima lição" no resultado. Hoje só existe Continuar, que volta à trilha. | P |
| C3 | "Algo errado nesta questão?" no erro, com 3 toques (minha resposta estava certa / enunciado confuso / outro), gravado e mostrado em `db:dificuldade`. | P–M |
| C4 | Corações, XP e o anel da meta no topo, tocáveis, cada um com sua explicação. | P |
| C5 | O nó "Revisão" da trilha começa a revisão direto, sem mandar para a aba Praticar. | P |
| C6 | Desafio do dia: parecer tocável (seta, "Jogar") e mostrar "feito hoje" com o placar. | P |
| C7 | Rodapé dos exercícios mais leve: Dica e Conceito como ícones, Verificar largo (hoje ocupa 40% da tela). | P |
| C8 | Barra de progresso que anda também nos cartões de conceito. | P |
| C9 | Aviso de "sem conexão" sem cara de erro: amarelo, sem faixa branca. | P |
| C10 | Arrumações: e-mail fora do topo do perfil; conquistas com progresso primeiro; "Meta do dia" duplicada no desktop; "Já tenho conta" vira link na tela inicial; aviso legal uma vez só; nó atual da trilha visível ao abrir. | P–M |

## D. Ferramentas novas

| # | O quê | Esforço |
|---|---|---|
| D1 | **Caderno de conceitos:** consultar qualquer cartão já visto, com o "Entenda melhor", fora da lição. Tem busca e é aberto pelo Praticar e pela trilha (como o guia do Duolingo). | M |
| D2 | **Tamanho do texto:** Normal, Grande ou Maior, em Preferências. O público tem de 30 a 60 anos. | P–M |
| D3 | **Lembrete na agenda do celular:** "Lembrar todo dia às 20h" cria o evento no Google Agenda ou no calendário do iPhone, sem servidor e sem e-mail. | M |
| D4 | **Meus erros recentes**, no Praticar, com a resposta certa, a explicação e "Refazer". | G |
| D5 | **Glossário:** palavras técnicas sublinhadas que explicam a si mesmas ao toque, mais a página "Palavras do Python". | M–G |

## E. Python de verdade ("digitar, apertar Enter e ver o resultado")

**Dá para fazer com segurança.** O código roda no celular do próprio aluno (Pyodide, o Python oficial compilado para o
navegador), dentro de uma caixa fechada: um worker num iframe isolado, sem acesso aos cookies do Sibi, à rede, ao
servidor, ao banco ou aos outros alunos. Loop infinito é cortado em poucos segundos. Os erros aparecem traduzidos.
"Só o que a lição permite" não é questão de segurança (a caixa resolve isso), mas é útil para o ensino: um aviso
amigável como "o `for` aparece na unidade 4". Pesa cerca de 7 MB na primeira vez, baixados só quando o aluno toca em
"Experimente"; depois fica guardado no aparelho.

| Etapa | Esforço |
|---|---|
| Protótipo com medição num Android simples | M |
| Caixa isolada (iframe sem `allow-same-origin`, CSP, sem `fetch`), com teste de que não alcança `/api` | M |
| Executor: tempo-limite, limite de saída, `input()` | M |
| Tradução de uns 15 erros comuns, com testes | M |
| Botão "Experimente" no cartão de conceito, depois de ver a saída, com barra de símbolos `( ) " : =` | G |
| Aviso pedagógico do que ainda não foi ensinado | M |
| Depois: exercício "rode e mude um número" e console `>>>` livre | G |

## Ordem recomendada

1. **Antes do teste com amigos:** A (cartão e "Entenda melhor"), B (pegar pela mão) e C (fim da lição e uso diário). São cerca de 1,5 dia.
2. **Logo depois:** o caderno de conceitos (D1) e o tamanho do texto (D2).
3. **Em seguida:** Python de verdade (E), uns 3 a 4 dias até a primeira versão no cartão de conceito.
4. **Quando houver dados do teste:** D3 a D5.
