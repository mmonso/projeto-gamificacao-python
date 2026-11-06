# Unidade 2 — Valores e operações: versão de leitura

Gerado por `ferramentas/verificar_conteudo.py` a partir dos arquivos YAML. Não edite à mão.

## Lição 1 — Tipos de valores

Objetivo: Identificar os tipos int, float, str e bool e usar ponto nas casas decimais.

### Sessão principal

#### u2-l1-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Cada valor tem um tipo, e o comando type mostra qual é. O que este programa exibe?

```python
print(type(42))
```

- ✅ a:

  ```text
  <class 'int'>
  ```

- ▫️ b:

  ```text
  <class 'str'>
  ```

  - Feedback: Sem aspas, 42 é um número inteiro, não um texto.
- ▫️ c:

  ```text
  42
  ```

  - Feedback: O type mostra o tipo do valor, não o próprio valor.

- Dica 1: 42 é um número sem casa decimal e sem aspas.
- Dica 2: Cada tipo tem um nome curto: int para inteiros, float para números com ponto, str para textos e bool para True e False.

**Explicação:** Números inteiros, sem casa decimal, são do tipo int. O type exibe o tipo como <class 'int'>.

Conceitos: Tipos básicos. Objetivo: Usar type para descobrir que um número sem aspas é int.

#### u2-l1-e02 — escolher resultado (dificuldade 1)

**Enunciado:** Agora o número está entre aspas. O que este programa exibe?

```python
print(type("42"))
```

- ▫️ a:

  ```text
  <class 'int'>
  ```

  - Feedback: Com aspas, é um texto, mesmo que tenha só algarismos.
- ✅ b:

  ```text
  <class 'str'>
  ```

- ▫️ c:

  ```text
  <class 'float'>
  ```

  - Feedback: float é para números com casa decimal, sem aspas.

- Dica 1: Repare: agora o número está entre aspas.
- Dica 2: Tudo o que está entre aspas é texto, do tipo str, mesmo que pareça um número. O nome str vem de string, como o Python chama os textos.

**Explicação:** Tudo o que está entre aspas é texto, do tipo str, mesmo que pareça um número.

Conceitos: Tipos básicos. Objetivo: Perceber que algarismos entre aspas formam um texto.

#### u2-l1-e03 — escolher resultado (dificuldade 1)

**Enunciado:** Em Python, números com casa decimal usam ponto. O que este programa exibe?

```python
print(type(3.5))
```

- ▫️ a:

  ```text
  <class 'int'>
  ```

  - Feedback: Um número com casa decimal não é inteiro.
- ▫️ b:

  ```text
  <class 'str'>
  ```

  - Feedback: Não há aspas, então não é texto.
- ✅ c:

  ```text
  <class 'float'>
  ```


- Dica 1: 3.5 tem casa decimal e não tem aspas.
- Dica 2: Números com casa decimal são do tipo float, e inteiros são do tipo int. Por exemplo, 1.0 é float e 1 é int.

**Explicação:** Números com casa decimal são do tipo float. Em Python, a casa decimal é separada por ponto.

Conceitos: Tipos básicos. Objetivo: Reconhecer números com casa decimal como float.

#### u2-l1-e04 — completar lacuna (dificuldade 2)

**Enunciado:** O tipo bool tem só dois valores, True e False. Complete para exibir o tipo bool.

```python
print(type(___1___))
```

Saída esperada:

```text
<class 'bool'>
```

- Lacuna 1: **`True`**, `"True"`, `true`

- Dica 1: Com aspas, seria um texto.
- Dica 2: Os valores do tipo bool são True e False, sempre com a primeira letra maiúscula e sem aspas.

**Explicação:** True e False são os valores do tipo bool. Eles começam com maiúscula e não levam aspas; true, em minúsculas, seria um nome desconhecido.

Conceitos: Tipos básicos. Objetivo: Escrever o valor lógico True, com T maiúsculo e sem aspas.

#### u2-l1-e05 — escolher resultado (dificuldade 2)

**Enunciado:** Qual programa exibe exatamente: <class 'float'>

Saída esperada:

```text
<class 'float'>
```

- ▫️ a:

  ```python
  print(type(2))
  ```

  - Feedback: 2 é um número inteiro, do tipo int.
- ✅ b:

  ```python
  print(type(2.0))
  ```

- ▫️ c:

  ```python
  print(type("2.0"))
  ```

  - Feedback: Com aspas, é um texto, do tipo str.

- Dica 1: Procure um número com ponto e sem aspas.
- Dica 2: Ter casa decimal basta para ser float, mesmo que ela seja zero: 5.0 é float, e 5 é int.

**Explicação:** 2.0 tem casa decimal e não tem aspas, então é float, mesmo que a parte decimal seja zero.

Conceitos: Tipos básicos. Objetivo: Escolher o valor que é do tipo float.

#### u2-l1-e06 — localizar erro (dificuldade 3)

**Enunciado:** O programa deveria exibir a saída abaixo, mas mostra outra coisa. Selecione a linha com o problema.

```python
 1  preco = 4,50
 2  print("Preço:", preco)
```

Saída esperada:

```text
Preço: 4.5
```

