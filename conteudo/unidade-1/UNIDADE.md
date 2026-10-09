# Unidade 1 — Primeiros comandos

Documento da etapa E02 do [plano de referência](../../PLANO_PRODUTO_E_ARQUITETURA.md#e02--primeira-unidade-detalhada). O conteúdo está nos arquivos `licao-*.yaml`, no [formato de conteúdo](../FORMATO.md). A [versão de leitura](LEITURA.md) mostra todos os exercícios com respostas, dicas e explicações.

| Tarefa | Seção | Situação |
| --- | --- | --- |
| E02.1 — Objetivos e sequência das lições | [1](#1-objetivos-e-sequência) | Registrada |
| E02.2 — Formato de conteúdo | [FORMATO.md](../FORMATO.md) | Registrada |
| E02.3 — Exercícios da lição 1 e fluxo de feedback | [licao-1.yaml](licao-1.yaml) | Registrada |
| E02.4 — Lições 2 a 5 e desafio final | `licao-2.yaml` a `licao-5.yaml` | Registrada |
| E02.5 — Variações de revisão e ambiguidades | [2](#2-variações-de-revisão-e-ambiguidades) | Registrada |
| E02.6 — Verificação e revisão pedagógica | [3](#3-verificação-e-revisão-pedagógica) | Registrada |

## 1. Objetivos e sequência

Ao final da unidade, o aluno prevê a saída de programas curtos com `print`, textos, números e variáveis, encontra erros comuns nesses programas e monta um cartão de apresentação a partir de blocos. Esses são os objetivos da unidade 1 na [seção 1.2 da especificação](../../ESPECIFICACAO_MVP.md#12-objetivo-de-aprendizagem).

| Lição | Título | O aluno consegue | Conceitos novos | Exercícios |
| --- | --- | --- | --- | --- |
| 1 | Olá, Python | Prever a saída de `print` com texto, reconhecer aspas faltando e ordenar comandos | `print-texto`, `string-aspas`, `ordem-execucao` | 6 |
| 2 | Números na tela | Exibir números e resultados de contas, distinguir conta de texto e usar vírgula no `print` | `print-numero`, `texto-vs-numero`, `print-varios` | 7 |
| 3 | Guardando valores | Criar variáveis, usá-las no `print`, distinguir variável de texto e reconhecer nomes inválidos | `atribuicao`, `variavel-vs-texto`, `nomes-variaveis` | 7 |
| 4 | Mudando valores | Prever valores depois de reatribuições e atualizações, respeitando a ordem das linhas | `reatribuicao`, `atualizacao` | 7 |
| 5 | Desafio: cartão de apresentação | Montar, em etapas, um programa que exibe um cartão com nome, idade e cidade | Nenhum; combina os anteriores | 7 |

Decisões de sequência:

- **A lição 1 é a demonstração (D-01).** Por isso é a mais curta, começa com um exercício resolvível só pelo enunciado e não depende de nenhum conhecimento prévio.
- **Contas só com `+`, `-` e `*` e números inteiros.** Divisão, tipos e operadores restantes ficam para a unidade 2.
- **Textos combinados só com vírgula no `print`.** A concatenação com `+` e a conversão de tipos ficam para a unidade 2.
- **Fora da unidade 1:** comentários, `input()`, f-strings e aspas triplas.
- **Aspas simples aparecem só na revisão da lição 1,** para mostrar que as aspas precisam ser iguais, sem sobrecarregar a demonstração.
- **O desafio monta o programa em etapas.** As variáveis são criadas primeiro e, no fim, o cartão completo é montado com as variáveis já fixas, o que mantém uma única ordem válida no último exercício.

Erros de iniciante que os distratores representam:

| Erro comum | Onde aparece |
| --- | --- |
| Achar que as aspas aparecem na saída | Lições 1, 2 e 3 |
| Achar que o comando `print` aparece na saída | Lição 1 |
| Esquecer de fechar aspas ou de usar aspas iguais | Lição 1 e revisão |
| Escrever `Print` ou um comando em português | Lição 1 |
| Escrever uma conta entre aspas esperando o resultado | Lições 2 e 4 |
| Esperar que a vírgula do `print` apareça ou que não haja espaço | Lições 2 e 5 |
| Confundir nome de variável com texto | Lições 3 e 5 |
| Trocar maiúsculas e minúsculas em nomes | Lições 1, 3 e 5 |
| Usar uma variável antes de criá-la | Lições 3 e 5 |
| Achar que uma variável guarda todos os valores já atribuídos | Lição 4 |
| Achar que copiar uma variável mantém as duas ligadas | Lição 4 |

## 2. Variações de revisão e ambiguidades

Cada lição de 1 a 4 tem três variações de revisão, e o desafio tem uma, totalizando 13. Cada variação aponta para o exercício principal que substitui (`variacao_de`) e muda o contexto: outros textos, números e nomes, mantendo o mesmo conceito. Somadas às das unidades 2 e 3, ficam dentro da faixa de 30 a 45 variações do plano.

| Lição | Exercícios principais | Variações | Tipos na sessão principal |
| --- | --- | --- | --- |
| 1 | 6 | 3 | 3 escolher resultado, 1 lacuna, 1 blocos, 1 localizar erro |
| 2 | 7 | 3 | 4 escolher resultado, 1 lacuna, 1 blocos, 1 localizar erro |
| 3 | 7 | 3 | 4 escolher resultado, 1 lacuna, 1 blocos, 1 localizar erro |
| 4 | 7 | 3 | 4 escolher resultado, 1 lacuna, 1 blocos, 1 localizar erro |
| 5 | 7 | 1 | 2 escolher resultado, 2 lacunas, 2 blocos, 1 localizar erro |
| Total | 34 | 13 | — |

Ambiguidades tratadas:

| Situação | Tratamento |
| --- | --- |
| Blocos com mais de uma ordem válida (L3-e06) | As três ordens válidas são aceitas; o verificador confirma que são exatamente essas |
| Blocos com muitas ordens válidas (L5-e04) | As oito ordens válidas, encontradas pelo verificador, são aceitas. Não há distrator, de propósito: o exercício treina a liberdade de ordem das atribuições |
| Montagem final do cartão (L5-e07) | As variáveis ficam fixas antes da área de montagem, o que deixa uma única ordem válida |
| Opções de lacuna que produziriam a mesma saída | Removidas durante a escrita: `3 + 1` em L4-e04, `25` em L3-e03, `"28"` em L5-e01 e `29` ou `"29"` em L5-e05 |
| Distratores de blocos sem efeito | Evitados. Um bloco como `numero + 1` poderia ser inserido em qualquer lugar sem mudar a saída; L4-e06 usa um `print` com a variável entre aspas |
| Opções de código com a mesma saída | Evitadas. `print("Python", "é legal")` também exibiria `Python é legal` e não foi usada em L1-e06 |

Risco aceito: em L4-e05, mudar a linha 2 para `gasto = -30` também produziria `Saldo: 70`. A linha 3 continua sendo a resposta porque o enunciado trata de um gasto que diminui o saldo. Vale observar no beta se algum aluno escolhe a linha 2.

## 3. Verificação e revisão pedagógica

### 3.1 Verificação automática

| Item | Resultado |
| --- | --- |
| Data | 8 de outubro de 2026 |
| Python | 3.14.7, no Windows |
| Comando | `python ferramentas/verificar_conteudo.py conteudo/unidade-1 --leitura` |
| Exercícios verificados | 34 principais e 13 variações |
| Erros | Nenhum |
| Avisos | 1, aceito: L5-e04 sem blocos distratores |

O verificador também foi testado com uma cópia da unidade alterada de propósito. Detectou as cinco falhas introduzidas: resposta trocada, lacuna ambígua, linha de erro errada, número sem aspas no YAML e bloco distrator sem efeito.

Versão de referência: **Python 3.14**, a versão em que os exemplos foram executados. A unidade 1 usa só `print`, atribuição, aritmética de inteiros e textos, que se comportam do mesmo jeito desde as versões 3.x anteriores. Ainda assim, os exemplos não foram executados em 3.12 ou 3.13. O pipeline de conteúdo (E04.7) deve fixar a versão de Python usada. Quando o editor chegar, o experimento P01 deve conferir a versão incluída no Pyodide.

### 3.2 Revisão pedagógica

A revisão foi feita sobre a [versão de leitura](LEITURA.md) completa, conferindo os critérios da seção 12 do plano:

| Critério | Situação |
| --- | --- |
| Exemplos executam na versão de Python escolhida | Atendido pela verificação automática |
| Respostas inequívocas | Atendido: só a opção, combinação ou ordem correta produz o resultado esperado |
| Distratores representam erros plausíveis | Atendido: cada distrator corresponde a um erro da tabela da seção 1. Em escolher resultado, todos têm feedback próprio; em lacunas e blocos, a explicação comenta os distratores |
| Variações de revisão mudam o contexto | Atendido nas 13 variações |
| Ordens alternativas de blocos | Aceitas quando válidas, ou eliminadas com linhas fixas |
| Textos de interface servem para celular e desktop | "Toque na linha" foi trocado por "Selecione a linha" |

Ajustes feitos na revisão: duas dicas reescritas (L3-e01 e L5-e01) e um feedback reescrito (L5-e02).

Limitação: a revisão foi feita por quem escreveu o conteúdo. A primeira leitura por iniciantes acontece no protótipo (E03.7) e no beta (E09). Exercícios com muitos erros na primeira tentativa ou com muitos pedidos de dica devem ser revistos com esses dados.
