# Unidade 2 — Valores e operações

Documento da etapa E07 do [plano de referência](../../PLANO_PRODUTO_E_ARQUITETURA.md#e07--curso-completo). O conteúdo segue o [formato de conteúdo](../FORMATO.md), e a [versão de leitura](LEITURA.md) mostra todos os exercícios com respostas.

## Objetivos e sequência

Ao final, o aluno identifica `int`, `float`, `str` e `bool`, prevê o resultado de `+`, `-`, `*`, `/`, `//`, `%` e `**`, junta textos, converte valores com `str()`, `int()` e `float()` e reconhece o erro de somar texto com número.

| Lição | Título | Conceitos | Exercícios | Variações |
| --- | --- | --- | --- | --- |
| 1 | Tipos de valores | `tipos-basicos` | 7 | 3 |
| 2 | Contas com Python | `divisao`, `resto-potencia`, `precedencia` | 7 | 3 |
| 3 | Juntando textos | `concatenacao`, `repeticao-texto`, `erro-tipo` | 7 | 3 |
| 4 | Convertendo valores | `conversao`, `erro-tipo` | 7 | 3 |
| 5 | Desafio: conta do lanche | Combina os anteriores | 7 | 1 |

Decisões:

- f-strings ficam fora do MVP. A unidade usa `+` com `str()` e a vírgula do `print`, que preparam a conversão de tipos.
- A vírgula decimal (`4,50`) aparece como erro comum: em Python ela cria dois valores, e não dá erro.
- `int()` com texto decimal, como `int("3.5")`, não é usado, porque gera `ValueError`, um tipo de erro ainda não apresentado.
- Os floats usados têm representação exata, como 12.5 e 31.5, para evitar resultados como `0.30000000000000004`.

## Verificação

Em 8 de outubro de 2026, com Python 3.14.7: 35 exercícios e 13 variações, sem erros. O verificador apontou dois distratores sem efeito (L3-e06 e L4-e07), que podiam entrar no programa sem mudar a saída. Os dois foram trocados por blocos que alteram a saída.

A revisão pedagógica foi feita por quem escreveu o conteúdo. A leitura por iniciantes acontece no beta (E09).
