# Unidade 3 — Decisões: versão de leitura

Gerado por `ferramentas/verificar_conteudo.py` a partir dos arquivos YAML. Não edite à mão.

## Lição 1 — Verdadeiro ou falso

Objetivo: Prever o resultado de comparações com >, <, >= e <=.

### Sessão principal

#### u3-l1-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Uma comparação responde com True (verdadeiro) ou False (falso). O que este programa exibe?

```python
print(5 > 3)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: 5 é maior que 3, então a comparação é verdadeira.
- ▫️ c:

  ```text
  5 > 3
  ```

  - Feedback: Sem aspas, o Python avalia a comparação.

- Dica 1: 5 é maior que 3?

**Explicação:** 5 > 3 é verdadeiro, e o Python responde com True.

Conceitos: Verdadeiro ou falso, Comparar números. Objetivo: Perceber que uma comparação resulta em True ou False.

#### u3-l1-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
print(2 > 7)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: 2 não é maior que 7.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  7
  ```

  - Feedback: Uma comparação resulta em True ou False, não em um número.

- Dica 1: Leia > como "é maior que".

**Explicação:** 2 não é maior que 7, então a comparação resulta em False.

Conceitos: Verdadeiro ou falso, Comparar números. Objetivo: Prever uma comparação falsa.

#### u3-l1-e03 — escolher resultado (dificuldade 2)

**Enunciado:** O operador >= significa "maior ou igual". O que este programa exibe?

```python
print(4 >= 4)
```

- ▫️ a:

  ```text
  False
  ```

  - Feedback: 4 não é maior que 4, mas é igual, e o >= aceita a igualdade.
- ✅ b:

  ```text
  True
  ```

- ▫️ c:

  ```text
  4
  ```

  - Feedback: A comparação resulta em True ou False.

- Dica 1: O >= aceita valores iguais.

**Explicação:** 4 >= 4 pergunta se 4 é maior ou igual a 4. Como é igual, o resultado é True.

Conceitos: Comparar números. Objetivo: Perceber que >= inclui a igualdade.

#### u3-l1-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para verificar se a idade é maior que 18.

```python
idade = 20
print(idade ___1___ 18)
```

Saída esperada:

```text
True
```

- Lacuna 1: **`>`**, `<`, `=`

- Dica 1: Um único = guarda valores; não compara.

**Explicação:** idade > 18 pergunta se 20 é maior que 18, o que é verdadeiro. Com <, o resultado seria False; com =, o Python mostraria um erro.

Conceitos: Comparar números. Objetivo: Escolher o operador de comparação que torna a condição verdadeira.

#### u3-l1-e05 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
x = 10
print(x < 5)
```

- ✅ a:

  ```text
  False
  ```

- ▫️ b:

  ```text
  True
  ```

  - Feedback: x vale 10, que não é menor que 5.
- ▫️ c:

  ```text
  10 < 5
  ```

  - Feedback: O print exibe o resultado da comparação.

- Dica 1: Troque x pelo valor guardado nele.

**Explicação:** x vale 10, e 10 < 5 é falso. O print exibe False.

Conceitos: Comparar números, Verdadeiro ou falso. Objetivo: Comparar o valor de uma variável.

#### u3-l1-e06 — localizar erro (dificuldade 3)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  pontos = "10"
 2  print(pontos > 5)
```

Resposta: linha 2 (TypeError). Correção: `print(int(pontos) > 5)`

- Dica 1: Qual é o tipo de pontos?

**Explicação:** pontos guarda o texto "10". O Python não compara texto e número com >, por isso a linha 2 gera TypeError. Convertendo com int, a comparação funciona.

Conceitos: Comparar números. Objetivo: Encontrar a comparação entre texto e número.

#### u3-l1-e07 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída.

Linhas fixas antes:

```python
nota = 7
```

Saída esperada:

```text
True
False
```

- `a`: `print(nota >= 6)`
- `b`: `print(nota >= 8)`
- `c`: `print(nota => 6)` (distrator)

Ordens aceitas: a → b

- Dica 1: O operador é escrito >=, não =>.

**Explicação:** 7 >= 6 é verdadeiro e 7 >= 8 é falso. O bloco com => está escrito errado e geraria um erro.

Conceitos: Comparar números, Verdadeiro ou falso. Objetivo: Montar comparações que produzem True e depois False.

