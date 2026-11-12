# Unidade 4 — Listas e repetição: versão de leitura

Gerado por `ferramentas/verificar_conteudo.py` a partir dos arquivos YAML. Não edite à mão.

## Lição 1 — Listas

Objetivo: Criar uma lista e prever o que o print e o len mostram.

### Sessão principal

#### u4-l1-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Uma lista guarda vários valores entre colchetes. O que este programa exibe?

```python
frutas = ["maçã", "uva"]
print(frutas)
```

- ✅ a:

  ```text
  ['maçã', 'uva']
  ```

- ▫️ b:

  ```text
  maçã uva
  ```

  - Feedback: O print de uma lista mostra a lista inteira, com os colchetes.
- ▫️ c:

  ```text
  ["maçã", "uva"]
  ```

  - Feedback: Na tela, os textos de uma lista aparecem com aspas simples.
- ▫️ d:

  ```text
  frutas
  ```

  - Feedback: Sem aspas, frutas é o nome da variável; o print mostra o valor guardado nela.

- Dica 1: O print mostra a lista do jeito que o Python a escreve, com colchetes.
- Dica 2: Ao mostrar uma lista, o Python usa aspas simples nos textos: print(["sim"]) exibe ['sim'].

**Explicação:** O print de uma lista mostra os colchetes e as vírgulas. Os textos aparecem entre aspas simples, mesmo que o código use aspas duplas.

Conceitos: Listas. Objetivo: Prever que o print de uma lista mostra colchetes e aspas simples.

#### u4-l1-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O len diz quantos valores uma lista tem. O que este programa exibe?

```python
nomes = ["Ana", "Bia", "Caio"]
print(len(nomes))
```

- ▫️ a:

  ```text
  2
  ```

  - Feedback: Conte os valores entre os colchetes, um por um.
- ✅ b:

  ```text
  3
  ```

- ▫️ c:

  ```text
  10
  ```

  - Feedback: O len de uma lista conta os valores, não as letras.

- Dica 1: Quantos textos há entre os colchetes?
- Dica 2: O len de uma lista conta os valores separados por vírgula: len([7, 8]) dá 2.

**Explicação:** A lista tem três valores, então len(nomes) é 3. O len de uma lista conta os valores, não as letras de cada um.

Conceitos: Listas. Objetivo: Usar len para contar os valores de uma lista.

#### u4-l1-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Complete o programa para criar a lista de preços.

```python
precos = ___1___10, 20, 30___2___
print(precos)
```

Saída esperada:

```text
[10, 20, 30]
```

- Lacuna 1: **`[`**, `(`, `{`
- Lacuna 2: **`]`**, `)`, `}`

- Dica 1: Repare nos sinais que aparecem na saída.
- Dica 2: Uma lista começa com [ e termina com ]. Por exemplo: notas = [7, 9].

**Explicação:** Listas são escritas entre colchetes, [ e ]. Parênteses e chaves criam outros tipos de valor, que aparecem diferente na tela.

Conceitos: Listas. Objetivo: Escrever uma lista com colchetes.

#### u4-l1-e04 — escolher resultado (dificuldade 2)

**Enunciado:** Uma lista pode misturar textos e números. O que este programa exibe?

```python
cadastro = ["Ana", 30]
print(cadastro)
```

- ▫️ a:

  ```text
  ['Ana', '30']
  ```

  - Feedback: 30 foi escrito sem aspas, então é número e aparece sem aspas.
- ✅ b:

  ```text
  ['Ana', 30]
  ```

- ▫️ c:

  ```text
  [Ana, 30]
  ```

  - Feedback: Ao mostrar uma lista, os textos aparecem entre aspas simples.
- ▫️ d:

  ```text
  Ana 30
  ```

  - Feedback: O print de uma lista mostra os colchetes e as vírgulas.

- Dica 1: Qual dos dois valores foi escrito entre aspas no código?
- Dica 2: Numa lista mostrada na tela, textos aparecem com aspas simples e números sem aspas: ["a", 1] aparece como ['a', 1].

**Explicação:** "Ana" é texto e aparece com aspas simples; 30 é número e aparece sem aspas.

Conceitos: Listas. Objetivo: Perceber que números aparecem sem aspas e textos com aspas simples numa lista.

#### u4-l1-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  cores = ["azul", "verde", "rosa"
 2  print(len(cores))