Resposta: linha 1 (saida_incorreta). Correção: `preco = 4.50`

- Dica 1: Confira como os números com casa decimal estão escritos.
- Dica 2: Em Python, a casa decimal usa ponto, como em 9.90. Com vírgula, o Python entende dois números separados.

**Explicação:** Em Python, a casa decimal usa ponto. Com vírgula, 4,50 vira dois números separados, e o print exibe (4, 50).

Conceitos: Tipos básicos. Objetivo: Reconhecer o uso de vírgula no lugar do ponto decimal.

#### u2-l1-e07 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída.

Saída esperada:

```text
<class 'str'>
<class 'int'>
```

- `a`: `print(type("10"))`
- `b`: `print(type(10))`
- `c`: `print(type(10.0))` (distrator)

Ordens aceitas: a → b

- Dica 1: A primeira linha da saída é o tipo de um texto; a segunda, o de um inteiro.
- Dica 2: O tipo depende de como o valor é escrito: com aspas é str, sem aspas e sem ponto é int, com ponto é float.

**Explicação:** "10" entre aspas é texto (str) e 10 sem aspas é inteiro (int). O bloco com 10.0 exibiria float.

Conceitos: Tipos básicos. Objetivo: Associar valores a seus tipos para produzir uma saída.

### Variações de revisão

#### u2-l1-r01 — escolher resultado (dificuldade 2)

Variação de u2-l1-e02.

**Enunciado:** O que este programa exibe?

```python
print(type("3.14"))
```

- ▫️ a:

  ```text
  <class 'float'>
  ```

  - Feedback: Com aspas, é texto, mesmo com ponto decimal.
- ✅ b:

  ```text
  <class 'str'>
  ```

- ▫️ c:

  ```text
  3.14
  ```

  - Feedback: O type mostra o tipo, não o valor.

- Dica 1: Repare nas aspas.
- Dica 2: Entre aspas, qualquer valor é texto, do tipo str, mesmo que seja um número com ponto.

**Explicação:** Entre aspas, 3.14 é um texto, do tipo str.

Conceitos: Tipos básicos. Objetivo: Reconhecer um número decimal entre aspas como texto.

#### u2-l1-r02 — localizar erro (dificuldade 3)

Variação de u2-l1-e06.

**Enunciado:** O programa deveria exibir a saída abaixo, mas mostra outra coisa. Selecione a linha com o problema.

```python
 1  aluno = "Caio"
 2  nota = 7,5
 3  print("Nota:", nota)
```

Saída esperada:

```text
Nota: 7.5
```

Resposta: linha 2 (saida_incorreta). Correção: `nota = 7.5`

- Dica 1: Como o Python separa a casa decimal?
- Dica 2: Em Python, a casa decimal usa ponto, como em 8.5. A vírgula serve para separar valores.

**Explicação:** Na linha 2, a vírgula transforma 7,5 em dois números. O correto é 7.5, com ponto.

Conceitos: Tipos básicos. Objetivo: Corrigir a vírgula decimal em outro contexto.

#### u2-l1-r03 — escolher resultado (dificuldade 1)

Variação de u2-l1-e04.

**Enunciado:** O que este programa exibe?

```python
print(type(False))
```

- ✅ a:

  ```text
  <class 'bool'>
  ```

- ▫️ b:

  ```text
  <class 'str'>
  ```

  - Feedback: False sem aspas não é texto.
- ▫️ c:

  ```text
  False
  ```

  - Feedback: O type mostra o tipo, não o valor.

- Dica 1: False é um dos dois valores de um tipo especial.
- Dica 2: True e False pertencem ao tipo bool, usado para verdadeiro e falso.

**Explicação:** False, assim como True, é um valor do tipo bool.

Conceitos: Tipos básicos. Objetivo: Reconhecer False como valor do tipo bool.

## Lição 2 — Contas com Python

Objetivo: Prever o resultado de /, //, %, ** e da ordem das operações.

### Sessão principal

#### u2-l2-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Em Python, a divisão usa /. O que este programa exibe?

```python
print(7 / 2)
```

- ▫️ a:

  ```text
  3
  ```

  - Feedback: Com /, o resultado mantém a parte decimal.
- ✅ b:

  ```text
  3.5
  ```

- ▫️ c:

  ```text
  3,5
  ```

  - Feedback: O Python usa ponto para a casa decimal.

- Dica 1: 7 dividido por 2 não dá um número inteiro.
- Dica 2: A divisão com / mostra o resultado completo, com a parte decimal separada por ponto. Por exemplo, 5 / 2 dá 2.5.

**Explicação:** A divisão com / mostra o resultado completo, com parte decimal separada por ponto.

Conceitos: Divisão. Objetivo: Prever que a divisão com / mostra a parte decimal.

#### u2-l2-e02 — escolher resultado (dificuldade 2)

**Enunciado:** A divisão agora é exata. O que este programa exibe?

```python
print(6 / 2)
```

- ▫️ a:

  ```text
  3
  ```

  - Feedback: Com /, o resultado é sempre float, então aparece com .0.
- ✅ b:

  ```text
  3.0
  ```

- ▫️ c:

  ```text
  6 / 2
  ```

  - Feedback: Sem aspas, a conta é calculada.