### Variações de revisão

#### u3-l1-r01 — escolher resultado (dificuldade 1)

Variação de u3-l1-e01.

**Enunciado:** O que este programa exibe?

```python
print(10 < 3)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: 10 não é menor que 3.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  3
  ```

  - Feedback: A comparação resulta em True ou False.

- Dica 1: Leia < como "é menor que".

**Explicação:** 10 não é menor que 3, então o resultado é False.

Conceitos: Comparar números, Verdadeiro ou falso. Objetivo: Prever uma comparação com <.

#### u3-l1-r02 — completar lacuna (dificuldade 2)

Variação de u3-l1-e04.

**Enunciado:** Complete para verificar se a temperatura está abaixo de 30.

```python
temperatura = 15
print(temperatura ___1___ 30)
```

Saída esperada:

```text
True
```

- Lacuna 1: **`<`**, `>`, `=<`

- Dica 1: Abaixo de 30 significa menor que 30.

**Explicação:** temperatura < 30 é verdadeiro, porque 15 é menor que 30. O operador =< não existe; o certo seria <=.

Conceitos: Comparar números. Objetivo: Escolher o operador de comparação em outro contexto.

#### u3-l1-r03 — escolher resultado (dificuldade 2)

Variação de u3-l1-e03.

**Enunciado:** O que este programa exibe?

```python
print(9 <= 8)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: 9 não é menor nem igual a 8.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  8
  ```

  - Feedback: A comparação resulta em True ou False.

- Dica 1: O <= aceita menor ou igual.

**Explicação:** 9 não é menor nem igual a 8, então o resultado é False.

Conceitos: Comparar números. Objetivo: Prever uma comparação com <=.

## Lição 2 — Igual ou diferente

Objetivo: Comparar valores com == e != e distinguir comparação de atribuição.

### Sessão principal

#### u3-l2-e01 — escolher resultado (dificuldade 1)

**Enunciado:** Para comparar se dois valores são iguais, usa-se ==. O que este programa exibe?

```python
print(3 == 3)
```

- ▫️ a:

  ```text
  3
  ```

  - Feedback: O == compara e responde com True ou False.
- ✅ b:

  ```text
  True
  ```

- ▫️ c:

  ```text
  False
  ```

  - Feedback: 3 é igual a 3.

- Dica 1: Os dois lados são iguais?

**Explicação:** 3 == 3 pergunta se os valores são iguais. Como são, o resultado é True.

Conceitos: Igual ou diferente. Objetivo: Usar == para comparar igualdade.

#### u3-l2-e02 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
print("sim" == "Sim")
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: Para o Python, s minúsculo e S maiúsculo são diferentes.
- ✅ b:

  ```text
  False
  ```

- ▫️ c: O programa mostra um erro
  - Feedback: Comparar textos com == funciona normalmente.

- Dica 1: Compare as letras uma a uma.

**Explicação:** Os textos diferem na primeira letra, maiúscula em um e minúscula no outro. Por isso não são iguais.

Conceitos: Igual ou diferente. Objetivo: Perceber que maiúsculas e minúsculas tornam textos diferentes.

#### u3-l2-e03 — escolher resultado (dificuldade 2)

**Enunciado:** O operador != significa "diferente de". O que este programa exibe?

```python
print(5 != 3)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: 5 e 3 são diferentes, então != responde True.
- ▫️ c:

  ```text
  2
  ```

  - Feedback: O != compara; não faz subtração.

- Dica 1: 5 é diferente de 3?

**Explicação:** 5 != 3 pergunta se os valores são diferentes. Como são, o resultado é True.

Conceitos: Igual ou diferente. Objetivo: Usar != para verificar se valores são diferentes.

#### u3-l2-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para conferir se a senha digitada é a correta.

```python
senha = "abc123"
print(senha ___1___ "abc123")
```

Saída esperada:

```text
True
```

- Lacuna 1: **`==`**, `=`, `!=`

- Dica 1: Um único = guarda valores; dois comparam.

**Explicação:** senha == "abc123" compara os dois textos, que são iguais. Com =, o Python mostraria um erro; com !=, o resultado seria False.

Conceitos: Igual ou diferente. Objetivo: Escolher == para conferir uma senha.

#### u3-l2-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  cor = "azul"
 2  print("azul" = cor)
```