```

Resposta: linha 1 (SyntaxError). Correção: `cores = ["azul", "verde", "rosa"]`

- Dica 1: Toda lista que abre um colchete precisa fechá-lo.
- Dica 2: Uma lista começa com [ e termina com ], na mesma linha: dias = ["seg", "ter"].

**Explicação:** A lista da linha 1 abre o colchete e não fecha. Sem o ], o Python não sabe onde a lista termina e mostra um erro de sintaxe.

Conceitos: Listas. Objetivo: Encontrar uma lista sem o colchete de fechar.

#### u4-l1-e06 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que mostra quantos pedidos há na lista.

Saída esperada:

```text
2
```

- `a`: `pedidos = ["suco", "pão"]`
- `b`: `print(len(pedidos))`
- `c`: `print(len("pedidos"))` (distrator)
- `d`: `print(len(pedidos)` (distrator)

Ordens aceitas: a → b

- Dica 1: A lista precisa existir antes de ser contada.
- Dica 2: Entre aspas, "pedidos" é um texto de 7 letras, não a lista. Para contar a lista, use o nome dela sem aspas.

**Explicação:** Primeiro o programa cria a lista e depois conta os valores com len(pedidos). Com aspas, len("pedidos") contaria as letras da palavra.

Conceitos: Listas. Objetivo: Montar um programa que cria uma lista e mostra quantos valores ela tem.

#### u4-l1-e07 — escolher resultado (dificuldade 3)

**Enunciado:** Repare nas aspas. O que este programa exibe?

```python
itens = ["arroz, feijão", "café"]
print(len(itens))
```

- ▫️ a:

  ```text
  3
  ```

  - Feedback: A vírgula entre arroz e feijão está dentro das aspas, então faz parte do texto.
- ✅ b:

  ```text
  2
  ```

- ▫️ c:

  ```text
  1
  ```

  - Feedback: Há uma vírgula fora das aspas separando dois valores.

- Dica 1: Quantas vírgulas estão fora das aspas?
- Dica 2: Só as vírgulas fora das aspas separam valores: ["a, b"] tem um valor só.

**Explicação:** A lista tem dois textos, "arroz, feijão" e "café". A vírgula dentro das aspas faz parte do primeiro texto.

Conceitos: Listas. Objetivo: Perceber que a vírgula dentro das aspas faz parte do texto, e não separa valores.

### Variações de revisão

#### u4-l1-r01 — escolher resultado (dificuldade 1)

Variação de u4-l1-e01.

**Enunciado:** O que este programa exibe?

```python
bebidas = ["café", "chá"]
print(bebidas)
```

- ▫️ a:

  ```text
  café chá
  ```

  - Feedback: O print de uma lista mostra os colchetes e as vírgulas.
- ▫️ b:

  ```text
  ["café", "chá"]
  ```

  - Feedback: Na tela, os textos de uma lista aparecem com aspas simples.
- ✅ c:

  ```text
  ['café', 'chá']
  ```


- Dica 1: O print mostra a lista com colchetes.
- Dica 2: Ao mostrar uma lista, o Python escreve os textos com aspas simples: ["oi"] aparece como ['oi'].

**Explicação:** O print mostra a lista com colchetes e vírgulas, e os textos com aspas simples.

Conceitos: Listas. Objetivo: Prever o print de uma lista de textos em outro contexto.

#### u4-l1-r02 — escolher resultado (dificuldade 1)

Variação de u4-l1-e02.

**Enunciado:** O que este programa exibe?

```python
tarefas = ["estudar"]
print(len(tarefas))
```

- ✅ a:

  ```text
  1
  ```

- ▫️ b:

  ```text
  7
  ```

  - Feedback: O len de uma lista conta os valores, não as letras.
- ▫️ c:

  ```text
  0
  ```

  - Feedback: A lista tem um valor dentro dos colchetes.

- Dica 1: Quantos valores há entre os colchetes?
- Dica 2: O len de uma lista conta os valores: len(["sol", "lua"]) dá 2, não importa o tamanho de cada palavra.

**Explicação:** A lista tem um único valor, o texto "estudar", então len(tarefas) é 1.

Conceitos: Listas. Objetivo: Contar os valores de uma lista com um valor só.

#### u4-l1-r03 — localizar erro (dificuldade 2)

Variação de u4-l1-e05.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  times = ["azul", "verde"]
 2  notas = [8, 6, 9
 3  print(len(notas))
```

Resposta: linha 2 (SyntaxError). Correção: `notas = [8, 6, 9]`

- Dica 1: Confira se cada lista abre e fecha o colchete.
- Dica 2: Toda lista termina com ], como em idades = [20, 31].

**Explicação:** A lista da linha 2 não fecha o colchete. Sem o ], o Python mostra um erro de sintaxe.

Conceitos: Listas. Objetivo: Encontrar uma lista sem o colchete de fechar em outro contexto.

## Lição 2 — Posições

Objetivo: Pegar um valor da lista pela posição, contando a partir de 0, e o último com -1.

### Sessão principal

#### u4-l2-e01 — escolher resultado (dificuldade 1)

**Enunciado:** As posições de uma lista começam em 0. O que este programa exibe?

```python
cores = ["azul", "verde", "rosa"]
print(cores[0])
```

- ✅ a:

  ```text
  azul
  ```

- ▫️ b:

  ```text
  verde
  ```

  - Feedback: A contagem das posições começa em 0, então 0 é a primeira.
- ▫️ c:

  ```text
  ['azul']
  ```

  - Feedback: cores[0] é um valor só, o texto, e não uma lista.

- Dica 1: Qual valor está na posição 0?
- Dica 2: A primeira posição de uma lista é 0, a segunda é 1: em ["x", "y"], a posição 0 guarda "x".

**Explicação:** As posições começam em 0. Por isso cores[0] é o primeiro valor, azul.

Conceitos: Posições na lista. Objetivo: Perceber que a posição 0 é o primeiro valor da lista.