- Dica 1: Repare no operador: é a divisão com uma barra só.
- Dica 2: A divisão com / sempre resulta em float, mesmo quando é exata: 8 / 4 dá 2.0.

**Explicação:** A divisão com / sempre resulta em float. Por isso 6 / 2 aparece como 3.0.

Conceitos: Divisão, Tipos básicos. Objetivo: Perceber que / sempre resulta em float, mesmo em divisão exata.

#### u2-l2-e03 — escolher resultado (dificuldade 2)

**Enunciado:** O operador // faz a divisão e descarta a parte decimal. O que este programa exibe?

```python
print(7 // 2)
```

- ▫️ a:

  ```text
  3.5
  ```

  - Feedback: Esse é o resultado de /. Com //, a parte decimal é descartada.
- ▫️ b:

  ```text
  4
  ```

  - Feedback: O // não arredonda; ele descarta a parte decimal.
- ✅ c:

  ```text
  3
  ```


- Dica 1: Primeiro pense em 7 dividido por 2; depois tire a parte decimal.
- Dica 2: O // divide e descarta a parte decimal, sem arredondar para cima: 9 // 2 dá 4.

**Explicação:** 7 // 2 calcula 3.5 e descarta a parte decimal, resultando em 3.

Conceitos: Divisão. Objetivo: Prever o resultado da divisão inteira com //.

#### u2-l2-e04 — escolher resultado (dificuldade 2)

**Enunciado:** O operador % mostra o resto de uma divisão. O que este programa exibe?

```python
print(7 % 2)
```

- ✅ a:

  ```text
  1
  ```

- ▫️ b:

  ```text
  3
  ```

  - Feedback: 3 é quantas vezes o 2 cabe no 7. O % mostra o que sobra.
- ▫️ c:

  ```text
  3.5
  ```

  - Feedback: O % não faz a divisão completa; mostra só o resto.

- Dica 1: Pense em quantas vezes o 2 cabe no 7 e quanto sobra.
- Dica 2: O % mostra o que sobra da divisão: 10 % 3 dá 1, porque o 3 cabe 3 vezes no 10 e sobra 1.

**Explicação:** 7 dividido por 2 dá 3, com resto 1. O % exibe esse resto.

Conceitos: Resto e potência. Objetivo: Prever o resto de uma divisão com %.

#### u2-l2-e05 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para calcular 2 elevado a 3.

```python
print(2 ___1___ 3)
```

Saída esperada:

```text
8
```

- Lacuna 1: **`**`**, `^`, `*`

- Dica 1: Em Python, a potência usa dois símbolos iguais.
- Dica 2: Um asterisco multiplica; dois asteriscos elevam a uma potência. Por exemplo, 3 ** 2 dá 9.

**Explicação:** Em Python, a potência é escrita com **. O ^ existe, mas faz outra operação, e * é multiplicação.

Conceitos: Resto e potência. Objetivo: Usar ** para calcular uma potência.

#### u2-l2-e06 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
print(2 + 3 * 4)
```

- ▫️ a:

  ```text
  20
  ```

  - Feedback: Somar primeiro daria 20, mas a multiplicação vem antes.
- ✅ b:

  ```text
  14
  ```

- ▫️ c:

  ```text
  2 + 3 * 4
  ```

  - Feedback: Sem aspas, a conta é calculada.

- Dica 1: Como na matemática, uma das operações vem antes da outra.
- Dica 2: Multiplicação e divisão são feitas antes de soma e subtração: 1 + 2 * 5 dá 11, e não 15.

**Explicação:** O Python calcula 3 * 4 primeiro, que dá 12, e depois soma 2, resultando em 14.

Conceitos: Ordem das operações. Objetivo: Aplicar a ordem das operações, com multiplicação antes da soma.

#### u2-l2-e07 — localizar erro (dificuldade 3)

**Enunciado:** O programa deveria exibir a média das duas notas, mas mostra outro valor. Selecione a linha com o problema.

```python
 1  nota1 = 6
 2  nota2 = 8
 3  media = nota1 + nota2 / 2
 4  print("Média:", media)