Resposta: linha 2 (SyntaxError). Correção: `print("azul" == cor)`

- Dica 1: Para comparar, são necessários dois sinais de igual.

**Explicação:** Na linha 2, um único = tenta guardar um valor dentro do print, o que é um erro. Para comparar, use ==.

Conceitos: Igual ou diferente. Objetivo: Encontrar o uso de = no lugar de ==.

#### u3-l2-e06 — escolher resultado (dificuldade 3)

**Enunciado:** O que este programa exibe?

```python
print("10" == 10)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: Um é texto e o outro é número; para o Python, não são iguais.
- ▫️ b: O programa mostra um erro
  - Feedback: Com ==, comparar texto e número não é erro; só resulta em False.
- ✅ c:

  ```text
  False
  ```


- Dica 1: Qual é o tipo de cada lado?

**Explicação:** "10" é texto e 10 é número. O == não mostra erro, mas responde False, porque valores de tipos diferentes não são iguais.

Conceitos: Igual ou diferente, Verdadeiro ou falso. Objetivo: Perceber que texto e número nunca são iguais.

#### u3-l2-e07 — ordenar blocos (dificuldade 2)

**Enunciado:** Monte o programa que exibe esta saída.

Linhas fixas antes:

```python
resposta = "Python"
```

Saída esperada:

```text
False
True
```

- `a`: `print(resposta == "python")`
- `b`: `print(resposta == "Python")`
- `c`: `print(resposta = "Python")` (distrator)

Ordens aceitas: a → b

- Dica 1: Uma das comparações difere só na primeira letra.

**Explicação:** "python" com p minúsculo é diferente de "Python", então a primeira comparação é False e a segunda é True. O bloco com um único = geraria erro.

Conceitos: Igual ou diferente. Objetivo: Montar comparações de texto que produzem False e True.

### Variações de revisão

#### u3-l2-r01 — escolher resultado (dificuldade 2)

Variação de u3-l2-e02.

**Enunciado:** O que este programa exibe?

```python
print("Ana" == "ana")
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: A maiúscula faz diferença na comparação.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  Ana
  ```

  - Feedback: A comparação resulta em True ou False.

- Dica 1: Compare a primeira letra de cada texto.

**Explicação:** "Ana" e "ana" diferem na primeira letra, por isso a comparação resulta em False.

Conceitos: Igual ou diferente. Objetivo: Comparar nomes com maiúsculas diferentes.

#### u3-l2-r02 — escolher resultado (dificuldade 2)

Variação de u3-l2-e03.

**Enunciado:** O que este programa exibe?

```python
print(8 != 8)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: 8 não é diferente de 8.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  0
  ```

  - Feedback: O != compara; não subtrai.

- Dica 1: Os dois valores são diferentes?

**Explicação:** 8 != 8 pergunta se os valores são diferentes. Como são iguais, o resultado é False.

Conceitos: Igual ou diferente. Objetivo: Prever != com valores iguais.

#### u3-l2-r03 — escolher resultado (dificuldade 3)

Variação de u3-l2-e06.

**Enunciado:** O que este programa exibe?

```python
print(1 == "1")
```

- ✅ a:

  ```text
  False
  ```

- ▫️ b:

  ```text
  True
  ```

  - Feedback: Número e texto não são iguais, mesmo com o mesmo algarismo.
- ▫️ c: O programa mostra um erro
  - Feedback: O == aceita tipos diferentes e responde False.

- Dica 1: Um lado tem aspas e o outro não.

**Explicação:** 1 é número e "1" é texto. Como os tipos são diferentes, o == responde False.

Conceitos: Igual ou diferente, Verdadeiro ou falso. Objetivo: Comparar número com texto em outro contexto.

## Lição 3 — E, ou, não

Objetivo: Combinar condições com and, or e not.

### Sessão principal

#### u3-l3-e01 — escolher resultado (dificuldade 1)

**Enunciado:** O and só é verdadeiro quando os dois lados são verdadeiros. O que este programa exibe?

```python
print(True and False)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: Um dos lados é False, e o and exige os dois verdadeiros.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  True False
  ```

  - Feedback: O and combina os valores e resulta em um só.

- Dica 1: Os dois lados são True?

**Explicação:** Com and, basta um lado ser False para o resultado ser False.

Conceitos: E, ou, não. Objetivo: Perceber que and exige as duas condições verdadeiras.

#### u3-l3-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O or é verdadeiro quando pelo menos um lado é verdadeiro. O que este programa exibe?

```python
print(True or False)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: Com or, basta um lado ser True.
- ▫️ c:

  ```text
  True or False
  ```

  - Feedback: Sem aspas, o Python calcula o resultado.

