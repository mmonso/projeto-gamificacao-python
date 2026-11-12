# Unidade 4 — Listas e repetição

Primeira unidade depois do curso inicial, pedida pela [estratégia de crescimento](../../design/ESTRATEGIA_DE_CRESCIMENTO.md#próximo-conteúdo). O conteúdo segue o [formato de conteúdo](../FORMATO.md), e a [versão de leitura](LEITURA.md) mostra todos os exercícios com respostas.

## Objetivos e sequência

Ao final, o aluno cria uma lista, prevê o que `print`, `len` e o acesso por posição mostram, acrescenta valores com `append`, prevê quantas vezes e em que ordem um `for` repete o bloco e soma uma lista com um acumulador.

| Lição | Título | Conceitos | Exercícios | Variações |
| --- | --- | --- | --- | --- |
| 1 | Listas | `listas` | 7 | 3 |
| 2 | Posições | `indice`, `listas` | 7 | 3 |
| 3 | Lista que cresce | `append`, `listas` | 7 | 3 |
| 4 | Repetir com for | `for` | 7 | 3 |
| 5 | Desafio: gastos da semana | `acumulador`, `for` | 7 | 2 |

Decisões:

- **Sem `range` nem `while`.** O `for` percorre listas escritas no código. O `range` entra junto com o `while` numa unidade futura, para não misturar duas ideias novas no mesmo `for`.
- **Sem cópia de listas (`b = a`).** Duas variáveis apontando para a mesma lista contradizem a regra das unidades anteriores ("a cópia não muda"). O assunto fica para quando houver execução de código no navegador, em que o aluno pode ver o efeito.
- **O print de uma lista mostra aspas simples** (`['Ana', 'Bia']`), mesmo quando o código usa aspas duplas. Isso vira distrator de propósito, com feedback.
- **Erros de posição inexistente** (`IndexError`) aparecem só como opção "o programa mostra um erro" em escolher o resultado, porque o verificador e o tipo `localizar_erro` aceitam só `SyntaxError`, `IndentationError`, `NameError`, `TypeError` e saída incorreta.
- **O desafio** é o projeto da estratégia: total e maior gasto da semana, com `for`, acumulador e `if` dentro do `for`. Exercícios só marcam conceitos desta unidade, como no formato; os de unidades anteriores (`if`, comparação, `print` com vírgula) são usados como já sabidos.
- Quase todas as saídas têm até 4 linhas, para que os itens de escolher a saída também possam aparecer como digitar a saída na revisão. A exceção é a u4-l4-e07, cujo distrator de 6 linhas a mantém só como escolha.

## Verificação

Em 12 de novembro de 2026, com Python 3.14.7: 35 exercícios e 14 variações, sem erros nem avisos. Publicada no mesmo dia (versão 1 das cinco lições).

A revisão pedagógica foi feita por quem escreveu o conteúdo. A leitura por iniciantes acontece no teste com amigos.