```

Saída esperada:

```text
Média: 7.0
```

Resposta: linha 3 (saida_incorreta). Correção: `media = (nota1 + nota2) / 2`

- Dica 1: Qual operação acontece primeiro na linha 3?
- Dica 2: A divisão acontece antes da soma, a não ser que haja parênteses: em (1 + 3) * 2, a soma vem primeiro.

**Explicação:** Sem parênteses, o Python divide nota2 por 2 antes de somar. Com (nota1 + nota2) / 2, a soma vem primeiro e a média fica 7.0.

Conceitos: Ordem das operações, Divisão. Objetivo: Encontrar uma média calculada sem parênteses.

### Variações de revisão

#### u2-l2-r01 — escolher resultado (dificuldade 2)

Variação de u2-l2-e03.

**Enunciado:** O que este programa exibe?

```python
print(10 // 3)
```

- ✅ a:

  ```text
  3
  ```

- ▫️ b:

  ```text
  3.3333333333333335
  ```

  - Feedback: Esse seria o resultado de /. O // descarta a parte decimal.
- ▫️ c:

  ```text
  1
  ```

  - Feedback: 1 é o resto, que seria o resultado de %.

- Dica 1: Quantas vezes o 3 cabe inteiro no 10?
- Dica 2: O // divide e descarta a parte decimal: 7 // 2 dá 3.

**Explicação:** 10 // 3 descarta a parte decimal da divisão e resulta em 3.

Conceitos: Divisão. Objetivo: Prever outra divisão inteira.

#### u2-l2-r02 — escolher resultado (dificuldade 2)

Variação de u2-l2-e04.

**Enunciado:** O que este programa exibe?

```python
print(10 % 4)
```

- ▫️ a:

  ```text
  2.5
  ```

  - Feedback: O % mostra o resto, não o resultado da divisão.
- ✅ b:

  ```text
  2
  ```

- ▫️ c:

  ```text
  0
  ```

  - Feedback: 4 não divide 10 sem sobra.

- Dica 1: Pense em quantas vezes o 4 cabe no 10 e quanto sobra.
- Dica 2: O % mostra o resto da divisão: 9 % 4 dá 1, porque o 4 cabe 2 vezes no 9 e sobra 1.

**Explicação:** 10 dividido por 4 dá 2, com resto 2. O % exibe o resto.

Conceitos: Resto e potência. Objetivo: Prever o resto em outra divisão.

#### u2-l2-r03 — escolher resultado (dificuldade 2)

Variação de u2-l2-e06.

**Enunciado:** O que este programa exibe?

```python
print((2 + 3) * 4)
```

- ▫️ a:

  ```text
  14
  ```

  - Feedback: Os parênteses fazem a soma acontecer antes.
- ✅ b:

  ```text
  20
  ```

- ▫️ c:

  ```text
  24
  ```

  - Feedback: Primeiro 2 + 3, depois o resultado vezes 4.

- Dica 1: O que está entre parênteses é calculado primeiro.
- Dica 2: Os parênteses mudam a ordem normal das contas: em (1 + 1) * 3, a soma vem antes e o resultado é 6.

**Explicação:** Os parênteses fazem o Python calcular 2 + 3 primeiro. Depois, 5 * 4 resulta em 20.

Conceitos: Ordem das operações. Objetivo: Perceber que parênteses mudam a ordem das operações.

## Lição 3 — Juntando textos

Objetivo: Juntar e repetir textos e reconhecer o erro de somar texto com número.

### Sessão principal

#### u2-l3-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Com textos, o + junta um no outro. O que este programa exibe?

```python
print("Bom" + "dia")
```

- ▫️ a:

  ```text
  Bom dia
  ```

  - Feedback: O + não coloca espaço entre os textos.
- ✅ b:

  ```text
  Bomdia
  ```

- ▫️ c:

  ```text
  Bom + dia
  ```

  - Feedback: O + junta os textos e não aparece na saída.

- Dica 1: Repare: nenhum dos dois textos tem espaço.
- Dica 2: O + cola um texto no outro, sem acrescentar nada entre eles: "sol" + "dado" forma soldado.

**Explicação:** O + junta os textos exatamente como estão. Como nenhum deles tem espaço, o resultado é Bomdia.

Conceitos: Juntar textos. Objetivo: Perceber que o + junta textos sem colocar espaço.

#### u2-l3-e02 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para exibir as duas palavras separadas por espaço.

```python
print("Bom" + ___1___ + "dia")
```

Saída esperada:

```text
Bom dia
```

- Lacuna 1: **`" "`**, `""`, `espaco`

- Dica 1: O espaço também é um texto e precisa de aspas.
- Dica 2: Um texto pode ter só um espaço dentro das aspas. Já "", sem nada dentro, é um texto vazio.

**Explicação:** " " é um texto com um espaço. Juntado entre as palavras, ele as separa. "" é um texto vazio, e espaco sem aspas seria um nome desconhecido.

Conceitos: Juntar textos. Objetivo: Incluir um texto com espaço para separar palavras.

#### u2-l3-e03 — escolher resultado (dificuldade 1)

**Enunciado:** Um texto vezes um número é repetido. O que este programa exibe?

```python
print("ha" * 3)
```

- ✅ a:

  ```text
  hahaha
  ```

- ▫️ b:

  ```text
  ha ha ha
  ```

  - Feedback: A repetição não coloca espaços entre as cópias.
- ▫️ c:

  ```text
  ha3
  ```

  - Feedback: O * repete o texto; não junta o número a ele.

- Dica 1: O texto será repetido três vezes.
- Dica 2: Multiplicar um texto por um número repete o texto, colado, sem espaços: "oi" * 2 forma oioi.

**Explicação:** "ha" * 3 repete o texto três vezes, sem espaços: hahaha.

Conceitos: Repetir textos. Objetivo: Prever a repetição de um texto com *.

#### u2-l3-e04 — escolher resultado (dificuldade 2)

**Enunciado:** O que acontece quando este programa é executado?

```python
print("Idade: " + 30)
```

- ▫️ a:

  ```text
  Idade: 30
  ```

  - Feedback: O + não junta texto com número; o Python mostra um erro.
- ✅ b: O programa mostra um erro
- ▫️ c:

  ```text
  Idade: + 30
  ```

  - Feedback: O + não aparece na saída.

- Dica 1: Repare no tipo de cada lado do +.
- Dica 2: O + junta dois textos ou soma dois números, mas não mistura os dois. Texto mais número gera um erro de tipo (TypeError).

**Explicação:** O + junta textos ou soma números, mas não mistura os dois. Juntar texto com número gera um erro de tipo (TypeError).

Conceitos: Texto com número. Objetivo: Prever que juntar texto e número com + gera erro.

#### u2-l3-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  nome = "Rui"
 2  pontos = 50
 3  print(nome + " fez " + pontos + " pontos")
```

Resposta: linha 3 (TypeError). Correção: `print(nome, "fez", pontos, "pontos")`

- Dica 1: Qual das variáveis guarda um número?
- Dica 2: Juntar texto e número com + gera TypeError. Com vírgulas, o print aceita texto e número juntos.

**Explicação:** Na linha 3, o + tenta juntar textos com o número 50 e gera TypeError. Com vírgulas, o print aceita texto e número juntos.

Conceitos: Texto com número, Juntar textos. Objetivo: Encontrar a linha que junta texto e número com +.

#### u2-l3-e06 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saudação.

Linhas fixas antes:

```python
nome = "Bia"
```

Saída esperada:

```text
Olá, Bia!
```

- `a`: `saudacao = "Olá, " + nome + "!"`
- `b`: `print(saudacao)`
- `c`: `print("saudacao")` (distrator)
- `d`: `print("Olá, " + "nome" + "!")` (distrator)

Ordens aceitas: a → b

- Dica 1: A mensagem precisa usar o valor de nome, e não a palavra nome.
- Dica 2: Sem aspas, o nome da variável é trocado pelo valor guardado. Primeiro monte a saudação, depois exiba a variável.

**Explicação:** A saudação junta o texto "Olá, ", o valor de nome e o texto "!". Depois, o print exibe a variável saudacao, sem aspas.

Conceitos: Juntar textos. Objetivo: Montar uma saudação juntando textos e uma variável.

#### u2-l3-e07 — escolher resultado (dificuldade 2)

**Enunciado:** Qual programa exibe exatamente: ===

Saída esperada:

```text
===
```

- ▫️ a:

  ```python
  print("=" + 3)
  ```

  - Feedback: Somar texto com número gera TypeError.
- ▫️ b:

  ```python
  print("= = =")
  ```

  - Feedback: Esse texto tem espaços entre os sinais.
- ✅ c:

  ```python
  print("=" * 3)
  ```


- Dica 1: A saída tem o mesmo sinal três vezes, colado.
- Dica 2: Para repetir um texto, multiplique-o por um número inteiro. Somar texto com número gera erro.

**Explicação:** "=" * 3 repete o sinal três vezes, sem espaços.

Conceitos: Repetir textos, Texto com número. Objetivo: Escolher o programa que repete um símbolo.

### Variações de revisão

#### u2-l3-r01 — escolher resultado (dificuldade 1)

Variação de u2-l3-e01.

**Enunciado:** O que este programa exibe?

```python
print("Py" + "thon")
```

- ▫️ a:

  ```text
  Py thon
  ```

  - Feedback: O + não acrescenta espaço.
- ✅ b:

  ```text
  Python
  ```

- ▫️ c:

  ```text
  Py + thon
  ```

  - Feedback: O + junta os textos e não aparece.

- Dica 1: Os textos são colados um no outro.
- Dica 2: O + junta os textos exatamente como estão, sem colocar espaço entre eles.

**Explicação:** O + junta "Py" e "thon" sem espaço, formando Python.

Conceitos: Juntar textos. Objetivo: Prever a junção de dois textos em outro contexto.

#### u2-l3-r02 — escolher resultado (dificuldade 2)

Variação de u2-l3-e04.

**Enunciado:** O que acontece quando este programa é executado?

```python
print("Nível " + 2)
```

- ▫️ a:

  ```text
  Nível 2
  ```

  - Feedback: O + não junta texto com número.
- ▫️ b:

  ```text
  Nível 2.0
  ```

  - Feedback: O programa não chega a exibir nada.
- ✅ c: O programa mostra um erro

- Dica 1: Um lado do + é texto, e o outro é número.
- Dica 2: O + não mistura texto com número. Para juntar, o número precisaria virar texto antes.

**Explicação:** Juntar o texto "Nível " com o número 2 usando + gera TypeError.

Conceitos: Texto com número. Objetivo: Prever o erro de tipo em outro contexto.

#### u2-l3-r03 — escolher resultado (dificuldade 1)

Variação de u2-l3-e03.

**Enunciado:** O que este programa exibe?

```python
print("-" * 5)
```

- ✅ a:

  ```text
  -----
  ```

- ▫️ b:

  ```text
  -5
  ```

  - Feedback: Com texto, o * repete; não faz conta.
- ▫️ c:

  ```text
  - - - - -
  ```

  - Feedback: As cópias ficam coladas, sem espaços.

- Dica 1: O sinal será repetido cinco vezes.
- Dica 2: Um texto multiplicado por um número aparece repetido, colado, sem espaços.

**Explicação:** "-" * 5 repete o sinal cinco vezes, formando uma linha.

Conceitos: Repetir textos. Objetivo: Prever a repetição de um símbolo.

## Lição 4 — Convertendo valores

Objetivo: Converter valores com str, int e float para juntar textos e fazer contas.

### Sessão principal

#### u2-l4-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Os dois valores estão entre aspas. O que este programa exibe?

```python
print("5" + "5")
```

- ▫️ a:

  ```text
  10
  ```

  - Feedback: Com aspas, são textos; o + junta, não soma.
- ✅ b:

  ```text
  55
  ```

- ▫️ c:

  ```text
  5 5
  ```

  - Feedback: O + não acrescenta espaço.

- Dica 1: Com aspas, os valores são textos.
- Dica 2: Com textos, o + junta em vez de somar: "1" + "2" forma 12.

**Explicação:** "5" e "5" são textos, então o + os junta e o resultado é 55.

Conceitos: Converter valores, Juntar textos. Objetivo: Perceber que números entre aspas são juntados, não somados.

#### u2-l4-e02 — escolher resultado (dificuldade 2)

**Enunciado:** O int transforma um texto com algarismos em número inteiro. O que este programa exibe?

```python
print(int("5") + 5)
```

- ▫️ a:

  ```text
  55
  ```

  - Feedback: Depois do int, "5" vira o número 5, e o + soma.
- ✅ b:

  ```text
  10
  ```

- ▫️ c: O programa mostra um erro
  - Feedback: Depois da conversão, os dois lados são números, e a soma funciona.

- Dica 1: Depois do int, os dois valores são números.
- Dica 2: O int transforma um texto com algarismos em número inteiro, que pode entrar em contas: int("3") + 1 dá 4.

**Explicação:** int("5") converte o texto no número 5. Somado com 5, o resultado é 10.

Conceitos: Converter valores. Objetivo: Usar int para transformar texto em número antes de somar.

#### u2-l4-e03 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para juntar o texto e a pontuação com +.

```python
pontos = 50
print("Pontos: " + ___1___(pontos))
```

Saída esperada:

```text
Pontos: 50
```

- Lacuna 1: **`str`**, `int`, `float`

- Dica 1: Para juntar com +, os dois lados precisam ser texto.
- Dica 2: Cada conversão tem seu nome: str transforma em texto, int em inteiro e float em número com casa decimal.

**Explicação:** str(pontos) transforma 50 no texto "50", que pode ser juntado com +. int e float manteriam um número e gerariam TypeError.

Conceitos: Converter valores, Texto com número. Objetivo: Usar str para juntar um número a um texto.

#### u2-l4-e04 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
print(float("2.5") * 2)
```

- ✅ a:

  ```text
  5.0
  ```

- ▫️ b:

  ```text
  2.52.5
  ```

  - Feedback: Depois do float, "2.5" é um número, e o * multiplica.
- ▫️ c:

  ```text
  5
  ```

  - Feedback: Uma conta com float resulta em float, que aparece com .0.

- Dica 1: Primeiro o float transforma o texto em número.
- Dica 2: Depois da conversão, a conta é uma multiplicação comum, e float vezes int resulta em float: 1.5 * 2 dá 3.0.

**Explicação:** float("2.5") converte o texto em número. Multiplicado por 2, resulta em 5.0.

Conceitos: Converter valores, Tipos básicos. Objetivo: Converter um texto decimal com float antes de calcular.

#### u2-l4-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  idade = "30"
 2  proximo = idade + 1
 3  print("Ano que vem:", proximo)
```

Resposta: linha 2 (TypeError). Correção: `proximo = int(idade) + 1`

- Dica 1: Qual é o tipo de idade?
- Dica 2: Um texto precisa ser convertido antes de entrar numa conta: int("7") + 1 dá 8.

**Explicação:** idade guarda o texto "30". Na linha 2, somar texto com número gera TypeError; int(idade) converte antes da soma.

Conceitos: Converter valores, Texto com número. Objetivo: Encontrar uma soma com um número guardado como texto.

#### u2-l4-e06 — escolher resultado (dificuldade 3)

**Enunciado:** O que este programa exibe?

```python
print(int(3.9))
```

- ▫️ a:

  ```text
  4
  ```

  - Feedback: O int não arredonda; ele descarta a parte decimal.
- ▫️ b:

  ```text
  3.9
  ```

  - Feedback: O int transforma o valor em inteiro.
- ✅ c:

  ```text
  3
  ```


- Dica 1: O int não arredonda.
- Dica 2: Ao converter para inteiro, o int simplesmente descarta a parte decimal: int(7.8) dá 7.

**Explicação:** Ao converter 3.9 para inteiro, o int descarta a parte decimal. O resultado é 3, não 4.

Conceitos: Converter valores. Objetivo: Perceber que int descarta a parte decimal sem arredondar.

#### u2-l4-e07 — ordenar blocos (dificuldade 3)

**Enunciado:** A quantidade foi guardada como texto. Monte o programa que exibe esta saída.

Linhas fixas antes:

```python
quantidade = "3"
```

Saída esperada:

```text
Total: 15
```

- `a`: `total = int(quantidade) * 5`
- `b`: `print("Total: " + str(total))`
- `c`: `print("Total: " + quantidade * 5)` (distrator)
- `d`: `print("Total: " + total)` (distrator)

Ordens aceitas: a → b

- Dica 1: Para a conta, a quantidade precisa virar número.
- Dica 2: Depois da conta, o total precisa virar texto com str para ser juntado com +. Um texto multiplicado por número seria repetido, e não multiplicado.

**Explicação:** int(quantidade) permite a multiplicação, e str(total) permite juntar o resultado ao texto. Sem o int, o texto "3" seria repetido; sem o str, o + geraria TypeError.

Conceitos: Converter valores, Juntar textos. Objetivo: Converter um texto em número, calcular e converter de volta para exibir.

### Variações de revisão

#### u2-l4-r01 — escolher resultado (dificuldade 1)

Variação de u2-l4-e01.

**Enunciado:** O que este programa exibe?

```python
print("2" + "3")
```

- ▫️ a:

  ```text
  5
  ```

  - Feedback: Com aspas, os valores são textos e são juntados.
- ✅ b:

  ```text
  23
  ```

- ▫️ c:

  ```text
  2 + 3
  ```

  - Feedback: O + não aparece na saída.

- Dica 1: Repare nas aspas.
- Dica 2: Com textos, o + cola um no outro: "4" + "4" forma 44.

**Explicação:** "2" e "3" são textos, então o + os junta: 23.

Conceitos: Converter valores, Juntar textos. Objetivo: Prever a junção de dois números escritos como texto.

#### u2-l4-r02 — localizar erro (dificuldade 3)

Variação de u2-l4-e05.

**Enunciado:** O programa deveria exibir o dobro do preço, mas mostra outra coisa. Selecione a linha com o problema.

```python
 1  preco = "10"
 2  dobro = preco * 2
 3  print("Dobro:", dobro)
```

Saída esperada:

```text
Dobro: 20
```

Resposta: linha 2 (saida_incorreta). Correção: `dobro = int(preco) * 2`

- Dica 1: O que acontece quando um texto é multiplicado por um número?
- Dica 2: Um texto vezes um número é repetido. Para multiplicar de verdade, converta antes com int, como em int("4") * 2.

**Explicação:** Como preco é texto, preco * 2 repete o texto e resulta em 1010. Convertendo com int, a multiplicação dá 20.

Conceitos: Converter valores, Repetir textos. Objetivo: Encontrar uma multiplicação feita com um texto.

#### u2-l4-r03 — completar lacuna (dificuldade 2)

Variação de u2-l4-e03.

**Enunciado:** Complete para juntar o texto e a idade com +.

```python
idade = 25
print("Idade: " + ___1___(idade))
```

Saída esperada:

```text
Idade: 25
```

- Lacuna 1: `int`, **`str`**, `type`

- Dica 1: Os dois lados do + precisam ser texto.
- Dica 2: Das opções, só uma transforma um valor em texto. As outras convertem em inteiro ou mostram o tipo.

**Explicação:** str(idade) transforma 25 em texto, que pode ser juntado com "Idade: ".

Conceitos: Converter valores. Objetivo: Usar str para exibir um número junto com texto.

## Lição 5 — Desafio: conta do lanche

Objetivo: Montar, em etapas, um programa que calcula o total de um pedido e exibe uma mensagem.

### Sessão principal

#### u2-l5-e01 — completar lacuna (dificuldade 2)

**Enunciado:** Etapa 1: o lanche custa 12,50 reais, e foram pedidos 2. Complete para guardar os valores.

```python
preco = ___1___
quantidade = ___2___
print(preco, quantidade)
```

Saída esperada:

```text
12.5 2
```

- Lacuna 1: **`12.5`**, `12,5`, `12`
- Lacuna 2: **`2`**, `2.0`, `dois`

- Dica 1: A casa decimal usa ponto.
- Dica 2: A quantidade é um número inteiro, escrito em algarismos e sem aspas. Com vírgula, 12,5 viraria dois números.

**Explicação:** 12.5 é um float, escrito com ponto, e 2 é um int. Com vírgula, 12,5 viraria dois números separados.

Conceitos: Tipos básicos. Objetivo: Guardar um preço decimal e uma quantidade inteira.

#### u2-l5-e02 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 2: calcule o total. O que este programa exibe?

```python
preco = 12.5
quantidade = 2
total = preco * quantidade
print(total)
```

- ▫️ a:

  ```text
  25
  ```

  - Feedback: Uma conta com float resulta em float, que aparece com .0.
- ✅ b:

  ```text
  25.0
  ```

- ▫️ c:

  ```text
  12.5 * 2
  ```

  - Feedback: Sem aspas, a conta é calculada.

- Dica 1: Um dos valores é float.
- Dica 2: Uma conta com pelo menos um float resulta em float: 1.5 * 2 dá 3.0.

**Explicação:** Multiplicar um float por um int resulta em float, por isso o total aparece como 25.0.

Conceitos: Tipos básicos. Objetivo: Prever o tipo do resultado de float vezes int.

#### u2-l5-e03 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 3: a entrega custa 5 reais. O que este programa exibe?

```python
total = 12.5 * 2 + 5
print(total)
```

- ✅ a:

  ```text
  30.0
  ```

- ▫️ b:

  ```text
  87.5
  ```

  - Feedback: A multiplicação acontece antes da soma.
- ▫️ c:

  ```text
  30
  ```

  - Feedback: A conta envolve um float, então o resultado é float.

- Dica 1: Primeiro a multiplicação, depois a soma.
- Dica 2: Como um dos números tem ponto, o resultado também terá casa decimal.

**Explicação:** O Python calcula 12.5 * 2, que dá 25.0, e depois soma 5, resultando em 30.0.

Conceitos: Ordem das operações. Objetivo: Aplicar a ordem das operações ao somar a entrega.

#### u2-l5-e04 — localizar erro (dificuldade 2)

**Enunciado:** Etapa 4: a mensagem mostra um erro. Selecione a linha com o problema.

```python
 1  total = 30.0
 2  print("Total: R$ " + total)
```

Resposta: linha 2 (TypeError). Correção: `print("Total: R$ " + str(total))`

- Dica 1: Repare no tipo de total e no que o + está juntando.
- Dica 2: Para juntar um número a um texto com +, converta o número com str antes, como em "Nota: " + str(9).

**Explicação:** O total é um número. Na linha 2, ele precisa ser convertido com str antes de ser juntado ao texto.

Conceitos: Converter valores, Juntar textos. Objetivo: Encontrar a mensagem que junta texto e número sem conversão.

#### u2-l5-e05 — completar lacuna (dificuldade 2)

**Enunciado:** Etapa 5: a conta deu 31,50 reais e vai ser dividida por 3 pessoas. Complete o cálculo.

```python
total = 31.5
pessoas = 3
print("Cada um paga:", total ___1___ pessoas)
```

Saída esperada:

```text
Cada um paga: 10.5
```

- Lacuna 1: **`/`**, `//`, `%`

- Dica 1: O valor de cada pessoa pode ter centavos.
- Dica 2: O / mantém a parte decimal, o // a descarta e o % mostra só o resto da divisão.

**Explicação:** Com /, a divisão mantém a parte decimal e resulta em 10.5. Com //, os centavos seriam descartados; com %, apareceria só o resto.

Conceitos: Divisão. Objetivo: Escolher a divisão certa para dividir a conta.

#### u2-l5-e06 — ordenar blocos (dificuldade 3)

**Enunciado:** Etapa 6: monte o programa que exibe a mensagem do total.

Linhas fixas antes:

```python
preco = 12.5
quantidade = 2
```

Saída esperada:

```text
Total: R$ 25.0
```

- `a`: `total = preco * quantidade`
- `b`: `mensagem = "Total: R$ " + str(total)`
- `c`: `print(mensagem)`
- `d`: `mensagem = "Total: R$ " + total` (distrator)

Ordens aceitas: a → b → c

- Dica 1: Calcule o total antes de montar a mensagem.
- Dica 2: O total é um número; para juntá-lo ao texto com +, ele precisa virar texto com str.

**Explicação:** Primeiro o total é calculado; depois, convertido com str e juntado ao texto; por fim, a mensagem é exibida.

Conceitos: Converter valores, Juntar textos. Objetivo: Montar o cálculo e a mensagem do total.

#### u2-l5-e07 — escolher resultado (dificuldade 3)

**Enunciado:** Etapa final: qual programa exibe exatamente: Total: R$ 25.0

Saída esperada:

```text
Total: R$ 25.0
```

- ▫️ a:

  ```python
  total = 12.5 * 2
  print("Total: R$" + str(total))
  ```

  - Feedback: Falta o espaço depois de R$, então a saída fica R$25.0.
- ✅ b:

  ```python
  total = 12.5 * 2
  print("Total: R$ " + str(total))
  ```

- ▫️ c:

  ```python
  total = "12.5" * 2
  print("Total: R$ " + str(total))
  ```

  - Feedback: Com aspas, o preço é texto, e o * repete o texto.

- Dica 1: Confira o espaço e as aspas.
- Dica 2: O + não coloca espaço entre os textos: o espaço precisa estar dentro das aspas. E um número entre aspas não é multiplicado como número.

**Explicação:** O preço sem aspas permite a multiplicação, e o texto "Total: R$ " já termina com o espaço antes do valor.

Conceitos: Converter valores, Juntar textos. Objetivo: Escolher o programa completo que exibe a mensagem exata.

### Variações de revisão

#### u2-l5-r01 — localizar erro (dificuldade 2)

Variação de u2-l5-e04.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  pessoas = 4
 2  print("Somos " + pessoas + " pessoas")
```

Resposta: linha 2 (TypeError). Correção: `print("Somos " + str(pessoas) + " pessoas")`

- Dica 1: Qual valor não é texto?
- Dica 2: Para juntar um número com textos usando +, converta o número com str antes.

**Explicação:** pessoas guarda um número. Para juntar com +, ele precisa ser convertido com str.

Conceitos: Converter valores, Texto com número. Objetivo: Encontrar outra mensagem que junta texto e número.