#### u4-l2-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
dias = ["seg", "ter", "qua"]
print(dias[1])
```

- ▫️ a:

  ```text
  seg
  ```

  - Feedback: seg está na posição 0. A posição 1 é a segunda.
- ✅ b:

  ```text
  ter
  ```

- ▫️ c:

  ```text
  qua
  ```

  - Feedback: qua está na posição 2.

- Dica 1: Conte as posições começando do 0.
- Dica 2: Em ["a", "b", "c"], as posições são 0, 1 e 2; a posição 1 guarda "b".

**Explicação:** Contando do 0, seg está na posição 0 e ter na posição 1. Por isso dias[1] é ter.

Conceitos: Posições na lista. Objetivo: Pegar o segundo valor da lista com a posição 1.

#### u4-l2-e03 — escolher resultado (dificuldade 2)

**Enunciado:** Posições negativas contam do fim da lista. O que este programa exibe?

```python
fila = ["Ana", "Bia", "Caio", "Davi"]
print(fila[-1])
```

- ▫️ a:

  ```text
  Ana
  ```

  - Feedback: -1 conta do fim da lista, não do começo.
- ▫️ b:

  ```text
  Caio
  ```

  - Feedback: -1 é o último valor; Caio é o penúltimo.
- ✅ c:

  ```text
  Davi
  ```


- Dica 1: O sinal de menos faz contar a partir do fim.
- Dica 2: A posição -1 é sempre o último valor, e -2 o penúltimo: em [1, 2, 3], a posição -1 guarda 3.

**Explicação:** A posição -1 é sempre o último valor da lista, qualquer que seja o tamanho dela. Aqui, Davi.

Conceitos: Posições na lista. Objetivo: Pegar o último valor com a posição -1.

#### u4-l2-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete com a posição que mostra a nota 4.

```python
notas = [7, 9, 4]
print(notas[___1___])
```

Saída esperada:

```text
4
```

- Lacuna 1: **`2`**, `3`, `1`

- Dica 1: O 4 é o terceiro valor. Em que posição ele está, contando do 0?
- Dica 2: As posições de [10, 20, 30] são 0, 1 e 2: o terceiro valor fica na posição 2.

**Explicação:** Contando do 0, a nota 4 está na posição 2. A posição 3 não existe numa lista de três valores.

Conceitos: Posições na lista. Objetivo: Escolher a posição do terceiro valor.

#### u4-l2-e05 — escolher resultado (dificuldade 2)

**Enunciado:** A lista tem três valores. O que acontece quando este programa é executado?

```python
letras = ["a", "b", "c"]
print(letras[3])
```

- ▫️ a:

  ```text
  c
  ```

  - Feedback: c está na posição 2. Com três valores, as posições vão de 0 a 2.
- ✅ b: O programa mostra um erro
- ▫️ c:

  ```text
  a
  ```

  - Feedback: A lista não recomeça do início quando a posição passa do fim.

- Dica 1: Quais são as posições de uma lista com três valores?
- Dica 2: Uma lista com 2 valores tem as posições 0 e 1. Pedir a posição 2 dela é pedir um valor que não existe.

**Explicação:** Com três valores, as posições vão de 0 a 2. A posição 3 não existe, e o Python mostra um erro (IndexError).

Conceitos: Posições na lista, Listas. Objetivo: Prever o erro ao pedir uma posição que não existe.

#### u4-l2-e06 — localizar erro (dificuldade 2)

**Enunciado:** O programa deveria mostrar o primeiro da fila, mas mostra outro nome. Selecione a linha com o problema.

```python
 1  fila = ["Rui", "Ana", "Léo"]
 2  print("Primeiro da fila:")
 3  print(fila[1])
```

Saída esperada:

```text
Primeiro da fila:
Rui
```

Resposta: linha 3 (saida_incorreta). Correção: `print(fila[0])`

- Dica 1: Qual posição guarda o primeiro valor?
- Dica 2: A contagem das posições começa em 0. A posição 1 é a segunda: em ["x", "y"], [1] é "y".

**Explicação:** A linha 3 usa a posição 1, que é o segundo nome. O primeiro valor fica na posição 0.

Conceitos: Posições na lista. Objetivo: Encontrar a posição errada num programa que deveria mostrar o primeiro valor.

#### u4-l2-e07 — ordenar blocos (dificuldade 3)

**Enunciado:** Monte o programa que mostra o primeiro e depois o último nome da fila.

Saída esperada:

```text
Rui
Léo
```

- `a`: `fila = ["Rui", "Ana", "Léo"]`
- `b`: `print(fila[0])`
- `c`: `print(fila[-1])`
- `d`: `print(fila[1])` (distrator)
- `e`: `print(fila[3])` (distrator)

Ordens aceitas: a → b → c

- Dica 1: Primeiro crie a lista; depois mostre a posição do primeiro e a do último.
- Dica 2: O primeiro valor fica na posição 0 e o último na posição -1. Numa lista de 3 valores, a posição 3 não existe.

**Explicação:** A lista vem primeiro. Depois, fila[0] mostra o primeiro nome e fila[-1] o último.

Conceitos: Posições na lista, Listas. Objetivo: Montar um programa que mostra o primeiro e o último valor da lista.

### Variações de revisão

#### u4-l2-r01 — escolher resultado (dificuldade 1)

Variação de u4-l2-e01.

**Enunciado:** O que este programa exibe?

```python
sabores = ["uva", "limão"]
print(sabores[0])
```

- ▫️ a:

  ```text
  limão
  ```

  - Feedback: A contagem das posições começa em 0, então 0 é a primeira.
- ✅ b:

  ```text
  uva
  ```

- ▫️ c:

  ```text
  sabores
  ```

  - Feedback: O print mostra o valor guardado na posição 0, não o nome da lista.

- Dica 1: A posição 0 é a primeira.
- Dica 2: Em ["sol", "lua"], a posição 0 guarda "sol" e a posição 1 guarda "lua".

**Explicação:** A posição 0 é sempre o primeiro valor da lista. Aqui, uva.

Conceitos: Posições na lista. Objetivo: Pegar o primeiro valor com a posição 0 em outro contexto.

#### u4-l2-r02 — escolher resultado (dificuldade 2)

Variação de u4-l2-e03.

**Enunciado:** O que este programa exibe?

```python
precos = [5, 8, 12]
print(precos[-1])
```

- ▫️ a:

  ```text
  5
  ```

  - Feedback: -1 conta do fim da lista, não do começo.
- ✅ b:

  ```text
  12
  ```

- ▫️ c:

  ```text
  -12
  ```

  - Feedback: O -1 é uma posição; o valor guardado nela continua positivo.

- Dica 1: Com o sinal de menos, a posição conta a partir do fim.
- Dica 2: A posição -1 guarda sempre o último valor: em ["a", "b"], [-1] é "b".

**Explicação:** A posição -1 é o último valor da lista, o 12.

Conceitos: Posições na lista. Objetivo: Pegar o último valor com -1 numa lista de números.

#### u4-l2-r03 — escolher resultado (dificuldade 2)

Variação de u4-l2-e05.

**Enunciado:** O que acontece quando este programa é executado?

```python
pares = [2, 4]
print(pares[2])
```

- ▫️ a:

  ```text
  4
  ```

  - Feedback: 4 está na posição 1. Com dois valores, as posições são 0 e 1.
- ▫️ b:

  ```text
  2
  ```

  - Feedback: A lista não recomeça do início quando a posição passa do fim.
- ✅ c: O programa mostra um erro

- Dica 1: Quais posições existem numa lista com dois valores?
- Dica 2: Uma lista com 3 valores tem as posições 0, 1 e 2; a posição 3 não existe e dá erro.

**Explicação:** Com dois valores, as posições são 0 e 1. A posição 2 não existe, e o Python mostra um erro (IndexError).

Conceitos: Posições na lista, Listas. Objetivo: Prever o erro de posição inexistente em outro contexto.

## Lição 3 — Lista que cresce

Objetivo: Acrescentar valores no fim de uma lista com append e prever como ela fica.

### Sessão principal

#### u4-l3-e01 — escolher resultado (dificuldade 1)

**Enunciado:** O append coloca um valor no fim da lista. O que este programa exibe?

```python
tarefas = ["lavar"]
tarefas.append("passar")
print(tarefas)
```

- ▫️ a:

  ```text
  ['passar', 'lavar']
  ```

  - Feedback: O append coloca o valor novo no fim, depois dos que já estão.
- ▫️ b:

  ```text
  ['lavar']
  ```

  - Feedback: O append muda a própria lista, que passa a ter um valor a mais.
- ✅ c:

  ```text
  ['lavar', 'passar']
  ```


- Dica 1: Onde o append coloca o valor novo?
- Dica 2: O append põe o valor no fim da lista: depois de lista = [1] e lista.append(2), a lista é [1, 2].

**Explicação:** O append coloca "passar" no fim da lista, depois de "lavar". A própria lista muda.

Conceitos: Acrescentar à lista. Objetivo: Prever que o append coloca o valor no fim da lista.

#### u4-l3-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
nomes = ["Ana", "Bia"]
nomes.append("Caio")
print(len(nomes))
```