- Dica 1: Algum dos lados é True?

**Explicação:** Com or, um lado verdadeiro é suficiente. Como o primeiro é True, o resultado é True.

Conceitos: E, ou, não. Objetivo: Perceber que or precisa de pelo menos uma condição verdadeira.

#### u3-l3-e03 — escolher resultado (dificuldade 1)

**Enunciado:** O not inverte o valor. O que este programa exibe?

```python
print(not True)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: O not troca True por False.
- ✅ b:

  ```text
  False
  ```

- ▫️ c: O programa mostra um erro
  - Feedback: not True é válido em Python.

- Dica 1: Qual é o contrário de True?

**Explicação:** O not inverte o valor lógico. O contrário de True é False.

Conceitos: E, ou, não. Objetivo: Usar not para inverter um valor lógico.

#### u3-l3-e04 — escolher resultado (dificuldade 2)

**Enunciado:** O que este programa exibe?

```python
idade = 20
tem_ingresso = True
print(idade >= 18 and tem_ingresso)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: As duas condições são verdadeiras.
- ▫️ c:

  ```text
  20
  ```

  - Feedback: O and resulta em um valor lógico.

- Dica 1: Avalie cada lado do and separadamente.

**Explicação:** idade >= 18 é True, e tem_ingresso também é True. Com os dois verdadeiros, o and resulta em True.

Conceitos: E, ou, não, Verdadeiro ou falso. Objetivo: Combinar uma comparação e uma variável lógica com and.

#### u3-l3-e05 — completar lacuna (dificuldade 2)

**Enunciado:** Complete para que o programa exiba True quando estiver chovendo ou fazendo sol.

```python
chuva = True
sol = False
print(chuva ___1___ sol)
```

Saída esperada:

```text
True
```

- Lacuna 1: **`or`**, `and`, `+`

- Dica 1: Basta uma das condições ser verdadeira.

**Explicação:** chuva or sol é True, porque chuva é True. Com and, o resultado seria False; com +, o Python faria uma soma.

Conceitos: E, ou, não. Objetivo: Escolher or quando basta uma condição verdadeira.

#### u3-l3-e06 — localizar erro (dificuldade 3)

**Enunciado:** Para passar, o aluno precisa de nota de pelo menos 6 e frequência de pelo menos 75. O programa deveria exibir a saída abaixo. Selecione a linha com o problema.

```python
 1  nota = 8
 2  frequencia = 60
 3  print(nota >= 6 or frequencia >= 75)
```

Saída esperada:

```text
False
```

Resposta: linha 3 (saida_incorreta). Correção: `print(nota >= 6 and frequencia >= 75)`

- Dica 1: As duas exigências precisam ser cumpridas.

**Explicação:** As duas condições são obrigatórias, então o correto é and. Com or, a nota sozinha já tornava o resultado True.

Conceitos: E, ou, não. Objetivo: Encontrar uma condição que usa or no lugar de and.

#### u3-l3-e07 — escolher resultado (dificuldade 2)

**Enunciado:** Hoje não é fim de semana, mas é feriado. Qual programa exibe exatamente: True

Saída esperada:

```text
True
```

- ▫️ a:

  ```python
  fim_de_semana = False
  feriado = True
  print(fim_de_semana and feriado)
  ```

  - Feedback: Com and, os dois precisariam ser True.
- ✅ b:

  ```python
  fim_de_semana = False
  feriado = True
  print(fim_de_semana or feriado)
  ```

- ▫️ c:

  ```python
  fim_de_semana = False
  feriado = True
  print(not feriado)
  ```

  - Feedback: not feriado inverte True para False.

- Dica 1: Uma condição verdadeira basta?

**Explicação:** Com or, basta um dos lados ser True. Como feriado é True, o resultado é True.

Conceitos: E, ou, não. Objetivo: Escolher o programa que combina condições corretamente.

### Variações de revisão

#### u3-l3-r01 — escolher resultado (dificuldade 2)

