# Ciência da aprendizagem publicada pelo Duolingo: repetição espaçada, personalização da dificuldade e eficácia medida

Notas de pesquisa, novembro de 2026. As fontes primárias são artigos (ACL, NAACL/BEA, Foreign Language Annals), relatórios técnicos do Duolingo (DRR) e posts oficiais em blog.duolingo.com. Quando uma afirmação vem de imprensa ou de crítico externo, isso está marcado como **[secundária]**. As adaptações para o Sibi ficam na subseção "Inferências" de cada pergunta. Elas são propostas minhas, não achados das fontes.

Contexto do Sibi usado nas adaptações: app web em português que ensina Python a adultos iniciantes. As lições duram 5 minutos por dia. Os exercícios são: escolher a saída, preencher a lacuna, ordenar blocos, achar a linha do erro e digitar a saída. O app já tem revisão espaçada simples por conceito, mapa de domínio e cartões de conceito antes de cada conceito novo.

---

## 1. Half-Life Regression (Settles & Meeder, ACL 2016)

### Takeaway
A HLR é uma curva de esquecimento exponencial cuja meia-vida é aprendida por regressão a partir de contadores de acertos e erros de cada aluno em cada palavra. Nos logs históricos, ela reduziu o erro de previsão (MAE) em cerca de 45% ou mais em relação ao Leitner. Em produção, a variante **sem** pesos por palavra (HLR -lex) aumentou significativamente o retorno diário, com +12% em "qualquer atividade". A lição mais transferível: pesos por item superajustaram e frustraram usuários, enquanto contadores simples de histórico generalizaram melhor.