- ▫️ a:

  ```text
  2
  ```

  - Feedback: O append acrescenta um valor, e o len conta a lista já com ele.
- ✅ b:

  ```text
  3
  ```

- ▫️ c:

  ```text
  4
  ```

  - Feedback: O append acrescenta um valor só.

- Dica 1: Quantos valores a lista tem depois do append?
- Dica 2: Cada append acrescenta um valor: uma lista com 1 valor passa a ter 2.

**Explicação:** A lista começa com dois nomes e o append acrescenta o terceiro. Por isso len(nomes) é 3.

Conceitos: Acrescentar à lista, Listas. Objetivo: Perceber que o len aumenta depois do append.

#### u4-l3-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Complete o programa para acrescentar Natal à lista.

```python
cidades = ["Recife"]
cidades.___1___("Natal")
print(cidades)
```

Saída esperada:

```text
['Recife', 'Natal']
```

- Lacuna 1: **`append`**, `add`, `push`

- Dica 1: Qual comando coloca um valor no fim de uma lista em Python?
- Dica 2: Em Python, acrescenta-se à lista com lista.append(valor), escrito depois do nome da lista e de um ponto.

**Explicação:** Em Python, o comando que acrescenta um valor no fim da lista é o append. Outros nomes, como add ou push, dão erro em listas.

Conceitos: Acrescentar à lista. Objetivo: Escrever o nome do comando que acrescenta um valor à lista.

#### u4-l3-e04 — escolher resultado (dificuldade 2)

**Enunciado:** Uma lista pode começar vazia, com []. O que este programa exibe?

```python
fila = []
fila.append("Rui")
fila.append("Ana")
print(fila)
```

- ✅ a:

  ```text
  ['Rui', 'Ana']
  ```

- ▫️ b:

  ```text
  ['Ana', 'Rui']
  ```

  - Feedback: Cada append coloca o valor no fim. Ana chega depois de Rui.
- ▫️ c:

  ```text
  []
  ```

  - Feedback: A lista começa vazia, mas os dois append acrescentam valores a ela.

- Dica 1: Qual nome entrou primeiro na lista?
- Dica 2: Cada append coloca o valor depois dos que já estão, como numa fila: o primeiro a entrar fica na frente.

**Explicação:** A lista começa vazia. Rui entra primeiro e Ana depois, no fim. A lista fica ['Rui', 'Ana'].

Conceitos: Acrescentar à lista. Objetivo: Prever a ordem dos valores depois de dois append numa lista vazia.

#### u4-l3-e05 — localizar erro (dificuldade 3)

**Enunciado:** O programa deveria mostrar [1, 2, 3], mas mostra None. Selecione a linha com o problema.

```python
 1  numeros = [1, 2]
 2  numeros = numeros.append(3)
 3  print(numeros)
```

Saída esperada:

```text
[1, 2, 3]
```

Resposta: linha 2 (saida_incorreta). Correção: `numeros.append(3)`

- Dica 1: O append precisa de = para mudar a lista?
- Dica 2: O append muda a própria lista e não devolve nada. Por isso se escreve só lista.append(valor), sem guardar o resultado.

**Explicação:** O append muda a lista e não devolve nada, o None. Guardar esse resultado com = troca a lista por None. Basta escrever numeros.append(3).

Conceitos: Acrescentar à lista. Objetivo: Perceber que o append muda a lista e não deve ser guardado com =.

#### u4-l3-e06 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que acrescenta leite à lista de compras e mostra a lista e quantos itens ela tem.

Saída esperada:

```text
['pão', 'leite']
2
```