Variação de u3-l3-e02.

**Enunciado:** O que este programa exibe?

```python
print(False or False)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: O or precisa de pelo menos um lado True.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  False False
  ```

  - Feedback: O or resulta em um único valor.

- Dica 1: Algum lado é True?

**Explicação:** Nenhum dos lados é True, então o or resulta em False.

Conceitos: E, ou, não. Objetivo: Prever or com os dois lados falsos.

#### u3-l3-r02 — escolher resultado (dificuldade 1)

Variação de u3-l3-e03.

**Enunciado:** O que este programa exibe?

```python
print(not False)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: O not inverte o valor.
- ▫️ c:

  ```text
  not False
  ```

  - Feedback: Sem aspas, o Python calcula o resultado.

- Dica 1: Qual é o contrário de False?

**Explicação:** O not inverte False, resultando em True.

Conceitos: E, ou, não. Objetivo: Inverter False com not.

#### u3-l3-r03 — escolher resultado (dificuldade 2)

Variação de u3-l3-e04.

**Enunciado:** O que este programa exibe?

```python
idade = 25
tem_carteira = False
print(idade >= 18 and tem_carteira)
```

- ▫️ a:

  ```text
  True
  ```

  - Feedback: tem_carteira é False, e o and exige os dois verdadeiros.
- ✅ b:

  ```text
  False
  ```

- ▫️ c:

  ```text
  25
  ```

  - Feedback: O and resulta em um valor lógico.

- Dica 1: Avalie cada lado do and.

**Explicação:** idade >= 18 é True, mas tem_carteira é False. Com and, o resultado é False.

Conceitos: E, ou, não, Verdadeiro ou falso. Objetivo: Prever and com uma condição falsa.

## Lição 4 — Se e senão

Objetivo: Prever qual bloco de um if/else é executado e escrever blocos com dois-pontos e recuo.

### Sessão principal

#### u3-l4-e01 — escolher resultado (dificuldade 1)

**Enunciado:** O if executa o bloco recuado quando a condição é verdadeira; senão, o else executa o dele. O que este programa exibe?

```python
idade = 20
if idade >= 18:
    print("Maior de idade")
else:
    print("Menor de idade")
```

- ✅ a:

  ```text
  Maior de idade
  ```

- ▫️ b:

  ```text
  Menor de idade
  ```

  - Feedback: A condição é verdadeira, então o else não é executado.
- ▫️ c:

  ```text
  Maior de idade
  Menor de idade
  ```

  - Feedback: Só um dos blocos é executado.

- Dica 1: 20 >= 18 é verdadeiro ou falso?

**Explicação:** Como 20 >= 18 é verdadeiro, o Python executa o bloco do if e pula o do else.

Conceitos: Se e senão. Objetivo: Prever que o if executa seu bloco quando a condição é verdadeira.

#### u3-l4-e02 — escolher resultado (dificuldade 1)

**Enunciado:** O que este programa exibe?

```python
temperatura = 15
if temperatura > 25:
    print("Calor")
else:
    print("Frio")
```

- ▫️ a:

  ```text
  Calor
  ```

  - Feedback: 15 não é maior que 25.
- ✅ b:

  ```text
  Frio
  ```

- ▫️ c:

  ```text
  Calor
  Frio
  ```

  - Feedback: Só um dos blocos é executado.

- Dica 1: A condição é verdadeira?

**Explicação:** 15 > 25 é falso, então o Python pula o bloco do if e executa o do else.

Conceitos: Se e senão. Objetivo: Prever que o else executa quando a condição é falsa.

#### u3-l4-e03 — escolher resultado (dificuldade 2)

**Enunciado:** A última linha não tem recuo. O que este programa exibe?

```python
nota = 4
if nota >= 6:
    print("Aprovado")
else:
    print("Recuperação")
print("Fim")
```

- ✅ a:

  ```text
  Recuperação
  Fim
  ```

- ▫️ b:

  ```text
  Fim
  ```

  - Feedback: O bloco do else também é executado, porque a condição é falsa.
- ▫️ c:

  ```text
  Aprovado
  Fim
  ```

  - Feedback: 4 não é maior ou igual a 6.

- Dica 1: Uma linha sem recuo não pertence ao if nem ao else.

**Explicação:** Como a nota é 4, o else exibe Recuperação. A última linha não tem recuo, então é executada sempre, depois do if/else.

Conceitos: Se e senão, Blocos e indentação. Objetivo: Perceber que linhas sem recuo depois do if/else sempre executam.

#### u3-l4-e04 — completar lacuna (dificuldade 2)

**Enunciado:** Complete o final da linha do if.

```python
saldo = 50
if saldo >= 30___1___
    print("Compra aprovada")
