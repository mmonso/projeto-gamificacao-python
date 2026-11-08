# Unidade 1 — Primeiros comandos: versão de leitura

Gerado por `ferramentas/verificar_conteudo.py` a partir dos arquivos YAML. Não edite à mão.

## Lição 1 — Olá, Python

Objetivo: Prever a saída de print com texto, reconhecer aspas faltando e ordenar comandos de print.

### Sessão principal

#### u1-l1-e01 — escolher resultado (dificuldade 1)

**Enunciado:** O comando print mostra uma mensagem na tela. O que este programa exibe?

```python
print("Olá, mundo!")
```

- ✅ a:

  ```text
  Olá, mundo!
  ```

- ▫️ b:

  ```text
  "Olá, mundo!"
  ```

  - Feedback: As aspas marcam onde o texto começa e termina. Elas não aparecem na tela.
- ▫️ c:

  ```text
  print("Olá, mundo!")
  ```

  - Feedback: O comando não aparece na tela. Aparece só a mensagem que está entre os parênteses.

- Dica 1: Pense no que aparece para quem usa o programa, não no código escrito.
- Dica 2: O print mostra só o que está entre as aspas. Por exemplo, print("Oi") exibe Oi, sem aspas e sem a palavra print.

**Explicação:** O print exibe na tela o texto que está entre as aspas. Nem o comando nem as aspas aparecem na saída.

Conceitos: Exibir texto com print, Texto entre aspas. Objetivo: Perceber que print exibe o texto entre aspas, sem as aspas e sem o comando.

#### u1-l1-e02 — completar lacuna (dificuldade 1)

**Enunciado:** Complete o programa para exibir a mensagem Bom dia.

```python
___1___("Bom dia")
```

Saída esperada:

```text
Bom dia
```

- Lacuna 1: **`print`**, `mostrar`, `Print`

- Dica 1: O comando que mostra mensagens na tela vem do inglês e significa imprimir.
- Dica 2: O Python diferencia maiúsculas de minúsculas, e os comandos dele são escritos todos em minúsculas.

**Explicação:** O comando se chama print, todo em letras minúsculas. O Python não conhece mostrar, e Print com P maiúsculo é outro nome.

Conceitos: Exibir texto com print. Objetivo: Escrever o nome do comando print corretamente, em letras minúsculas.

#### u1-l1-e03 — escolher resultado (dificuldade 1)

**Enunciado:** Um programa pode ter vários comandos. O que este programa exibe?

```python
print("Primeiro")
print("Segundo")
```

- ✅ a:

  ```text
  Primeiro
  Segundo
  ```

- ▫️ b:

  ```text
  Segundo
  Primeiro
  ```

  - Feedback: O Python executa as linhas de cima para baixo.
- ▫️ c:

  ```text
  Primeiro Segundo
  ```

  - Feedback: Cada print termina a linha. O próximo print começa em uma linha nova.

- Dica 1: O Python executa as linhas na ordem em que estão escritas.
- Dica 2: Cada print termina pulando de linha. Dois print seguidos exibem duas linhas, uma embaixo da outra.

**Explicação:** As linhas são executadas de cima para baixo, e cada print exibe uma linha nova. Por isso Primeiro aparece antes de Segundo, em linhas separadas.

Conceitos: Ordem de execução, Exibir texto com print. Objetivo: Prever que cada print exibe uma linha, na ordem em que aparece no código.

#### u1-l1-e04 — ordenar blocos (dificuldade 1)

**Enunciado:** Monte o programa que exibe esta saída.

Saída esperada:

```text
Oi
Tudo bem?
```

- `a`: `print("Oi")`
- `b`: `print("Tudo bem?")`
- `c`: `print(Oi)` (distrator)

Ordens aceitas: a → b

- Dica 1: A primeira linha da saída vem do primeiro print do programa.
- Dica 2: Texto sempre vai entre aspas. Sem aspas, como em print(Ola), o Python procura algo com esse nome e mostra um erro.

**Explicação:** O programa exibe as linhas na ordem em que os print aparecem. O bloco print(Oi) não tem aspas, então o Python procuraria algo chamado Oi e mostraria um erro.

Conceitos: Ordem de execução, Texto entre aspas. Objetivo: Montar um programa de duas linhas na ordem certa e descartar um bloco sem aspas.