- `a`: `compras = ["pão"]`
- `b`: `compras.append("leite")`
- `c`: `print(compras)`
- `d`: `print(len(compras))`
- `e`: `compras.append(leite)` (distrator)

Ordens aceitas: a → b → c → d

- Dica 1: A lista precisa existir antes do append, e o append vem antes dos print.
- Dica 2: Sem aspas, leite seria o nome de uma variável que não existe. Textos vão entre aspas: lista.append("ovo").

**Explicação:** Primeiro a lista é criada, depois o append acrescenta "leite" e só então os print mostram a lista e o tamanho.

Conceitos: Acrescentar à lista, Listas. Objetivo: Montar um programa que acrescenta um valor e mostra a lista e o tamanho.

#### u4-l3-e07 — escolher resultado (dificuldade 3)

**Enunciado:** O que este programa exibe?

```python
notas = [5]
notas.append(8)
notas.append(6)
print(notas[-1])
```

- ▫️ a:

  ```text
  5
  ```

  - Feedback: -1 é a última posição, e o 5 ficou no começo.
- ▫️ b:

  ```text
  8
  ```

  - Feedback: Depois do 8 ainda entrou o 6, no fim.
- ✅ c:

  ```text
  6
  ```


- Dica 1: Como fica a lista depois dos dois append?
- Dica 2: Cada append coloca o valor no fim, e a posição -1 é sempre o último valor da lista.

**Explicação:** A lista fica [5, 8, 6]. A posição -1 é o último valor, o 6, que foi o último a entrar.

Conceitos: Acrescentar à lista, Posições na lista. Objetivo: Combinar append e a posição -1 para achar o último valor acrescentado.

### Variações de revisão

#### u4-l3-r01 — escolher resultado (dificuldade 1)

Variação de u4-l3-e01.

**Enunciado:** O que este programa exibe?

```python
jogos = ["xadrez"]
jogos.append("dama")
print(jogos)
```

- ✅ a:

  ```text
  ['xadrez', 'dama']
  ```

- ▫️ b:

  ```text
  ['dama', 'xadrez']
  ```

  - Feedback: O append coloca o valor novo no fim da lista.
- ▫️ c:

  ```text
  ['dama']
  ```

  - Feedback: O append acrescenta um valor; os que já estavam continuam na lista.

- Dica 1: Onde o append coloca o valor novo?
- Dica 2: O append põe o valor depois dos que já estão: ["a"] com append("b") vira ['a', 'b'].

**Explicação:** O append coloca "dama" no fim, depois de "xadrez".

Conceitos: Acrescentar à lista. Objetivo: Prever o append no fim da lista em outro contexto.

#### u4-l3-r02 — escolher resultado (dificuldade 1)

Variação de u4-l3-e02.

**Enunciado:** O que este programa exibe?

```python
itens = []
itens.append("caneta")
print(len(itens))
```

- ▫️ a:

  ```text
  0
  ```

  - Feedback: A lista começou vazia, mas o append acrescentou um valor.
- ✅ b:

  ```text
  1
  ```

- ▫️ c:

  ```text
  6
  ```

  - Feedback: O len de uma lista conta os valores, não as letras.

- Dica 1: Quantos valores a lista tem depois do append?
- Dica 2: Uma lista vazia, [], tem len 0. Cada append acrescenta um valor.

**Explicação:** A lista começa vazia e o append acrescenta um valor. Por isso len(itens) é 1.

Conceitos: Acrescentar à lista, Listas. Objetivo: Contar os valores de uma lista vazia depois de um append.

#### u4-l3-r03 — escolher resultado (dificuldade 2)

Variação de u4-l3-e04.

**Enunciado:** O que este programa exibe?

```python
senhas = ["A1"]
senhas.append("B2")
senhas.append("C3")
print(senhas[1])
```

- ▫️ a:

  ```text
  A1
  ```

  - Feedback: A1 está na posição 0. A posição 1 é a segunda.
- ✅ b:

  ```text
  B2
  ```

- ▫️ c:

  ```text
  C3
  ```

  - Feedback: C3 entrou por último e ficou na posição 2.

- Dica 1: Como fica a lista depois dos dois append?
- Dica 2: Cada append coloca o valor no fim. Contando do 0, a posição 1 é o segundo valor.

**Explicação:** A lista fica ['A1', 'B2', 'C3']. Contando do 0, a posição 1 guarda B2.

Conceitos: Acrescentar à lista, Posições na lista. Objetivo: Prever a posição de um valor depois de dois append.

## Lição 4 — Repetir com for

Objetivo: Prever quantas vezes e em que ordem o for repete o bloco recuado, e o que fica fora dele.

### Sessão principal

#### u4-l4-e01 — escolher resultado (dificuldade 1)

**Enunciado:** O for repete o bloco recuado para cada valor da lista. O que este programa exibe?

```python
frutas = ["uva", "kiwi"]
for fruta in frutas:
    print(fruta)
```

- ✅ a:

  ```text
  uva
  kiwi
  ```

- ▫️ b:

  ```text
  ['uva', 'kiwi']
  ```

  - Feedback: A cada volta, fruta guarda um valor só da lista, e não a lista inteira.
- ▫️ c:

  ```text
  uva
  ```

  - Feedback: O bloco é executado uma vez para cada valor da lista.

- Dica 1: Quantos valores a lista tem? O bloco roda uma vez para cada um.
- Dica 2: Na primeira volta, a variável do for guarda o primeiro valor; na segunda, o segundo. for x in [1, 2]: print(x) mostra 1 e depois 2.

**Explicação:** O for executa o print duas vezes. Na primeira volta, fruta guarda "uva"; na segunda, "kiwi".

Conceitos: Repetir com for. Objetivo: Prever que o for executa o bloco uma vez para cada valor, em ordem.

#### u4-l4-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
for nome in ["Ana", "Bia", "Caio"]:
    print("Oi")