else:
    print("Saldo insuficiente")
```

Saída esperada:

```text
Compra aprovada
```

- Lacuna 1: **`:`**, `;`, `.`

- Dica 1: Olhe como termina a linha do else.

**Explicação:** As linhas do if e do else terminam com dois-pontos. Eles indicam que um bloco recuado vem a seguir.

Conceitos: Blocos e indentação. Objetivo: Terminar a linha do if com dois-pontos.

#### u3-l4-e05 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  pontos = 80
 2  if pontos > 50:
 3  print("Ganhou")
 4  else:
 5      print("Tente de novo")
```

Resposta: linha 3 (IndentationError). Correção: `print("Ganhou")`

- Dica 1: Compare o recuo das linhas dentro do if e do else.

**Explicação:** A linha 3 pertence ao bloco do if e precisa de recuo. Sem ele, o Python mostra um erro de indentação (IndentationError).

Conceitos: Blocos e indentação. Objetivo: Encontrar um bloco do if sem recuo.

#### u3-l4-e06 — localizar erro (dificuldade 2)

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  senha = "1234"
 2  if senha = "1234":
 3      print("Acesso liberado")
 4  else:
 5      print("Senha incorreta")
```

Resposta: linha 2 (SyntaxError). Correção: `if senha == "1234":`

- Dica 1: Para comparar, são necessários dois sinais de igual.

**Explicação:** A condição do if precisa comparar com ==. Um único = tenta guardar um valor e gera um erro de sintaxe.

Conceitos: Se e senão. Objetivo: Encontrar um if que usa = no lugar de ==.

#### u3-l4-e07 — ordenar blocos (dificuldade 3)

**Enunciado:** Monte o início do programa que diz se um número é par. O else já está pronto.

Linhas fixas antes:

```python
numero = 4
```

Saída esperada:

```text
Par
```

- `a`: `if numero % 2 == 0:`
- `b`: `print("Par")`
- `c`: `print("Par")` (distrator)
- `d`: `if numero % 2 = 0:` (distrator)

Linhas fixas depois:

```python
else:
    print("Ímpar")
```

Ordens aceitas: a → b

- Dica 1: Um número é par quando o resto da divisão por 2 é zero.
- Dica 2: O bloco do if precisa de recuo.

**Explicação:** A condição compara o resto com zero usando ==, e o print fica recuado dentro do if. Sem recuo, ou com um único =, o programa teria erro.

Conceitos: Se e senão, Blocos e indentação. Objetivo: Montar o início de um if com condição e bloco recuado.

### Variações de revisão

#### u3-l4-r01 — escolher resultado (dificuldade 1)

Variação de u3-l4-e01.

**Enunciado:** O que este programa exibe?

```python
hora = 9
if hora < 12:
    print("Bom dia")
else:
    print("Boa tarde")
```

- ▫️ a:

  ```text
  Boa tarde
  ```

  - Feedback: 9 é menor que 12, então o bloco do if é executado.
- ✅ b:

  ```text
  Bom dia
  ```

- ▫️ c:

  ```text
  Bom dia
  Boa tarde
  ```

  - Feedback: Só um dos blocos é executado.

- Dica 1: 9 < 12 é verdadeiro?

**Explicação:** Como 9 < 12 é verdadeiro, o programa exibe Bom dia e pula o else.

Conceitos: Se e senão. Objetivo: Prever qual bloco executa em outro contexto.

#### u3-l4-r02 — localizar erro (dificuldade 2)

Variação de u3-l4-e05.

**Enunciado:** Este programa mostra um erro. Selecione a linha com o problema.

```python
 1  chuva = True
 2  if chuva:
 3      print("Leve guarda-chuva")
 4  else:
 5  print("Aproveite o sol")