### Cited Findings
- **Referência:** Burr Settles e Brendan Meeder, "A Trainable Spaced Repetition Model for Language Learning", ACL 2016, pp. 1848-1858. — [ACL Anthology P16-1174](https://aclanthology.org/P16-1174/); listado em [research.duolingo.com](https://research.duolingo.com/)
- **Modelo:** a probabilidade de lembrar é p = 2^(-Δ/h), sendo Δ o tempo desde a última prática e h a meia-vida. A meia-vida estimada é ĥ = 2^(Θ·x), com x um vetor de atributos. Se Δ = h, p = 0,5. O artigo mostra que Pimsleur e Leitner são casos especiais dessa fórmula, com pesos fixos escolhidos à mão. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Função de perda:** erro quadrático em p mais um termo de erro quadrático na meia-vida, com regularização L2. A meia-vida "observada" vem de h = -Δ/log2(p). O treino é por gradiente descendente com α = 0,01, λ = 0,1 e taxa de aprendizado 0,001. Sem o termo de meia-vida (variante "-h"), o MAE "mais que dobra". — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Unidade de dado:** cada instância é uma sessão (lição ou prática) de um aluno com uma palavra. p é a proporção de vezes que a palavra foi lembrada corretamente naquela sessão, por exemplo 3/4. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Atributos:** (a) de interação: total de vezes que o aluno viu a palavra, acertos e erros. A raiz quadrada dos contadores funcionou melhor que os valores brutos. (b) de lexema: cerca de 20 mil indicadores esparsos, um por palavra/lexema, para capturar a dificuldade intrínseca. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Dados:** duas semanas de logs do Duolingo, com **12,9 milhões** de traços aluno-palavra de todos os cursos. Divisão 90% treino e 10% teste. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Resultados offline (Tabela 2, MAE / AUC / correlação de meia-vida):** HLR 0,128 / 0,538 / 0,201. HLR -lex 0,128 / 0,537 / 0,160. HLR -h 0,350 / 0,528 / -0,143. Leitner 0,235 / 0,542 / -0,098. Pimsleur 0,445 / 0,510 / -0,132. Só as duas HLR com termo de meia-vida ficaram abaixo do MAE de uma previsão constante pela média. O Leitner teve a maior AUC por pouco. As AUCs são baixas porque a tarefa é ruidosa e a taxa de recordação é alta. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Pesos aprendidos:** cognatos e palavras comuns, curtas ou morfologicamente simples receberam pesos positivos (meia-vida maior). Formas irregulares, palavras raras, particípios e aspecto imperfectivo receberam pesos negativos. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Experimento I em produção (HLR contra Leitner):** 6 semanas, pouco menos de 1 milhão de alunos. O algoritmo controlava as barras de força das habilidades e a escolha de palavras para prática. Resultado: +0,3% em qualquer atividade (não significativo), +0,3% em lições e **-7,3% em sessões de prática** (significativo). Os autores interpretaram a queda como positiva: antes, alunos praticavam "só para manter a árvore dourada", e a prática não revisava o que eles achavam que precisavam. Com o novo modelo, praticar deixou de ser necessário só para recompor barras que decaíam sem motivo. A HLR foi lançada para todos. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Experimento II (HLR -lex contra HLR):** meses depois, alunos ativos reclamaram que certas palavras decaíam rapidamente "por mais que praticassem". A causa eram pesos de lexema muito negativos, um superajuste apesar da regularização L2. Além disso, cursos novos não tinham dados para treinar esses pesos (*cold start*). Num teste de 2 semanas com **3,3 milhões** de alunos, a HLR -lex teve aumentos significativos em retorno diário: **+12,0% em qualquer atividade, +1,7% em lições e +9,5% em prática**. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- Os autores acreditam que a HLR -lex é "ao menos parcialmente responsável" pelo crescimento consistente de 5% ao mês em usuários ativos depois do lançamento. É uma afirmação correlacional dos próprios autores. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf)
- **Código e dados abertos:** o artigo aponta para https://github.com/duolingo/halflife-regression. O research.duolingo.com lista o "half-life regression spaced repetition dataset" na seção Data & Tools. — [Settles & Meeder 2016, PDF](https://aclanthology.org/P16-1174.pdf); [research.duolingo.com](https://research.duolingo.com/)
- **Uso atual:** o Duolingo diz que as "lições de prática personalizada" usam repetição espaçada junto com acurácia para escolher palavras e gramática a revisar. Os erros de uma lição são revistos no fim da mesma lição, para aproveitar "um pouco de repetição espaçada" (post de Elizabeth Onstwedder, 26/12/2023). O post não diz se o modelo ainda é a HLR. — [Duolingo Blog, 2023](https://blog.duolingo.com/spaced-repetition-for-learning)

### Inferências
- **Adaptação para o Sibi: meia-vida por conceito (aluno × conceito).** Trocar o intervalo fixo atual por ĥ = 2^(θ0 + θ1·√acertos + θ2·√erros) e agendar a revisão quando p̂ = 2^(-Δ/ĥ) cair abaixo de um limiar. O limiar de 0,5 é o que o artigo usa para ilustrar. Pesos iniciais podem ser escolhidos à mão para imitar o comportamento atual, já que o Leitner é um caso especial. Esforço **pequeno**. Prioridade **alta**: substitui o agendamento atual sem mudar a interface.
- **Registrar desde já o trio (p, Δ, x) por sessão e conceito.** p é a fração de acertos no conceito naquela sessão, Δ são os dias desde a última vez e x são os contadores. Sem isso, nunca haverá como ajustar Θ. Esforço **pequeno** (uma tabela no Supabase). Prioridade **alta**.
- **Não usar pesos por conceito ou por exercício enquanto a base de alunos for pequena.** O Duolingo superajustou esses pesos com 12,9 milhões de instâncias. O Sibi tem ordens de grandeza menos dados. Uma alternativa é um único atributo de "dificuldade do conceito" definido à mão (por exemplo `for` com `range` mais difícil que `print`), com regularização forte. Esforço pequeno. Prioridade média.
- **O mapa de domínio deve refletir o que o aluno lembra, não esconder decaimento.** O caso do "manter a árvore dourada" mostra que barras de força mal calibradas geram prática inútil e reclamação. Se o mapa de domínio do Sibi decai, o decaimento deve vir do p̂ do modelo, e a sessão de revisão deve atacar justamente os conceitos com menor p̂.
- Ajustar Θ por gradiente com os dados do próprio Sibi vira uma tarefa **média** quando houver alguns milhares de sessões de revisão. O repositório aberto serve de referência de implementação.

### Gaps
- Não verifiquei o conteúdo atual do repositório no GitHub, a licença nem o local exato de hospedagem do dataset (o artigo cita só o GitHub).
- Não encontrei publicação oficial dizendo se a HLR ainda roda em produção ou foi substituída. O post de 2023 fala de "spacing + accuracy" sem nomear o modelo.
- Não extraí os números da regressão logística (LR) da Tabela 2.

---

## 2. Birdbrain: estimativa de dificuldade do exercício e habilidade do aluno (2020-2023)

### Takeaway
O Birdbrain V1 (2020) é uma regressão logística inspirada em IRT que generaliza o Elo. A previsão de acerto é função da habilidade do aluno menos a dificuldade do exercício, e a dificuldade é uma soma de atributos como tipo de exercício e palavras. Os dois parâmetros são atualizados por um passo de SGD a cada resposta. O V2 (maio de 2022) usa uma LSTM com estado de 40 dimensões. O Duolingo afirma que os testes A/B aumentaram de forma consistente as métricas de engajamento e de aprendizagem, mas **nunca publicou tamanhos de efeito**.

### Cited Findings
- **Post oficial de lançamento:** "Learning how to help you learn: introducing Birdbrain", por Klinton Bicknell e Claire Brust, 7/10/2020. O Birdbrain estima quanto o aluno sabe e quão difícil é cada material, e combina as duas estimativas para prever se o aluno acertará um exercício. A personalização de lições começou em março de 2020: cerca de 5% das lições em julho e **mais de 20%** em outubro de 2020. — [Duolingo Blog, 2020](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain)
- **Mecânica de atualização (oficial):** a cada exercício o sistema atualiza as duas estimativas. Um erro reduz a estimativa de habilidade do aluno e aumenta a de dificuldade do exercício. — [Duolingo Blog, 2020](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain)
- **Sem números (oficial):** o post diz que construir lições na dificuldade certa "consistentemente" ajudou os alunos a aprender mais e que os alunos com lições do Birdbrain fizeram mais lições e voltaram mais no dia seguinte. Não informa efeitos, amostras nem valores de p. — [Duolingo Blog, 2020](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain)
- **Detalhes técnicos (artigo assinado por Bicknell, Brust e Settles, todos do Duolingo, IEEE Spectrum, fev. 2023):**
  - V1: regressão logística inspirada em IRT, P(acerto) = f(habilidade - dificuldade). A dificuldade do exercício é a soma de seus atributos (tipo de exercício, palavras de vocabulário). Cada resposta gera um passo de SGD, apresentado como generalização do Elo. No início, os parâmetros eram atualizados uma vez a cada 24 horas, durante a noite. — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
  - Antes de ir ao ar, o V1 rodou em **modo sombra**: as previsões eram registradas, mas não usadas. — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
  - V2: LSTM que comprime o histórico do aluno num vetor de habilidade de **40 dimensões**. Atualiza minutos depois de cada exercício, em streaming durante a lição, porque cerca de **20% das lições iniciadas não são concluídas**. Captura padrões como "vai bem no passado, mal no futuro". Substituiu o V1 em **maio de 2022**. — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
  - Métricas dos testes A/B: tempo na tarefa (engajamento) e velocidade de avanço para material mais difícil (aprendizagem). O V1 "consistentemente" aumentou as duas, e o V2 aumentou ainda mais. Nenhum número foi publicado. — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
- **Sistema anterior [secundária]:** antes do Birdbrain, a dificuldade era estimada por heurísticas, como o número de palavras ou caracteres da frase. — resumo de busca de [VentureBeat](https://venturebeat.com/ai/how-duolingo-uses-ai-in-every-part-of-its-app). Não li o artigo completo.
- **Conflito de números [secundária]:** a VentureBeat teria citado 12% das sessões personalizadas, contra "mais de 20%" no blog oficial. A diferença deve vir de datas diferentes. Prefira o número oficial. — [VentureBeat](https://venturebeat.com/ai/how-duolingo-uses-ai-in-every-part-of-its-app) contra [Duolingo Blog, 2020](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain)
- **Whitepaper "The Duolingo Method" (Cassie Freeman):** cita o Birdbrain como o modelo de aluno que ajusta a dificuldade de cada lição. Só achei uma cópia no Scribd, com texto fragmentado e data não verificada. — [Scribd, cópia não oficial](https://www.scribd.com/document/684747885/duolingo-method-whitepaper)
- **Fundamento em aprendizagem (oficial):** a dificuldade "bem na borda do que você sabe" leva a mais engajamento e melhor aprendizagem, segundo Freeman. Não cita estudo específico. — [Duolingo Blog, 2023](https://blog.duolingo.com/duolingo-teaching-method)
- **Trabalho relacionado do Duolingo:** "Jump-Starting Item Parameters for Adaptive Language Tests" (McCarthy, Yancey, LaFlair, Egbert, Liao, Settles, EMNLP 2021) trata de estimar parâmetros de itens novos sem dados de resposta (*cold start* de itens, no contexto do DET). — [research.duolingo.com](https://research.duolingo.com/). Não li o artigo.

### Inferências
- **Adaptação para o Sibi: um "Birdbrain V1" mínimo (Elo/Rasch).** P(acerto na 1ª tentativa) = σ(θ_aluno - b_exercício), com b_exercício = b_tipo + b_conceito + b_item, e atualização Elo depois de cada primeira tentativa: θ += K·(y - p̂), b -= K·(y - p̂). Usar só a primeira tentativa, porque retentativas depois de feedback medem outra coisa. Esforço **médio**. Prioridade **alta**, porque também entrega um painel de calibração de conteúdo.
- **Usar primeiro como ferramenta de autoria, em modo sombra, como fez o Duolingo.** Calcular b_item com os dados existentes e listar os exercícios com acerto na 1ª tentativa muito alto (triviais) ou muito baixo (talvez ambíguos ou mal redigidos). "Achar a linha do erro" e "digitar a saída" devem sair naturalmente com b_tipo maior. Esforço **pequeno** (consulta SQL mais relatório). Prioridade **alta**.
- **Selecionar exercícios por probabilidade prevista.** Na lição de 5 minutos, escolher entre variantes do mesmo conceito aquela com p̂ perto de um alvo. O Duolingo não publicou valor numérico. Qualquer alvo, como 70-85%, seria hipótese a testar, não achado do Duolingo. Esforço médio. Prioridade média, depois do modo sombra.
- **Lições abandonadas também contam.** Gravar cada resposta na hora, não só no fim da lição. A justificativa do V2 (20% das lições não terminam) vale ainda mais para iniciantes adultos no celular.
- Uma LSTM como a do V2 é desproporcional para o volume do Sibi. Esforço **grande** e prioridade **baixa**. A parte útil do V2 é a ideia de habilidade multidimensional, que o Sibi consegue com um θ por unidade ou conceito em vez de um θ global.

### Gaps
- Não há números publicados de A/B do Birdbrain (nem de aprendizagem, nem de retenção) em fonte oficial.
- O "alvo" de probabilidade de acerto usado pelo Session Generator não foi publicado.
- Não achei artigo revisado por pares específico do Birdbrain. A descrição técnica mais detalhada é o texto dos próprios autores na IEEE Spectrum.

---

## 3. Geração de sessões, prática personalizada, Practice Hub e revisão de erros

### Takeaway
O "Session Generator" monta cada lição a partir de um grande conjunto de exercícios candidatos, usando as previsões do Birdbrain. As lições incluem revisão de palavras e conceitos errados recentemente. Os erros da própria lição voltam no fim dela, e há níveis de prática intercalados no caminho e uma aba de prática com revisão de erros. Os únicos efeitos quantificados publicamente sobre prática são os da HLR em 2016. Sobre o Practice Hub e a revisão de erros, o Duolingo publicou descrições de produto, não resultados.

### Cited Findings
- O Session Generator monta lições a partir de um grande conjunto de exercícios candidatos com "um algoritmo sofisticado" (sem detalhes). O Birdbrain informa quais exercícios estão na dificuldade certa para cada aluno. — [Duolingo Blog, 2020](https://blog.duolingo.com/learning-how-to-help-you-learn-introducing-birdbrain)
- As lições são calibradas ao nível do aluno e incluem revisão de palavras e conceitos errados recentemente. O objetivo é manter o aluno engajado "aprendendo na borda de suas habilidades". — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
- Os erros cometidos numa lição são revistos **no fim da própria lição**, de propósito, para ter um pequeno intervalo de espaçamento. As lições de prática personalizada escolhem o que revisar por espaçamento e acurácia. — [Duolingo Blog, dez. 2023](https://blog.duolingo.com/spaced-repetition-for-learning)
- A prática está embutida no novo caminho de aprendizagem: há níveis de prática colocados em pontos do caminho para revisar conceitos com regularidade. — resumo de busca do [Duolingo Blog, "ways to practice"](https://blog.duolingo.com/ways-to-practice-in-duolingo). Não li o post completo.
- **Practice Hub:** sessões especiais de prática de erros, combinação de vocabulário, histórias e lições só de fala, todas montadas a partir da atividade recente do aluno nas lições regulares. É recurso principalmente do plano Super. Fontes posteriores dizem que parte da prática, incluindo "Mistakes", ficou gratuita, e as fontes divergem sobre o que é gratuito. — [Duolingo Blog, guia do Practice Hub](https://blog.duolingo.com/guide-to-duolingo-practice-hub/), via resumo de busca; [feedbagel, secundária](https://feedbagel.com/post/duolingo-makes-practice-tab-free-for-all-language-learners)
- **Único A/B quantificado sobre prática:** a HLR contra o Leitner reduziu sessões de prática em 7,3%, e a HLR -lex contra a HLR aumentou a prática em 9,5% e qualquer atividade em 12%. Ver seção 1. — [Settles & Meeder 2016](https://aclanthology.org/P16-1174.pdf)
- **Notificações:** "A Sleeping, Recovering Bandit Algorithm for Optimizing Recurring Notifications" (K.P. Yancey e B. Settles, KDD 2020) otimiza lembretes recorrentes. Trata de engajamento, não de pedagogia. — [research.duolingo.com](https://research.duolingo.com/). Não li o artigo nem seus números.

### Inferências
- **Adaptação para o Sibi: reapresentar os erros no fim da lição.** O exercício errado ou uma variante do mesmo conceito volta no fim da lição de 5 minutos. É o mecanismo mais barato e com justificativa explícita do Duolingo. Esforço **pequeno**. Prioridade **alta**.
- **Composição fixa da lição de 5 minutos:** exercícios do conceito novo + 1 ou 2 itens dos conceitos com menor p̂ (seção 1) + os erros reapresentados no fim. Esforço **pequeno a médio**. Prioridade **alta**. É o "Session Generator" simplificado, que aproveita a revisão espaçada que o Sibi já tem.
- **"Nível de prática" a cada N lições no caminho:** sessões só de revisão de conceitos anteriores. Esforço **pequeno**. Prioridade média.
- **"Revisar meus erros" sob demanda**, com a lista de exercícios errados na 1ª tentativa nos últimos X dias. O Duolingo trata isso como recurso de valor, a ponto de ter sido pago. Esforço **pequeno**. Prioridade média.
- Usar o retorno no dia seguinte e as sessões de prática como métricas, como o Duolingo fez em 2016, mas desconfiar de "mais prática" como sinal de sucesso. Prática compulsiva para recompor uma barra que decaiu sem motivo é sintoma de modelo mal calibrado (seção 1).

### Gaps
- Não encontrei artigo técnico nem números de A/B sobre Session Generator, Practice Hub ou revisão de erros.
- Não verifiquei a disponibilidade atual (2026) desses recursos por plano.

---

## 4. "The Duolingo Method" e publicações sobre pedagogia (ensino implícito e explícito)

### Takeaway
O Duolingo descreve oficialmente seu método em cinco princípios: aprender fazendo, com padrões inferidos de exercícios que vão do simples ao difícil e explicações curtas opcionais; personalização por IA; foco no que importa, alinhado a CEFR e Common Core; motivação por hábito e gamificação; e diversão. O post-resumo não traz números. A produção acadêmica de pedagogia do research.duolingo.com é pequena e mais voltada a psicolinguística do que a experimentos de ensino.

### Cited Findings
- **Post oficial:** "The Duolingo Method: 5 key principles that make learning fun and effective", Cassie Freeman, Ph.D., 2/2/2023. — [Duolingo Blog, 2023](https://blog.duolingo.com/duolingo-teaching-method)
  1. **Interativo, aprender fazendo:** os exercícios começam simples para o aluno notar padrões (conjugação, ortografia) e avançam para aplicações mais difíceis. Dicas opcionais e explicações curtas servem de apoio.
  2. **Personalizado com IA:** ordem e dificuldade dos exercícios ajustadas por modelo. Sessões de prática focadas nas habilidades mais fracas.
  3. **Foco no que importa:** conteúdo guiado por CEFR e Common Core, mais a experiência de especialistas.
  4. **Motivação:** lições curtas, pontos, ofensivas (*streaks*) e competição com amigos para criar hábito.
  5. **Entreter e encantar:** personagens, humor e frases inusitadas, sob o argumento de que conteúdo engraçado é mais memorável.
  - O post não traz estatística nem tamanho de efeito. Cita genericamente "décadas de pesquisa" e "mais de uma década" estudando autodidatas. Aponta para um whitepaper e uma palestra da Duocon 2023. — [Duolingo Blog, 2023](https://blog.duolingo.com/duolingo-teaching-method)
- **Whitepaper "The Duolingo Method":** de Cassie Freeman et al. Descreve cinco pilares, cada um com a ciência da aprendizagem que o sustenta. Só encontrei cópia no Scribd. — [Scribd, não oficial](https://www.scribd.com/document/684747885/duolingo-method-whitepaper)
- **Implícito e explícito (oficial):** o Duolingo define aprendizagem explícita como instrução direta que diz ao aluno a regra ou o padrão, em oposição à aprendizagem implícita, por exposição e inferência. — resumo de busca do [Duolingo Blog, "what is implicit learning"](https://blog.duolingo.com/what-is-implicit-learning). Não li o post completo e não sei a data.
- **Artigos de ciência cognitiva da equipe (2015-2020), segundo a lista do research.duolingo.com:**
  - Pajak, Fine, Kleinschmidt e Jaeger, "Learning Additional Languages As Hierarchical Probabilistic Inference", *Language Learning*, 2016.
  - Markant, Settles e Gureckis, "Self-directed Learning Favors Local, Rather Than Global, Uncertainty", *Cognitive Science*, 2016.
  - Streeter, "Mixture Modeling of Individual Learning Curves", EDM 2015 (melhor artigo).
  - Portnoff, Gustafson, Rollinson e Bicknell, "Methods for Language Learning Assessment at Scale: Duolingo Case Study", EDM 2021.
  - McDowell e Goodman, "Learning from Omission", ACL 2019.
  - [research.duolingo.com](https://research.duolingo.com/). Não li esses artigos e cito só títulos, autores, veículos e anos.
- A página de pesquisa listava 21 publicações (2015-2021) e nenhuma é explicitamente sobre geração de sessões ou sobre experimentos de instrução implícita contra explícita. — [research.duolingo.com](https://research.duolingo.com/)

### Inferências
- **Adaptação para o Sibi: testar a ordem cartão de conceito → exercício contra exercício → cartão.** O Duolingo privilegia "notar o padrão fazendo", com explicação opcional. O Sibi mostra o cartão antes. Para Python e adultos sem base, a explicação prévia provavelmente é mais segura, mas dá para testar uma variante: começar com 1 ou 2 exercícios de "escolha a saída" muito fáceis e só depois mostrar o cartão. Esforço **pequeno** (uma flag por conceito). Prioridade **média**. Medir acerto na 1ª tentativa nos exercícios seguintes e a retenção em D+1.
- **Cartões curtos e consultáveis durante o exercício,** equivalentes às "dicas opcionais", em vez de um único cartão longo antes. Esforço pequeno. Prioridade média.
- **Progressão simples → aplicação em cada conceito:** primeiro "escolha a saída", depois "preencha a lacuna" e "ordene", e por fim "ache o erro" e "digite a saída". Isso já combina com o princípio 1 e com a dificuldade por tipo (seção 2).
- **Humor e exemplos inusitados** em português nos enunciados (variáveis com nomes engraçados) são baratos e estão alinhados ao princípio 5. A evidência de memorabilidade citada pelo Duolingo é genérica.

### Gaps
- Não obtive o whitepaper completo de fonte oficial nem as referências específicas por pilar.
- Não encontrei estudo publicado pelo Duolingo comparando experimentalmente instrução implícita e explícita no app.
- A lista de publicações de research.duolingo.com que li vai só até 2021. Pode haver publicações de 2022 a 2026 em outra página.

---

## 5. Estudos de eficácia (Vesselinov & Grego 2012; Jiang et al. 2020/2021; Duolingo Math)

### Takeaway
Os estudos medem proficiência **em um único momento** de alunos autosselecionados, quase sempre com ensino superior, e comparam com dados publicados de universitários americanos. Não são ensaios controlados com pré e pós-teste. Dizem que quem chega a certo ponto do curso tem leitura e audição comparáveis à de universitários do 4º ou 5º semestre. Os estudos mais recentes têm autores do Duolingo, e o de 2012 foi financiado pela empresa. Não achei estudo publicado de eficácia do Duolingo Math.

### Cited Findings
- **Vesselinov & Grego (2012), "Duolingo Effectiveness Study":** financiado pelo Duolingo, com coleta e análise descritas como independentes. Cerca de 8 semanas, de setembro a novembro de 2012, com voluntários recrutados por anúncio. Estimativa: **26 a 49 horas (média de 34)** de Duolingo para cobrir o conteúdo do 1º semestre universitário de espanhol. Ganho médio de 8,1 pontos por hora, com **mediana de 3,9** e desvio-padrão de 12,1. Os autores alertam que o resultado não se generaliza a outras línguas sem nova evidência. — [Scribd, cópia do relatório](https://www.scribd.com/doc/295554832/DuolingoReport-Final); cobertura de imprensa em [TechCrunch, 2013](https://techcrunch.com/2013/01/17/study-learning-spanish-with-duolingo-can-be-more-effective-than-college-classes-or-rosetta-stone/amp) **[secundária]**
- **Crítica ao estudo de 2012 [secundária]:** só cerca de 90 dos 156 voluntários completaram as 30 horas, 25% fizeram 8 horas ou menos, e não houve comparação direta com cursos universitários. — [Krashen, "research on Duolingo"](https://mail.sdkrashen.com/content/articles/research_on_duolingo.pdf), via resumo de busca
- **Jiang, Rollinson, Plonsky, Gustafson e Pajak (2021), "Evaluating the reading and listening outcomes of beginning-level Duolingo courses", *Foreign Language Annals* 54(4):974-1002, DOI 10.1111/flan.12600** (estudo de 2020). **n = 225** adultos nos EUA, com pouca ou nenhuma proficiência prévia, usando só o Duolingo e tendo concluído o nível iniciante de espanhol ou francês (5 unidades). Resultado na escala ACTFL: **Intermediate Low em leitura e Novice High em audição**, comparável a universitários no **fim do 4º semestre**. — [NAU Experts, registro do artigo](https://experts.nau.edu/en/publications/evaluating-the-reading-and-listening-outcomes-of-beginning-level-/); [press release do Duolingo](https://investors.duolingo.com/news-releases/news-release-details/leading-language-research-journal-publishes-study-showing)
- O blog oficial diz que os alunos chegaram a esse nível "em menos da metade do tempo" dos universitários. — resumo de busca de [Duolingo Blog, resultados de eficácia](https://blog.duolingo.com/results-duolingo-efficacy-studies) (não li na íntegra)
- **Relatório DRR-21-03 (11/11/2021), Jiang, Chen, Portnoff, Gustafson, Rollinson, Plonsky e Pajak, "Finishing half of B1 on Duolingo comparable to five university semesters in reading and listening":**
  - **n = 340** (208 de espanhol, o restante de francês), em 58 países. Pouca ou nenhuma proficiência prévia, autodeclarada de 0 a 2 numa escala de 0 a 10, e Duolingo como única ferramenta. Avaliados ao chegar ao fim da **Unidade 7**, metade do conteúdo de B1. — [DRR-21-03, PDF](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
  - Testes ACTFL de leitura e audição, aplicados online com supervisor remoto, com 15 trechos cada. Resultado: **Intermediate Mid/High em leitura e Intermediate Low em audição**. Espanhol (leitura e audição) e francês (audição) ficaram significativamente acima do 5º semestre universitário de Tschirner (2016). Francês (leitura) não diferiu do 5º semestre e ficou acima do 4º. — [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
  - **Mediana de 203 horas** para completar as 7 unidades, com grande variação individual. — [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
  - Perfil: idade média de 42 anos (espanhol) e 38 (francês), mais homens que mulheres, **87% com pelo menos bacharelado** (58% e 49% com pós-graduação). Mais de 80% estudavam por diversão. — [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
  - **Limitações declaradas pelos autores:** só há medição no fim, sem pré-teste. A proficiência prévia, a exposição externa e o uso exclusivo do Duolingo são autodeclarados. Só habilidades receptivas foram medidas. A comparação com universitários (20-22 anos, em tempo integral, possivelmente com anos de estudo no ensino básico ou herança linguística) "não deve ser interpretada como competição", e os resultados "não devem ser supergeneralizados". Os autores recomendam um desenho com pré e pós-teste. — [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
- **Fala:** estudo com 258 alunos testados na Unidade 5. O Duolingo relata habilidade oral "no nível esperado", e Jiang et al. (2021) relatam que mais da metade atingiu ou superou as expectativas curriculares em fala. — resumo de busca de [Duolingo Blog](https://blog.duolingo.com/how-well-does-duolingo-teach-speaking-skills); citado no [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)
- **Crítica metodológica [secundária, revista CALL-EJ]:** em Jiang et al. (2020), 90% do grupo Duolingo seria o grupo de controle do estudo principal. Mais de 80% dos participantes do grupo universitário viriam de três universidades (Michigan State, Utah e Minnesota), e a grande maioria dos usuários tinha diploma universitário. — [CALL-EJ](https://callej.org/index.php/journal/article/download/419/347/1013), via resumo de busca. Não verifiquei no texto completo.
- **Estudo independente (Cambridge/ReCALL):** com iniciantes de francês em três grupos (só sala de aula, só Duolingo e combinado), concluiu que sala de aula e Duolingo são comparavelmente eficazes. Outro estudo alemão de 2015, também independente, viu universitários superarem usuários do Duolingo. — resumo de busca de [Cambridge Core](https://www.cambridge.org/core/product/68C0E7E296669798089C84CDC7F3BB9E/core-reader). Não li e não confirmei autores nem anos.
- **Duolingo Math:** não encontrei estudo de eficácia publicado nem relatório DRR. Só há descrições de produto: currículo por série escolar, de aritmética a álgebra. Críticos falam em abordagem "superficial" **[secundária]**. Uma porta-voz disse que, ao identificar uma fraqueza, o app repete aqueles problemas até o aluno resolvê-los. — [The 74](https://www.the74million.org/article/duolingo-the-language-learning-app-giant-wants-to-teach-kids-math/); [The Register, 2021](https://www.theregister.com/2021/10/08/duolingo_maths/)

### Inferências
- **Adaptação para o Sibi: medir eficácia com desenho melhor que o do Duolingo.** Fazer pré-teste no onboarding (5 a 8 itens de "qual a saída?" cobrindo as unidades 1 a 4) e o mesmo teste, com itens paralelos, ao fim de cada unidade, ou depois de 30 dias para medir retenção. Assim se evita a principal limitação reconhecida pelos próprios autores. Esforço **médio**. Prioridade **média** (vira argumento de credibilidade e de produto).
- **Reportar a mediana, não só a média,** e o tempo até o marco, como o DRR faz com as 203 horas. O caso de 2012 (média de 8,1 contra mediana de 3,9) mostra como a média infla com poucos usuários extremos.
- **Cuidado com o viés de sobrevivência.** Todos os estudos medem quem chegou ao marco (Unidade 5 ou 7). No Sibi, qualquer número de "quem terminou a Unidade 4 sabe X" precisa vir junto com a taxa de chegada até lá.
- **Benchmark externo possível para Python:** comparar com itens equivalentes de provas introdutórias de programação, ou com problemas clássicos de leitura de código como rastrear um `for` com acumulador. Hipótese de projeto. Não há benchmark padronizado como o ACTFL para Python iniciante que eu tenha verificado.

### Gaps
- Não li o relatório de 2012 diretamente, só a cópia no Scribd via busca, e não confirmei o n final analisado.
- Não li o texto completo de Jiang et al. 2021 (tamanho do grupo de comparação, instrumentos exatos).
- Não encontrei estudo de eficácia do Duolingo Math nem de outros cursos fora de idiomas (por exemplo música) publicado até novembro de 2026.

---

## 6. SLAM 2018: shared task de modelagem de aquisição de segunda língua (rastreamento de conhecimento)

### Takeaway
O Duolingo abriu mais de 7 milhões de palavras produzidas por mais de 6 mil alunos de inglês, espanhol e francês em 30 dias, para prever **em que palavra (token) o aluno vai errar**. Quinze equipes participaram. Venceram modelos não lineares (RNN e conjuntos de GBDT, AUC de cerca de 0,86) e modelos multitarefa. Atributos de aluno e de tempo de resposta ajudaram, e atributos morfossintáticos atrapalharam. Atributos de repetição espaçada não deram ganho significativo com uma janela de só 30 dias.

### Cited Findings
- **Referência:** Burr Settles, Claire Brust, Erin Gustafson, Masato Hagiwara e Nitin Madnani, "Second Language Acquisition Modeling", 13º Workshop BEA, NAACL-HLT 2018, pp. 56-65, DOI 10.18653/v1/W18-0506. Corpus com mais de 7M de palavras e mais de 6 mil alunos de inglês, espanhol e francês. A tarefa é prever os erros futuros do aluno a partir do histórico de erros. **15 equipes**. — [ACL Anthology W18-0506](https://aclanthology.org/W18-0506/)
- **Métrica principal:** AUC, justificada por ser útil para priorizar palavras ou exercícios na revisão de cada aluno. F1 é a métrica secundária. — [Settles et al. 2018, PDF](https://aclanthology.org/W18-0506.pdf)
- **Melhores resultados (AUC / F1):** no inglês, SanaLabs 0,861 / 0,561 e singsound 0,861 / 0,559. No espanhol, SanaLabs 0,838 / 0,530. No francês, SanaLabs 0,857 / 0,573. Combinar os sistemas por *stacking* chegou a 0,867 / 0,844 / 0,863. — [Settles et al. 2018, PDF](https://aclanthology.org/W18-0506.pdf)
- **SanaLabs:** combinou previsões de RNN com um conjunto de GBDT. **NYU:** conjunto de GBDT com atributos inspirados em psicologia, incluindo motivação e diligência do usuário. **CECL:** regressão logística com muitas conjunções de atributos, o único modelo linear no top 5. — [Settles et al. 2018, PDF](https://aclanthology.org/W18-0506.pdf)
- **Análise de efeitos mistos (efeito sobre a AUC):** RNN +0,028 (p = 0,012), multitarefa +0,023 (p = 0,017), árvores de decisão +0,018 (p = 0,055) e modelo linear tipo IRT -0,006 (não significativo). — [Settles et al. 2018, PDF](https://aclanthology.org/W18-0506.pdf)
- **Atributos:** tempo de resposta +0,028 (significativo), dias no curso +0,023 (marginal), embeddings de palavra +0,020, ID do usuário +0,014 e atributos de repetição espaçada +0,013 (não significativo). Morfologia -0,021 e rótulos de dependência -0,011 tiveram efeito negativo, provavelmente por erros sistemáticos do parser automático. Os autores supõem que a janela de 30 dias foi curta demais para os atributos de espaçamento capturarem esquecimento de longo prazo. — [Settles et al. 2018, PDF](https://aclanthology.org/W18-0506.pdf)

### Inferências
- **Adaptação para o Sibi: rotular "componentes de conhecimento" por exercício.** Em vez de um só conceito por exercício, marcar os elementos de Python que ele exige (`print`, f-string, `range`, indexação, `+=`, `if`/`else`, `append`), como os "knowledge components" do artigo. Assim, um erro em "digite a saída" de um laço com acumulador atualiza `range` e `+=`, e não só "Unidade 4". Esforço **médio** (curadoria do conteúdo existente). Prioridade **média-alta**, porque melhora a seção 1 e a seção 2 ao mesmo tempo.
- **Registrar o tempo de resposta por exercício.** Foi o atributo com efeito significativo mais claro. Respostas certas mas muito lentas podem indicar domínio frágil e encurtar a meia-vida. Esforço **pequeno**. Prioridade **alta** (só registrar já tem valor).
- **Em "ache a linha do erro" e "ordene blocos", registrar qual linha ou ordem o aluno escolheu, não só se acertou.** Essa granularidade de token permite descobrir equívocos recorrentes (por exemplo, confundir `=` com `==`) e criar exercícios-alvo. Esforço pequeno. Prioridade média.
- Um modelo tipo IRT linear basta no início. O ganho dos modelos não lineares (cerca de 0,02-0,03 de AUC) só compensa com muito dado.

### Gaps
- Não verifiquei se o dataset do SLAM continua disponível para download nem sua licença.
- Não achei edições posteriores do shared task de SLA modeling. A shared task do Duolingo de 2020 foi sobre tradução e paráfrase (STAPLE), fora do escopo.

---

## 7. Síntese das adaptações para o Sibi (esforço e prioridade)

### Takeaway
As ideias mais baratas e mais bem fundamentadas são: (1) registrar dados no formato certo (primeira tentativa, tempo de resposta, Δ desde a última revisão); (2) reapresentar os erros no fim da lição; (3) calibrar a dificuldade dos exercícios a partir do acerto na 1ª tentativa, em modo sombra; e (4) trocar o intervalo fixo por uma meia-vida por conceito, sem pesos por item. Modelos neurais e A/B de grande escala estão fora do alcance com o volume atual.

### Cited Findings
- A HLR com só contadores de interação superou a versão com pesos por item em produção (+12% de retorno diário) e resolveu o *cold start* de cursos novos. — [Settles & Meeder 2016](https://aclanthology.org/P16-1174.pdf)
- O Birdbrain V1 é logístico/IRT com atualização tipo Elo, e rodou em modo sombra antes de ir ao ar. — [IEEE Spectrum, 2023](https://spectrum.ieee.org/duolingo)
- Os erros voltam no fim da lição, e a prática personalizada usa espaçamento mais acurácia. — [Duolingo Blog, 2023](https://blog.duolingo.com/spaced-repetition-for-learning)
- O tempo de resposta foi o atributo com efeito significativo no SLAM. — [Settles et al. 2018](https://aclanthology.org/W18-0506.pdf)
- Os próprios autores dos estudos de eficácia recomendam desenho com pré e pós-teste. — [DRR-21-03](https://duolingo-papers.s3.amazonaws.com/reports/Duolingo_whitepaper_language_read_listen_2021.pdf)

### Inferências
Tabela de priorização (propostas minhas, baseadas nos achados acima):

| # | Adaptação para o Sibi | Base no Duolingo | Esforço | Prioridade |
|---|---|---|---|---|
| 1 | Registrar por resposta: acerto na 1ª tentativa, tempo de resposta, opção escolhida, Δ desde a última exposição ao conceito | HLR (p, Δ, x); SLAM (tempo de resposta); Birdbrain V2 (streaming) | Pequeno | Alta |
| 2 | Reapresentar os erros (ou uma variante) no fim da lição de 5 minutos | Revisão de erros no fim da lição (blog 2023) | Pequeno | Alta |
| 3 | Relatório de calibração: dificuldade b por exercício e por tipo a partir do acerto na 1ª tentativa; sinalizar itens triviais ou ambíguos | Birdbrain V1 em modo sombra | Pequeno | Alta |
| 4 | Meia-vida por aluno × conceito: ĥ = 2^(θ·[1, √acertos, √erros]), revisão quando p̂ < limiar; pesos iniciais escolhidos à mão | HLR -lex | Pequeno-médio | Alta |
| 5 | Composição da lição: novo conceito + 1 ou 2 conceitos com menor p̂ + erros | Session Generator | Pequeno-médio | Alta |
| 6 | Elo/Rasch online (θ do aluno por unidade, b do exercício) para escolher variantes perto de um alvo de acerto, a definir por teste | Birdbrain V1 | Médio | Média |
| 7 | Componentes de conhecimento por exercício (elementos de Python) | SLAM | Médio | Média-alta |
| 8 | Níveis de prática no caminho e tela "revisar meus erros" | Practice levels e Practice Hub | Pequeno | Média |
| 9 | Experimento da ordem do cartão (antes ou depois de 1 ou 2 exercícios fáceis) e cartões como dica consultável | Duolingo Method, princípio 1 | Pequeno | Média |
| 10 | Pré e pós-teste de leitura de código para medir eficácia, reportando mediana e taxa de chegada | Limitações do DRR-21-03 e crítica a 2012 | Médio | Média |
| 11 | Ajustar Θ da HLR por gradiente com dados próprios (usando o repositório aberto como referência) | HLR | Médio | Baixa agora; alta com alguns milhares de revisões |
| 12 | Modelo de aluno neural (LSTM) | Birdbrain V2 | Grande | Baixa |

- Ordem sugerida: 1 → 3 → 2 → 4 → 5. Os itens 1 e 3 não mudam nada para o aluno e criam a base de dados para validar os demais.
- Com poucos usuários, os testes A/B do Sibi não terão o poder estatístico dos testes do Duolingo, que tinham de 1 a 3,3 milhões de alunos. Mudanças baseadas em evidência publicada (itens 2, 4 e 5) podem ser adotadas direto, sem A/B. O item 9 é o que mais pede teste, porque a evidência do Duolingo é genérica e de outro domínio.

### Gaps
- Nenhuma fonte do Duolingo trata de ensino de programação. Toda a transferência para Python é inferência.
- Faltam números oficiais de efeito do Birdbrain, do Session Generator e do Practice Hub. A única evidência quantitativa de A/B publicada sobre algoritmo pedagógico é a da HLR (2016).