```

- ▫️ a:

  ```text
  Oi
  ```

  - Feedback: O bloco é executado uma vez para cada um dos três valores.
- ✅ b:

  ```text
  Oi
  Oi
  Oi
  ```

- ▫️ c:

  ```text
  Ana
  Bia
  Caio
  ```

  - Feedback: O print mostra o texto "Oi", que está entre aspas, e não a variável nome.

- Dica 1: O que o print mostra? Quantas vezes ele roda?
- Dica 2: O bloco roda uma vez por valor da lista, mesmo que não use a variável: for x in [1, 2]: print("-") mostra - duas vezes.

**Explicação:** A lista tem três valores, então o bloco roda três vezes. O print mostra sempre o texto "Oi".

Conceitos: Repetir com for. Objetivo: Perceber que o bloco do for repete mesmo quando não usa a variável.

#### u4-l4-e03 — escolher resultado (dificuldade 2)

**Enunciado:** A última linha não tem recuo. O que este programa exibe?

```python
for numero in [1, 2]:
    print(numero)
print("Fim")
```

- ▫️ a:

  ```text
  1
  Fim
  2
  Fim
  ```

  - Feedback: Sem recuo, o print("Fim") está fora do for e não se repete.
- ✅ b:

  ```text
  1
  2
  Fim
  ```

- ▫️ c:

  ```text
  Fim
  ```

  - Feedback: O bloco recuado roda antes, uma vez para cada número.

- Dica 1: Quais linhas estão recuadas, dentro do for?
- Dica 2: Só as linhas recuadas se repetem. Uma linha sem recuo, depois do for, roda uma vez, quando todas as voltas acabam.

**Explicação:** O print recuado roda uma vez para cada número. O print("Fim") não tem recuo, então roda uma vez só, depois das voltas.

Conceitos: Repetir com for. Objetivo: Perceber que a linha sem recuo depois do for roda uma vez só, no fim.

#### u4-l4-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete a linha do for.

```python
for cor ___1___ ["azul", "rosa"]___2___
    print(cor)
```

Saída esperada:

```text
azul
rosa
```

- Lacuna 1: **`in`**, `em`, `=`
- Lacuna 2: **`:`**, `;`, `.`

- Dica 1: O for usa uma palavra em inglês que quer dizer "em", e a linha termina como a do if.
- Dica 2: A linha do for tem a forma for nome in lista: e termina com dois-pontos, que avisam que um bloco recuado vem a seguir.

**Explicação:** A linha do for é escrita for nome in lista, com in, e termina com dois-pontos, como a do if.

Conceitos: Repetir com for. Objetivo: Escrever a linha do for com in e dois-pontos.

#### u4-l4-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  precos = [3, 7]
 2  for preco in precos:
 3  print(preco)
```

Resposta: linha 3 (IndentationError). Correção: `print(preco)`

- Dica 1: O que vem logo depois da linha do for precisa estar recuado.
- Dica 2: Depois dos dois-pontos do for, as linhas do bloco ficam recuadas com quatro espaços, como no if.

**Explicação:** A linha 3 é o bloco do for e precisa de recuo. Sem ele, o Python mostra um erro de indentação (IndentationError).

Conceitos: Repetir com for. Objetivo: Encontrar o bloco do for sem recuo.

#### u4-l4-e06 — ordenar blocos (dificuldade 3)

**Enunciado:** Monte o programa que mostra cada pedido e, no fim, quantos pedidos são.

Linhas fixas antes:

```python
pedidos = ["suco", "bolo"]
```

Saída esperada:

```text
Pedido: suco
Pedido: bolo
2 pedidos
```

- `a`: `for pedido in pedidos:`
- `b`: `print("Pedido:", pedido)`
- `c`: `print(len(pedidos), "pedidos")`
- `d`: `print(len(pedidos), "pedidos")` (distrator)
- `e`: `print("Pedido:", pedido)` (distrator)

Ordens aceitas: a → b → c

- Dica 1: O que se repete fica recuado dentro do for; o que aparece uma vez só fica sem recuo, depois.
- Dica 2: Uma linha recuada no bloco do for roda uma vez por valor. Sem recuo, depois do bloco, ela roda uma vez só.

**Explicação:** O print recuado mostra cada pedido, uma vez por volta. O total vem sem recuo, depois do bloco, para aparecer uma vez só.

Conceitos: Repetir com for. Objetivo: Montar um for com uma linha dentro e uma linha depois do bloco.

#### u4-l4-e07 — escolher resultado (dificuldade 3)

**Enunciado:** Um texto vezes um número é repetido. O que este programa exibe?

```python
for letra in ["a", "b", "c"]:
    print(letra * 2)
```

- ✅ a:

  ```text
  aa
  bb
  cc
  ```

- ▫️ b:

  ```text
  abcabc
  ```

  - Feedback: O bloco trata um valor por vez, e cada print mostra uma linha.
- ▫️ c:

  ```text
  a
  b
  c
  a
  b
  c
  ```

  - Feedback: O * 2 repete cada letra na mesma linha, dentro de cada volta.

- Dica 1: Em cada volta, letra guarda uma letra só. O que letra * 2 mostra?
- Dica 2: Um texto vezes 2 aparece duas vezes, junto: "x" * 2 mostra xx. No for, isso acontece com cada valor, um por linha.

**Explicação:** A cada volta, letra guarda uma letra, e letra * 2 a repete. Cada print mostra uma linha, aa, bb e cc.

Conceitos: Repetir com for. Objetivo: Prever o bloco do for aplicado a cada valor.

### Variações de revisão

#### u4-l4-r01 — escolher resultado (dificuldade 1)

Variação de u4-l4-e01.

**Enunciado:** O que este programa exibe?

```python
for dia in ["sábado", "domingo"]:
    print(dia)
```