```

Resposta: linha 5 (IndentationError). Correção: `print("Aproveite o sol")`

- Dica 1: O bloco do else também precisa de recuo.

**Explicação:** A linha 5 pertence ao else e precisa de recuo, mesmo que esse bloco não seja executado agora.

Conceitos: Blocos e indentação. Objetivo: Encontrar um bloco do else sem recuo.

#### u3-l4-r03 — escolher resultado (dificuldade 2)

Variação de u3-l4-e03.

**Enunciado:** O que este programa exibe?

```python
estoque = 0
if estoque > 0:
    print("Disponível")
else:
    print("Esgotado")
print("Obrigado")
```

- ✅ a:

  ```text
  Esgotado
  Obrigado
  ```

- ▫️ b:

  ```text
  Disponível
  Obrigado
  ```

  - Feedback: 0 não é maior que 0.
- ▫️ c:

  ```text
  Esgotado
  ```

  - Feedback: A última linha não tem recuo e é sempre executada.

- Dica 1: 0 > 0 é verdadeiro?

**Explicação:** Como 0 > 0 é falso, o else exibe Esgotado. Depois, a linha sem recuo exibe Obrigado.

Conceitos: Se e senão, Blocos e indentação. Objetivo: Prever o if/else seguido de uma linha que sempre executa.

## Lição 5 — Desafio: verificador de ingresso

Objetivo: Montar, em etapas, um programa que decide entre meia-entrada e inteira.

### Sessão principal

#### u3-l5-e01 — completar lacuna (dificuldade 2)

**Enunciado:** Etapa 1: a pessoa tem 16 anos e não é estudante. Complete para guardar os dados.

```python
idade = ___1___
estudante = ___2___
print(idade, estudante)
```

Saída esperada:

```text
16 False
```

- Lacuna 1: **`16`**, `16.0`, `dezesseis`
- Lacuna 2: **`False`**, `false`, `Falso`

- Dica 1: Idade é um número inteiro.
- Dica 2: O valor lógico é escrito em inglês, com maiúscula.

**Explicação:** 16 é um inteiro, e False é o valor lógico para "não". false e Falso não são valores do Python.

Conceitos: Verdadeiro ou falso. Objetivo: Guardar um número e um valor lógico em variáveis.

#### u3-l5-e02 — escolher resultado (dificuldade 1)

**Enunciado:** Etapa 2: menores de 18 pagam meia. O que este programa exibe?

```python
idade = 16
print(idade < 18)
```

- ✅ a:

  ```text
  True
  ```

- ▫️ b:

  ```text
  False
  ```

  - Feedback: 16 é menor que 18.
- ▫️ c:

  ```text
  16
  ```

  - Feedback: A comparação resulta em True ou False.

- Dica 1: 16 é menor que 18?

**Explicação:** 16 < 18 é verdadeiro, então a pessoa tem direito a meia-entrada pela idade.

Conceitos: Comparar números. Objetivo: Prever a comparação da idade.

#### u3-l5-e03 — escolher resultado (dificuldade 2)

**Enunciado:** Etapa 3: tem meia quem é menor de 18 ou estudante. O que este programa exibe?

```python
idade = 16
estudante = False
print(idade < 18 or estudante)
```

- ▫️ a:

  ```text
  False
  ```

  - Feedback: Com or, basta uma condição verdadeira, e a idade já é.
- ✅ b:

  ```text
  True
  ```

- ▫️ c:

  ```text
  16 False
  ```

  - Feedback: O or resulta em um único valor lógico.

- Dica 1: Uma das condições já é verdadeira?

**Explicação:** idade < 18 é True. Com or, isso basta para o resultado ser True, mesmo sem ser estudante.

Conceitos: E, ou, não. Objetivo: Combinar as duas regras da meia-entrada com or.

#### u3-l5-e04 — localizar erro (dificuldade 3)

**Enunciado:** Etapa 4: estudantes pagam meia, mas o programa diz outra coisa. Selecione a linha com o problema.

```python
 1  idade = 30
 2  estudante = True
 3  if idade < 18 and estudante:
 4      print("Meia-entrada")
 5  else:
 6      print("Inteira")
