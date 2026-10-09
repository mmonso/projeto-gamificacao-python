# Unidade 3 — Decisões

Documento da etapa E07 do [plano de referência](../../PLANO_PRODUTO_E_ARQUITETURA.md#e07--curso-completo). O conteúdo segue o [formato de conteúdo](../FORMATO.md), e a [versão de leitura](LEITURA.md) mostra todos os exercícios com respostas.

## Objetivos e sequência

Ao final, o aluno prevê o resultado de comparações e de `and`, `or` e `not`, prevê qual ramo de um `if`/`else` executa e identifica erros de indentação e de `=` usado no lugar de `==`.

| Lição | Título | Conceitos | Exercícios | Variações |
| --- | --- | --- | --- | --- |
| 1 | Verdadeiro ou falso | `booleanos`, `comparacao` | 7 | 3 |
| 2 | Igual ou diferente | `igualdade`, `booleanos` | 7 | 3 |
| 3 | E, ou, não | `logicos` | 7 | 3 |
| 4 | Se e senão | `if-else`, `indentacao` | 7 | 3 |
| 5 | Desafio: verificador de ingresso | Combina os anteriores | 7 | 1 |

Decisões:

- `elif` fica fora do MVP. A unidade se limita a `if`/`else`, como no plano.
- O desafio usa a regra de meia-entrada (menor de 18 ou estudante), que exige `or`, e mostra o erro comum de usar `and`.
- Exercícios de blocos com `if` usam linhas fixas (`codigo_depois`) ou variáveis que tornam uma única montagem válida. Um `if` sem `else` também produziria a saída, e as linhas fixas evitam essa ambiguidade.
- Alguns exercícios reaproveitam conteúdo da unidade 2, como `int()` em L1-e06 e `%` em L4-e07.

## Verificação

Em 8 de outubro de 2026, com Python 3.14.7: 35 exercícios e 13 variações, sem erros. O verificador passou a aceitar `IndentationError`. Também foi corrigido um caso em que ele ignorava o recuo ao conferir se a linha corrigida era diferente da original.

A revisão pedagógica foi feita por quem escreveu o conteúdo. A leitura por iniciantes acontece no beta (E09).