- ▫️ a:

  ```text
  sábado
  ```

  - Feedback: O bloco é executado uma vez para cada valor da lista.
- ✅ b:

  ```text
  sábado
  domingo
  ```

- ▫️ c:

  ```text
  ['sábado', 'domingo']
  ```

  - Feedback: A cada volta, dia guarda um valor só, e não a lista inteira.

- Dica 1: Quantas vezes o print roda?
- Dica 2: O for roda o bloco uma vez para cada valor, em ordem: for x in ["a", "b"]: print(x) mostra a e depois b.

**Explicação:** O for roda o print duas vezes, uma com "sábado" e outra com "domingo".

Conceitos: Repetir com for. Objetivo: Prever um for simples em outro contexto.

#### u4-l4-r02 — escolher resultado (dificuldade 2)

Variação de u4-l4-e03.

**Enunciado:** As duas linhas do bloco estão recuadas. O que este programa exibe?

```python
for numero in [5, 6]:
    print(numero)
    print("ok")
```

- ✅ a:

  ```text
  5
  ok
  6
  ok
  ```

- ▫️ b:

  ```text
  5
  6
  ok
  ```

  - Feedback: O print("ok") está recuado, então se repete a cada volta.
- ▫️ c:

  ```text
  5
  6
  ```

  - Feedback: O bloco tem dois print, e os dois rodam a cada volta.

- Dica 1: Quais linhas estão dentro do for?
- Dica 2: Todas as linhas recuadas formam o bloco e rodam juntas, na ordem, a cada volta do for.

**Explicação:** Os dois print estão recuados, então rodam juntos a cada volta. Primeiro com 5, depois com 6.

Conceitos: Repetir com for. Objetivo: Perceber que todas as linhas recuadas se repetem a cada volta.

#### u4-l4-r03 — localizar erro (dificuldade 2)

Variação de u4-l4-e05.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  for nome in ["Lia", "Davi"]:
 2  print("Olá,", nome)
```

Resposta: linha 2 (IndentationError). Correção: `print("Olá,", nome)`

- Dica 1: Repare no recuo da linha de baixo do for.
- Dica 2: Toda linha do bloco do for fica recuada com quatro espaços, logo abaixo da linha que termina com dois-pontos.

**Explicação:** A linha 2 é o bloco do for e precisa de recuo. Sem ele, o Python mostra um erro de indentação.

Conceitos: Repetir com for. Objetivo: Encontrar o bloco do for sem recuo em outro contexto.

## Lição 5 — Desafio: gastos da semana

Objetivo: Somar os gastos de uma lista com um acumulador, achar o maior gasto e calcular a média.

### Sessão principal

#### u4-l5-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Etapa 1: somar os gastos. O total começa em 0 e recebe cada gasto. O que este programa exibe?

```python
total = 0
for gasto in [10, 20, 5]:
    total = total + gasto
print(total)
```

- ✅ a:

  ```text
  35
  ```

- ▫️ b:

  ```text
  5
  ```

  - Feedback: O total não guarda só o último gasto; a cada volta ele soma mais um.
- ▫️ c:

  ```text
  0
  ```

  - Feedback: O total começa em 0, mas o bloco do for soma cada gasto a ele.

- Dica 1: Quanto vale o total depois de cada volta?
- Dica 2: Com total = 0 e for x in [1, 2]: total = total + x, o total vale 1 depois da primeira volta e 3 depois da segunda.

**Explicação:** O total começa em 0 e vale 10, depois 30 e por fim 35. O print fora do for mostra só o resultado final.

Conceitos: Somar numa repetição. Objetivo: Prever a soma feita por um acumulador dentro do for.

#### u4-l5-e02 — escolher resultado (dificuldade 2)

**Enunciado:** Agora o print está dentro do for. O que este programa exibe?

```python
total = 0
for gasto in [4, 6]:
    total = total + gasto
    print(total)
```

- ▫️ a:

  ```text
  10
  ```

  - Feedback: O print está recuado, então roda a cada volta, e não só no fim.
- ▫️ b:

  ```text
  4
  6
  ```

  - Feedback: O print mostra o total somado até ali, e não o gasto da vez.
- ✅ c:

  ```text
  4
  10
  ```


- Dica 1: O print roda em cada volta. Quanto vale o total em cada uma?
- Dica 2: Dentro do for, o print mostra o total acumulado até aquela volta: com [1, 2], mostraria 1 e depois 3.

**Explicação:** Na primeira volta o total vira 4 e é mostrado; na segunda vira 10 e é mostrado de novo.

Conceitos: Somar numa repetição, Repetir com for. Objetivo: Prever o total parcial mostrado a cada volta.

#### u4-l5-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Complete com o valor inicial do total.

```python
total = ___1___
for gasto in [12, 8, 30]:
    total = total + gasto
print(total)
```

Saída esperada:

```text
50
```

- Lacuna 1: **`0`**, `1`, `gasto`

- Dica 1: Antes de somar qualquer gasto, quanto deve valer o total?
- Dica 2: Uma soma começa do zero: se o total começasse em 1, o resultado teria 1 a mais.

**Explicação:** O total começa em 0 para que, no fim, guarde exatamente a soma dos gastos. Começando em 1, sobraria 1.

Conceitos: Somar numa repetição. Objetivo: Escolher o valor inicial de um acumulador de soma.

#### u4-l5-e04 — localizar erro (dificuldade 3)

**Enunciado:** O programa deveria mostrar 50, a soma dos gastos, mas mostra 10. Selecione a linha com o problema.

```python
 1  gastos = [15, 25, 10]
 2  total = 0
 3  for gasto in gastos:
 4      total = gasto
 5  print(total)
