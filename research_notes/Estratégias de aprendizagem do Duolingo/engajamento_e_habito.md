# Mecânicas de engajamento e hábito do Duolingo: o que foi publicado, o que foi medido e como adaptar ao Sibi

Notas de pesquisa (nov/2026). Fontes primárias: paper KDD 2020, blog.duolingo.com, cartas aos acionistas (SEC EDGAR) e o artigo de Jorge Mazal no Lenny's Newsletter, escrito em primeira pessoa por quem liderou o crescimento. Fontes secundárias (imprensa, resumos, wikis) estão marcadas **[secundária]**. Todo número vem com o ano.

---

## 1. Notificações: o bandit de Yancey & Settles (KDD 2020), o texto do Duo e os lembretes por e-mail

### Takeaway
O algoritmo de lembretes diários é o resultado mais bem documentado do Duolingo. É um bandit que escolhe *qual texto* enviar, sem mexer na quantidade de envios. Ele penaliza modelos de texto que o usuário viu recentemente e trata cada modelo como elegível só para alguns usuários. O ganho foi pequeno no DAU total (+0,5%) e grande na retenção de usuários novos (+2%). A regra da empresa era "proteger o canal": melhorar texto e horário sem aumentar o volume de envios.

### Cited Findings
- **Paper:** "A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications", Kevin P. Yancey e Burr Settles (Duolingo), KDD 2020 (agosto de 2020, evento virtual), DOI 10.1145/3394486.3403351. O método se chama **Recovering Difference Softmax Algorithm** e escolhe o modelo de texto de "milhões de lembretes diários". — [Paper (PDF)](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Resultado principal (2020):** "+0,5% no total de usuários ativos diários (DAUs) e +2% na retenção de usuários novos, sobre uma linha de base forte". — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Teste A/B online (Tabela 8, após duas semanas, 2020):**
  - DAU +0,5%\* e total de lições concluídas +0,4%\*.
  - Retenção D1 de usuários existentes +0,5%\*; D7 de usuários existentes +0,2% (não significativo).
  - Retenção D1 de usuários novos +2,2%\*; D7 de usuários novos +2,0%\*.
  - \* = p < 0,05.
  - O texto extraído do PDF embaralha as colunas da tabela. A ordem acima é a mais coerente com o texto do paper, que cita "DAU e lições +0,5% e +0,4%" e "retenção de novos +2%".
  - Os autores esperavam de +0,5% a +1,5% no DAU. A atividade orgânica (lições feitas sem notificação) dilui o efeito. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Interpretação dos autores:** usuários novos seriam mais sensíveis a essa otimização porque "ainda estão estabelecendo rotinas habituais". — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Holdout cinco meses depois (2020):** 95% dos envios usaram a política do bandit e 5% usaram escolha aleatória uniforme. A política teve **recompensa 2,5% maior** que o holdout. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Recompensa:** binária. Conta como sucesso se o usuário completar uma lição **até 2 horas** depois do lembrete. A conversão média ficou em torno de 0,13. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **"Sleeping" (elegibilidade):** cada modelo tem critérios próprios. Exemplos da Tabela 1:
  - "You're on fire / Continue your 109 day Spanish streak on Duolingo" exige ofensiva de 3+ dias.
  - "You're on day 2 of your 7-day streak wager! Now get to day 3!" exige ter feito uma aposta de ofensiva.
  - "Ready for your trip? Take 5 minutes to practice Italian now" exige que o perfil indique motivação de viagem.
  - Comparar médias brutas engana: um modelo pode parecer pior (-0,37%) porque só é elegível para usuários piores, quando entre os elegíveis é melhor (+1,48%).
  - Por isso, o score do bandit é a diferença relativa entre a recompensa quando o modelo foi escolhido e quando não foi, *entre os elegíveis*, corrigida por importance sampling. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **"Recovering" (efeito novidade):** "testes A/B anteriores no Duolingo que introduziam modelos novos tendiam a aumentar a conversão, mesmo quando esses modelos não eram melhores no longo prazo."
  - Solução: penalidade de recência com decaimento exponencial, inspirado na curva de esquecimento de Ebbinghaus. A fórmula é s_a,t = s_a − γ·0,5^(d/h), com **meia-vida h = 15 dias** e γ ≈ 0,017.
  - Reusar sempre o último modelo **piora a recompensa em 0,5%**. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **Detalhes offline (2020):**
  - Tratar cada par modelo + idioma da interface como um braço separado rendeu +1,8%, contra +1,2% com um braço por modelo. Os textos eram traduzidos para 25 idiomas de interface.
  - Somar a penalidade de recência levou a +1,9%.
  - O softmax com temperatura 0,0025 manteve mais de 90% do ganho e ainda explorou. — [Paper](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- **"Proteger o canal" (Mazal, ~2022):** nenhum aumento no volume de notificações sem aprovação do CEO. Os ganhos vieram de horário, modelos, texto e do bandit. O artigo não traz percentuais por experimento de push. — [Lenny's Newsletter, Jorge Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **Primeiro grande ganho de ofensiva (Mazal, ~2022):** a notificação "streak saver", um aviso tarde da noite para quem ainda não praticou e vai perder a ofensiva. O artigo não dá número. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)

### Inferences
- O ganho de +2% na retenção de novos indica que, para um app jovem, otimizar o lembrete importa mais na **primeira semana**.
- O efeito novidade sugere variar o texto. Repetir o mesmo lembrete todo dia desgasta.
- A regra "proteger o canal" é diretamente aplicável: no máximo um lembrete por dia, e o lembrete é o mais personalizado possível (ofensiva atual, motivo declarado, "5 minutos").
- **Para o Sibi:**
  - Não há push. Num PWA, o Web Push funciona no Android e no desktop. No iOS, só funciona com o app instalado na tela inicial, a partir do iOS 16.4 (conhecimento geral, não verificado nesta pesquisa).
  - O e-mail diário (Resend ou Supabase) é o canal de lembrete mais viável e universal.
  - Com menos de 100 usuários, não há volume para um bandit: ~0,13 de conversão × dezenas de envios/dia não dá significância em meses. Basta uma rotação simples de 5 a 10 modelos em PT-BR, sem repetir o último modelo enviado, com elegibilidade por estado (ofensiva ≥ 3, dia livre disponível, perto da meta).
  - Registrar "lição até 2 horas depois do envio" desde já, para ter dados quando houver escala.

### Gaps
- **Horário do lembrete:** o Duolingo é conhecido por enviar perto do horário em que o usuário costuma estudar. Não encontrei fonte primária com essa regra nem com o efeito do horário. O paper otimiza só o *conteúdo*.
- **E-mail:** não encontrei resultados publicados de experimentos com lembretes por e-mail.
- **Tom do Duo** ("passivo-agressivo", memes da coruja): não achei fonte primária com o efeito medido. Só há cobertura de imprensa e marketing, não consultada a fundo.
- O texto do PDF embaralha as colunas da Tabela 8. A atribuição exata do +0,5% e do +0,2% às linhas de retenção de usuários existentes tem alguma incerteza.

---

## 2. Ofensivas (streaks), proteção de ofensiva (streak freeze), amuleto de fim de semana, aposta de ofensiva e recuperação de ofensiva perdida

### Takeaway
A ofensiva é a principal alavanca de retenção do Duolingo. Foram mais de 600 experimentos com ela em cerca de 4 anos (dado de dez/2024). A participação de usuários com ofensiva de 7+ dias quase triplicou e passou de metade do DAU. Mecânicas de flexibilidade (proteção, amuleto) e de compromisso (aposta) tiveram efeitos medidos positivos. Em jun/2026, um evento único de recuperação de ofensiva perdida reativou 15,4 milhões de pessoas.

### Cited Findings
- **Aposta de ofensiva (Streak Wager, A/B, publicado em mai/2017):** o usuário aposta moeda do jogo que manterá a ofensiva por mais 7 dias e, se conseguir, dobra o valor. Retenção D1, D7 e D14 subiu com significância. O maior efeito foi no **D7: +14%**. — [Blog Duolingo, Kai Herng Loh, 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals)
- **Amuleto de fim de semana (Weekend Amulet, A/B, 2017):** item equipável na sexta que mantém a ofensiva no sábado e no domingo sem uso. Quem recebeu a oferta teve **+4% de chance de voltar uma semana depois** e **-5% de chance de perder a ofensiva**. No mesmo texto: o DAU de fim de semana cai **5% a 10%**. — [Blog Duolingo, 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals)
  - O amuleto foi descontinuado por volta de 2021/2022. — **[secundária]** [Duolingo Fandom Wiki](https://duolingo.fandom.com/wiki/Shop/Streak_freeze)
- **Proteção de ofensiva (blog, jan/2022):** permitir até **2 proteções equipadas** deu **+0,38% em usuários ativos diários**, e "não levou os usuários a tirar mais dias de folga". — [Blog Duolingo, "How the Duolingo streak builds habit", 2022](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- **Animações de extensão de ofensiva** (com animações especiais nos marcos, 2022): **+1,7%** na probabilidade de um usuário novo ainda usar o app 7 dias depois. — [Blog Duolingo, 2022](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- **Correlação (2022):** quem chega a uma ofensiva de 7 dias tem **3,6 vezes mais chance de concluir o curso**. Havia "mais de 6 milhões de pessoas com ofensiva de 7+ dias" na época. — [Blog Duolingo, 2022](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- **Princípios citados no blog (2022):**
  - Consistência no mesmo contexto torna o ato automático.
  - A ofensiva é mensurável e visível.
  - No começo, ela motiva pelo progresso (de 2 para 3 dias é +50%). Depois, motiva pela aversão à perda.
  - A flexibilidade ("folga") motiva mais que regras rígidas, citando um estudo de UPenn e UCLA.
  - O feedback da extensão deve ser o mais satisfatório possível. — [Blog Duolingo, 2022](https://blog.duolingo.com/how-duolingo-streak-builds-habit/)
- **Mazal (~2022):**
  - A fração do DAU com ofensiva de 7+ dias **quase triplicou**, chegando a **mais de metade do DAU**.
  - Usuários que chegam a uma ofensiva de 10 dias têm evasão muito menor (ele reconhece que é em parte correlação).
  - O "streak saver" foi o primeiro grande ganho.
  - Proteções, visão de calendário, animações e recompensas de ofensiva melhoraram a retenção, sem números. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **Jackson Shuttleworth, Group PM de Retenção (podcast Lenny, dez/2024):**
  - **"600+ experimentos"** com ofensiva em cerca de 4 anos.
  - "A retenção é mais frágil nos primeiros sete dias."
  - Mudar o botão de "continuar" para "comprometer-me com minha meta" aumentou a retenção "significativamente".
  - Deixar o usuário escolher a duração da ofensiva-meta também aumentou "significativamente".
  - Nenhum percentual foi divulgado. — [Lenny's Podcast, "Behind the product: Duolingo streaks", 2024](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks)
- **Streak Revival (jun/2026, carta do 2º trimestre de 2026, SEC):** evento único em que quem optasse e completasse **3 lições** recuperava a maior ofensiva que já teve. **15,4 milhões** de pessoas recuperaram ofensivas, incluindo **quase 8 milhões sem ofensiva ativa** no início. A empresa chamou de "uma das nossas campanhas mais bem-sucedidas" e listou o evento como um dos três fatores da aceleração do DAU no trimestre. — [Carta aos acionistas, 2º tri 2026 (SEC 8-K)](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
  - Detalhe de cobertura: a regra valia para ofensivas perdidas de 30+ dias e restaurava só a maior. — **[secundária]** [Android Authority](https://androidauthority.com/duolingo-revive-broken-streak-event-3673004/)
  - Atenção: um resultado de busca agregado datou o evento em 2025. A carta do 2º tri de 2026 confirma **junho de 2026**.

### Inferences
- O Sibi já tem as duas peças de maior efeito barato: ofensiva com calendário e "dia livre", com limite de 2 igual ao do Duolingo.
- Os próximos passos com evidência são:
  1. Celebração animada ao estender a ofensiva, com marcos em 3, 7, 14 e 30 dias (+1,7% D7 em novos).
  2. Compromisso explícito no fim da primeira lição: "Vou estudar 7 dias seguidos", com escolha da meta. É uma versão sem moeda da aposta (+14% D7) e da escolha de duração do podcast.
  3. Um "amuleto de fim de semana" ou modo fim de semana. Para adultos que estudam no horário de trabalho, a queda de 5% a 10% no fim de semana é plausível.
  4. Recuperar ofensiva fazendo trabalho: "complete 3 lições para recuperar sua ofensiva perdida". Isso funciona mesmo com dezenas de usuários, porque não depende de escala.
- Não monetizar a recuperação (o Duolingo cobra gemas no Streak Repair) evita o que críticos chamam de "deceptive design".

### Gaps
- Não encontrei números públicos de Streak Society, Perfect Streak, Friend Streak ou widget de iOS.
- Não encontrei número oficial e datado de usuários com ofensiva de 365+ dias. Um agregador cita "5+ milhões", sem fonte primária localizada.
- Os percentuais do podcast de 2024 não foram divulgados.

---

## 3. Ligas e placares semanais (Leaderboards/Leagues)

### Takeaway
As ligas foram testadas a partir de 2018 e são um dos poucos experimentos que o Duolingo descreve como fora da curva. O tempo total de aprendizagem subiu 17% e os usuários altamente engajados triplicaram. Mas elas dependem de grupos de cerca de 30 pessoas com hábitos parecidos, formados toda semana. Não servem para menos de 100 usuários.

### Cited Findings
- **Efeito (Mazal, ~2022):**
  - Tempo total de aprendizagem **+17%**.
  - Aprendizes altamente engajados (≥ 1 hora/dia, 5 dias/semana) **triplicaram**.
  - Retenção tradicional (D1, D7) melhorou com significância.
  - Na mesma série, um "contador de movimentos" ao estilo Gardenscapes foi neutro, e um programa de indicação deu +3% em novos usuários. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **Conflito de números:** Luis von Ahn é citado dizendo que os placares aumentaram o tempo no app "em 20%". Outro estudo de caso confunde o número com "DAU +17%". — **[secundárias]** [Deconstructor of Fun, 2025](https://www.deconstructoroffun.com/blog/2025/4/14/duolingo-how-the-15b-app-uses-gaming-principles-to-supercharge-dau-growth); [Blitzllama](https://www.blitzllama.com/blog/duolingo-product-management-lessons). O número primário mais confiável é o **+17% de tempo de aprendizagem** de Mazal.
- **Funcionamento (blog, mai/2023):**
  - **10 ligas** (as primeiras versões tinham 5), com Diamante no topo.
  - Nova liga **todo domingo**, no fuso do usuário.
  - O pareamento junta pessoas com "hábitos de estudo parecidos" e fuso próximo, de qualquer curso.
  - Os 10 primeiros do Diamante podem disputar um Torneio de 3 fases.
  - Atividade irregular (farm de XP) é removida.
  - Para sair, é preciso desligar "perfil público" nas configurações web.
  - O texto não informa o tamanho do grupo. — [Blog Duolingo, "Duolingo Leagues", 2023](https://blog.duolingo.com/duolingo-leagues-leaderboards/)
- **Tamanho do grupo:** cerca de **30 usuários** por grupo semanal, com promoção e rebaixamento. A versão vencedora (4ª iteração) seria *opt-out*. — **[secundária]** [Deconstructor of Fun, mecânica Leagues](https://duolingo.deconstructoroffun.com/mechanics/leagues); [resumo do artigo de Mazal](https://edwardize.blogspot.com/2024/04/the-secret-to-duolingos-growth.html)
- **Ajuste posterior (blog, jun/2024):** a métrica TSLW levou a aumentar o XP das lições da trilha, para que subir no placar exija avançar em conteúdo novo e não "farmar" XP repetindo lições. — [Blog Duolingo, "Time spent learning well", 2024](https://blog.duolingo.com/time-spent-learning-well)

### Inferences
- **Para o Sibi agora (menos de 100 usuários, teste com amigos): não fazer ligas.**
  - Com 30 por grupo e pareamento por hábito, seriam 1 a 3 grupos heterogêneos, e o último colocado se desmotiva.
  - Alternativa de esforço pequeno: um **placar de amigos/turma opt-in**, ou um "placar da semana" entre quem fez o desafio diário compartilhável. Isso dá o empurrão social sem rebaixamento.
- **Em escala (milhares de DAU):** ligas semanais de ~30 por fuso e por faixa de XP, com XP ponderado por conteúdo novo. Isso evita o erro que o Duolingo teve de corrigir em 2024.
- Para adultos iniciantes, a competição pode afastar uma parte do público. O próprio Duolingo descreve as ligas como algo que funcionou "para muitos", não para todos. Por isso, mantê-las opt-out.

### Gaps
- Não encontrei post primário do Duolingo com a data exata de lançamento global nem com o tamanho do grupo (o 30 vem de fontes secundárias).
- Não encontrei dados públicos sobre a taxa de opt-out.

---

## 4. XP, multiplicadores de XP, missões diárias, missões com amigos, vidas e "energia"

### Takeaway
O Duolingo passou a calibrar XP, missões e desafios por uma métrica de aprendizagem (TSLW), não por volume bruto. Em 2025, substituiu as vidas (punição por erro) pela energia (custo por uso, recarga por acertos seguidos). Os primeiros resultados no iOS mostraram alta simultânea de DAU, tempo de aprendizagem e conversão em assinatura.

### Cited Findings
- **TSLW (blog, jun/2024):**
  - Fórmula aproximada: TSLW = minutos na trilha + 0,5 × minutos em outras lições.
  - Objetivo declarado: aumentar a fração de usuários com **pelo menos 15 min/dia**.
  - "Total de sessões" foi descartada porque premiava sessões curtas e fáceis. "Tempo total" foi descartada porque é dominada por poucos usuários muito ativos. — [Blog Duolingo, 2024](https://blog.duolingo.com/time-spent-learning-well)
- **Mudanças guiadas pelo TSLW (2024):**
  - Missões diárias ficam progressivamente mais difíceis e favorecem avançar (terminar unidade, ler a próxima história).
  - O Desafio Mensal passou de XP para missões, para que o usuário volte todo dia em vez de farmar XP no fim do mês.
  - O rebalanceamento do XP da trilha deu cerca de **+1,1 milhão de minutos/dia** (parcial) e **+1,8 milhão de minutos/dia** (completo).
  - "Lições mais curtas pioraram o TSLW." "Adicionar conteúdo novo à trilha sempre teve impacto positivo."
  - Um estudo independente achou que "o número de lições concluídas foi o preditor mais forte de ganho de aprendizagem". — [Blog Duolingo, 2024](https://blog.duolingo.com/time-spent-learning-well)
- **Energia no lugar de vidas (carta do 2º tri de 2025):**
  - Para usuários gratuitos. Cada exercício gasta 1 unidade, acertando ou errando, e a energia volta com acertos seguidos.
  - No iOS, aumentou **DAU, tempo de aprendizagem e conversão em assinatura**. A empresa disse que "raramente vemos uma funcionalidade mover mais de uma dessas métricas, quanto mais as três".
  - A carta chamou o resultado de "iteração inicial". — Fonte primária: [carta do 2º tri de 2025](https://investors.duolingo.com/static-files/0b55110c-2eb9-466d-8549-5459e0851290). Essa URL retornou 403 nesta pesquisa; o conteúdo veio do resumo da busca, então trate como **parcialmente verificado**.
  - Detalhes de imprensa: barra de **25 unidades** (contra 5 vidas); rollout em mais de 50% do DAU de iOS, Android depois; energia ilimitada para Super e Max. — **[secundária]** [Fintool, 2º tri 2025](https://fintool.com/app/research/companies/DUOL/earnings/Q2%202025); [edtechinnovationhub](https://edtechinnovationhub.com/news/duolingo-rides-ai-momentum-with-fastest-course-launch-and-40-dau-growth-in-q2)
- **Indicação (Mazal, ~2022):** +3% em usuários novos, um resultado "positivo, mas não uma virada". — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)

### Inferences
- **Vidas no Sibi:** o Duolingo trocou a punição por erro por custo de uso porque as vidas punem justamente o iniciante que erra. Para adultos aprendendo Python, errar é parte do aprendizado.
  - Recomendação (esforço pequeno): suavizar as vidas da lição principal. Exemplos: recuperar 1 vida ao acertar 3 seguidas; não bloquear, e sim oferecer "revisar o erro" para recuperar.
  - O Sibi não monetiza, então a função de "pacing" da energia não é necessária. O que vale copiar é recompensar acertos em vez de punir erros.
- **XP e missões:** pesar mais o XP de lição nova que o de revisão repetida, no espírito do TSLW. Uma ou duas missões diárias simples ("complete 1 lição nova", "acerte 5 seguidas", "revise 1 erro antigo") reforçam a meta diária que já existe. Esforço médio.
- **Missões com amigos:** só fazem sentido com um grafo social. No teste com amigos, uma missão em dupla via link de convite é viável, mas sem evidência numérica publicada.
- Duplicar o XP por tempo limitado ("XP boost") não tem efeito publicado encontrado. Prioridade baixa.

### Gaps
- Não encontrei resultados publicados de Missões Diárias (lançadas ~2022), Missões com Amigos ou XP Boost.
- Não encontrei o post de racional original das vidas.
- Não verifiquei se o Duolingo divulgou atualizações sobre a energia depois do 2º tri de 2025 (Android, 2026).

---

## 5. Crescimento: modelo de estados de usuário, CURR e as alavancas que moveram o DAU (Mazal, cartas aos acionistas 2021–2026)

### Takeaway
O Duolingo dividiu os usuários em estados mutuamente exclusivos e simulou qual taxa movia mais o DAU. A retenção de usuários correntes (CURR) teve impacto cerca de 5 vezes maior que a segunda alavanca. Daí veio o foco em ofensivas, ligas e notificações, que levou a 4,5 vezes mais DAU em 4 anos. Em 2026, a CURR é métrica oficial nas cartas e bateu recorde de 84%.

### Cited Findings
- **Estados (Mazal, ~2022):**
  - Novo: primeiro dia.
  - Corrente: ativo hoje e em pelo menos 1 dos 6 dias anteriores.
  - Reativado: volta após 7 a 29 dias.
  - Ressuscitado: volta após 30+ dias.
  - Em risco WAU, em risco MAU e dormente (31+ dias inativo).
  - Novo + corrente + reativado + ressuscitado = DAU. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **Simulação (~2022):** mover cada taxa 2% por trimestre durante 3 anos mostrou que a CURR tinha impacto no DAU **~5 vezes** maior que a segunda alavanca, a reativação de WAU inativo (iWAURR). — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **Resultado (~2018–2022):**
  - Em meados de 2018, o DAU crescia em um dígito ao ano.
  - Em 4 anos, o DAU cresceu **4,5 vezes**.
  - A CURR subiu **21%**, o que cortou a evasão diária dos melhores usuários em **mais de 40%**. — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- **CURR oficial (carta do 2º tri de 2026, SEC):**
  - Definição: fração dos "DAUs correntes" (ativos em pelo menos 1 dos 7 dias anteriores) que voltam no dia seguinte.
  - Recorde de **84%**, cerca de 1 ponto acima do ano anterior. "Pequenas melhorias na CURR se compõem em grandes ganhos de DAU."
  - DAU de **58,7 milhões** (+23% ao ano) e MAU de **140,6 milhões** (+10%).
  - DAU/MAU calculado nestas notas: ~41,8%, contra ~37,2% no 2º tri de 2025. — [Carta 2º tri 2026 (SEC)](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)
- **4º tri de 2025:** DAU de 52,7 milhões (+30% ao ano, contra 40,5 milhões) e MAU de 133,1 milhões. Meta de médio prazo: **100 milhões de DAU em 2028**, com a estratégia priorizando crescimento de usuários. — [Carta 4º tri 2025](https://investors.duolingo.com/static-files/961ce633-3cee-49d0-bd7a-2c63731d45fb) (403 nesta pesquisa; números via resumo de busca, parcialmente verificado)
  - Analistas atribuíram a desaceleração de 2025 a mais anúncios e mais pressão de venda de assinatura. — **[secundária]** [Zacks via MetaTrader](https://www.metatrader.com/de/news/1358885-duolingos-100m-dau-blueprint-sacrificing-margins-for-scalability)
- **2026:** a aceleração do DAU no 2º tri foi atribuída a mudanças de produto, marketing e Streak Revival. A margem de EBITDA ajustado caiu de 31,2% para 25,9%, por "escolha deliberada de investir em crescimento de usuários". — [Carta 2º tri 2026 (SEC)](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- **Para o Sibi:** com menos de 100 usuários, a CURR é calculável e é a melhor métrica-norte, com esforço pequeno.
  - Uma consulta SQL diária classifica cada usuário em novo, corrente, reativado, ressuscitado ou em risco. Ela pode entrar no `npm run db:vigilancia` ou num script irmão.
  - Com N pequeno a métrica será ruidosa. Use média móvel de 7 dias e acompanhe as **contagens absolutas** de quem caiu de "corrente" para "em risco".
- **A lição estratégica:** com base pequena, o que move o DAU é manter os correntes, não captar mais. Isso favorece investir em ofensiva, lembrete e primeira semana antes de ligas ou indicação.
- **Monetização contra crescimento:** a desaceleração de 2025 sugere não introduzir fricção (anúncios, paywall nas vidas) enquanto o objetivo for formar hábito.

### Gaps
- O artigo de Mazal não dá anos exatos para o 4,5 vezes (o período é cerca de 2018 a 2022) e não detalha os efeitos de cada experimento de notificação.
- A CURR trimestral de 2021 a 2025 não foi levantada aqui.
- A data exata de publicação do artigo de Mazal não foi confirmada na leitura (é de ~2022).

---

## 6. Cultura de testes A/B

### Takeaway
Tudo passa por teste A/B. Um experimento típico move cerca de 1%, então resultados de dois dígitos (ligas) são excepcionais. Novidades sobem no curto prazo e somem no longo, o que exige holdouts.

### Cited Findings
- "600+ experimentos" só com ofensiva em cerca de 4 anos (2024). — [Lenny's Podcast, 2024](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks)
- O sistema de notificações já tinha sido "otimizado por anos de testes A/B" antes do bandit, o que tornava a linha de base forte. O efeito novidade foi descoberto em A/Bs de modelos de texto. Foi usado um holdout de 5% por 5 meses. — [Paper KDD 2020](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- Experimentos neutros também são relatados: o contador de movimentos (neutro) e a indicação (+3%). — [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth)
- Um experimento típico move cerca de 1%, contra os 17% das ligas. — **[secundária]** [resumo do artigo de Mazal](https://edwardize.blogspot.com/2024/04/the-secret-to-duolingos-growth.html)
- "Green Machine" (2026): testar "centenas de mudanças", medir e "dobrar a aposta no que funciona". — [Carta 2º tri 2026 (SEC)](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm)

### Inferences
- **Com menos de 100 usuários, A/B não tem poder estatístico.** Efeitos de 0,4% a 14% exigiriam milhares a milhões de usuários.
- Para o Sibi, o substituto é:
  - Adotar mecânicas *já validadas* pelo Duolingo, que funcionam como evidência emprestada.
  - Instrumentar eventos (lição concluída, ofensiva estendida ou quebrada, dia livre usado, lembrete enviado ou aberto).
  - Fazer entrevistas qualitativas com os amigos.
  - Comparar antes e depois de cada lançamento, sabendo que é fraco como causalidade.
- Ligar flags de feature por usuário (esforço pequeno) prepara o A/B para quando houver escala.

### Gaps
- Não encontrei número oficial do total de experimentos por ano em toda a empresa.

---

## 7. Duração da sessão e lições curtas

### Takeaway
A promessa do Duolingo é "5 minutos" (aparece literalmente no texto dos lembretes). Mas os dados de 2024 mostram que encurtar lições piorou o tempo de aprendizagem efetivo. O objetivo é ter mais usuários com 15+ min/dia, não sessões minúsculas.

### Cited Findings
- Exemplo de lembrete: "Take 5 minutes to practice Italian now" (2020). — [Paper KDD 2020](https://research.duolingo.com/papers/yancey.kdd20.pdf)
- "Lições mais curtas pioraram o TSLW." A meta é a fração de usuários com 15+ min/dia (2024). — [Blog Duolingo, 2024](https://blog.duolingo.com/time-spent-learning-well)
- "Número de lições concluídas foi o preditor mais forte de ganho de aprendizagem" (estudo citado em 2024). — [Blog Duolingo, 2024](https://blog.duolingo.com/time-spent-learning-well)
- Quem faz maratonas de lições tem mais chance de desistir do que quem se cadencia. Esse foi o racional do amuleto de fim de semana. — [Blog Duolingo, 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals) (descrito no resumo da busca; o texto exato não foi confirmado na leitura)

### Inferences
- O formato de 5 minutos do Sibi está alinhado com a *entrada* do hábito.
- A meta diária de 1 a 3 sessões já é o mecanismo certo para estender o tempo sem alongar cada sessão. Não encurte as lições abaixo de 5 minutos.
- O convite "mais uma?" depois da meta cumprida deve ser leve e sem pressão.

### Gaps
- Não encontrei post primário dedicado ao racional de "lições curtas" nem a experimentos com a duração da lição, além da frase do TSLW.

---

## 8. Adaptações para o Sibi: esforço, prioridade e escala

### Takeaway
Para um teste com amigos de menos de 100 usuários, o maior retorno vem de quatro itens baratos e independentes de escala, apoiados em evidência primária:

1. Um lembrete diário por e-mail (e Web Push no PWA) com texto variado e elegibilidade por estado.
2. Celebração animada da ofensiva, com marcos.
3. Compromisso explícito de 7 dias na primeira sessão.
4. Recuperar ofensiva perdida com trabalho.

Ligas, bandit e A/B ficam para quando houver escala.

### Cited Findings
Cada linha vem com sua evidência de origem, já citada nas seções acima.

| # | Mecânica Duolingo (evidência) | Adaptação concreta para o Sibi | Esforço | Prioridade | Escala |
|---|---|---|---|---|---|
| 1 | Lembrete diário otimizado (+0,5% DAU, +2% retenção de novos, 2020) e "streak saver" (o primeiro grande ganho de ofensiva) — [KDD](https://research.duolingo.com/papers/yancey.kdd20.pdf), [Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) | E-mail diário opt-in no horário escolhido pelo usuário. Um segundo aviso "sua ofensiva vai acabar" à noite, só se não estudou e não tem dia livre. Pool de 6 a 10 modelos em PT-BR com elegibilidade (ofensiva ≥ 3, motivo declarado), sem repetir o último. Registrar se houve lição até 2 horas depois. Web Push depois (iOS só com o PWA instalado) | Médio | **Alta** | Funciona já |
| 2 | Animações de ofensiva (+1,7% D7 em novos, 2022) — [Blog](https://blog.duolingo.com/how-duolingo-streak-builds-habit/) | Tela de celebração ao estender a ofensiva, com marcos em 3, 7, 14, 30, 50 e 100 dias. Pode virar conquista entre as 18 existentes | Pequeno | **Alta** | Funciona já |
| 3 | Aposta de ofensiva (+14% D7, 2017) e escolha da duração com texto de compromisso (2024) — [Blog 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals), [Podcast](https://www.lennysnewsletter.com/p/behind-the-product-duolingo-streaks) | No fim da 1ª sessão: "Qual seu compromisso? 3 / 7 / 14 dias", com botão "Me comprometo". Ao cumprir, ganha 1 dia livre extra (respeitando o máximo de 2) ou uma conquista | Pequeno | **Alta** | Funciona já |
| 4 | Streak Revival (15,4 milhões recuperaram, jun/2026) — [Carta 2º tri 2026](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm) | "Recupere sua ofensiva": quem perdeu uma ofensiva de 7+ dias há até 7 dias pode recuperá-la completando 3 sessões em 1 a 2 dias. Também serve como e-mail de reativação | Pequeno a médio | **Alta** | Funciona já, porque mira justamente quem saiu |
| 5 | Proteção de ofensiva (+0,38% DAU, 2022) | **Já existe** (dia livre, máximo 2). Possível ajuste: mostrar no calendário os dias salvos por dia livre e avisar por e-mail quando um foi usado | Pequeno | Média | Já |
| 6 | Amuleto de fim de semana (+4% de volta em 1 semana, -5% de ofensivas perdidas, 2017) — [Blog 2017](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals) | Opção "modo dias úteis": a ofensiva conta só de segunda a sexta, ou um "passe de fim de semana" ganho ao cumprir a meta 5 dias na semana. Combina com adultos que estudam no trabalho | Pequeno a médio | Média | Já |
| 7 | CURR e modelo de estados (CURR ~5 vezes a 2ª alavanca; 84% em 2026) — [Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth), [SEC](https://www.sec.gov/Archives/edgar/data/0001562088/000162828026053299/q2fy26duolingo6-30x26share.htm) | Script SQL diário (junto do `db:vigilancia`) com contagem por estado (novo, corrente, reativado, ressuscitado, em risco) e CURR em média de 7 dias | Pequeno | **Alta** (instrumentação) | Funciona já; ganha significado com escala |
| 8 | Energia no lugar de vidas (DAU, tempo e conversão subiram, 2025) — [Carta 2º tri 2025](https://investors.duolingo.com/static-files/0b55110c-2eb9-466d-8549-5459e0851290) | Suavizar as vidas: recuperar 1 vida a cada 3 acertos seguidos, ou ao revisar o erro. Nunca bloquear a lição de um iniciante | Pequeno | Média | Já |
| 9 | XP e missões guiados por TSLW (+1,1 a 1,8 milhão de min/dia, 2024) — [Blog](https://blog.duolingo.com/time-spent-learning-well) | XP maior para lição nova que para revisão repetida. 1 a 2 missões diárias ligadas à trilha. Desafio mensal por dias com meta cumprida, não por XP acumulado | Médio | Média-baixa | Já, com valor modesto |
| 10 | Ligas (+17% tempo de aprendizagem, 3 vezes mais usuários superengajados, ~2019–2022) — [Mazal](https://www.lennysnewsletter.com/p/how-duolingo-reignited-user-growth) | **Agora:** placar semanal opt-in entre amigos ou convidados do desafio diário, sem rebaixamento. **Em escala** (mais de 1.000 DAU): ligas de ~30 por fuso e faixa de XP, opt-out, XP ponderado por conteúdo novo | Pequeno (amigos) / Grande (ligas) | Baixa agora | Ligas só em escala |
| 11 | Bandit de notificações (KDD 2020) | Adiar. Com menos de 100 usuários, não há sinal. Basta rotação com penalidade de "não repetir o último" | Grande | Baixa | Só em escala (milhares de envios/dia) |
| 12 | Cultura de A/B (600+ experimentos com ofensiva) | Flags por usuário e eventos instrumentados agora. A/B de verdade só com escala. Enquanto isso, entrevistas e antes/depois | Pequeno (flags) | Média | A/B só em escala |
| 13 | Indicação (+3% em novos, ~2019–2022) | O desafio diário compartilhável já cumpre esse papel. Possível "convide um amigo e ganhe 1 dia livre" | Pequeno | Baixa | Já, com efeito pequeno |

### Inferences
- **Ordem sugerida para o teste com amigos:** 7 (medir), depois 2 e 3 (baratos, primeira semana), depois 1 (canal de volta), depois 4 e 6, depois 8.
- A primeira semana é onde o Duolingo concentra o esforço ("a retenção é mais frágil nos primeiros sete dias"; +2% em novos com o bandit; +1,7% D7 com animações; +14% D7 com a aposta). Itens 1 a 3 atacam exatamente essa janela.
- O ponto de atenção ético e de tom: o Duolingo cobra a reparação de ofensiva e usa culpa nos lembretes. Para adultos iniciantes em programação, o Sibi tende a funcionar melhor com tom encorajador e recuperação por esforço. Isso é inferência, sem dado comparativo.

### Gaps
- Nenhum dos efeitos do Duolingo foi medido em adultos aprendendo programação nem em PWA sem push. A transferência para o Sibi é inferência.
- O suporte a Web Push no iOS (16.4+, só com o PWA instalado) é conhecimento geral, não verificado nesta pesquisa.