```

Saída esperada:

```text
Meia-entrada
```

Resposta: linha 3 (saida_incorreta). Correção: `if idade < 18 or estudante:`

- Dica 1: Para ter meia, a pessoa precisa cumprir as duas regras ou basta uma?

**Explicação:** Basta uma das regras para ter meia-entrada, então a condição usa or. Com and, a pessoa precisaria ser menor e estudante ao mesmo tempo.

Conceitos: E, ou, não, Se e senão. Objetivo: Encontrar uma regra que usa and no lugar de or.

#### u3-l5-e05 — ordenar blocos (dificuldade 3)

**Enunciado:** Etapa 5: a regra já está calculada. Monte o if/else que exibe o tipo de ingresso.

Linhas fixas antes:

```python
idade = 30
estudante = False
meia = idade < 18 or estudante
```

Saída esperada:

```text
Inteira
```

- `a`: `if meia:`
- `b`: `print("Meia-entrada")`
- `c`: `else:`
- `d`: `print("Inteira")`
- `e`: `if meia = True:` (distrator)

Ordens aceitas: a → b → c → d

- Dica 1: O if vem antes do else, e cada um tem seu bloco recuado.

**Explicação:** Como meia é False, o Python pula o bloco do if e executa o do else. Cada bloco fica recuado logo abaixo da sua linha.

Conceitos: Se e senão, Blocos e indentação. Objetivo: Montar o if/else completo com blocos recuados.

#### u3-l5-e06 — escolher resultado (dificuldade 3)

**Enunciado:** Etapa 6: um estudante de 30 anos deve pagar meia. Qual programa exibe exatamente: Meia-entrada

Saída esperada:

```text
Meia-entrada
```

- ✅ a:

  ```python
  idade = 30
  estudante = True
  if idade < 18 or estudante:
      print("Meia-entrada")
  else:
      print("Inteira")
  ```

- ▫️ b:

  ```python
  idade = 30
  estudante = True
  if idade < 18 and estudante:
      print("Meia-entrada")
  else:
      print("Inteira")
  ```

  - Feedback: Com and, o estudante de 30 anos pagaria inteira.
- ▫️ c:

  ```python
  idade = 30
  estudante = True
  if idade < 18 or estudante
      print("Meia-entrada")
  else:
      print("Inteira")
  ```

  - Feedback: Falta o dois-pontos no final da linha do if.

- Dica 1: Confira o operador lógico e o final da linha do if.

**Explicação:** A condição usa or, porque basta uma regra, e a linha do if termina com dois-pontos.

Conceitos: E, ou, não, Se e senão, Blocos e indentação. Objetivo: Escolher o programa com a condição e a sintaxe corretas.

#### u3-l5-e07 — escolher resultado (dificuldade 3)

**Enunciado:** Etapa final. O que este programa exibe?

```python
idade = 17
estudante = False
if idade < 18 or estudante:
    tipo = "Meia-entrada"
else:
    tipo = "Inteira"
print("Ingresso:", tipo)
```

- ▫️ a:

  ```text
  Ingresso: Inteira
  ```

  - Feedback: 17 é menor que 18, então a condição é verdadeira.
- ▫️ b:

  ```text
  Ingresso: tipo
  ```

  - Feedback: Sem aspas, tipo é a variável, e o print exibe o valor dela.
- ✅ c:

  ```text
  Ingresso: Meia-entrada
  ```


- Dica 1: Qual bloco guarda um valor em tipo?

**Explicação:** Como idade < 18 é verdadeiro, o bloco do if guarda Meia-entrada em tipo. A última linha, sem recuo, exibe esse valor.

Conceitos: Se e senão, E, ou, não. Objetivo: Prever a saída do verificador completo.

### Variações de revisão

#### u3-l5-r01 — localizar erro (dificuldade 3)

Variação de u3-l5-e04.

**Enunciado:** Uma criança de 12 anos deveria pagar meia, mas o programa diz outra coisa. Selecione a linha com o problema.

```python
 1  idade = 12
 2  estudante = False
 3  if idade > 18 or estudante:
 4      print("Meia-entrada")
 5  else:
 6      print("Inteira")
```

Saída esperada:

```text
Meia-entrada
```

Resposta: linha 3 (saida_incorreta). Correção: `if idade < 18 or estudante:`

- Dica 1: Quem tem direito a meia, os menores ou os maiores de 18?

**Explicação:** A regra é para menores de 18, então a comparação é idade < 18. Com >, a criança de 12 anos pagaria inteira.

Conceitos: Comparar números, Se e senão. Objetivo: Encontrar uma comparação invertida na regra de idade.
