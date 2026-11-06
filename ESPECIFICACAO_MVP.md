# Especificação do MVP — aprendizagem de Python com experiência semelhante ao Duolingo

Data de início: 7 de outubro de 2026. Documento da etapa E01 do [plano de referência](PLANO_PRODUTO_E_ARQUITETURA.md#e01--especificação-do-mvp). Detalha as decisões do plano até o ponto em que seja possível desenhar e construir a primeira lição sem decisões implícitas.

| Tarefa | Seção | Situação |
| --- | --- | --- |
| E01.1 — Público, objetivo de aprendizagem e premissas | [1](#1-público-objetivo-de-aprendizagem-e-premissas) | Registrada |
| E01.2 — Inventário de funcionalidades do MVP | [2](#2-inventário-de-funcionalidades-do-mvp) | Registrada |
| E01.3 — Fluxos | [3](#3-fluxos) | Registrada |
| E01.4 — Regras de gamificação detalhadas | [4](#4-regras-de-gamificação) | Registrada |
| E01.5 — Critérios de aceitação | [5](#5-critérios-de-aceitação) | Registrada |
| E01.6 — Decisão de stack e limites do MVP | [6](#6-stack-e-limites-do-mvp) | Registrada |

## 1. Público, objetivo de aprendizagem e premissas

### 1.1 Público inicial

Pessoas que leem em português brasileiro e estão começando em programação: nunca programaram ou tiveram só contato superficial, como um vídeo ou tutorial abandonado. A conta é para maiores de 18 anos, por declaração no cadastro, sem verificação de documentos; a demonstração sem conta é aberta e não grava dados pessoais no servidor (PR-02, revisada em 6 de novembro de 2026). Linguagem e exemplos são pensados para adultos iniciantes.

Motivações esperadas: curiosidade, transição ou complemento de carreira, automatizar tarefas do trabalho e apoio a estudos. O produto não depende de uma motivação específica; os exemplos dos exercícios devem usar situações cotidianas e neutras, como compras, agenda, notas e mensagens.

Contexto de uso: sessões de 5 a 10 minutos, com conexão, em momentos curtos do dia. Espera-se uso predominante no celular, mas desktop é igualmente suportado.

Conhecimentos pressupostos:

- usar um navegador e criar uma conta com e-mail;
- ler textos curtos em português;
- aritmética básica: somar, subtrair, multiplicar, dividir e comparar números.

Não se pressupõe: inglês, instalação de programas, uso de terminal ou conhecimento de outra linguagem de programação. Palavras-chave do Python, como `print`, `if` e `else`, serão apresentadas com seu significado em português na primeira vez em que aparecerem.

Fora do público inicial:

| Grupo | Motivo |
| --- | --- |
| Turmas, professores e escolas | O MVP é uma experiência individual, como o Duolingo básico; não há papéis nem acompanhamento por terceiros |
| Quem já programa em outra linguagem | Pode usar o produto, mas o ritmo e as explicações não serão otimizados para essa pessoa |
| Preparação para certificação ou entrevista | Exige escrita de código livre e correção confiável, que não fazem parte do MVP |

### 1.2 Objetivo de aprendizagem

Objetivo geral: ao concluir as três unidades do MVP, o aluno consegue **ler, prever o resultado e corrigir programas curtos em Python**, com até cerca de dez linhas, que usam saída, variáveis, tipos básicos, operadores e decisões com `if`/`else`; e consegue **montar programas simples a partir de blocos**.

O MVP não ensina a escrever código livre, porque não terá editor nem execução de Python. A escrita de código começa na segunda entrega, com o editor no navegador. A comunicação do produto não deve prometer que o aluno "programa sozinho" ao final do MVP.

Objetivos observáveis por unidade:

| Unidade | Ao final, o aluno consegue |
| --- | --- |
| 1 — Primeiros comandos | Prever a saída de `print` com textos e números; distinguir um texto entre aspas de um nome de variável; prever o valor de uma variável após atribuições e reatribuições; ordenar comandos para produzir uma saída pedida |
| 2 — Valores e operações | Identificar `int`, `float`, `str` e `bool`; prever o resultado de `+`, `-`, `*`, `/`, `//`, `%` e `**`; juntar textos e converter valores com `str()`, `int()` e `float()`; reconhecer o erro de somar texto com número |
| 3 — Decisões | Prever o resultado de comparações e de `and`, `or` e `not`; prever qual ramo de um `if`/`else` executa; identificar erros de indentação e de `=` usado no lugar de `==` |

Esses objetivos orientam a escrita dos exercícios em E02 e E07. Detalhes de escopo, como incluir `elif` ou f-strings, serão decididos no detalhamento de cada unidade.

Fora do objetivo do MVP: `input()`, laços, listas, funções, tratamento de exceções, instalação local do Python e escrita de programas sem apoio de blocos. Esses temas estão nas entregas posteriores do plano.

Evidência de aprendizagem: acertar na primeira tentativa uma variação nova, em contexto diferente do exercício original, sem pedir dica. Acertos após erro ou após ver a explicação contam para progresso, mas não como evidência de aprendizagem. Metas numéricas serão definidas após a linha de base do beta, conforme a seção 16 do plano.

Versão de referência: Python 3.14, versão em que os exemplos da unidade 1 foram verificados em E02.6 ([registro](conteudo/unidade-1/UNIDADE.md#31-verificação-automática)).

### 1.3 Premissas adotadas

Cada premissa simplifica o MVP. Se uma delas deixar de valer, a coluna da direita indica o que precisa ser revisto.

| ID | Premissa | Se deixar de valer |
| --- | --- | --- |
| PR-01 | Equipe pequena, com um desenvolvedor principal que também conduz conteúdo e design, com apoio pontual | Revisar a estimativa de 8 a 12 semanas e a divisão de etapas |
| PR-02 | Conta só para maiores de 18 anos, declarado no cadastro; sem verificação de documentos; data de nascimento não é coletada; linguagem voltada a adultos iniciantes. Revisada em 6 de novembro de 2026: sem idade mínima, o Sibi pode ser considerado de acesso provável por adolescentes no ECA Digital (Lei 15.211/2025, em vigor desde 17 de março de 2026) | Abrir para menores de 18 exige cumprir o ECA Digital (supervisão parental e limite de tempo de uso, art. 17; contas de até 16 anos vinculadas à de um responsável, art. 24; configurações que evitem uso compulsivo, art. 8º, IV, o que alcança sequência e recompensas) e o art. 14 da LGPD |
| PR-03 | Conexão disponível durante as lições; falhas curtas são tratadas por reenvio | Planejar ensino offline e sincronização, hoje fora do escopo |
| PR-04 | Sem monetização, compras ou anúncios no primeiro lançamento | Incluir pagamentos, termos comerciais e regras de cristais com valor real |
| PR-05 | Primeira turma de 10 a 20 iniciantes convidados | Revisar capacidade, custos, suporte e moderação antes de abrir acesso |
| PR-06 | Um único idioma, português brasileiro | Planejar internacionalização de interface e conteúdo |
| PR-07 | Navegadores atuais em celular e desktop: Chrome, Safari, Edge e Firefox | Definir suporte a versões antigas e testar outros navegadores |
| PR-08 | Sem execução de Python no MVP; toda correção é objetiva e feita no servidor | Antecipar o experimento P01 e o isolamento de execução |
| PR-09 | Conta necessária para progresso durável; demonstração sem conta limitada a uma lição | Revisar armazenamento local, transferência de progresso e antifraude |
| PR-10 | Aparência e interações próximas da referência, com nome, mascote, ilustrações, sons e textos próprios | Revisar identidade visual e direitos de uso de qualquer elemento reaproveitado |
| PR-11 | Experiência individual, como o Duolingo básico: sem turmas, professores, escolas ou painéis de acompanhamento | Planejar papéis, painéis de acompanhamento e contratos institucionais |

### 1.4 Decisões confirmadas e pontos em aberto

Confirmado em 7 de outubro de 2026:

- não há idade mínima (PR-02). Revisto em 6 de novembro de 2026, por causa do ECA Digital: conta para maiores de 18 anos, aguardando a confirmação do responsável pelo produto;
- não há turmas nem professores; o MVP é o Duolingo básico, individual (PR-11).

Consequência de não haver idade mínima: menores de idade podem criar conta. Antes de abrir acesso público (E10), verificar com orientação jurídica as exigências da LGPD e do ECA Digital (Lei 15.211/2025) para produtos que podem ser usados por crianças e adolescentes. A atenção maior está nas funções sociais posteriores, como ligas e ranking, e nas mecânicas de engajamento. Isso não bloqueia E01 a E09, desde que o MVP continue coletando apenas os dados necessários para conta e progresso.

Resolvido em E02.6: Python 3.14 é a versão de referência dos exemplos.

## 2. Inventário de funcionalidades do MVP

### 2.1 Critério de inclusão

Entra no MVP o que é necessário para o ciclo básico: chegar, criar conta, estudar uma lição, receber feedback e recompensa, voltar em outro dia e revisar. O que apenas reforça esse ciclo fica para as entregas posteriores.

Os identificadores `F-xx` são estáveis. Fluxos (E01.3), regras (E01.4), critérios de aceitação (E01.5) e tarefas de implementação devem citá-los.

### 2.2 Funcionalidades do MVP

#### Entrada e conta

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-01 | Apresentação | Mascote, benefício direto, botão Começar, acesso à demonstração e ao login | — |
| F-02 | Demonstração anônima | Uma lição fixa, progresso local e XP apresentado como provisório | Outras lições sem conta |
| F-03 | Introdução | Nome, meta diária, explicação curta da trilha e sugestão de fuso pelo navegador | — |
| F-04 | Cadastro | E-mail e senha, aceite de termos de uso e política de privacidade, verificação de e-mail | Login social; verificação de idade |
| F-05 | Login, saída e recuperação de acesso | Sessão no servidor e redefinição de senha por e-mail | — |
| F-06 | Transferência da demonstração | Oferecida ao criar conta; respostas revalidadas no servidor; recompensa concedida uma única vez | Transferência a partir de outro dispositivo |

#### Trilha

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-07 | Trilha do curso | Três unidades com cinco lições cada, trilha sinuosa e lição atual destacada | Baús |
| F-08 | Estados e desbloqueio | Lições disponíveis, concluídas e bloqueadas; próxima lição liberada após a conclusão da anterior | Teste de nivelamento; pular lições |
| F-09 | Pontos de revisão | Acesso, pela trilha, às revisões recomendadas | — |

#### Lição e exercícios

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-10 | Sessão de lição | Um exercício por tela, progresso, corações visíveis, Verificar e Continuar, estados explícitos da sessão | — |
| F-11 | Escolher resultado | Prever a saída ou o valor entre alternativas | — |
| F-12 | Completar lacuna | Preencher lacunas escolhendo entre opções | Digitação livre |
| F-13 | Ordenar blocos | Ordenar por toque, arrastar ou teclado; ordens alternativas aceitas quando forem válidas | — |
| F-14 | Localizar erro | Selecionar a linha com erro | Corrigir o código digitando |
| F-15 | Correção no servidor | Gabarito privado, correção determinística e vinculada à versão do conteúdo | Execução de Python |
| F-16 | Feedback e dicas | Resultado com texto e ícone, explicação e dicas graduais registradas para a revisão | Tutor por IA |
| F-17 | Repetição dos erros | Itens errados voltam ao fim da sessão; o desempenho da primeira resposta é preservado | — |
| F-18 | Desafio final da unidade | Programa montado por etapas com os conceitos da unidade | Escrita livre de código |
| F-19 | Retomada | Reenvio com o mesmo identificador, recuperação após recarga e continuação em outro dispositivo | Uso offline |

#### Resultado e celebração

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-20 | Tela de resultado | XP confirmado pelo servidor, desempenho, sequência, meta do dia e próxima ação | Cristais |
| F-21 | Celebração e mascote | Estados de incentivo, comemoração, atenção e descanso, com animações que respeitam a redução de movimento | — |

#### Gamificação

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-22 | XP | Primeira conclusão e prática, com limite diário de sessões recompensadas | Ranking; ligas |
| F-23 | Corações | Cinco corações, perda na primeira resposta errada de cada item, pausa da trilha com saldo zero e recuperação por revisão | Recuperação paga ou por tempo |
| F-24 | Sequência diária | Mantida por uma sessão elegível no dia local do aluno | Proteção de sequência |
| F-25 | Meta diária | Uma, duas ou três sessões, separada da sequência | Missões diárias |
| F-26 | Conquistas | Primeira lição, primeira unidade e sete dias de sequência | Outras conquistas |

Os valores de cada regra estão na seção 8 do plano e serão detalhados em E01.4.

#### Praticar e revisão

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-27 | Tela Praticar | Revisões recomendadas e recuperação de corações | — |
| F-28 | Agenda de revisão por conceito | Repetição após cerca de 1, 3 e 7 dias, ajustada por acertos e dicas; estados iniciado, praticando e consolidando | Algoritmo adaptativo avançado |
| F-29 | Prática de lição concluída | Nova sessão sem recompensa de primeira conclusão; XP de prática dentro do limite diário | — |

#### Perfil e preferências

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-30 | Perfil | Progresso, conquistas, sequência e meta | Apelido público; foto; amigos |
| F-31 | Preferências | Meta diária, fuso horário confirmável e som ligado ou desligado | Preferências de notificação |
| F-32 | Dados pessoais | Exportação do histórico e exclusão da conta e dos dados | — |

#### Experiência transversal

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-33 | Layout responsivo | Desktop com menu, trilha e painel de metas; celular com uma coluna, indicadores no topo e navegação inferior; tela dedicada à lição | Aplicativo instalável (PWA) |
| F-34 | Acessibilidade | Teclado como alternativa a arrastar; feedback que não depende só de cor; redução de movimento conforme o sistema; teclado virtual validado no celular | — |
| F-35 | Estados de interface | Carregamento, erro, falta de conexão e retomada | — |
| F-36 | Sons | Sons próprios de acerto, erro e conclusão, desligáveis | — |

#### Conteúdo e operação

| ID | Funcionalidade | Inclui | Não inclui no MVP |
| --- | --- | --- | --- |
| F-37 | Autoria e publicação de conteúdo | Arquivos versionados no repositório, validados por esquema e publicados por um comando explícito | Painel de autoria |
| F-38 | E-mails de conta | Apenas verificação de e-mail e recuperação de acesso | Lembretes; comunicação de marketing |
| F-39 | Eventos e diagnóstico | Eventos mínimos de produto da seção 16 do plano e registro de erros sem dados pessoais desnecessários | Painel de análise próprio |
| F-40 | Ambientes e continuidade | Desenvolvimento, homologação e produção; pipeline de verificação; backup e restauração testada | — |

### 2.3 Entregas posteriores

| Funcionalidade | Entrega | Motivo |
| --- | --- | --- |
| Editor com CodeMirror e Python no navegador com Pyodide | Segunda | Depende do experimento P01 e dos critérios de P02 |
| Unidades de entrada de dados, laços, listas, funções e projetos curtos | Segunda | Exigem escrita de código e o editor |
| Cristais, baús e loja | Segunda | Moeda só faz sentido quando puder ser gasta |
| Proteção de sequência | Segunda | Depende da loja ou de outra moeda de troca |
| Missões diárias | Segunda | Reforçam o ciclo básico, mas não são necessárias para validá-lo |
| Ligas semanais e ranking com apelido | Terceira | Exigem base de usuários e revisão para o uso por menores (PR-02) |
| Painel de autoria | Terceira | Arquivos no repositório atendem à equipe do MVP (PR-01) |
| Notificações opcionais e lembretes, inclusive por e-mail | Terceira | O beta mede o retorno sem estímulo externo |
| Instalação como PWA | Terceira | O MVP valida o uso pelo navegador |
| Login social | Futuro | E-mail e senha bastam para o beta |
| Ensino offline | Futuro | Contraria PR-03 |
| Assinatura, compras e anúncios | Futuro | Contraria PR-04 |
| Tutor por IA | Futuro | Condicionado a necessidades comprovadas no uso |
| Correção remota de código | Futuro | Exige executor isolado separado do servidor web |
| Turmas, professores e escolas | Futuro | Contraria PR-11 |

### 2.4 Mudanças em relação ao plano de referência

| Decisão | Antes | Agora | Motivo |
| --- | --- | --- | --- |
| Cristais e baús | Acumulavam no MVP, sem uso até a loja | Entram na segunda entrega, junto com a loja | MVP menor e nenhuma moeda sem utilidade para o aluno |
| Lembretes | Não especificados; notificações na terceira entrega | Nenhum lembrete no MVP; e-mails só de conta | Medir o retorno espontâneo no beta e reduzir a operação de e-mails |

O livro de lançamentos de recompensas da seção 7 do plano continua igual: ele registra XP no MVP e poderá registrar cristais quando a loja chegar, sem mudar o modelo.

## 3. Fluxos

Cada fluxo tem um caminho principal e uma tabela de exceções. Valores numéricos de recompensas e limites são os da seção 8 do plano; seus casos de borda serão detalhados em E01.4. As decisões tomadas para fechar os fluxos estão reunidas em [3.8](#38-decisões-tomadas-nos-fluxos).

### 3.1 Estados da sessão de lição

Todos os fluxos de estudo usam os mesmos estados, definidos no servidor para a sessão e na interface para o exercício atual.

| Estado | Significado | Sai para |
| --- | --- | --- |
| Carregando | A sessão está sendo criada ou recuperada | Respondendo |
| Respondendo | O exercício atual aceita resposta; Verificar fica ativo quando a resposta está completa | Verificando |
| Verificando | A submissão foi enviada; botões ficam desabilitados | Feedback; Respondendo, se o envio falhar |
| Feedback | Resultado e explicação confirmados pelo servidor | Próxima questão; Pausada; Concluindo |
| Próxima questão | Transição para o próximo item da fila | Respondendo |
| Pausada | Sessão principal interrompida por falta de corações | Carregando, quando houver corações |
| Concluindo | Todos os itens resolvidos; conclusão enviada | Concluída; Concluindo, com reenvio, se falhar |
| Concluída | Resultado confirmado e exibido | — |

Sair da lição pelo botão de fechar não muda o estado no servidor: a sessão continua aberta e pode ser retomada.

### 3.2 FL-01 — Primeiro acesso e demonstração

Objetivo: permitir que a pessoa experimente uma lição antes de criar conta. Funcionalidades: F-01, F-02, F-03, F-10 a F-17, F-20.

1. A apresentação mostra o mascote, o benefício e dois caminhos: Começar e Já tenho conta. Já tenho conta segue para FL-02.
2. Começar abre a introdução: nome opcional, meta diária com uma sessão pré-selecionada e uma explicação curta da trilha. As escolhas ficam guardadas no navegador.
3. A demonstração inicia a lição 1 da unidade 1, na versão de conteúdo publicada naquele momento.
4. Cada resposta é corrigida pelo servidor em um endpoint anônimo, que não grava progresso e tem limite de frequência. O gabarito nunca vai para o navegador.
5. A demonstração não usa corações. Erros voltam ao fim da sessão, como na lição normal.
6. O progresso da demonstração fica no navegador: identificadores dos itens, versão do conteúdo, respostas e uso de dicas.
7. Ao concluir, a tela de resultado mostra o desempenho e o XP como provisório, com a chamada Criar conta para salvar. A alternativa Agora não leva à apresentação, preservando o resultado local.

| Situação | Comportamento |
| --- | --- |
| A pessoa fecha a página no meio da demonstração | Ao voltar no mesmo navegador, a demonstração continua do item em que parou |
| A pessoa volta depois de concluir a demonstração sem criar conta | A apresentação destaca Criar conta para salvar a lição concluída |
| Armazenamento do navegador indisponível ou apagado | A demonstração funciona até o fim, mas o resultado não pode ser transferido |
| Falha de conexão durante a correção | A resposta continua na tela e a pessoa pode tentar de novo |
| Nova versão da lição publicada durante a demonstração | A demonstração continua na versão em que começou |
| A pessoa tenta abrir outra lição sem conta | As demais lições aparecem bloqueadas, com convite para criar conta |

### 3.3 FL-02 — Cadastro, acesso e transferência da demonstração

Objetivo: criar a conta, entrar com segurança e levar para ela o resultado da demonstração. Funcionalidades: F-04, F-05, F-06, F-31, F-38.

Cadastro:

1. A pessoa informa e-mail e senha e aceita os termos de uso e a política de privacidade. O nome da introdução vem preenchido e pode ser alterado.
2. O servidor cria a conta e envia o e-mail de verificação. A tela seguinte pede para abrir o e-mail e permite reenviar o link.
3. O link de verificação confirma o e-mail e inicia a sessão no navegador em que foi aberto.
4. No primeiro acesso, o servidor salva nome e meta diária vindos da introdução e define o fuso sugerido pelo navegador, que pode ser alterado nas preferências.
5. Se houver demonstração concluída nesse navegador, aparece a oferta de transferência, descrita abaixo. Depois, o aluno vai para a trilha.

Login, recuperação e saída:

1. Login com e-mail e senha. Falhas mostram uma mensagem única de e-mail ou senha incorretos, sem revelar se o e-mail existe.
2. Esqueci a senha pede o e-mail e sempre responde com a mesma mensagem neutra. O link recebido permite definir uma nova senha e entra na conta.
3. Sair encerra a sessão no dispositivo atual e volta à apresentação.
4. Uma sessão de login expirada leva ao login; depois de entrar, o aluno volta à tela em que estava.

Transferência da demonstração:

1. A oferta aparece no primeiro login em que o navegador tem uma demonstração concluída e ainda não transferida.
2. Salvar envia as respostas guardadas. O servidor as corrige de novo com o gabarito da versão registrada.
3. Se todas forem válidas, o servidor registra a conclusão da lição 1 da unidade 1 com as recompensas normais de primeira conclusão, conta a atividade no dia local da transferência e desbloqueia a lição 2.
4. O resultado local é apagado depois da confirmação do servidor.

| Situação | Comportamento |
| --- | --- |
| E-mail já cadastrado | Mensagem neutra com caminho para login e recuperação de acesso |
| Link de verificação aberto em outro dispositivo | A conta é confirmada lá; a transferência acontece no próximo login no navegador que tem a demonstração |
| Link de verificação ou de nova senha expirado | Mensagem com opção de pedir um novo link |
| Login sem e-mail verificado | O login é recusado com opção de reenviar o link de verificação |
| A conta já concluiu a lição 1 | Não há transferência; a mensagem informa que a lição já está na conta e o resultado local é apagado |
| Revalidação falha | Nada é registrado; a lição 1 fica disponível na conta e o resultado local é apagado |
| A pessoa recusa a transferência | O resultado local é apagado e a lição 1 fica disponível |
| Demonstração iniciada e não concluída | Não há transferência; o resultado local é apagado no primeiro login |
| Falha de conexão durante a transferência | A oferta reaparece no próximo acesso; o servidor processa a transferência uma única vez |

### 3.4 FL-03 — Estudo de uma lição

Objetivo: estudar uma lição nova, com correção, feedback e recompensa confirmados pelo servidor. Funcionalidades: F-07, F-08, F-10 a F-18, F-20 a F-26.

1. Na trilha, o aluno toca a lição atual. Um balão mostra o título e o botão Começar, ou Continuar se já houver sessão aberta.
2. O servidor cria a sessão principal ou devolve a que já está aberta. Existe no máximo uma sessão principal aberta por aluno e lição. A sessão fica presa à versão de conteúdo em que começou.
3. O exercício aparece. O aluno pode pedir dicas graduais; cada dica fica registrada.
4. Verificar envia a submissão com identificador próprio. O servidor corrige, grava e devolve o resultado com a explicação.
5. Na primeira resposta incorreta de um item, o aluno perde um coração e o item volta ao fim da fila. Novas tentativas do mesmo item não custam corações.
6. Continuar leva ao próximo item da fila. A barra de progresso só avança com itens resolvidos.
7. Quando todos os itens estão resolvidos, a interface envia a conclusão. Em uma transação, o servidor registra a conclusão, concede o XP de primeira conclusão, atualiza atividade diária, meta, sequência e conquistas e desbloqueia a próxima lição.
8. A tela de resultado mostra o XP confirmado, os acertos de primeira, a sequência e a meta do dia. Se houver conquista, sequência nova ou unidade concluída, uma celebração aparece antes da volta à trilha.
9. Na trilha, a lição concluída muda de estado e a próxima aparece como atual.

A quinta lição de cada unidade é o desafio final: segue este mesmo fluxo, com exercícios que montam um programa por etapas.

| Situação | Comportamento |
| --- | --- |
| O aluno chega a zero corações | Depois do feedback, a sessão fica pausada e aparece a tela Sem corações, com Recuperar corações (FL-06) e Voltar à trilha |
| O aluno toca uma lição com zero corações | Em vez de Começar, a lição oferece Recuperar corações |
| O aluno fecha a lição no meio | Uma confirmação informa que o progresso fica salvo; a sessão continua aberta |
| O aluno toca uma lição bloqueada | O balão informa qual lição precisa ser concluída antes |
| O aluno toca uma lição concluída | Abre uma sessão de prática (FL-05), sem recompensa de primeira conclusão |
| Falha na correção, na conclusão ou recarga | Segue FL-04 |

### 3.5 FL-04 — Retomada

Objetivo: garantir que falhas de rede, recargas e troca de dispositivo não percam progresso nem dupliquem efeitos. Funcionalidades: F-15, F-19, F-35.

1. Antes de enviar, a interface guarda a resposta e o identificador da submissão.
2. Se o envio falhar, a resposta continua na tela com Tentar novamente. O reenvio usa o mesmo identificador; o servidor devolve o resultado já gravado, se houver, sem descontar coração nem conceder nada outra vez.
3. Em uma recarga, a interface pede a sessão ao servidor. Se a última submissão já foi confirmada, mostra seu feedback; se não, mostra o exercício atual com a resposta guardada.
4. Em outro dispositivo, a trilha mostra Continuar na lição com sessão aberta. A sessão segue do primeiro item não resolvido.

| Situação | Comportamento |
| --- | --- |
| Duas abas respondem ao mesmo item | O servidor processa a primeira submissão; a outra aba recebe o resultado gravado e se atualiza |
| Duas abas pedem a conclusão | Apenas uma conclusão é registrada; as duas mostram o mesmo resultado |
| Falha ao enviar a conclusão | O estado Concluindo permite reenvio; o XP só aparece como recebido após confirmação |
| Sem conexão por mais tempo | Aviso persistente de falta de conexão; o aluno não avança sem confirmação do servidor |
| Nova versão do conteúdo publicada durante a sessão | A sessão termina na versão em que começou; a nova versão vale para as próximas sessões |
| Versão retirada por erro grave de conteúdo | A sessão aberta é encerrada, os corações perdidos nela são devolvidos e o aluno recomeça a lição na versão corrigida |
| Sessão de prática ou revisão abandonada | É descartada após 24 horas sem atividade; a sessão principal não expira |
| Login expirado durante a lição | O aluno entra de novo e volta à mesma sessão |

### 3.6 FL-05 — Prática e revisão

Objetivo: revisar conceitos no momento indicado pela agenda e praticar lições já concluídas. Funcionalidades: F-09, F-22, F-24, F-25, F-27 a F-29.

1. O aluno entra pela aba Praticar, por um ponto de revisão na trilha ou tocando uma lição concluída.
2. A revisão recomendada reúne itens dos conceitos com revisão vencida, priorizando os que tiveram erro ou dica. A prática de lição usa os exercícios daquela lição e suas variações.
3. A sessão segue o fluxo de exercícios de FL-03, com uma diferença: prática e revisão não consomem corações e podem ser feitas com zero corações.
4. Ao concluir, o servidor atualiza a agenda dos conceitos, concede XP de prática se a sessão for elegível e ainda houver sessões recompensadas no dia, e atualiza atividade, meta e sequência.
5. A tela de resultado mostra o XP recebido ou informa que o limite de XP de prática do dia foi atingido.

| Situação | Comportamento |
| --- | --- |
| Nenhum conceito com revisão vencida | Praticar oferece as lições concluídas e uma revisão geral dos conceitos já vistos |
| Aluno sem lição concluída | Praticar explica que as revisões aparecem depois da primeira lição e oferece voltar à trilha |
| Limite diário de XP de prática atingido | A prática continua disponível, sem XP; a agenda de revisão é atualizada normalmente |
| Prática de lição concluída | Nunca concede de novo a recompensa de primeira conclusão |

### 3.7 FL-06 — Recuperação de corações

Objetivo: devolver corações por meio de estudo, sem pagamento nem espera. Funcionalidades: F-23, F-27.

1. O aluno entra pela tela Sem corações, por uma lição na trilha quando está sem corações, ou pela aba Praticar quando tem menos de cinco corações.
2. O servidor monta uma revisão de cinco itens de conceitos que o aluno já viu, priorizando os que errou.
3. A revisão segue o fluxo de exercícios sem consumir corações. Erros voltam ao fim até que os cinco itens estejam resolvidos.
4. Ao concluir, o servidor devolve dois corações, sem passar de cinco, e conta a sessão como prática para XP, atividade e agenda.
5. Se houver uma sessão principal pausada, o resultado oferece Voltar à lição; caso contrário, Voltar à trilha.

| Situação | Comportamento |
| --- | --- |
| Aluno com cinco corações | A recuperação não aparece; Praticar mostra que os corações estão cheios |
| Aluno sem corações ainda na primeira lição | A revisão usa os conceitos já apresentados naquela lição, com variações |
| Limite diário de XP de prática atingido | A recuperação continua disponível e devolve corações normalmente, sem XP |
| Recuperações repetidas no mesmo dia | Permitidas, sem limite no MVP |
| O aluno abandona a recuperação | Nenhum coração é devolvido; a próxima tentativa monta uma nova revisão |

Corações não se recuperam com o passar do tempo no MVP (F-23).

### 3.8 Decisões tomadas nos fluxos

Estas decisões fecham lacunas do plano. Podem ser alteradas antes de E03 sem retrabalho.

| ID | Decisão | Motivo |
| --- | --- | --- |
| D-01 | A demonstração é a lição 1 da unidade 1 | A transferência registra uma lição real da trilha |
| D-02 | A demonstração é corrigida por um endpoint anônimo do servidor, sem gravar progresso | O gabarito continua fora do navegador |
| D-03 | A demonstração não usa corações | Evita transferir corações perdidos sem conta e simplifica a primeira experiência |
| D-04 | Só uma demonstração concluída pode ser transferida | Evita reconstruir sessões parciais a partir de dados locais |
| D-05 | O e-mail precisa ser verificado antes do primeiro login | Garante a recuperação de acesso; a demonstração fica guardada no navegador enquanto isso |
| D-06 | Aceite de termos de uso e política de privacidade no cadastro | Base para o tratamento de dados da conta |
| D-07 | Uma sessão principal aberta por aluno e lição; ela não expira | Permite retomar em qualquer momento e dispositivo |
| D-08 | Sessões de prática e revisão abandonadas são descartadas após 24 horas | São curtas e geradas a partir da agenda do momento |
| D-09 | Prática, revisão e recuperação não consomem corações | Segue a regra de corações da sessão principal e mantém um caminho de estudo sempre disponível |
| D-10 | Dicas não custam corações | Dicas já reduzem a evidência de aprendizagem e ficam registradas para a revisão |
| D-11 | A quinta lição de cada unidade é o desafio final | Mantém quinze lições no MVP |
| D-12 | Recuperação de corações sem limite diário | É estudo efetivo; o limite de XP de prática evita ganho excessivo |

## 4. Regras de gamificação

Os valores numéricos são parâmetros iniciais, reunidos em [4.10](#410-parâmetros-iniciais) e ajustáveis após o beta. Todas as regras são aplicadas pelo servidor; a interface apenas mostra o que foi confirmado.

### 4.1 Definições

| Termo | Definição |
| --- | --- |
| Dia de estudo | Data local no fuso horário da conta, da meia-noite às 23h59 |
| Sessão principal | Primeira passagem por uma lição da trilha; consome corações |
| Sessão de prática | Repetição de uma lição já concluída |
| Sessão de revisão | Revisão recomendada pela agenda de conceitos |
| Sessão de recuperação | Revisão de cinco itens que devolve corações |
| Sessão concluída | Sessão em que todos os itens foram resolvidos e a conclusão foi confirmada pelo servidor |
| Sessão elegível | Qualquer sessão concluída, de qualquer tipo. Sessões abandonadas ou pausadas não são elegíveis |
| Momento da conclusão | Instante em que o servidor confirma a conclusão. Define o dia de estudo da sessão, mesmo que ela tenha começado no dia anterior |

A demonstração transferida conta como sessão principal concluída no dia local da transferência (FL-02).

### 4.2 XP

| Regra | Valor ou comportamento |
| --- | --- |
| Primeira conclusão de uma lição | 20 XP, uma única vez por aluno e lição, independentemente de erros e dicas |
| Sessão de prática, revisão ou recuperação | 10 XP por sessão elegível |
| Limite de XP de prática | As três primeiras sessões de prática, revisão ou recuperação concluídas no dia de estudo recebem XP; as seguintes recebem zero |
| Dicas | Não reduzem nem aumentam o XP |
| Sessão abandonada ou incompleta | Nenhum XP |
| Conquistas, meta e sequência | Não concedem XP no MVP |

O XP total nunca diminui. O perfil mostra o XP total e o XP do dia. Cada concessão é um lançamento no livro de recompensas com causa, valor e identificador único do evento.

### 4.3 Corações

| Regra | Valor ou comportamento |
| --- | --- |
| Saldo inicial e máximo | Cinco corações |
| Perda | Um coração na primeira resposta incorreta de cada item de uma sessão principal |
| Novas tentativas do mesmo item | Não custam corações |
| Dicas | Não custam corações |
| Prática, revisão, recuperação e demonstração | Não consomem corações |
| Saldo mínimo | Zero; o saldo nunca fica negativo |
| Saldo zero | Após o feedback, a sessão principal fica pausada; nenhuma sessão principal pode ser iniciada ou continuada |
| Recuperação | Disponível com menos de cinco corações; ao concluir a revisão de cinco itens, devolve dois corações, sem passar de cinco |
| Passagem do tempo | Não devolve corações no MVP |

Exemplos: com um coração, a primeira resposta errada leva a zero e pausa a sessão. Com quatro corações, uma recuperação devolve apenas um, até o limite de cinco.

### 4.4 Meta diária

| Regra | Valor ou comportamento |
| --- | --- |
| Opções | Uma, duas ou três sessões por dia; uma é o padrão |
| O que conta | Sessões elegíveis de qualquer tipo, inclusive as que já não recebem XP pelo limite diário |
| Meta cumprida | Ao atingir o número escolhido, o resultado mostra a meta cumprida uma única vez naquele dia |
| Alteração da meta | Vale a partir do dia de estudo atual; se o novo valor já tiver sido atingido, a meta aparece como cumprida |
| Relação com outras regras | Independente da sequência e do XP; não cumprir a meta não quebra a sequência |

### 4.5 Sequência

| Regra | Valor ou comportamento |
| --- | --- |
| Definição | Número de dias de estudo consecutivos com pelo menos uma sessão elegível |
| Início e aumento | A primeira sessão elegível do dia aumenta a sequência em um, se houve estudo no dia anterior; caso contrário, a sequência recomeça em um |
| Sessões seguintes no mesmo dia | Não alteram a sequência |
| Quebra | Um dia de estudo inteiro sem sessão elegível zera a sequência; o perfil já mostra zero no dia seguinte ao dia perdido |
| Maior sequência | O perfil mostra a maior sequência já alcançada |
| Proteção de sequência | Não existe no MVP |

A sequência é calculada a partir da atividade diária gravada por aluno e data local, com uma única linha por dia.

### 4.6 Fuso horário

| Regra | Valor ou comportamento |
| --- | --- |
| Fuso inicial | Identificador IANA sugerido pelo navegador no primeiro acesso; se não estiver disponível, `America/Sao_Paulo` |
| Mudança automática | Não existe; se o fuso do navegador for diferente do fuso da conta, o perfil sugere a alteração |
| Alteração manual | Feita nas preferências; passa a valer no próximo dia de estudo, contado no fuso anterior |
| Alterações pendentes | No máximo uma; uma nova alteração substitui a pendente |
| Data que recuaria | Se a mudança fizer a data local voltar a um dia já registrado, o período até a próxima meia-noite no novo fuso continua contando como esse mesmo dia, sem novo crédito |
| Data pulada | Se a mudança fizer a data local avançar mais de um dia, o dia pulado não quebra a sequência |
| Horários gravados | Sempre em UTC; a data local é calculada no momento da conclusão e gravada junto com a atividade |

### 4.7 Conquistas

| Conquista | Condição |
| --- | --- |
| Primeira lição | Primeira sessão principal concluída, inclusive pela transferência da demonstração |
| Primeira unidade | Conclusão das cinco lições de uma unidade |
| Sete dias de sequência | Sequência atual chega a sete dias |

Cada conquista é concedida uma única vez por aluno, na mesma transação do evento que a causou, e nunca é removida. Uma sequência quebrada depois não retira a conquista de sete dias.

### 4.8 Revisão e prática

| Regra | Valor ou comportamento |
| --- | --- |
| Entrada na agenda | Um conceito entra na agenda quando aparece pela primeira vez em uma sessão principal concluída, com revisão marcada para um dia depois |
| Avanço | Se todos os itens do conceito na revisão forem acertados de primeira e sem dica, o próximo intervalo passa de 1 para 3 dias e de 3 para 7 dias; depois disso, permanece em 7 dias |
| Recuo | Erro na primeira tentativa ou uso de dica volta o intervalo para 1 dia |
| Estados mostrados | Iniciado, antes da primeira revisão; praticando, nos intervalos de 1 e 3 dias; consolidando, depois de uma revisão bem-sucedida no intervalo de 7 dias |
| Tamanho da revisão recomendada | Entre cinco e oito itens; se houver menos de cinco conceitos vencidos, a revisão é completada com os conceitos vistos mais recentemente |
| Prática de lição concluída | Usa os exercícios da lição e suas variações, na versão de conteúdo atual |

Sessões de prática e recuperação também atualizam a agenda dos conceitos que contêm. Os intervalos são hipóteses de produto e serão avaliados no beta.

### 4.9 Repetições e casos de borda

| Situação | Comportamento |
| --- | --- |
| Submissão reenviada com o mesmo identificador | Devolve o resultado gravado; não desconta coração nem concede XP de novo |
| Duas conclusões da mesma sessão | Apenas uma é registrada; a outra recebe o mesmo resultado |
| Lição concluída novamente | Torna-se prática; nunca concede outra vez os 20 XP |
| Transferência da demonstração repetida | Processada uma única vez por conta |
| Sessão iniciada antes e concluída depois da meia-noite | Conta para o dia de estudo da conclusão |
| Quarta sessão de prática no dia | Concluída normalmente, sem XP, contando para meta, sequência e agenda |
| Pedido de recuperação com cinco corações | Recusado pelo servidor |
| Nova versão de uma lição já concluída | A conclusão e o XP permanecem; a prática passa a usar a nova versão |
| Versão retirada por erro grave | Os corações perdidos na sessão encerrada são devolvidos; XP e conclusões já confirmados permanecem |
| Exclusão da conta | Remove progresso, XP, sequência e conquistas; uma nova conta com o mesmo e-mail começa do zero |

### 4.10 Parâmetros iniciais

Os parâmetros ficam em configuração do servidor. Uma alteração vale para eventos futuros e nunca recalcula recompensas já concedidas.

| Parâmetro | Valor inicial |
| --- | --- |
| XP de primeira conclusão | 20 |
| XP por sessão de prática, revisão ou recuperação | 10 |
| Sessões de prática recompensadas por dia | 3 |
| Corações máximos e iniciais | 5 |
| Itens da revisão de recuperação | 5 |
| Corações devolvidos por recuperação | 2 |
| Opções de meta diária | 1, 2 ou 3 sessões; padrão 1 |
| Intervalos de revisão | 1, 3 e 7 dias |
| Itens da revisão recomendada | 5 a 8 |
| Expiração de sessões de prática e revisão abandonadas | 24 horas sem atividade |
| Fuso padrão | `America/Sao_Paulo` |

## 5. Critérios de aceitação

### 5.1 Como usar

Cada critério descreve um comportamento observável no formato dado, quando, então. Um critério está atendido quando sua verificação passa no ambiente de homologação. As tarefas de E04 a E08 devem citar os critérios que atendem.

| Verificação | Significado |
| --- | --- |
| D | Teste de domínio, com regras isoladas (Vitest) |
| I | Teste de integração com banco, autorização e concorrência |
| J | Teste de jornada no navegador (Playwright) |
| M | Verificação manual, em aparelho real ou por inspeção |

A numeração tem intervalos por fluxo para permitir acréscimos sem renumerar. Os critérios de lançamento da seção 15 do plano continuam valendo; estes os detalham.

### 5.2 FL-01 — Primeiro acesso e demonstração

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-01 | Visitante sem conta | Toca Começar e conclui a introdução | A lição 1 da unidade 1 abre sem pedir cadastro | J |
| CA-02 | Demonstração em andamento | As respostas da API e os arquivos carregados são inspecionados | Nenhum gabarito aparece antes da submissão | I |
| CA-03 | Demonstração em andamento | O visitante erra um item | Nenhum coração é exibido ou descontado e o item volta ao fim da sessão | J |
| CA-04 | Demonstração interrompida em um item | O visitante recarrega a página no mesmo navegador | A demonstração continua no mesmo item | J |
| CA-05 | Demonstração concluída | A tela de resultado aparece | O XP aparece como provisório, com Criar conta para salvar | J |
| CA-06 | Endpoint anônimo de correção | Recebe mais requisições que o limite | Recusa o excesso e não grava progresso | I |
| CA-07 | Armazenamento do navegador indisponível | O visitante conclui a demonstração | A demonstração termina normalmente e nenhuma transferência é oferecida depois | J |

### 5.3 FL-02 — Cadastro, acesso e transferência

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-10 | Formulário de cadastro | Os termos não foram aceitos | Criar conta fica indisponível | J |
| CA-11 | E-mail, senha e aceite válidos | A pessoa cria a conta | A conta é criada e o e-mail de verificação é enviado | J |
| CA-12 | Conta com e-mail não verificado | A pessoa tenta entrar | O login é recusado com a opção de reenviar o link | J |
| CA-13 | Link de verificação válido | A pessoa o abre | A sessão começa e nome, meta e fuso sugerido ficam salvos na conta | J |
| CA-14 | Tela de login | A senha está errada ou o e-mail não existe | A mesma mensagem aparece nos dois casos | J |
| CA-15 | Tela de recuperação de acesso | Um e-mail cadastrado ou não cadastrado é informado | A mesma mensagem aparece; o link recebido define uma nova senha e a anterior deixa de funcionar | J |
| CA-16 | Aluno conectado | Toca Sair e tenta abrir a trilha | É levado ao login | J |
| CA-17 | Demonstração concluída e conta nova | A pessoa aceita a transferência | A lição 1 fica concluída com 20 XP, a lição 2 é desbloqueada, a atividade do dia é registrada e os dados locais são apagados | J |
| CA-18 | Respostas da demonstração alteradas no navegador | A transferência é enviada | Nada é registrado e a lição 1 continua disponível | I |
| CA-19 | Transferência válida | É enviada duas vezes | Há uma única conclusão e um único lançamento de 20 XP | I |
| CA-20 | Conta que já concluiu a lição 1 | Entra em um navegador com demonstração concluída | Não há transferência; a mensagem informa que a lição já está na conta | J |
| CA-21 | Demonstração iniciada e não concluída | A pessoa entra na conta | Nenhuma transferência é oferecida e os dados locais são apagados | J |

### 5.4 FL-03 — Estudo de uma lição

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-30 | Lição com sessão principal aberta | O aluno a abre em outra aba ou dispositivo | Recebe a mesma sessão, sem criar outra | I |
| CA-31 | Exercício com resposta incompleta | O aluno tenta verificar | Verificar está indisponível | J |
| CA-32 | Sessão principal com cinco corações | O aluno erra um item pela primeira vez e depois erra o mesmo item de novo | Perde um coração só no primeiro erro, e o item volta ao fim da fila | D, J |
| CA-33 | Exercício com dicas | O aluno pede uma dica | A dica é registrada e corações e XP não mudam | I |
| CA-34 | Sessão em andamento | Um item é errado | A barra de progresso não avança até o item ser resolvido | J |
| CA-35 | Todos os itens resolvidos | A conclusão é confirmada | Conclusão, 20 XP, atividade, meta, sequência, conquistas e desbloqueio são gravados juntos | I |
| CA-36 | Falha simulada no meio da conclusão | A transação é interrompida | Nenhum desses efeitos é gravado | I |
| CA-37 | Conclusão enviada | A confirmação ainda não chegou | O XP não aparece como recebido | J |
| CA-38 | Aluno com um coração | Erra um item pela primeira vez | Após o feedback, a sessão fica pausada e aparece Sem corações | J |
| CA-39 | Aluno com zero corações | Toca uma lição na trilha | Recuperar corações aparece no lugar de Começar, e o servidor recusa iniciar sessão principal | I, J |
| CA-40 | Lição bloqueada | O aluno a toca ou uma sessão é pedida diretamente à API | O balão explica o requisito, e o servidor recusa a sessão | I, J |
| CA-41 | Lição já concluída | O aluno a abre e conclui | A sessão é de prática e não concede de novo os 20 XP | I |
| CA-42 | Sessão de outro aluno | Uma requisição usa seu identificador | O servidor recusa sem revelar dados da sessão | I |
| CA-43 | Sessão aberta na versão 1 | A versão 2 da lição é publicada | A sessão continua com itens e gabarito da versão 1 | I |
| CA-44 | Quinta lição de uma unidade | O aluno a conclui | A conquista Primeira unidade é concedida, se ainda não existir, e a celebração aparece | J |

### 5.5 FL-04 — Retomada

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-50 | Rede indisponível no envio | O aluno toca Verificar | A resposta continua na tela com Tentar novamente | J |
| CA-51 | Submissão reenviada com o mesmo identificador | O servidor já a havia gravado | Devolve o mesmo resultado, sem novo desconto de coração | I |
| CA-52 | Submissão confirmada | O aluno recarrega a página | O feedback dessa submissão aparece | J |
| CA-53 | Resposta preenchida e não enviada | O aluno recarrega a página | O mesmo exercício aparece com a resposta guardada | J |
| CA-54 | Sessão aberta em um dispositivo | O aluno entra em outro dispositivo | A trilha mostra Continuar, e a sessão segue do primeiro item não resolvido | J |
| CA-55 | Duas abas no mesmo item | As duas enviam respostas | Só a primeira é processada, e a outra aba mostra o resultado gravado | I, J |
| CA-56 | Duas abas no fim da sessão | As duas pedem a conclusão ao mesmo tempo | Há uma conclusão e um lançamento de XP | I |
| CA-57 | Falha ao enviar a conclusão | O aluno toca Tentar novamente | A conclusão é registrada uma vez e o resultado aparece | J |
| CA-58 | Login expirado durante a lição | O aluno entra de novo | Volta à mesma sessão e ao mesmo item | J |
| CA-59 | Sessão de prática sem atividade por 24 horas | O aluno abre Praticar | Uma nova sessão é montada; a sessão principal aberta continua disponível | I |
| CA-60 | Versão de lição retirada por erro grave | Havia sessão aberta nela | A sessão é encerrada, os corações perdidos nela são devolvidos e a lição recomeça na versão corrigida | I |
| CA-61 | Sem conexão por mais tempo | O aluno tenta avançar | Um aviso persistente aparece e nada avança sem confirmação | J |

### 5.6 FL-05 — Prática e revisão

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-70 | Conceitos com revisão vencida | O aluno abre Praticar | A revisão recomendada aparece com cinco a oito itens | I |
| CA-71 | Aluno com zero corações | Conclui uma prática ou revisão | A sessão é permitida e nenhum coração é descontado | I |
| CA-72 | Três sessões de prática concluídas no dia | O aluno conclui a quarta | Recebe zero XP, vê o aviso de limite, e a sessão conta para meta, sequência e agenda | D, I |
| CA-73 | Conceito em intervalo de 1 dia | O aluno acerta todos os itens dele de primeira e sem dica, e depois repete isso | O intervalo passa para 3 dias e depois para 7 | D |
| CA-74 | Conceito em intervalo de 7 dias | O aluno erra ou usa dica | O intervalo volta para 1 dia | D |
| CA-75 | Aluno sem lição concluída | Abre Praticar | Vê a explicação de que as revisões começam após a primeira lição | J |
| CA-76 | Nenhum conceito vencido | O aluno abre Praticar | Vê as lições concluídas e a revisão geral | J |

### 5.7 FL-06 — Recuperação de corações

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-80 | Aluno com cinco corações | Abre Praticar ou pede a recuperação à API | A recuperação não aparece e o servidor recusa o pedido | I |
| CA-81 | Aluno com zero ou com quatro corações | Conclui uma recuperação | Fica com dois ou com cinco corações, respectivamente | D |
| CA-82 | Recuperação em andamento | O aluno a abandona | Nenhum coração é devolvido | I |
| CA-83 | Limite de XP de prática atingido | O aluno conclui uma recuperação | Recebe os corações e nenhum XP | D |
| CA-84 | Sessão principal pausada | O aluno conclui uma recuperação e toca Voltar à lição | A sessão continua no mesmo item em que parou | J |

### 5.8 Regras de gamificação

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-90 | Sessão iniciada às 23h55 no fuso da conta | É concluída às 0h05 | Conta para o novo dia de estudo | D |
| CA-91 | Estudo em dois dias seguidos | O aluno conclui uma sessão no segundo dia | A sequência fica em dois | D |
| CA-92 | Sequência ativa | Um dia inteiro passa sem sessão elegível | No dia seguinte, o perfil mostra zero; a próxima sessão recomeça em um | D |
| CA-93 | Uma sessão já concluída no dia | O aluno conclui outra | A sequência não muda | D |
| CA-94 | Meta de duas sessões | O aluno conclui a segunda | A meta aparece cumprida uma única vez naquele dia | D, J |
| CA-95 | Uma sessão concluída e meta de duas | O aluno muda a meta para uma | A meta aparece cumprida | D |
| CA-96 | Alteração de fuso salva | Ainda é o mesmo dia no fuso anterior | O fuso novo só vale a partir do próximo dia de estudo | D |
| CA-97 | Mudança de fuso que faz a data local recuar | O aluno conclui uma sessão | Não é criado um novo dia de estudo | D |
| CA-98 | Mudança de fuso que pula uma data | O aluno conclui uma sessão no dia seguinte | A sequência não é quebrada | D |
| CA-99 | Sequência chega a sete | A sessão é concluída | A conquista é concedida uma vez e permanece se a sequência quebrar | D, I |
| CA-100 | Parâmetro de XP alterado | Há recompensas antigas | Elas não são recalculadas | I |
| CA-101 | Qualquer sequência de operações | Corações são alterados | O saldo fica sempre entre zero e cinco, garantido também pelo banco | I |

### 5.9 Requisitos transversais

| ID | Dado | Quando | Então | Verificação |
| --- | --- | --- | --- | --- |
| CA-110 | Pessoa que usa só teclado | Percorre apresentação, demonstração, cadastro e uma lição com os quatro tipos de exercício | Conclui tudo sem mouse ou toque, inclusive a ordenação de blocos | J, M |
| CA-111 | Qualquer feedback de acerto ou erro | É exibido | Tem texto e ícone, além de cor | M |
| CA-112 | Redução de movimento ativada no sistema | O aluno conclui uma lição | Animações são substituídas por transições discretas | J |
| CA-113 | Som desligado nas preferências | O aluno estuda em outro dispositivo | Nenhum som é tocado | J |
| CA-114 | Celular real com 360 px de largura | O aluno responde exercícios com o teclado virtual aberto | Não há rolagem horizontal e Verificar permanece acessível | M |
| CA-115 | Aluno conectado | Pede a exportação do histórico | Recebe apenas os próprios dados de progresso | I, J |
| CA-116 | Aluno conectado | Exclui a conta | O login deixa de funcionar e progresso, XP, sequência e conquistas são removidos | I, J |
| CA-117 | Jornada completa executada | Logs e eventos são inspecionados | Não contêm respostas, senhas, e-mails ou código pessoal | M |
| CA-118 | Duas contas | Uma tenta ler ou alterar progresso, sessão ou perfil da outra | Todas as tentativas são recusadas | I |

## 6. Stack e limites do MVP

### 6.1 Decisão de stack

A stack da seção 4 do plano fica adotada para o MVP. As versões são fixadas em E04.1, com lockfile no repositório.

| Camada | Escolha | Papel no MVP |
| --- | --- | --- |
| Aplicação | Next.js, React e TypeScript, em um único projeto | Interface, renderização no servidor e API |
| Estilo e animação | Tailwind CSS, componentes próprios, CSS e SVG | Aparência da trilha, exercícios e celebrações |
| API | Route Handlers do Next.js | Sessões, submissões, conclusão, transferência, revisão e perfil |
| Validação | Zod | Requisições, respostas e arquivos de conteúdo |
| Banco | PostgreSQL no Supabase | Progresso, conteúdo publicado, lançamentos e atividade |
| Acesso ao banco | Drizzle ORM, com a única cadeia de migrações | Esquema tipado, transações e restrições de unicidade |
| Autenticação | Supabase Auth, com sessão em cookies no servidor | Cadastro, verificação, login, recuperação e saída |
| E-mail | Envio por SMTP próprio configurado no Supabase Auth | Verificação e recuperação de acesso (F-38) |
| Arquivos | Assets estáticos da aplicação | Mascote, ilustrações e sons |
| Hospedagem | Vercel | Aplicação e funções do servidor |
| Testes | Vitest e Playwright | Critérios D, I e J da seção 5 |

Regras de uso que decorrem da decisão:

- **Acesso a dados só pelo servidor.** O navegador não consulta tabelas pela API de dados do Supabase. As tabelas ficam fora do esquema exposto ou com RLS ativado e sem políticas de acesso para visitantes e alunos.
- **Autorização explícita nos serviços.** A conexão do servidor ao banco tem privilégios amplos; cada serviço confere se a sessão, a submissão ou o perfil pertence ao aluno autenticado (CA-42, CA-118).
- **Gabaritos separados.** Ficam em tabela própria, lida apenas pelos corretores, e nunca entram em respostas da API destinadas ao aluno (CA-02).
- **Leituras sem chamada HTTP interna.** Componentes de servidor chamam os serviços diretamente; Route Handlers atendem às ações da interface.
- **Limitação de frequência no servidor.** Endpoints de submissão, correção anônima e transferência têm limites próprios, guardados no PostgreSQL no MVP; os endpoints de autenticação usam os limites do Supabase Auth.
- **Datas com fuso IANA.** Cálculos de dia de estudo usam uma biblioteca de datas com suporte a fusos IANA, escolhida em E04.1, e são cobertos pelos critérios CA-90 a CA-98.
- **E-mail de produção configurado antes do beta.** O envio padrão do Supabase é limitado e serve para testes; o provedor de SMTP é escolhido junto com o levantamento de custos (E08.8).

### 6.2 Limites do MVP

| Limite | O que significa | Consequência para a implementação |
| --- | --- | --- |
| Correção objetiva no servidor | Os quatro tipos de exercício têm corretores determinísticos no servidor | Nenhum código de aluno é executado no servidor ou no navegador |
| Sem editor de Python | CodeMirror e Pyodide ficam para a segunda entrega, depois de P01 e P02 | Nenhuma dependência de execução de Python entra no MVP |
| Python apenas na verificação de conteúdo | Os exemplos do curso são executados por um script no pipeline de conteúdo, fora do aplicativo | O pipeline precisa de Python 3.14 e PyYAML; a aplicação não |
| Uso com conexão | Não há ensino offline nem instalação como PWA | Falhas de rede são tratadas por reenvio (FL-04) |
| Navegadores atuais | Chrome, Safari, Edge e Firefox atuais, em celular e desktop (PR-07) | Testes de jornada nesses navegadores; sem suporte a versões antigas |
| Um idioma | Interface e conteúdo em português brasileiro (PR-06) | Textos centralizados, sem infraestrutura de tradução |
| Escala de beta | Uma região de hospedagem e banco; sem metas de tráfego antes de medir | Otimizações só depois de identificar gargalos reais |
| Sem IA, pagamentos ou recursos sociais | Fora do MVP conforme a seção 2.3 | Nenhuma integração com esses serviços |

### 6.3 Alternativas descartadas para o MVP

| Alternativa | Motivo |
| --- | --- |
| Backend separado em Django ou FastAPI | Dois projetos para operar; a interface muito interativa favorece um único projeto em TypeScript |
| Executar Python no MVP | Exige isolamento e testes em celulares que ainda não foram feitos (P01) |
| Biblioteca global de estado na interface | O servidor é a referência; o estado da lição cabe em um reducer local |
| Consultas do navegador direto ao banco | Expõe tabelas e exige políticas de RLS para cada regra; o servidor já valida tudo |

### 6.4 Quando revisar a decisão

A stack pode ser revista antes de E04.1 se o levantamento de custos inviabilizar Vercel ou Supabase, se não houver região adequada ao público, ou se a pessoa responsável pela implementação preferir um backend em Python. Depois de E04, mudanças de stack exigem uma nova decisão registrada no acompanhamento do plano.

### 6.5 Conclusão da etapa E01

A especificação atende ao critério de E01: os fluxos e suas exceções estão descritos sem decisões implícitas que impeçam desenhar ou construir a primeira lição.

Pendências que não bloqueiam E02 e E03:

| Pendência | Quando resolver |
| --- | --- |
| Versão exata do Python de referência | Resolvida em E02.6: Python 3.14 |
| Provedor de SMTP e custos de operação | E08.8 |
| Termos de uso e política de privacidade, incluindo o uso por menores (PR-02) | E08.9, antes do beta |
| Verificação jurídica de LGPD e ECA Digital para acesso público | Antes de E10 |