#### u1-l1-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  print("Vamos aprender Python")
 2  print("Hoje é o primeiro dia)
 3  print("Até logo")
```

Resposta: linha 2 (SyntaxError). Correção: `print("Hoje é o primeiro dia")`

- Dica 1: Procure um texto que abre aspas mas não fecha.
- Dica 2: Todo texto precisa de aspas no começo e no fim, como em "Bom dia". Se faltar a do fim, o Python não sabe onde o texto termina.

**Explicação:** Na linha 2, o texto abre aspas mas não fecha. Todo texto precisa de aspas no início e no fim; sem isso, o Python mostra um erro de sintaxe (SyntaxError).

Conceitos: Texto entre aspas. Objetivo: Encontrar um texto com as aspas não fechadas.

#### u1-l1-e06 — escolher resultado (dificuldade 2)

**Enunciado:** Qual linha exibe exatamente: Python é legal

Saída esperada:

```text
Python é legal
```

- ✅ a:

  ```python
  print("Python é legal")
  ```

- ▫️ b:

  ```python
  print(Python é legal)
  ```

  - Feedback: Sem aspas, o Python tenta entender as palavras como código e mostra um erro.
- ▫️ c:

  ```python
  "Python é legal"
  ```

  - Feedback: Sem print, o texto existe no programa, mas nada aparece na tela.
- ▫️ d:

  ```python
  Print("Python é legal")
  ```

  - Feedback: Print com P maiúsculo não é o comando print.

- Dica 1: Para exibir um texto, são necessários o comando print, os parênteses e as aspas.
- Dica 2: Confira cada detalhe: o comando em minúsculas e o texto entre aspas dentro dos parênteses, como em print("Oi").

**Explicação:** Para exibir um texto, use print em minúsculas, com o texto entre aspas dentro dos parênteses.

Conceitos: Exibir texto com print, Texto entre aspas. Objetivo: Reconhecer o único comando completo entre opções com erros comuns.

### Variações de revisão

#### u1-l1-r01 — escolher resultado (dificuldade 1)

Variação de u1-l1-e01.

**Enunciado:** O que este programa exibe?

```python
print("Hora do café")
```

- ▫️ a:

  ```text
  "Hora do café"
  ```

  - Feedback: As aspas não aparecem na saída.
- ✅ b:

  ```text
  Hora do café
  ```

- ▫️ c:

  ```text
  (Hora do café)
  ```

  - Feedback: Os parênteses fazem parte do comando e não aparecem na saída.

- Dica 1: Só o conteúdo entre as aspas aparece na tela.
- Dica 2: Aspas e parênteses fazem parte do comando. print("Oi") exibe apenas Oi.

**Explicação:** O print exibe só o texto entre as aspas. Parênteses e aspas fazem parte do comando.

Conceitos: Exibir texto com print, Texto entre aspas. Objetivo: Prever a saída de print com texto em outro contexto.

#### u1-l1-r02 — localizar erro (dificuldade 2)

Variação de u1-l1-e05.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  print("Bem-vindo")
 2  print('Bom dia")
```

Resposta: linha 2 (SyntaxError). Correção: `print('Bom dia')`

- Dica 1: Compare a aspa do início com a do fim de cada texto.
- Dica 2: O Python aceita aspas simples ou duplas, mas o texto precisa começar e terminar com o mesmo tipo: 'Oi' ou "Oi".

**Explicação:** O Python aceita textos com aspas simples ou duplas, desde que o texto comece e termine com o mesmo tipo. Na linha 2, ele abre com aspas simples e tenta fechar com duplas.

Conceitos: Texto entre aspas. Objetivo: Reconhecer que as aspas de abertura e de fechamento precisam ser iguais.

#### u1-l1-r03 — escolher resultado (dificuldade 1)

Variação de u1-l1-e03.

**Enunciado:** O que este programa exibe?

```python
print("Acordar")
print("Tomar café")
print("Estudar")
```

- ▫️ a:

  ```text
  Estudar
  Tomar café
  Acordar
  ```

  - Feedback: As linhas são executadas de cima para baixo, não de baixo para cima.
- ▫️ b:

  ```text
  Acordar Tomar café Estudar
  ```

  - Feedback: Cada print exibe uma linha separada.
- ✅ c:

  ```text
  Acordar
  Tomar café
  Estudar
  ```


- Dica 1: Cada print gera uma linha, na ordem do código.
- Dica 2: O Python executa de cima para baixo, e cada print começa uma nova linha na tela.

**Explicação:** Cada print exibe uma linha, e as linhas aparecem na mesma ordem dos comandos no programa.

Conceitos: Ordem de execução. Objetivo: Prever a ordem de três linhas de saída.

## Lição 2 — Números na tela

Objetivo: Exibir números e resultados de contas, distinguir uma conta de um texto e exibir vários valores em um print.

### Sessão principal

#### u1-l2-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Números são escritos sem aspas. O que este programa exibe?

```python
print(2 + 3)
```

- ▫️ a:

  ```text
  2 + 3
  ```

  - Feedback: Sem aspas, o Python faz a conta antes de exibir.
- ✅ b:

  ```text
  5
  ```

- ▫️ c:

  ```text
  23
  ```

  - Feedback: Com números, o + soma. Ele não junta os algarismos.

- Dica 1: Não há aspas, então não é um texto.
- Dica 2: Sem aspas, o Python faz a conta antes de exibir. Por exemplo, print(1 + 1) exibe 2.

**Explicação:** Sem aspas, 2 + 3 é uma conta. O Python calcula o resultado e o print exibe 5.

Conceitos: Números e contas no print. Objetivo: Perceber que o print exibe o resultado de uma conta escrita sem aspas.

#### u1-l2-e02 — escolher resultado (dificuldade 1)

**Enunciado:** Agora a conta está entre aspas. O que este programa exibe?

```python
print("2 + 3")
```

- ▫️ a:

  ```text
  5
  ```

  - Feedback: Entre aspas, tudo é texto. O Python exibe o que está escrito, sem fazer a conta.
- ▫️ b:

  ```text
  "2 + 3"
  ```

  - Feedback: As aspas não aparecem na saída.
- ✅ c:

  ```text
  2 + 3
  ```


- Dica 1: Repare: agora a conta está entre aspas.
- Dica 2: Tudo o que está entre aspas é texto e aparece exatamente como foi escrito. Por exemplo, print("1 + 1") exibe 1 + 1, sem calcular.

**Explicação:** Tudo o que está entre aspas é texto. O print exibe o texto exatamente como foi escrito, sem calcular nada.

Conceitos: Texto ou número. Objetivo: Distinguir uma conta entre aspas, que é texto, de uma conta de verdade.

#### u1-l2-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Em Python, a multiplicação usa o símbolo *. Complete para exibir o resultado 12.

```python
print(___1___)
```

Saída esperada:

```text
12
```

- Lacuna 1: **`3 * 4`**, `"3 * 4"`, `3 x 4`

- Dica 1: Para o Python calcular, a conta não pode estar entre aspas.
- Dica 2: Em Python, a multiplicação usa o asterisco *. O x não é um símbolo de conta para o Python.

**Explicação:** A conta 3 * 4 sem aspas é calculada e exibe 12. Entre aspas, seria só o texto 3 * 4. Com x, o Python mostraria um erro.

Conceitos: Números e contas no print, Texto ou número. Objetivo: Escrever uma multiplicação com o símbolo * e sem aspas.

#### u1-l2-e04 — escolher resultado (dificuldade 2)

**Enunciado:** A vírgula separa valores dentro do print. O que este programa exibe?

```python
print("Idade:", 30)
```

- ▫️ a:

  ```text
  Idade:30
  ```

  - Feedback: O print coloca um espaço entre os valores separados por vírgula.
- ✅ b:

  ```text
  Idade: 30
  ```

- ▫️ c:

  ```text
  Idade:, 30
  ```

  - Feedback: A vírgula só separa os valores no código. Ela não aparece na saída.

- Dica 1: Repare no que acontece com a vírgula: ela aparece na tela?
- Dica 2: A vírgula separa os valores dentro do print e não aparece na saída. Entre um valor e outro, o print coloca um espaço.

**Explicação:** Com vírgula, o print exibe os valores na mesma linha, separados por um espaço. A vírgula não aparece na saída.

Conceitos: Vários valores no print. Objetivo: Prever como o print exibe dois valores separados por vírgula.

#### u1-l2-e05 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída.

Saída esperada:

```text
Total: 15
Fim
```

- `a`: `print("Total:", 10 + 5)`
- `b`: `print("Fim")`
- `c`: `print("Total:", "10 + 5")` (distrator)

Ordens aceitas: a → b

- Dica 1: A primeira linha da saída mostra o resultado da conta, não a conta.
- Dica 2: Uma conta sem aspas é calculada; entre aspas, ela vira texto. Por exemplo, print("Valor:", 2 + 2) exibe Valor: 4.

**Explicação:** Em print("Total:", 10 + 5), o texto vem entre aspas e a conta fica sem aspas, então o Python exibe o resultado 15. Depois, print("Fim") exibe a segunda linha.

Conceitos: Vários valores no print, Números e contas no print, Texto ou número. Objetivo: Combinar texto e o resultado de uma conta no mesmo print.

#### u1-l2-e06 — localizar erro (dificuldade 2)

**Enunciado:** O programa deveria exibir a saída abaixo, mas mostra outra coisa. Selecione a linha com o problema.

```python
 1  print("Calculando...")
 2  print("Soma:", "5 + 3")
```

Saída esperada:

```text
Calculando...
Soma: 8
```

Resposta: linha 2 (saida_incorreta). Correção: `print("Soma:", 5 + 3)`

- Dica 1: A primeira linha da saída já está certa. O problema está na conta.
- Dica 2: Entre aspas, uma conta vira texto e não é calculada: print("1 + 1") exibe 1 + 1, e não 2.

**Explicação:** Na linha 2, a conta 5 + 3 está entre aspas e é exibida como texto. Sem as aspas, o Python calcula e exibe 8.

Conceitos: Texto ou número, Vários valores no print. Objetivo: Encontrar uma conta escrita entre aspas por engano.

#### u1-l2-e07 — escolher resultado (dificuldade 2)

**Enunciado:** Qual programa exibe exatamente: 10 20

Saída esperada:

```text
10 20
```

- ▫️ a:

  ```python
  print(10 + 20)
  ```

  - Feedback: O + soma os números e exibe 30.
- ✅ b:

  ```python
  print(10, 20)
  ```

- ▫️ c:

  ```python
  print("10, 20")
  ```

  - Feedback: Entre aspas, a vírgula faz parte do texto e aparece na saída.

- Dica 1: Na saída, os dois números aparecem lado a lado, separados por um espaço, sem conta.
- Dica 2: A vírgula do print exibe vários valores na mesma linha, com um espaço entre eles. Já o + soma os números.

**Explicação:** Em print(10, 20), a vírgula separa dois valores, e o print os exibe com um espaço entre eles.

Conceitos: Vários valores no print, Números e contas no print. Objetivo: Escolher o programa que exibe dois números separados por espaço.

### Variações de revisão

#### u1-l2-r01 — escolher resultado (dificuldade 1)

Variação de u1-l2-e01.

**Enunciado:** O que este programa exibe?

```python
print(10 - 4)
```

- ✅ a:

  ```text
  6
  ```

- ▫️ b:

  ```text
  10 - 4
  ```

  - Feedback: Sem aspas, a conta é calculada antes de ser exibida.
- ▫️ c:

  ```text
  14
  ```

  - Feedback: O sinal - faz uma subtração.

- Dica 1: É uma conta sem aspas.
- Dica 2: Sem aspas, o Python calcula antes de exibir: print(9 - 2) exibe 7.

**Explicação:** Sem aspas, 10 - 4 é uma conta. O print exibe o resultado, 6.

Conceitos: Números e contas no print. Objetivo: Prever o resultado de uma subtração no print.

#### u1-l2-r02 — escolher resultado (dificuldade 1)

Variação de u1-l2-e02.

**Enunciado:** O que este programa exibe?

```python
print("4 * 2")
```

- ▫️ a:

  ```text
  8
  ```

  - Feedback: Entre aspas, a conta é só texto e não é calculada.
- ✅ b:

  ```text
  4 * 2
  ```

- ▫️ c:

  ```text
  42
  ```

  - Feedback: O print exibe o texto exatamente como foi escrito.

- Dica 1: Repare nas aspas.
- Dica 2: Entre aspas, tudo é texto, inclusive contas: print("9 - 2") exibe 9 - 2.

**Explicação:** Como está entre aspas, 4 * 2 é um texto. O print exibe o texto como foi escrito.

Conceitos: Texto ou número. Objetivo: Distinguir uma multiplicação entre aspas de uma conta.

#### u1-l2-r03 — escolher resultado (dificuldade 2)

Variação de u1-l2-e04.

**Enunciado:** O que este programa exibe?

```python
print("Ano:", 2000 + 26)
```

- ▫️ a:

  ```text
  Ano: 2000 + 26
  ```

  - Feedback: A conta está sem aspas, então é calculada.
- ▫️ b:

  ```text
  Ano:2026
  ```

  - Feedback: A vírgula do print coloca um espaço entre os valores.
- ✅ c:

  ```text
  Ano: 2026
  ```


- Dica 1: Primeiro o Python calcula a conta; depois o print junta os valores.
- Dica 2: A vírgula não aparece na tela: o print coloca um espaço entre os valores. print("Total:", 1 + 1) exibe Total: 2.

**Explicação:** O Python calcula 2000 + 26 e o print exibe o texto e o resultado separados por um espaço.

Conceitos: Vários valores no print, Números e contas no print. Objetivo: Prever a saída de texto e conta separados por vírgula.

## Lição 3 — Guardando valores

Objetivo: Criar variáveis com =, usá-las no print, distinguir variável de texto e reconhecer nomes inválidos.

### Sessão principal

#### u1-l3-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Uma variável guarda um valor com um nome. O sinal = guarda o valor da direita no nome da esquerda. O que este programa exibe?

```python
nome = "Ana"
print(nome)
```

- ▫️ a:

  ```text
  nome
  ```

  - Feedback: Sem aspas, nome é a variável. O print exibe o valor guardado nela.
- ✅ b:

  ```text
  Ana
  ```

- ▫️ c:

  ```text
  "Ana"
  ```

  - Feedback: As aspas não aparecem na saída.

- Dica 1: A primeira linha guarda um valor na variável nome.
- Dica 2: O print de uma variável, sem aspas, exibe o valor guardado nela. Depois de cor = "azul", print(cor) exibe azul.

**Explicação:** A linha nome = "Ana" guarda o texto Ana na variável nome. O print(nome) exibe o valor guardado, Ana.

Conceitos: Criar variáveis. Objetivo: Prever que o print de uma variável exibe o valor guardado nela.

#### u1-l3-e02 — escolher resultado (dificuldade 2)

**Enunciado:** Repare nas aspas do print. O que este programa exibe?

```python
cidade = "Recife"
print("cidade")
```

- ▫️ a:

  ```text
  Recife
  ```

  - Feedback: Com aspas, "cidade" é só um texto. A variável não é usada.
- ✅ b:

  ```text
  cidade
  ```

- ▫️ c: O programa mostra um erro
  - Feedback: O programa funciona. O print recebe um texto comum.

- Dica 1: Repare nas aspas dentro do print.
- Dica 2: Com aspas é texto; sem aspas é variável. print("cor") exibe a palavra cor, mesmo que exista uma variável com esse nome.

**Explicação:** Com aspas, "cidade" é um texto como qualquer outro, e o print o exibe como está. Para exibir Recife, seria print(cidade), sem aspas.

Conceitos: Variável ou texto. Objetivo: Perceber que o nome entre aspas é um texto e não usa a variável.

#### u1-l3-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para guardar 25 na variável idade e depois exibi-la.

```python
idade ___1___ 25
print(___2___)
```

Saída esperada:

```text
25
```

- Lacuna 1: **`=`**, `==`, `=>`
- Lacuna 2: **`idade`**, `"idade"`, `Idade`

- Dica 1: Para guardar um valor numa variável, usa-se um único sinal de igual.
- Dica 2: No print, a variável vai sem aspas e escrita exatamente como foi criada, com as mesmas letras maiúsculas e minúsculas.

**Explicação:** O sinal = guarda 25 na variável idade. Depois, print(idade) exibe o valor guardado. Com aspas, seria exibido o texto idade; com I maiúsculo, seria outro nome.

Conceitos: Criar variáveis, Variável ou texto. Objetivo: Escrever uma atribuição com = e usar a variável no print.

#### u1-l3-e04 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  pais = "Brasil"
 2  print("Moro no")
 3  print(Pais)
```

Resposta: linha 3 (NameError). Correção: `print(pais)`

- Dica 1: Compare o nome criado na linha 1 com o nome usado depois.
- Dica 2: Para o Python, uma letra maiúscula muda o nome: nota e Nota são variáveis diferentes.

**Explicação:** Pais e pais são nomes diferentes para o Python. Como Pais nunca foi criada, a linha 3 mostra um erro de nome (NameError).

Conceitos: Variável ou texto, Nomes de variáveis. Objetivo: Reconhecer que maiúsculas e minúsculas diferenciam nomes de variáveis.

#### u1-l3-e05 — escolher resultado (dificuldade 2)

**Enunciado:** Nomes de variáveis não têm espaços nem começam com número. Qual programa exibe: Maria

Saída esperada:

```text
Maria
```

- ▫️ a:

  ```python
  nome completo = "Maria"
  print(nome completo)
  ```

  - Feedback: Um nome de variável não pode ter espaço.
- ▫️ b:

  ```python
  1nome = "Maria"
  print(1nome)
  ```

  - Feedback: Um nome de variável não pode começar com número.
- ✅ c:

  ```python
  nome_completo = "Maria"
  print(nome_completo)
  ```


- Dica 1: Nomes de variáveis não podem ter espaços nem começar com número.
- Dica 2: No lugar do espaço, use _ para separar as palavras, como em data_nascimento.

**Explicação:** Nomes de variáveis usam letras, números e _, mas não podem ter espaços nem começar com número. Por isso nome_completo funciona.

Conceitos: Nomes de variáveis. Objetivo: Reconhecer nomes de variáveis válidos e inválidos.

#### u1-l3-e06 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída. Lembre que uma variável precisa ser criada antes de ser usada.

Saída esperada:

```text
Produto: caderno
Preço: 12
```

- `a`: `produto = "caderno"`
- `b`: `preco = 12`
- `c`: `print("Produto:", produto)`
- `d`: `print("Preço:", preco)`
- `e`: `print("Produto:", "produto")` (distrator)

Ordens aceitas: a → b → c → d; a → c → b → d; b → a → c → d

- Dica 1: Cada variável precisa ser criada, com =, antes do print que a usa.
- Dica 2: No print, o nome da variável fica sem aspas. Com aspas, o print exibiria o próprio nome, e não o valor guardado.

**Explicação:** Cada print só funciona depois que sua variável foi criada. Por isso as atribuições vêm antes dos print que as usam; a ordem entre elas pode variar.

Conceitos: Criar variáveis, Vários valores no print. Objetivo: Criar variáveis antes de usá-las e aceitar ordens equivalentes.

#### u1-l3-e07 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
pontos = 10
print("Pontos:", pontos)
```

- ✅ a:

  ```text
  Pontos: 10
  ```

- ▫️ b:

  ```text
  Pontos: pontos
  ```

  - Feedback: O segundo valor não tem aspas, então é a variável. O print exibe o valor dela.
- ▫️ c:

  ```text
  Pontos:10
  ```

  - Feedback: A vírgula do print coloca um espaço entre os valores.

- Dica 1: O primeiro valor do print é texto; o segundo é uma variável.
- Dica 2: A variável é trocada pelo valor guardado nela, e a vírgula coloca um espaço entre os valores.

**Explicação:** O print exibe o texto Pontos: e o valor guardado em pontos, separados por um espaço.

Conceitos: Criar variáveis, Vários valores no print. Objetivo: Prever a saída de texto e variável no mesmo print.

### Variações de revisão

#### u1-l3-r01 — escolher resultado (dificuldade 2)

Variação de u1-l3-e02.

**Enunciado:** O que este programa exibe?

```python
fruta = "manga"
print("fruta", fruta)
```

- ✅ a:

  ```text
  fruta manga
  ```

- ▫️ b:

  ```text
  manga manga
  ```

  - Feedback: O primeiro valor está entre aspas, então é só o texto fruta.
- ▫️ c:

  ```text
  fruta fruta
  ```

  - Feedback: O segundo valor está sem aspas, então é a variável, que guarda manga.

- Dica 1: Analise cada valor separado pela vírgula.
- Dica 2: O valor com aspas é exibido como está; o valor sem aspas é uma variável e mostra o que ela guarda.

**Explicação:** O primeiro valor, com aspas, é o texto fruta. O segundo, sem aspas, é a variável, que guarda manga.

Conceitos: Variável ou texto, Vários valores no print. Objetivo: Distinguir texto e variável com o mesmo nome no mesmo print.

#### u1-l3-r02 — localizar erro (dificuldade 2)

Variação de u1-l3-e04.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  mensagem = "Boa sorte"
 2  print(mesagem)
```

Resposta: linha 2 (NameError). Correção: `print(mensagem)`

- Dica 1: Compare o nome letra por letra.
- Dica 2: Se o nome usado não for exatamente igual ao criado, o Python não encontra a variável e mostra um NameError.

**Explicação:** Na linha 2 falta uma letra no nome. Para o Python, mesagem é um nome que nunca foi criado, por isso ele mostra um NameError.

Conceitos: Variável ou texto, Nomes de variáveis. Objetivo: Encontrar uma variável usada com o nome escrito errado.

#### u1-l3-r03 — escolher resultado (dificuldade 2)

Variação de u1-l3-e01.

**Enunciado:** O que este programa exibe?

```python
total = 3 * 5
print(total)
```

- ▫️ a:

  ```text
  3 * 5
  ```

  - Feedback: A conta é calculada antes de ser guardada na variável.
- ▫️ b:

  ```text
  total
  ```

  - Feedback: Sem aspas, total é a variável.
- ✅ c:

  ```text
  15
  ```


- Dica 1: Primeiro o Python calcula o lado direito do =.
- Dica 2: A variável guarda o resultado da conta, não a conta: depois de x = 2 + 2, x vale 4.

**Explicação:** O Python calcula 3 * 5 e guarda o resultado, 15, na variável total. O print exibe 15.

Conceitos: Criar variáveis, Números e contas no print. Objetivo: Perceber que a variável guarda o resultado de uma conta.

## Lição 4 — Mudando valores

Objetivo: Prever o valor de uma variável depois de reatribuições e atualizações, respeitando a ordem das linhas.

### Sessão principal

#### u1-l4-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Uma variável pode receber um novo valor. O que este programa exibe?

```python
cor = "azul"
cor = "verde"
print(cor)
```

- ▫️ a:

  ```text
  azul
  ```

  - Feedback: A segunda linha guarda verde no lugar de azul.
- ▫️ b:

  ```text
  azul
  verde
  ```

  - Feedback: Uma variável guarda um valor por vez.
- ✅ c:

  ```text
  verde
  ```


- Dica 1: Uma variável guarda só um valor por vez.
- Dica 2: Uma nova atribuição apaga o valor antigo. Depois de x = 1 e x = 2, x vale 2.

**Explicação:** A segunda atribuição substitui o valor anterior. Quando o print é executado, cor guarda verde.

Conceitos: Trocar o valor de uma variável. Objetivo: Perceber que uma nova atribuição substitui o valor anterior.

#### u1-l4-e02 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
nivel = 1
print(nivel)
nivel = 2
print(nivel)
```

- ▫️ a:

  ```text
  2
  2
  ```

  - Feedback: O primeiro print é executado antes da mudança, quando nivel ainda vale 1.
- ✅ b:

  ```text
  1
  2
  ```

- ▫️ c:

  ```text
  1
  1
  ```

  - Feedback: A linha 3 muda o valor antes do segundo print.

- Dica 1: Siga as linhas de cima para baixo, anotando o valor de nivel.
- Dica 2: Cada print mostra o valor que a variável tem naquele momento. Mudar a variável depois não altera o que já foi exibido.

**Explicação:** As linhas são executadas em ordem. O primeiro print acontece quando nivel vale 1; o segundo, depois da mudança para 2.

Conceitos: Trocar o valor de uma variável, Ordem de execução. Objetivo: Prever que cada print usa o valor da variável naquele momento.

#### u1-l4-e03 — escolher resultado (dificuldade 2)

**Enunciado:** À direita do =, o Python usa o valor atual da variável. O que este programa exibe?

```python
pontos = 10
pontos = pontos + 5
print(pontos)
```

- ✅ a:

  ```text
  15
  ```

- ▫️ b:

  ```text
  10
  ```

  - Feedback: A linha 2 calcula 10 + 5 e guarda o resultado em pontos.
- ▫️ c:

  ```text
  pontos + 5
  ```

  - Feedback: A conta está sem aspas, então é calculada.

- Dica 1: Primeiro o Python calcula o lado direito do =.
- Dica 2: Em x = x + 1, o Python usa o valor atual de x, soma 1 e guarda o resultado de volta em x.

**Explicação:** Na linha 2, o Python calcula pontos + 5 com o valor atual, 10, e guarda 15 de volta em pontos.

Conceitos: Atualizar uma variável. Objetivo: Prever o resultado de uma atualização que usa o próprio valor da variável.

#### u1-l4-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para aumentar o número de vidas em 1.

```python
vidas = 3
vidas = ___1___
print(vidas)
```

Saída esperada:

```text
4
```

- Lacuna 1: **`vidas + 1`**, `vidas - 1`, `"vidas + 1"`

- Dica 1: O novo valor de vidas é o valor atual mais 1.
- Dica 2: Para atualizar uma variável, use o próprio nome no lado direito, sem aspas: x = x + 2 aumenta x em 2.

**Explicação:** vidas = vidas + 1 calcula 3 + 1 e guarda 4 em vidas. Entre aspas, a conta viraria texto.

Conceitos: Atualizar uma variável. Objetivo: Escrever uma atualização que soma 1 ao valor atual.

#### u1-l4-e05 — localizar erro (dificuldade 3)

**Enunciado:** O programa deveria exibir o saldo depois de um gasto, mas mostra outro valor. Selecione a linha com o problema.

```python
 1  saldo = 100
 2  gasto = 30
 3  saldo = saldo + gasto
 4  print("Saldo:", saldo)
```

Saída esperada:

```text
Saldo: 70
```

Resposta: linha 3 (saida_incorreta). Correção: `saldo = saldo - gasto`

- Dica 1: Um gasto deve diminuir o saldo. Procure a linha que muda o saldo.
- Dica 2: Para descontar um valor, a conta usa o sinal de menos, como em total = total - 10.

**Explicação:** A linha 3 soma o gasto ao saldo. Para descontar, a conta deve ser saldo - gasto, que resulta em 70.

Conceitos: Atualizar uma variável. Objetivo: Encontrar uma atualização com a operação errada.

#### u1-l4-e06 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída.

Saída esperada:

```text
Antes: 5
Depois: 6
```

- `a`: `numero = 5`
- `b`: `print("Antes:", numero)`
- `c`: `numero = numero + 1`
- `d`: `print("Depois:", numero)`
- `e`: `print("Depois:", "numero")` (distrator)

Ordens aceitas: a → b → c → d

- Dica 1: O primeiro print precisa acontecer antes da atualização.
- Dica 2: As linhas rodam em ordem: crie a variável, exiba, atualize e exiba de novo. No print, a variável fica sem aspas.

**Explicação:** A variável é criada, exibida, atualizada e exibida de novo. Se a atualização viesse antes do primeiro print, os dois mostrariam 6.

Conceitos: Atualizar uma variável, Ordem de execução, Vários valores no print. Objetivo: Montar um programa que exibe uma variável antes e depois de atualizá-la.

#### u1-l4-e07 — escolher resultado (dificuldade 3)

**Enunciado:** O que este programa exibe?

```python
preco = 4
preco_antigo = preco
preco = 10
print(preco_antigo)
```

- ▫️ a:

  ```text
  10
  ```

  - Feedback: preco_antigo recebeu o valor 4 na linha 2. Mudar preco depois não altera preco_antigo.
- ✅ b:

  ```text
  4
  ```

- ▫️ c:

  ```text
  preco
  ```

  - Feedback: Sem aspas, preco_antigo é uma variável, e o print exibe o valor dela.

- Dica 1: Na linha 2, qual valor preco guarda?
- Dica 2: Siga linha por linha. A linha 3 dá um novo valor a preco; ela não menciona preco_antigo.

**Explicação:** Na linha 2, preco_antigo recebe o valor que preco tinha naquele momento, 4. A mudança de preco na linha 3 não altera preco_antigo.

Conceitos: Trocar o valor de uma variável, Ordem de execução. Objetivo: Perceber que copiar o valor de uma variável não liga as duas variáveis.

### Variações de revisão

#### u1-l4-r01 — escolher resultado (dificuldade 1)

Variação de u1-l4-e01.

**Enunciado:** O que este programa exibe?

```python
nome = "Léo"
nome = "Lia"
print(nome)
```

- ✅ a:

  ```text
  Lia
  ```

- ▫️ b:

  ```text
  Léo
  ```

  - Feedback: A segunda atribuição substitui Léo por Lia.
- ▫️ c:

  ```text
  Léo Lia
  ```

  - Feedback: A variável guarda só o último valor atribuído.

- Dica 1: Qual foi o último valor guardado antes do print?
- Dica 2: Uma nova atribuição substitui o valor antigo; a variável não guarda os dois.

**Explicação:** A segunda linha substitui o valor de nome. No momento do print, nome guarda Lia.

Conceitos: Trocar o valor de uma variável. Objetivo: Prever o valor após uma reatribuição de texto.

#### u1-l4-r02 — escolher resultado (dificuldade 2)

Variação de u1-l4-e03.

**Enunciado:** O que este programa exibe?

```python
moedas = 20
moedas = moedas - 5
moedas = moedas - 5
print(moedas)
```

- ▫️ a:

  ```text
  15
  ```

  - Feedback: Há duas atualizações; cada uma tira 5 do valor atual.
- ✅ b:

  ```text
  10
  ```

- ▫️ c:

  ```text
  20
  ```

  - Feedback: As linhas 2 e 3 alteram o valor de moedas antes do print.

- Dica 1: Anote o valor de moedas depois de cada linha.
- Dica 2: Cada linha usa o valor atual: se x vale 10, x = x - 1 deixa x com 9, e repetir a linha deixa com 8.

**Explicação:** A linha 2 muda moedas de 20 para 15, e a linha 3, de 15 para 10.

Conceitos: Atualizar uma variável. Objetivo: Prever o resultado de duas atualizações seguidas.

#### u1-l4-r03 — escolher resultado (dificuldade 3)

Variação de u1-l4-e07.

**Enunciado:** O que este programa exibe?

```python
meta = 3
copia = meta
meta = meta + 1
print(copia, meta)
```

- ▫️ a:

  ```text
  4 4
  ```

  - Feedback: copia recebeu 3 antes da atualização e continua com esse valor.
- ▫️ b:

  ```text
  3 3
  ```

  - Feedback: A linha 3 atualiza meta para 4.
- ✅ c:

  ```text
  3 4
  ```


- Dica 1: A linha 2 copia o valor de meta naquele momento.
- Dica 2: Anote o valor de cada variável depois de cada linha. A linha 3 dá um novo valor só a meta; nenhuma linha depois da 2 menciona copia.

**Explicação:** copia recebe 3 na linha 2. Depois, só meta é atualizada para 4. Por isso o print exibe 3 e 4.

Conceitos: Trocar o valor de uma variável, Atualizar uma variável, Vários valores no print. Objetivo: Perceber que uma cópia mantém o valor antigo depois de uma atualização.

## Lição 5 — Desafio: cartão de apresentação

Objetivo: Montar, em etapas, um programa que exibe um cartão com nome, idade e cidade usando variáveis e print.

### Sessão principal

#### u1-l5-e01 — completar lacuna (dificuldade 2)

**Enunciado:** Etapa 1: guarde os dados do cartão. Complete para que o programa exiba a saída abaixo.

```python
nome = ___1___
idade = ___2___
print(nome, idade)
```

Saída esperada:

```text
Bia 28
```

- Lacuna 1: **`"Bia"`**, `Bia`, `nome`
- Lacuna 2: **`28`**, `idade`, `"vinte e oito"`

- Dica 1: Texto precisa de aspas; número não.
- Dica 2: Sem aspas, o Python entende um nome como variável, e ainda não existe nenhuma variável chamada Bia nesse ponto do programa.

**Explicação:** O nome é um texto, então vai entre aspas. A idade é um número e fica sem aspas. O print exibe os dois valores separados por espaço.

Conceitos: Criar variáveis, Texto entre aspas, Números e contas no print. Objetivo: Guardar um texto e um número em variáveis.

#### u1-l5-e02 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 2: cada linha do cartão tem um rótulo e um valor. O que este programa exibe?

```python
nome = "Bia"
idade = 28
print("Nome:", nome)
print("Idade:", idade)
```

- ▫️ a:

  ```text
  Nome: nome
  Idade: idade
  ```

  - Feedback: Em cada print, o segundo valor está sem aspas, então é uma variável, e o print exibe o valor guardado nela.
- ✅ b:

  ```text
  Nome: Bia
  Idade: 28
  ```

- ▫️ c:

  ```text
  Nome: Bia Idade: 28
  ```

  - Feedback: Cada print exibe sua própria linha.

- Dica 1: Em cada print, o primeiro valor é texto e o segundo é variável.
- Dica 2: A variável é trocada pelo valor guardado, e cada print exibe uma linha separada.

**Explicação:** Cada print exibe um rótulo entre aspas e o valor de uma variável, em linhas separadas.

Conceitos: Vários valores no print, Variável ou texto. Objetivo: Prever a saída de linhas do cartão com rótulos e variáveis.

#### u1-l5-e03 — localizar erro (dificuldade 2)

**Enunciado:** Etapa 3: o cartão ganhou a cidade, mas o programa mostra um erro. Selecione a linha com o problema.

```python
 1  nome = "Bia"
 2  cidade = "Salvador"
 3  print("Nome:", nome)
 4  print("Cidade:", Cidade)
```

Resposta: linha 4 (NameError). Correção: `print("Cidade:", cidade)`

- Dica 1: Compare os nomes criados com os nomes usados.
- Dica 2: O Python diferencia maiúsculas de minúsculas: usar um nome com uma letra diferente é usar um nome que não existe.

**Explicação:** A variável criada foi cidade, com c minúsculo. Na linha 4, Cidade é outro nome, que não existe, e o Python mostra um NameError.

Conceitos: Variável ou texto, Nomes de variáveis. Objetivo: Encontrar uma variável escrita com letra maiúscula por engano.

#### u1-l5-e04 — ordenar blocos (dificuldade 3)

**Enunciado:** Etapa 4: monte o programa que exibe esta parte do cartão.

Saída esperada:

```text
Cartão de apresentação
Nome: Bia
Cidade: Salvador
```

- `a`: `nome = "Bia"`
- `b`: `cidade = "Salvador"`
- `c`: `print("Cartão de apresentação")`
- `d`: `print("Nome:", nome)`
- `e`: `print("Cidade:", cidade)`

Ordens aceitas: a → b → c → d → e; a → c → b → d → e; a → c → d → b → e; b → a → c → d → e; b → c → a → d → e; c → a → b → d → e; c → a → d → b → e; c → b → a → d → e

- Dica 1: Os print aparecem na mesma ordem das linhas da saída.
- Dica 2: Cada variável precisa ser criada antes do print que a usa. A posição das atribuições pode variar, desde que venham antes.

**Explicação:** Os três print seguem a ordem da saída, e cada variável é criada antes de ser usada. As atribuições podem vir em posições diferentes, desde que antes do seu print.

Conceitos: Criar variáveis, Ordem de execução, Vários valores no print. Objetivo: Montar parte do cartão criando variáveis antes de usá-las, com mais de uma ordem válida.

#### u1-l5-e05 — completar lacuna (dificuldade 2)

**Enunciado:** Etapa 5: Bia fez aniversário. Complete para atualizar a idade e exibir a saída abaixo.

```python
idade = 28
idade = ___1___
print("Idade:", ___2___)
```

Saída esperada:

```text
Idade: 29
```

- Lacuna 1: **`idade + 1`**, `idade - 1`, `idade`
- Lacuna 2: **`idade`**, `"idade"`, `Idade`

- Dica 1: Depois do aniversário, a idade é a atual mais 1.
- Dica 2: Atualize usando o próprio nome, como em x = x + 1. No print, a variável vai sem aspas e com o mesmo nome criado.

**Explicação:** idade = idade + 1 guarda 29 em idade. Depois, o print exibe o rótulo e o valor atualizado.

Conceitos: Atualizar uma variável, Variável ou texto. Objetivo: Atualizar a idade e exibir o novo valor.

#### u1-l5-e06 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 6: qual programa exibe exatamente: Cidade: Salvador

Saída esperada:

```text
Cidade: Salvador
```

- ▫️ a:

  ```python
  print("Cidade:", cidade)
  cidade = "Salvador"
  ```

  - Feedback: A variável é usada antes de ser criada, e o Python mostra um erro.
- ▫️ b:

  ```python
  cidade = "Salvador"
  print("Cidade:", "cidade")
  ```

  - Feedback: Com aspas, "cidade" é um texto e aparece como está.
- ✅ c:

  ```python
  cidade = "Salvador"
  print("Cidade:", cidade)
  ```


- Dica 1: Confira a ordem das linhas e as aspas no print.
- Dica 2: Uma variável só pode ser usada depois de criada, e no print ela fica sem aspas para mostrar o valor guardado.

**Explicação:** A variável precisa ser criada antes de ser usada e aparecer no print sem aspas.

Conceitos: Ordem de execução, Variável ou texto. Objetivo: Escolher o programa que cria a variável antes de usá-la e a usa sem aspas.

#### u1-l5-e07 — ordenar blocos (dificuldade 3)

**Enunciado:** Etapa final: os dados já estão guardados. Monte o cartão completo.

Linhas fixas antes:

```python
nome = "Bia"
idade = 29
cidade = "Salvador"
```

Saída esperada:

```text
Cartão de apresentação
Nome: Bia
Idade: 29
Cidade: Salvador
```

- `a`: `print("Cartão de apresentação")`
- `b`: `print("Nome:", nome)`
- `c`: `print("Idade:", idade)`
- `d`: `print("Cidade:", cidade)`
- `e`: `print("Nome:", "nome")` (distrator)

Ordens aceitas: a → b → c → d

- Dica 1: Siga a ordem das linhas da saída.
- Dica 2: Repare nas aspas: print("Nome:", "nome") exibiria a palavra nome, e não o valor da variável.

**Explicação:** Cada print exibe uma linha do cartão, na ordem da saída. O bloco com "nome" entre aspas exibiria a palavra nome, não Bia.

Conceitos: Vários valores no print, Ordem de execução, Variável ou texto. Objetivo: Montar o cartão completo a partir de variáveis já criadas.

### Variações de revisão

#### u1-l5-r01 — localizar erro (dificuldade 2)

Variação de u1-l5-e03.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  nome = "Davi"
 2  print("Nome:", nome)
 3  print("Cidade:, "Natal")
```

Resposta: linha 3 (SyntaxError). Correção: `print("Cidade:", "Natal")`

- Dica 1: Confira se cada texto abre e fecha as próprias aspas.
- Dica 2: Num print com vários valores, cada texto tem as suas aspas, e a vírgula fica fora delas: print("A", "B").

**Explicação:** Na linha 3, o texto Cidade: não fecha as aspas antes da vírgula. Cada texto do print precisa das próprias aspas.

Conceitos: Texto entre aspas, Vários valores no print. Objetivo: Encontrar aspas não fechadas em uma linha do cartão.