```

Saída esperada:

```text
50
```

Resposta: linha 4 (saida_incorreta). Correção: `total = total + gasto`

- Dica 1: Em qual linha o total deveria crescer?
- Dica 2: total = gasto troca o valor do total pelo gasto da vez. Para somar, o total novo é o total antigo mais o gasto.

**Explicação:** A linha 4 troca o total pelo gasto da vez, e no fim sobra só o último, 10. Para somar, escreva total = total + gasto.

Conceitos: Somar numa repetição. Objetivo: Encontrar o acumulador que troca o total em vez de somar.

#### u4-l5-e05 — ordenar blocos (dificuldade 3)

**Enunciado:** Etapa 2: monte o programa que soma os gastos e mostra o total uma vez, no fim.

Linhas fixas antes:

```python
gastos = [7, 5, 6]
```

Saída esperada:

```text
Total: 18
```

- `a`: `total = 0`
- `b`: `for gasto in gastos:`
- `c`: `total = total + gasto`
- `d`: `print("Total:", total)`
- `e`: `print("Total:", total)` (distrator)
- `f`: `total = 0` (distrator)

Ordens aceitas: a → b → c → d

- Dica 1: O total começa antes do for, a soma acontece dentro dele e o print vem depois.
- Dica 2: Se o total = 0 ficasse dentro do for, ele voltaria a zero a cada volta. Se o print ficasse dentro, apareceria a cada volta.

**Explicação:** O total começa em 0 antes do for, recebe cada gasto dentro do bloco e é mostrado uma vez, sem recuo, depois das voltas.

Conceitos: Somar numa repetição, Repetir com for. Objetivo: Montar o programa que soma os gastos e mostra o total uma vez.

#### u4-l5-e06 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 3: achar o maior gasto. O que este programa exibe?

```python
maior = 0
for gasto in [12, 40, 25]:
    if gasto > maior:
        maior = gasto
print(maior)
```

- ▫️ a:

  ```text
  25
  ```

  - Feedback: O maior só muda quando o gasto da vez é maior que ele. 25 não é maior que 40.
- ✅ b:

  ```text
  40
  ```

- ▫️ c:

  ```text
  77
  ```

  - Feedback: Aqui ninguém soma. O maior troca de valor só quando aparece um gasto maior.

- Dica 1: Acompanhe o valor de maior a cada volta.
- Dica 2: O if só troca o maior quando o gasto da vez passa dele: com [3, 9, 4], o maior vira 3, depois 9 e fica em 9.

**Explicação:** O maior vira 12, depois 40. Na última volta, 25 não é maior que 40, então o maior continua 40.

Conceitos: Repetir com for. Objetivo: Prever o maior valor encontrado com um if dentro do for.

#### u4-l5-e07 — escolher resultado (dificuldade 3)

**Enunciado:** Etapa final. O que este programa exibe?

```python
gastos = [20, 10, 30]
total = 0
for gasto in gastos:
    total = total + gasto
print("Total:", total)
print("Média:", total / len(gastos))
```

- ✅ a:

  ```text
  Total: 60
  Média: 20.0
  ```

- ▫️ b:

  ```text
  Total: 60
  Média: 20
  ```

  - Feedback: A divisão com / sempre dá um número com casa decimal.
- ▫️ c:

  ```text
  Total: 60
  Média: 60.0
  ```

  - Feedback: len(gastos) é 3, o número de gastos da lista.

- Dica 1: Qual é o total? E quanto vale len(gastos)?
- Dica 2: A média é o total dividido pela quantidade de valores. Em Python, a divisão com / sempre dá número com ponto: 6 / 3 dá 2.0.

**Explicação:** O total é 60 e a lista tem 3 gastos. 60 / 3 dá 20.0, porque a divisão com / sempre resulta em número com casa decimal.

Conceitos: Somar numa repetição, Repetir com for. Objetivo: Combinar soma, len e divisão para calcular a média dos gastos.

### Variações de revisão

#### u4-l5-r01 — escolher resultado (dificuldade 1)

Variação de u4-l5-e01.

**Enunciado:** O que este programa exibe?

```python
total = 0
for preco in [3, 9]:
    total = total + preco
print(total)
```

- ▫️ a:

  ```text
  9
  ```

  - Feedback: O total não guarda só o último preço; ele soma os dois.
- ✅ b:

  ```text
  12
  ```

- ▫️ c:

  ```text
  0
  ```

  - Feedback: O bloco do for soma cada preço ao total, que começou em 0.

- Dica 1: Quanto vale o total depois de cada volta?
- Dica 2: Um acumulador começa em 0 e recebe cada valor: com [2, 5], ele vale 2 e depois 7.

**Explicação:** O total começa em 0, vale 3 depois da primeira volta e 12 depois da segunda.

Conceitos: Somar numa repetição. Objetivo: Prever a soma de um acumulador em outro contexto.

#### u4-l5-r02 — escolher resultado (dificuldade 2)

Variação de u4-l5-e06.

**Enunciado:** O que este programa exibe?

```python
maior = 0
for nota in [7, 3, 5]:
    if nota > maior:
        maior = nota
print(maior)
```

- ▫️ a:

  ```text
  5
  ```

  - Feedback: O maior só muda quando a nota da vez passa dele. 5 não é maior que 7.
- ✅ b:

  ```text
  7
  ```

- ▫️ c:

  ```text
  15
  ```

  - Feedback: Aqui ninguém soma. O maior troca de valor só quando aparece uma nota maior.

- Dica 1: Acompanhe o valor de maior a cada volta.
- Dica 2: O if troca o maior só quando o valor da vez passa dele: com [8, 2], o maior vira 8 e não muda mais.

**Explicação:** O maior vira 7 na primeira volta. Depois, nem 3 nem 5 passam de 7, então ele continua 7.

Conceitos: Repetir com for. Objetivo: Prever o maior valor quando ele está no começo da lista.
