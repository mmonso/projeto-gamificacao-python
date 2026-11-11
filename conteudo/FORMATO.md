# Formato de conteúdo

Documento da tarefa E02.2 do [plano de referência](../PLANO_PRODUTO_E_ARQUITETURA.md#e02--primeira-unidade-detalhada). Define como unidades, lições e exercícios são escritos no repositório, validados e verificados antes da publicação. Vale para todas as unidades do MVP.

## 1. Organização dos arquivos

```text
conteudo/
  FORMATO.md                este documento
  unidade-1/
    UNIDADE.md              objetivos, sequência e registros de revisão
    unidade.yaml            metadados e conceitos da unidade
    licao-1.yaml … licao-5.yaml
    LEITURA.md              versão de leitura gerada pelo verificador
ferramentas/
  verificar_conteudo.py     validação de formato e execução dos exemplos
```

Os arquivos YAML são a fonte do conteúdo. `LEITURA.md` é gerado a partir deles e nunca é editado à mão.

## 2. Unidade

```yaml
id: u1
versao: 1
ordem: 1
titulo: Primeiros comandos
descricao: Texto curto exibido na trilha.
conceitos:
  - id: print-texto
    nome: Exibir texto com print
    descricao: O comando print exibe na tela o texto entre aspas.
```

Conceitos têm identificadores globais em letras minúsculas com hífens. Um conceito pertence à unidade em que é apresentado pela primeira vez; unidades seguintes podem usá-lo.

### Cartão "Conceito novo" (opcional)

Cada conceito pode ter um `cartao`, mostrado antes do primeiro exercício em que o conceito aparece e reaberto pelo botão "Conceito":

```yaml
    cartao:
      regra: "O print mostra na tela o texto que está entre as aspas."   # uma frase, até 200 caracteres
      exemplo: "print(\"Pedido recebido\")"                              # código que roda sem erro
      saida: "Pedido recebido"                                           # o que o exemplo imprime
      destaque: "print"                                                  # opcional; trecho do exemplo
      repare: "Nem o comando print nem as aspas aparecem na tela."       # uma observação, até 200 caracteres
      primeiro: "u1-l1-e01"                                              # exercício principal que avalia o conceito
```

O verificador executa o `exemplo` e confere a `saida`; o `destaque` precisa estar no `exemplo` e o `primeiro` precisa ser um exercício principal que avalie o conceito.

## 3. Lição

```yaml
id: u1-l1
unidade: u1
ordem: 1
versao: 1
titulo: Olá, Python
objetivo: O que o aluno consegue fazer ao final da lição.
conceitos: [print-texto, string-aspas]
exercicios: [...]   # sessão principal, na ordem de apresentação
revisao: [...]      # variações usadas em revisão e recuperação
```

A versão da lição aumenta sempre que um exercício muda, entra, sai ou troca de ordem. Sessões ficam presas à versão da lição em que começaram.

## 4. Campos comuns dos exercícios

| Campo | Obrigatório | Visível ao aluno | Descrição |
| --- | --- | --- | --- |
| `id` | Sim | Não | Estável, no formato `u1-l1-e01` (principal) ou `u1-l1-r01` (revisão) |
| `versao` | Sim | Não | Inteiro; aumenta quando enunciado, código, opções, resposta ou explicação mudam |
| `tipo` | Sim | — | `escolher_resultado`, `completar_lacuna`, `ordenar_blocos` ou `localizar_erro` |
| `objetivo` | Sim | Não | Intenção pedagógica do exercício, para revisão de conteúdo |
| `conceitos` | Sim | Não | Conceitos avaliados; alimentam a agenda de revisão |
| `dificuldade` | Sim | Não | 1, 2 ou 3 |
| `enunciado` | Sim | Antes da resposta | Até 200 caracteres |
| `codigo` | Conforme o tipo | Antes da resposta | Até 10 linhas |
| `saida_esperada` | Conforme o tipo | Antes da resposta | Saída-alvo mostrada ao aluno |
| `dicas` | Sim | Uma por vez, quando pedidas | De uma a três, da mais geral à mais específica |
| `explicacao` | Sim | Após a resposta | De uma a três frases sobre a regra envolvida |
| `variacao_de` | Só em `revisao` | Não | Exercício principal da mesma lição que a variação substitui |

Campos marcados como não visíveis, a resposta e o feedback das opções ficam no servidor até a submissão (F-15).

Cada exercício tem duas dicas, que se bastam sozinhas, porque o mesmo item aparece em práticas e revisões, longe da lição de origem:

1. **A primeira aponta onde olhar.** Exemplo: "Repare nas aspas."
2. **A segunda explica a regra com um exemplo diferente do exercício.** Exemplo: "Entre aspas, tudo é texto: print(\"9 - 2\") exibe 9 - 2."

As dicas nunca entregam a resposta. Elas também não citam outra lição ou outro exercício: nada de "lembre da lição anterior" (design/ANALISE_UX_GAMIFICACAO.md).

Antes da primeira publicação, lições e exercícios ficam na versão 1, mesmo quando editados. Depois de publicados, toda mudança aumenta a versão.

## 5. Tipos de exercício

### 5.1 `escolher_resultado`

O aluno escolhe uma entre três ou quatro opções.

| Campo | Descrição |
| --- | --- |
| `opcoes_sao` | `saida`: opções são saídas do `codigo`; `codigo`: opções são programas, e o correto produz `saida_esperada`; `texto`: opções conceituais, verificadas manualmente |
| `opcoes` | Lista com `id`, `texto` e `feedback` opcional. Uma opção pode ter `erro: true`, significando "o programa mostra um erro" |
| `resposta` | `id` da opção correta |
| `revisao_manual` | Obrigatório quando `opcoes_sao: texto`; registra quem revisou e por quê |

### 5.2 `completar_lacuna`

O código tem marcadores `___1___`, `___2___` e `___3___`. O aluno escolhe uma opção para cada lacuna.

| Campo | Descrição |
| --- | --- |
| `lacunas` | Lista com `id` (`"1"`, `"2"`…), `opcoes` (duas a quatro, como texto) e `resposta` |
| `saida_esperada` | Saída produzida com as respostas corretas |

A publicação embaralha as opções de cada lacuna, sempre do mesmo modo para a mesma versão. A ordem escrita no arquivo não chega ao aluno.

### 5.3 `ordenar_blocos`

O aluno monta um programa escolhendo e ordenando blocos de uma linha. Blocos que não aparecem em nenhuma ordem aceita são distratores.

| Campo | Descrição |
| --- | --- |
| `blocos` | Lista com `id` e `codigo`; de dois a sete blocos; a indentação faz parte do bloco |
| `codigo_antes`, `codigo_depois` | Linhas fixas exibidas antes ou depois da área de montagem |
| `resposta` | Lista de ordens aceitas, cada uma como lista de `id` |
| `saida_esperada` | Saída que o programa montado deve produzir |

Na publicação, os blocos recebem identificadores opacos e uma ordem embaralhada em que nenhuma resposta aceita aparece já montada. Os `id` do arquivo servem só para escrever as respostas.

Mudar como a publicação embaralha ou nomeia blocos e opções muda a parte pública das lições afetadas. Por isso aumenta a versão delas, como qualquer outra mudança.

### 5.4 `localizar_erro`

O aluno seleciona a linha que contém o erro.

| Campo | Descrição |
| --- | --- |
| `codigo` | Programa com exatamente um erro |
| `erro` | `SyntaxError`, `IndentationError`, `NameError`, `TypeError` ou `saida_incorreta` |
| `resposta` | Número da linha, começando em 1 |
| `correcao` | Linha corrigida, usada na explicação e na verificação |
| `saida_esperada` | Obrigatória com `saida_incorreta`; nos demais casos, saída depois da correção |

## 6. Correção e feedback

A correção é determinística e feita no servidor:

| Tipo | Resposta correta quando |
| --- | --- |
| `escolher_resultado` | A opção escolhida é a `resposta` |
| `completar_lacuna` | Cada lacuna recebeu sua `resposta` |
| `ordenar_blocos` | A sequência montada é igual a uma das ordens em `resposta` |
| `localizar_erro` | A linha selecionada é a `resposta` |

Fluxo de feedback de um item:

1. Antes de verificar, o aluno pode pedir as dicas, uma por vez. Cada pedido é registrado.
2. Acerto: a interface mostra a confirmação e a `explicacao`.
3. Erro: a interface mostra o `feedback` da opção escolhida, quando existir, a resposta correta e a `explicacao`. Na sessão principal, o item volta ao fim da fila (FL-03).
4. Na nova tentativa, o item é o mesmo, na mesma versão.

## 7. Regras de escrita

- Um conceito novo por exercício; o primeiro exercício de cada lição deve ser resolvível só com o enunciado.
- Nomes de variáveis em português, sem acentos; textos exibidos podem ter acentos.
- Cada distrator representa um erro plausível de iniciante e, sempre que possível, tem `feedback`.
- Opções não podem coincidir: duas opções diferentes não podem produzir a mesma saída.
- Exemplos usam situações cotidianas e neutras.
- Em YAML, código e saídas são escritos em blocos `|-` ou entre aspas, para que valores como `5` ou `no` não virem número ou booleano.

## 8. Verificação automática

`ferramentas/verificar_conteudo.py` deve passar sem erros antes de qualquer publicação:

```text
pip install -r ferramentas/requirements.txt
python ferramentas/verificar_conteudo.py conteudo/unidade-1 --leitura
```

O verificador:

- valida campos obrigatórios, tipos, limites de tamanho, identificadores únicos e conceitos existentes;
- em `escolher_resultado`, executa o código e confere que só a opção correta corresponde ao resultado; com `opcoes_sao: codigo`, executa cada opção;
- em `completar_lacuna`, executa todas as combinações de opções e exige que apenas a correta produza a saída esperada;
- em `ordenar_blocos`, executa todas as sequências possíveis de blocos e exige que as ordens aceitas sejam exatamente as que produzem a saída esperada, o que detecta ordens alternativas válidas e distratores sem efeito;
- em `localizar_erro`, confere o tipo de erro e a linha indicada pelo Python, e executa o programa corrigido;
- com `--leitura`, gera `LEITURA.md` para revisão pedagógica no papel.

A versão de Python usada na verificação fica registrada no `UNIDADE.md` de cada unidade.
