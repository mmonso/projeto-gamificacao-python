// Gerado por ferramentas/exportar_prototipo.py. Não edite à mão.
window.CONTEUDO = {
 "unidades": [
  {
   "id": "u1",
   "ordem": 1,
   "titulo": "Primeiros comandos",
   "descricao": "Exiba mensagens, números e valores guardados em variáveis.",
   "licoes": [
    {
     "id": "u1-l1",
     "unidade": "u1",
     "ordem": 1,
     "versao": 1,
     "titulo": "Olá, Python",
     "objetivo": "Prever a saída de print com texto, reconhecer aspas faltando e ordenar comandos de print.",
     "conceitos": [
      "print-texto",
      "string-aspas",
      "ordem-execucao"
     ],
     "exercicios": [
      {
       "id": "u1-l1-e01",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que print exibe o texto entre aspas, sem as aspas e sem o comando.",
       "conceitos": [
        "print-texto",
        "string-aspas"
       ],
       "dificuldade": 1,
       "enunciado": "O comando print mostra uma mensagem na tela. O que este programa exibe?",
       "codigo": "print(\"Olá, mundo!\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Olá, mundo!"
        },
        {
         "id": "b",
         "texto": "\"Olá, mundo!\"",
         "feedback": "As aspas marcam onde o texto começa e termina. Elas não aparecem na tela."
        },
        {
         "id": "c",
         "texto": "print(\"Olá, mundo!\")",
         "feedback": "O comando não aparece na tela. Aparece só a mensagem que está entre os parênteses."
        }
       ],
       "resposta": "a",
       "dicas": [
        "Pense no que a pessoa que usa o programa vê, não no código.",
        "As aspas só indicam onde o texto começa e termina."
       ],
       "explicacao": "O print exibe na tela o texto que está entre as aspas. Nem o comando nem as aspas aparecem na saída."
      },
      {
       "id": "u1-l1-e02",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Escrever o nome do comando print corretamente, em letras minúsculas.",
       "conceitos": [
        "print-texto"
       ],
       "dificuldade": 1,
       "enunciado": "Complete o programa para exibir a mensagem Bom dia.",
       "codigo": "___1___(\"Bom dia\")",
       "saida_esperada": "Bom dia",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "print",
          "mostrar",
          "Print"
         ],
         "resposta": "print"
        }
       ],
       "dicas": [
        "É o mesmo comando do exercício anterior.",
        "O Python diferencia letras maiúsculas de minúsculas."
       ],
       "explicacao": "O comando se chama print, todo em letras minúsculas. O Python não conhece mostrar, e Print com P maiúsculo é outro nome."
      },
      {
       "id": "u1-l1-e03",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever que cada print exibe uma linha, na ordem em que aparece no código.",
       "conceitos": [
        "ordem-execucao",
        "print-texto"
       ],
       "dificuldade": 1,
       "enunciado": "Um programa pode ter vários comandos. O que este programa exibe?",
       "codigo": "print(\"Primeiro\")\nprint(\"Segundo\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Primeiro\nSegundo"
        },
        {
         "id": "b",
         "texto": "Segundo\nPrimeiro",
         "feedback": "O Python executa as linhas de cima para baixo."
        },
        {
         "id": "c",
         "texto": "Primeiro Segundo",
         "feedback": "Cada print termina a linha. O próximo print começa em uma linha nova."
        }
       ],
       "resposta": "a",
       "dicas": [
        "O Python lê o programa como você lê um texto, de cima para baixo.",
        "Cada print exibe sua própria linha."
       ],
       "explicacao": "As linhas são executadas de cima para baixo, e cada print exibe uma linha nova. Por isso Primeiro aparece antes de Segundo, em linhas separadas."
      },
      {
       "id": "u1-l1-e04",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Montar um programa de duas linhas na ordem certa e descartar um bloco sem aspas.",
       "conceitos": [
        "ordem-execucao",
        "string-aspas"
       ],
       "dificuldade": 1,
       "enunciado": "Monte o programa que exibe esta saída.",
       "saida_esperada": "Oi\nTudo bem?",
       "blocos": [
        {
         "id": "a",
         "codigo": "print(\"Oi\")"
        },
        {
         "id": "b",
         "codigo": "print(\"Tudo bem?\")"
        },
        {
         "id": "c",
         "codigo": "print(Oi)"
        }
       ],
       "resposta": [
        [
         "a",
         "b"
        ]
       ],
       "dicas": [
        "A primeira linha da saída vem do primeiro print do programa.",
        "Um dos blocos não tem aspas. Sem aspas, Oi não é um texto."
       ],
       "explicacao": "O programa exibe as linhas na ordem em que os print aparecem. O bloco print(Oi) não tem aspas, então o Python procuraria algo chamado Oi e mostraria um erro."
      },
      {
       "id": "u1-l1-e05",
       "versao": 1,
       "tipo": "localizar_erro",
       "objetivo": "Encontrar um texto com as aspas não fechadas.",
       "conceitos": [
        "string-aspas"
       ],
       "dificuldade": 2,
       "enunciado": "Este programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "print(\"Vamos aprender Python\")\nprint(\"Hoje é o primeiro dia)\nprint(\"Até logo\")",
       "erro": "SyntaxError",
       "resposta": 2,
       "correcao": "print(\"Hoje é o primeiro dia\")",
       "saida_esperada": "Vamos aprender Python\nHoje é o primeiro dia\nAté logo",
       "dicas": [
        "Confira se cada texto tem aspas no início e no fim.",
        "Olhe o final de cada linha, antes do parêntese."
       ],
       "explicacao": "Na linha 2, o texto abre aspas mas não fecha. Todo texto precisa de aspas no início e no fim; sem isso, o Python mostra um erro de sintaxe (SyntaxError)."
      },
      {
       "id": "u1-l1-e06",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Reconhecer o único comando completo entre opções com erros comuns.",
       "conceitos": [
        "print-texto",
        "string-aspas"
       ],
       "dificuldade": 2,
       "enunciado": "Qual linha exibe exatamente: Python é legal",
       "saida_esperada": "Python é legal",
       "opcoes_sao": "codigo",
       "opcoes": [
        {
         "id": "a",
         "texto": "print(\"Python é legal\")"
        },
        {
         "id": "b",
         "texto": "print(Python é legal)",
         "feedback": "Sem aspas, o Python tenta entender as palavras como código e mostra um erro."
        },
        {
         "id": "c",
         "texto": "\"Python é legal\"",
         "feedback": "Sem print, o texto existe no programa, mas nada aparece na tela."
        },
        {
         "id": "d",
         "texto": "Print(\"Python é legal\")",
         "feedback": "Print com P maiúsculo não é o comando print."
        }
       ],
       "resposta": "a",
       "dicas": [
        "São necessários três itens: o comando print, os parênteses e as aspas.",
        "Confira também as letras maiúsculas e minúsculas."
       ],
       "explicacao": "Para exibir um texto, use print em minúsculas, com o texto entre aspas dentro dos parênteses."
      }
     ],
     "revisao": [
      {
       "id": "u1-l1-r01",
       "versao": 1,
       "variacao_de": "u1-l1-e01",
       "tipo": "escolher_resultado",
       "objetivo": "Prever a saída de print com texto em outro contexto.",
       "conceitos": [
        "print-texto",
        "string-aspas"
       ],
       "dificuldade": 1,
       "enunciado": "O que este programa exibe?",
       "codigo": "print(\"Hora do café\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "\"Hora do café\"",
         "feedback": "As aspas não aparecem na saída."
        },
        {
         "id": "b",
         "texto": "Hora do café"
        },
        {
         "id": "c",
         "texto": "(Hora do café)",
         "feedback": "Os parênteses fazem parte do comando e não aparecem na saída."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Só o conteúdo entre as aspas aparece na tela."
       ],
       "explicacao": "O print exibe só o texto entre as aspas. Parênteses e aspas fazem parte do comando."
      },
      {
       "id": "u1-l1-r02",
       "versao": 1,
       "variacao_de": "u1-l1-e05",
       "tipo": "localizar_erro",
       "objetivo": "Reconhecer que as aspas de abertura e de fechamento precisam ser iguais.",
       "conceitos": [
        "string-aspas"
       ],
       "dificuldade": 2,
       "enunciado": "Este programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "print(\"Bem-vindo\")\nprint('Bom dia\")",
       "erro": "SyntaxError",
       "resposta": 2,
       "correcao": "print('Bom dia')",
       "saida_esperada": "Bem-vindo\nBom dia",
       "dicas": [
        "O Python aceita aspas simples ou duplas.",
        "Compare a aspa do início com a do fim de cada texto."
       ],
       "explicacao": "O Python aceita textos com aspas simples ou duplas, desde que o texto comece e termine com o mesmo tipo. Na linha 2, ele abre com aspas simples e tenta fechar com duplas."
      },
      {
       "id": "u1-l1-r03",
       "versao": 1,
       "variacao_de": "u1-l1-e03",
       "tipo": "escolher_resultado",
       "objetivo": "Prever a ordem de três linhas de saída.",
       "conceitos": [
        "ordem-execucao"
       ],
       "dificuldade": 1,
       "enunciado": "O que este programa exibe?",
       "codigo": "print(\"Acordar\")\nprint(\"Tomar café\")\nprint(\"Estudar\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Estudar\nTomar café\nAcordar",
         "feedback": "As linhas são executadas de cima para baixo, não de baixo para cima."
        },
        {
         "id": "b",
         "texto": "Acordar Tomar café Estudar",
         "feedback": "Cada print exibe uma linha separada."
        },
        {
         "id": "c",
         "texto": "Acordar\nTomar café\nEstudar"
        }
       ],
       "resposta": "c",
       "dicas": [
        "Cada print gera uma linha, na ordem do código."
       ],
       "explicacao": "Cada print exibe uma linha, e as linhas aparecem na mesma ordem dos comandos no programa."
      }
     ]
    },
    {
     "id": "u1-l2",
     "unidade": "u1",
     "ordem": 2,
     "versao": 1,
     "titulo": "Números na tela",
     "objetivo": "Exibir números e resultados de contas, distinguir uma conta de um texto e exibir vários valores em um print.",
     "conceitos": [
      "print-numero",
      "texto-vs-numero",
      "print-varios"
     ],
     "exercicios": [
      {
       "id": "u1-l2-e01",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que o print exibe o resultado de uma conta escrita sem aspas.",
       "conceitos": [
        "print-numero"
       ],
       "dificuldade": 1,
       "enunciado": "Números são escritos sem aspas. O que este programa exibe?",
       "codigo": "print(2 + 3)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "2 + 3",
         "feedback": "Sem aspas, o Python faz a conta antes de exibir."
        },
        {
         "id": "b",
         "texto": "5"
        },
        {
         "id": "c",
         "texto": "23",
         "feedback": "Com números, o + soma. Ele não junta os algarismos."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Não há aspas, então não é um texto.",
        "O Python calcula a conta e exibe o resultado."
       ],
       "explicacao": "Sem aspas, 2 + 3 é uma conta. O Python calcula o resultado e o print exibe 5."
      },
      {
       "id": "u1-l2-e02",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Distinguir uma conta entre aspas, que é texto, de uma conta de verdade.",
       "conceitos": [
        "texto-vs-numero"
       ],
       "dificuldade": 1,
       "enunciado": "Agora a conta está entre aspas. O que este programa exibe?",
       "codigo": "print(\"2 + 3\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "5",
         "feedback": "Entre aspas, tudo é texto. O Python exibe o que está escrito, sem fazer a conta."
        },
        {
         "id": "b",
         "texto": "\"2 + 3\"",
         "feedback": "As aspas não aparecem na saída."
        },
        {
         "id": "c",
         "texto": "2 + 3"
        }
       ],
       "resposta": "c",
       "dicas": [
        "Lembre o que as aspas significam na lição anterior."
       ],
       "explicacao": "Tudo o que está entre aspas é texto. O print exibe o texto exatamente como foi escrito, sem calcular nada."
      },
      {
       "id": "u1-l2-e03",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Escrever uma multiplicação com o símbolo * e sem aspas.",
       "conceitos": [
        "print-numero",
        "texto-vs-numero"
       ],
       "dificuldade": 2,
       "enunciado": "Em Python, a multiplicação usa o símbolo *. Complete para exibir o resultado 12.",
       "codigo": "print(___1___)",
       "saida_esperada": "12",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "3 * 4",
          "\"3 * 4\"",
          "3 x 4"
         ],
         "resposta": "3 * 4"
        }
       ],
       "dicas": [
        "Para o Python calcular, a conta não pode estar entre aspas.",
        "O x não é usado para multiplicar em Python."
       ],
       "explicacao": "A conta 3 * 4 sem aspas é calculada e exibe 12. Entre aspas, seria só o texto 3 * 4. Com x, o Python mostraria um erro."
      },
      {
       "id": "u1-l2-e04",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever como o print exibe dois valores separados por vírgula.",
       "conceitos": [
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "A vírgula separa valores dentro do print. O que este programa exibe?",
       "codigo": "print(\"Idade:\", 30)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Idade:30",
         "feedback": "O print coloca um espaço entre os valores separados por vírgula."
        },
        {
         "id": "b",
         "texto": "Idade: 30"
        },
        {
         "id": "c",
         "texto": "Idade:, 30",
         "feedback": "A vírgula só separa os valores no código. Ela não aparece na saída."
        }
       ],
       "resposta": "b",
       "dicas": [
        "A vírgula não aparece na tela.",
        "O print coloca algo entre os valores."
       ],
       "explicacao": "Com vírgula, o print exibe os valores na mesma linha, separados por um espaço. A vírgula não aparece na saída."
      },
      {
       "id": "u1-l2-e05",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Combinar texto e o resultado de uma conta no mesmo print.",
       "conceitos": [
        "print-varios",
        "print-numero",
        "texto-vs-numero"
       ],
       "dificuldade": 2,
       "enunciado": "Monte o programa que exibe esta saída.",
       "saida_esperada": "Total: 15\nFim",
       "blocos": [
        {
         "id": "a",
         "codigo": "print(\"Total:\", 10 + 5)"
        },
        {
         "id": "b",
         "codigo": "print(\"Fim\")"
        },
        {
         "id": "c",
         "codigo": "print(\"Total:\", \"10 + 5\")"
        }
       ],
       "resposta": [
        [
         "a",
         "b"
        ]
       ],
       "dicas": [
        "A primeira linha precisa mostrar o resultado da conta, não a conta.",
        "Para ser calculada, a conta não pode estar entre aspas."
       ],
       "explicacao": "Em print(\"Total:\", 10 + 5), o texto vem entre aspas e a conta fica sem aspas, então o Python exibe o resultado 15. Depois, print(\"Fim\") exibe a segunda linha."
      },
      {
       "id": "u1-l2-e06",
       "versao": 1,
       "tipo": "localizar_erro",
       "objetivo": "Encontrar uma conta escrita entre aspas por engano.",
       "conceitos": [
        "texto-vs-numero",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "O programa deveria exibir a saída abaixo, mas mostra outra coisa. Selecione a linha com o problema.",
       "codigo": "print(\"Calculando...\")\nprint(\"Soma:\", \"5 + 3\")",
       "erro": "saida_incorreta",
       "resposta": 2,
       "correcao": "print(\"Soma:\", 5 + 3)",
       "saida_esperada": "Calculando...\nSoma: 8",
       "dicas": [
        "A primeira linha da saída está certa.",
        "Uma conta entre aspas não é calculada."
       ],
       "explicacao": "Na linha 2, a conta 5 + 3 está entre aspas e é exibida como texto. Sem as aspas, o Python calcula e exibe 8."
      },
      {
       "id": "u1-l2-e07",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Escolher o programa que exibe dois números separados por espaço.",
       "conceitos": [
        "print-varios",
        "print-numero"
       ],
       "dificuldade": 2,
       "enunciado": "Qual programa exibe exatamente: 10 20",
       "saida_esperada": "10 20",
       "opcoes_sao": "codigo",
       "opcoes": [
        {
         "id": "a",
         "texto": "print(10 + 20)",
         "feedback": "O + soma os números e exibe 30."
        },
        {
         "id": "b",
         "texto": "print(10, 20)"
        },
        {
         "id": "c",
         "texto": "print(\"10, 20\")",
         "feedback": "Entre aspas, a vírgula faz parte do texto e aparece na saída."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Para exibir os dois números lado a lado, use a vírgula do print."
       ],
       "explicacao": "Em print(10, 20), a vírgula separa dois valores, e o print os exibe com um espaço entre eles."
      }
     ],
     "revisao": [
      {
       "id": "u1-l2-r01",
       "versao": 1,
       "variacao_de": "u1-l2-e01",
       "tipo": "escolher_resultado",
       "objetivo": "Prever o resultado de uma subtração no print.",
       "conceitos": [
        "print-numero"
       ],
       "dificuldade": 1,
       "enunciado": "O que este programa exibe?",
       "codigo": "print(10 - 4)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "6"
        },
        {
         "id": "b",
         "texto": "10 - 4",
         "feedback": "Sem aspas, a conta é calculada antes de ser exibida."
        },
        {
         "id": "c",
         "texto": "14",
         "feedback": "O sinal - faz uma subtração."
        }
       ],
       "resposta": "a",
       "dicas": [
        "É uma conta sem aspas."
       ],
       "explicacao": "Sem aspas, 10 - 4 é uma conta. O print exibe o resultado, 6."
      },
      {
       "id": "u1-l2-r02",
       "versao": 1,
       "variacao_de": "u1-l2-e02",
       "tipo": "escolher_resultado",
       "objetivo": "Distinguir uma multiplicação entre aspas de uma conta.",
       "conceitos": [
        "texto-vs-numero"
       ],
       "dificuldade": 1,
       "enunciado": "O que este programa exibe?",
       "codigo": "print(\"4 * 2\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "8",
         "feedback": "Entre aspas, a conta é só texto e não é calculada."
        },
        {
         "id": "b",
         "texto": "4 * 2"
        },
        {
         "id": "c",
         "texto": "42",
         "feedback": "O print exibe o texto exatamente como foi escrito."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Repare nas aspas."
       ],
       "explicacao": "Como está entre aspas, 4 * 2 é um texto. O print exibe o texto como foi escrito."
      },
      {
       "id": "u1-l2-r03",
       "versao": 1,
       "variacao_de": "u1-l2-e04",
       "tipo": "escolher_resultado",
       "objetivo": "Prever a saída de texto e conta separados por vírgula.",
       "conceitos": [
        "print-varios",
        "print-numero"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "print(\"Ano:\", 2000 + 26)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Ano: 2000 + 26",
         "feedback": "A conta está sem aspas, então é calculada."
        },
        {
         "id": "b",
         "texto": "Ano:2026",
         "feedback": "A vírgula do print coloca um espaço entre os valores."
        },
        {
         "id": "c",
         "texto": "Ano: 2026"
        }
       ],
       "resposta": "c",
       "dicas": [
        "Primeiro o Python calcula a conta; depois o print junta os valores."
       ],
       "explicacao": "O Python calcula 2000 + 26 e o print exibe o texto e o resultado separados por um espaço."
      }
     ]
    },
    {
     "id": "u1-l3",
     "unidade": "u1",
     "ordem": 3,
     "versao": 1,
     "titulo": "Guardando valores",
     "objetivo": "Criar variáveis com =, usá-las no print, distinguir variável de texto e reconhecer nomes inválidos.",
     "conceitos": [
      "atribuicao",
      "variavel-vs-texto",
      "nomes-variaveis"
     ],
     "exercicios": [
      {
       "id": "u1-l3-e01",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever que o print de uma variável exibe o valor guardado nela.",
       "conceitos": [
        "atribuicao"
       ],
       "dificuldade": 1,
       "enunciado": "Uma variável guarda um valor com um nome. O sinal = guarda o valor da direita no nome da esquerda. O que este programa exibe?",
       "codigo": "nome = \"Ana\"\nprint(nome)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "nome",
         "feedback": "Sem aspas, nome é a variável. O print exibe o valor guardado nela."
        },
        {
         "id": "b",
         "texto": "Ana"
        },
        {
         "id": "c",
         "texto": "\"Ana\"",
         "feedback": "As aspas não aparecem na saída."
        }
       ],
       "resposta": "b",
       "dicas": [
        "A primeira linha guarda o texto Ana na variável chamada nome.",
        "O print recebe a variável, sem aspas."
       ],
       "explicacao": "A linha nome = \"Ana\" guarda o texto Ana na variável nome. O print(nome) exibe o valor guardado, Ana."
      },
      {
       "id": "u1-l3-e02",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que o nome entre aspas é um texto e não usa a variável.",
       "conceitos": [
        "variavel-vs-texto"
       ],
       "dificuldade": 2,
       "enunciado": "Repare nas aspas do print. O que este programa exibe?",
       "codigo": "cidade = \"Recife\"\nprint(\"cidade\")",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Recife",
         "feedback": "Com aspas, \"cidade\" é só um texto. A variável não é usada."
        },
        {
         "id": "b",
         "texto": "cidade"
        },
        {
         "id": "c",
         "erro": true,
         "feedback": "O programa funciona. O print recebe um texto comum."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Com aspas é texto; sem aspas é variável."
       ],
       "explicacao": "Com aspas, \"cidade\" é um texto como qualquer outro, e o print o exibe como está. Para exibir Recife, seria print(cidade), sem aspas."
      },
      {
       "id": "u1-l3-e03",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Escrever uma atribuição com = e usar a variável no print.",
       "conceitos": [
        "atribuicao",
        "variavel-vs-texto"
       ],
       "dificuldade": 2,
       "enunciado": "Complete para guardar 25 na variável idade e depois exibi-la.",
       "codigo": "idade ___1___ 25\nprint(___2___)",
       "saida_esperada": "25",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "=",
          "==",
          "=>"
         ],
         "resposta": "="
        },
        {
         "id": "2",
         "opcoes": [
          "idade",
          "\"idade\"",
          "Idade"
         ],
         "resposta": "idade"
        }
       ],
       "dicas": [
        "Para guardar um valor, usa-se um único sinal de igual.",
        "O print deve receber a variável sem aspas, escrita igual à primeira linha."
       ],
       "explicacao": "O sinal = guarda 25 na variável idade. Depois, print(idade) exibe o valor guardado. Com aspas, seria exibido o texto idade; com I maiúsculo, seria outro nome."
      },
      {
       "id": "u1-l3-e04",
       "versao": 1,
       "tipo": "localizar_erro",
       "objetivo": "Reconhecer que maiúsculas e minúsculas diferenciam nomes de variáveis.",
       "conceitos": [
        "variavel-vs-texto",
        "nomes-variaveis"
       ],
       "dificuldade": 2,
       "enunciado": "Este programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "pais = \"Brasil\"\nprint(\"Moro no\")\nprint(Pais)",
       "erro": "NameError",
       "resposta": 3,
       "correcao": "print(pais)",
       "saida_esperada": "Moro no\nBrasil",
       "dicas": [
        "Compare o nome criado na linha 1 com o nome usado depois.",
        "Uma letra maiúscula muda o nome."
       ],
       "explicacao": "Pais e pais são nomes diferentes para o Python. Como Pais nunca foi criada, a linha 3 mostra um erro de nome (NameError)."
      },
      {
       "id": "u1-l3-e05",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Reconhecer nomes de variáveis válidos e inválidos.",
       "conceitos": [
        "nomes-variaveis"
       ],
       "dificuldade": 2,
       "enunciado": "Nomes de variáveis não têm espaços nem começam com número. Qual programa exibe: Maria",
       "saida_esperada": "Maria",
       "opcoes_sao": "codigo",
       "opcoes": [
        {
         "id": "a",
         "texto": "nome completo = \"Maria\"\nprint(nome completo)",
         "feedback": "Um nome de variável não pode ter espaço."
        },
        {
         "id": "b",
         "texto": "1nome = \"Maria\"\nprint(1nome)",
         "feedback": "Um nome de variável não pode começar com número."
        },
        {
         "id": "c",
         "texto": "nome_completo = \"Maria\"\nprint(nome_completo)"
        }
       ],
       "resposta": "c",
       "dicas": [
        "No lugar do espaço, é comum usar _ para separar palavras."
       ],
       "explicacao": "Nomes de variáveis usam letras, números e _, mas não podem ter espaços nem começar com número. Por isso nome_completo funciona."
      },
      {
       "id": "u1-l3-e06",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Criar variáveis antes de usá-las e aceitar ordens equivalentes.",
       "conceitos": [
        "atribuicao",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "Monte o programa que exibe esta saída. Lembre que uma variável precisa ser criada antes de ser usada.",
       "saida_esperada": "Produto: caderno\nPreço: 12",
       "blocos": [
        {
         "id": "a",
         "codigo": "produto = \"caderno\""
        },
        {
         "id": "b",
         "codigo": "preco = 12"
        },
        {
         "id": "c",
         "codigo": "print(\"Produto:\", produto)"
        },
        {
         "id": "d",
         "codigo": "print(\"Preço:\", preco)"
        },
        {
         "id": "e",
         "codigo": "print(\"Produto:\", \"produto\")"
        }
       ],
       "resposta": [
        [
         "a",
         "b",
         "c",
         "d"
        ],
        [
         "a",
         "c",
         "b",
         "d"
        ],
        [
         "b",
         "a",
         "c",
         "d"
        ]
       ],
       "dicas": [
        "Cada variável precisa aparecer em uma linha com = antes do print que a usa.",
        "O nome da variável no print fica sem aspas."
       ],
       "explicacao": "Cada print só funciona depois que sua variável foi criada. Por isso as atribuições vêm antes dos print que as usam; a ordem entre elas pode variar."
      },
      {
       "id": "u1-l3-e07",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever a saída de texto e variável no mesmo print.",
       "conceitos": [
        "atribuicao",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "pontos = 10\nprint(\"Pontos:\", pontos)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Pontos: 10"
        },
        {
         "id": "b",
         "texto": "Pontos: pontos",
         "feedback": "O segundo valor não tem aspas, então é a variável. O print exibe o valor dela."
        },
        {
         "id": "c",
         "texto": "Pontos:10",
         "feedback": "A vírgula do print coloca um espaço entre os valores."
        }
       ],
       "resposta": "a",
       "dicas": [
        "O primeiro valor é texto; o segundo é uma variável."
       ],
       "explicacao": "O print exibe o texto Pontos: e o valor guardado em pontos, separados por um espaço."
      }
     ],
     "revisao": [
      {
       "id": "u1-l3-r01",
       "versao": 1,
       "variacao_de": "u1-l3-e02",
       "tipo": "escolher_resultado",
       "objetivo": "Distinguir texto e variável com o mesmo nome no mesmo print.",
       "conceitos": [
        "variavel-vs-texto",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "fruta = \"manga\"\nprint(\"fruta\", fruta)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "fruta manga"
        },
        {
         "id": "b",
         "texto": "manga manga",
         "feedback": "O primeiro valor está entre aspas, então é só o texto fruta."
        },
        {
         "id": "c",
         "texto": "fruta fruta",
         "feedback": "O segundo valor está sem aspas, então é a variável, que guarda manga."
        }
       ],
       "resposta": "a",
       "dicas": [
        "Analise cada valor separado pela vírgula."
       ],
       "explicacao": "O primeiro valor, com aspas, é o texto fruta. O segundo, sem aspas, é a variável, que guarda manga."
      },
      {
       "id": "u1-l3-r02",
       "versao": 1,
       "variacao_de": "u1-l3-e04",
       "tipo": "localizar_erro",
       "objetivo": "Encontrar uma variável usada com o nome escrito errado.",
       "conceitos": [
        "variavel-vs-texto",
        "nomes-variaveis"
       ],
       "dificuldade": 2,
       "enunciado": "Este programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "mensagem = \"Boa sorte\"\nprint(mesagem)",
       "erro": "NameError",
       "resposta": 2,
       "correcao": "print(mensagem)",
       "saida_esperada": "Boa sorte",
       "dicas": [
        "Compare o nome letra por letra."
       ],
       "explicacao": "Na linha 2 falta uma letra no nome. Para o Python, mesagem é um nome que nunca foi criado, por isso ele mostra um NameError."
      },
      {
       "id": "u1-l3-r03",
       "versao": 1,
       "variacao_de": "u1-l3-e01",
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que a variável guarda o resultado de uma conta.",
       "conceitos": [
        "atribuicao",
        "print-numero"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "total = 3 * 5\nprint(total)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "3 * 5",
         "feedback": "A conta é calculada antes de ser guardada na variável."
        },
        {
         "id": "b",
         "texto": "total",
         "feedback": "Sem aspas, total é a variável."
        },
        {
         "id": "c",
         "texto": "15"
        }
       ],
       "resposta": "c",
       "dicas": [
        "Primeiro o Python calcula o lado direito do =."
       ],
       "explicacao": "O Python calcula 3 * 5 e guarda o resultado, 15, na variável total. O print exibe 15."
      }
     ]
    },
    {
     "id": "u1-l4",
     "unidade": "u1",
     "ordem": 4,
     "versao": 1,
     "titulo": "Mudando valores",
     "objetivo": "Prever o valor de uma variável depois de reatribuições e atualizações, respeitando a ordem das linhas.",
     "conceitos": [
      "reatribuicao",
      "atualizacao",
      "ordem-execucao"
     ],
     "exercicios": [
      {
       "id": "u1-l4-e01",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que uma nova atribuição substitui o valor anterior.",
       "conceitos": [
        "reatribuicao"
       ],
       "dificuldade": 1,
       "enunciado": "Uma variável pode receber um novo valor. O que este programa exibe?",
       "codigo": "cor = \"azul\"\ncor = \"verde\"\nprint(cor)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "azul",
         "feedback": "A segunda linha guarda verde no lugar de azul."
        },
        {
         "id": "b",
         "texto": "azul\nverde",
         "feedback": "Uma variável guarda um valor por vez."
        },
        {
         "id": "c",
         "texto": "verde"
        }
       ],
       "resposta": "c",
       "dicas": [
        "A variável guarda só um valor por vez.",
        "Quando o print é executado, qual foi o último valor guardado?"
       ],
       "explicacao": "A segunda atribuição substitui o valor anterior. Quando o print é executado, cor guarda verde."
      },
      {
       "id": "u1-l4-e02",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever que cada print usa o valor da variável naquele momento.",
       "conceitos": [
        "reatribuicao",
        "ordem-execucao"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "nivel = 1\nprint(nivel)\nnivel = 2\nprint(nivel)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "2\n2",
         "feedback": "O primeiro print é executado antes da mudança, quando nivel ainda vale 1."
        },
        {
         "id": "b",
         "texto": "1\n2"
        },
        {
         "id": "c",
         "texto": "1\n1",
         "feedback": "A linha 3 muda o valor antes do segundo print."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Siga as linhas de cima para baixo, anotando o valor de nivel."
       ],
       "explicacao": "As linhas são executadas em ordem. O primeiro print acontece quando nivel vale 1; o segundo, depois da mudança para 2."
      },
      {
       "id": "u1-l4-e03",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever o resultado de uma atualização que usa o próprio valor da variável.",
       "conceitos": [
        "atualizacao"
       ],
       "dificuldade": 2,
       "enunciado": "À direita do =, o Python usa o valor atual da variável. O que este programa exibe?",
       "codigo": "pontos = 10\npontos = pontos + 5\nprint(pontos)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "15"
        },
        {
         "id": "b",
         "texto": "10",
         "feedback": "A linha 2 calcula 10 + 5 e guarda o resultado em pontos."
        },
        {
         "id": "c",
         "texto": "pontos + 5",
         "feedback": "A conta está sem aspas, então é calculada."
        }
       ],
       "resposta": "a",
       "dicas": [
        "Primeiro o Python calcula o lado direito do =.",
        "Na linha 2, pontos ainda vale 10."
       ],
       "explicacao": "Na linha 2, o Python calcula pontos + 5 com o valor atual, 10, e guarda 15 de volta em pontos."
      },
      {
       "id": "u1-l4-e04",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Escrever uma atualização que soma 1 ao valor atual.",
       "conceitos": [
        "atualizacao"
       ],
       "dificuldade": 2,
       "enunciado": "Complete para aumentar o número de vidas em 1.",
       "codigo": "vidas = 3\nvidas = ___1___\nprint(vidas)",
       "saida_esperada": "4",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "vidas + 1",
          "vidas - 1",
          "\"vidas + 1\""
         ],
         "resposta": "vidas + 1"
        }
       ],
       "dicas": [
        "O novo valor é o valor atual mais 1.",
        "A conta não pode estar entre aspas."
       ],
       "explicacao": "vidas = vidas + 1 calcula 3 + 1 e guarda 4 em vidas. Entre aspas, a conta viraria texto."
      },
      {
       "id": "u1-l4-e05",
       "versao": 1,
       "tipo": "localizar_erro",
       "objetivo": "Encontrar uma atualização com a operação errada.",
       "conceitos": [
        "atualizacao"
       ],
       "dificuldade": 3,
       "enunciado": "O programa deveria exibir o saldo depois de um gasto, mas mostra outro valor. Selecione a linha com o problema.",
       "codigo": "saldo = 100\ngasto = 30\nsaldo = saldo + gasto\nprint(\"Saldo:\", saldo)",
       "erro": "saida_incorreta",
       "resposta": 3,
       "correcao": "saldo = saldo - gasto",
       "saida_esperada": "Saldo: 70",
       "dicas": [
        "Um gasto deve diminuir o saldo.",
        "Veja qual linha muda o valor de saldo."
       ],
       "explicacao": "A linha 3 soma o gasto ao saldo. Para descontar, a conta deve ser saldo - gasto, que resulta em 70."
      },
      {
       "id": "u1-l4-e06",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Montar um programa que exibe uma variável antes e depois de atualizá-la.",
       "conceitos": [
        "atualizacao",
        "ordem-execucao",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "Monte o programa que exibe esta saída.",
       "saida_esperada": "Antes: 5\nDepois: 6",
       "blocos": [
        {
         "id": "a",
         "codigo": "numero = 5"
        },
        {
         "id": "b",
         "codigo": "print(\"Antes:\", numero)"
        },
        {
         "id": "c",
         "codigo": "numero = numero + 1"
        },
        {
         "id": "d",
         "codigo": "print(\"Depois:\", numero)"
        },
        {
         "id": "e",
         "codigo": "print(\"Depois:\", \"numero\")"
        }
       ],
       "resposta": [
        [
         "a",
         "b",
         "c",
         "d"
        ]
       ],
       "dicas": [
        "O primeiro print precisa acontecer antes da atualização.",
        "No print, a variável fica sem aspas."
       ],
       "explicacao": "A variável é criada, exibida, atualizada e exibida de novo. Se a atualização viesse antes do primeiro print, os dois mostrariam 6."
      },
      {
       "id": "u1-l4-e07",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que copiar o valor de uma variável não liga as duas variáveis.",
       "conceitos": [
        "reatribuicao",
        "ordem-execucao"
       ],
       "dificuldade": 3,
       "enunciado": "O que este programa exibe?",
       "codigo": "preco = 4\npreco_antigo = preco\npreco = 10\nprint(preco_antigo)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "10",
         "feedback": "preco_antigo recebeu o valor 4 na linha 2. Mudar preco depois não altera preco_antigo."
        },
        {
         "id": "b",
         "texto": "4"
        },
        {
         "id": "c",
         "texto": "preco",
         "feedback": "Sem aspas, preco_antigo é uma variável, e o print exibe o valor dela."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Na linha 2, qual valor preco guarda?",
        "A linha 3 muda só preco."
       ],
       "explicacao": "Na linha 2, preco_antigo recebe o valor que preco tinha naquele momento, 4. A mudança de preco na linha 3 não altera preco_antigo."
      }
     ],
     "revisao": [
      {
       "id": "u1-l4-r01",
       "versao": 1,
       "variacao_de": "u1-l4-e01",
       "tipo": "escolher_resultado",
       "objetivo": "Prever o valor após uma reatribuição de texto.",
       "conceitos": [
        "reatribuicao"
       ],
       "dificuldade": 1,
       "enunciado": "O que este programa exibe?",
       "codigo": "nome = \"Léo\"\nnome = \"Lia\"\nprint(nome)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Lia"
        },
        {
         "id": "b",
         "texto": "Léo",
         "feedback": "A segunda atribuição substitui Léo por Lia."
        },
        {
         "id": "c",
         "texto": "Léo Lia",
         "feedback": "A variável guarda só o último valor atribuído."
        }
       ],
       "resposta": "a",
       "dicas": [
        "Qual foi o último valor guardado antes do print?"
       ],
       "explicacao": "A segunda linha substitui o valor de nome. No momento do print, nome guarda Lia."
      },
      {
       "id": "u1-l4-r02",
       "versao": 1,
       "variacao_de": "u1-l4-e03",
       "tipo": "escolher_resultado",
       "objetivo": "Prever o resultado de duas atualizações seguidas.",
       "conceitos": [
        "atualizacao"
       ],
       "dificuldade": 2,
       "enunciado": "O que este programa exibe?",
       "codigo": "moedas = 20\nmoedas = moedas - 5\nmoedas = moedas - 5\nprint(moedas)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "15",
         "feedback": "Há duas atualizações; cada uma tira 5 do valor atual."
        },
        {
         "id": "b",
         "texto": "10"
        },
        {
         "id": "c",
         "texto": "20",
         "feedback": "As linhas 2 e 3 alteram o valor de moedas antes do print."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Anote o valor de moedas depois de cada linha."
       ],
       "explicacao": "A linha 2 muda moedas de 20 para 15, e a linha 3, de 15 para 10."
      },
      {
       "id": "u1-l4-r03",
       "versao": 1,
       "variacao_de": "u1-l4-e07",
       "tipo": "escolher_resultado",
       "objetivo": "Perceber que uma cópia mantém o valor antigo depois de uma atualização.",
       "conceitos": [
        "reatribuicao",
        "atualizacao",
        "print-varios"
       ],
       "dificuldade": 3,
       "enunciado": "O que este programa exibe?",
       "codigo": "meta = 3\ncopia = meta\nmeta = meta + 1\nprint(copia, meta)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "4 4",
         "feedback": "copia recebeu 3 antes da atualização e continua com esse valor."
        },
        {
         "id": "b",
         "texto": "3 3",
         "feedback": "A linha 3 atualiza meta para 4."
        },
        {
         "id": "c",
         "texto": "3 4"
        }
       ],
       "resposta": "c",
       "dicas": [
        "A linha 2 copia o valor de meta naquele momento."
       ],
       "explicacao": "copia recebe 3 na linha 2. Depois, só meta é atualizada para 4. Por isso o print exibe 3 e 4."
      }
     ]
    },
    {
     "id": "u1-l5",
     "unidade": "u1",
     "ordem": 5,
     "versao": 1,
     "titulo": "Desafio: cartão de apresentação",
     "objetivo": "Montar, em etapas, um programa que exibe um cartão com nome, idade e cidade usando variáveis e print.",
     "conceitos": [
      "atribuicao",
      "print-varios",
      "variavel-vs-texto",
      "ordem-execucao",
      "atualizacao"
     ],
     "exercicios": [
      {
       "id": "u1-l5-e01",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Guardar um texto e um número em variáveis.",
       "conceitos": [
        "atribuicao",
        "string-aspas",
        "print-numero"
       ],
       "dificuldade": 2,
       "enunciado": "Etapa 1: guarde os dados do cartão. Complete para que o programa exiba a saída abaixo.",
       "codigo": "nome = ___1___\nidade = ___2___\nprint(nome, idade)",
       "saida_esperada": "Bia 28",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "\"Bia\"",
          "Bia",
          "nome"
         ],
         "resposta": "\"Bia\""
        },
        {
         "id": "2",
         "opcoes": [
          "28",
          "idade",
          "\"vinte e oito\""
         ],
         "resposta": "28"
        }
       ],
       "dicas": [
        "Texto precisa de aspas; número não.",
        "Sem aspas, Bia e nome seriam variáveis, e elas ainda não existem nesse ponto do programa."
       ],
       "explicacao": "O nome é um texto, então vai entre aspas. A idade é um número e fica sem aspas. O print exibe os dois valores separados por espaço."
      },
      {
       "id": "u1-l5-e02",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Prever a saída de linhas do cartão com rótulos e variáveis.",
       "conceitos": [
        "print-varios",
        "variavel-vs-texto"
       ],
       "dificuldade": 2,
       "enunciado": "Etapa 2: cada linha do cartão tem um rótulo e um valor. O que este programa exibe?",
       "codigo": "nome = \"Bia\"\nidade = 28\nprint(\"Nome:\", nome)\nprint(\"Idade:\", idade)",
       "opcoes_sao": "saida",
       "opcoes": [
        {
         "id": "a",
         "texto": "Nome: nome\nIdade: idade",
         "feedback": "Em cada print, o segundo valor está sem aspas, então é uma variável, e o print exibe o valor guardado nela."
        },
        {
         "id": "b",
         "texto": "Nome: Bia\nIdade: 28"
        },
        {
         "id": "c",
         "texto": "Nome: Bia Idade: 28",
         "feedback": "Cada print exibe sua própria linha."
        }
       ],
       "resposta": "b",
       "dicas": [
        "Em cada print, o primeiro valor é texto e o segundo é variável."
       ],
       "explicacao": "Cada print exibe um rótulo entre aspas e o valor de uma variável, em linhas separadas."
      },
      {
       "id": "u1-l5-e03",
       "versao": 1,
       "tipo": "localizar_erro",
       "objetivo": "Encontrar uma variável escrita com letra maiúscula por engano.",
       "conceitos": [
        "variavel-vs-texto",
        "nomes-variaveis"
       ],
       "dificuldade": 2,
       "enunciado": "Etapa 3: o cartão ganhou a cidade, mas o programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "nome = \"Bia\"\ncidade = \"Salvador\"\nprint(\"Nome:\", nome)\nprint(\"Cidade:\", Cidade)",
       "erro": "NameError",
       "resposta": 4,
       "correcao": "print(\"Cidade:\", cidade)",
       "saida_esperada": "Nome: Bia\nCidade: Salvador",
       "dicas": [
        "Compare os nomes criados com os nomes usados."
       ],
       "explicacao": "A variável criada foi cidade, com c minúsculo. Na linha 4, Cidade é outro nome, que não existe, e o Python mostra um NameError."
      },
      {
       "id": "u1-l5-e04",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Montar parte do cartão criando variáveis antes de usá-las, com mais de uma ordem válida.",
       "conceitos": [
        "atribuicao",
        "ordem-execucao",
        "print-varios"
       ],
       "dificuldade": 3,
       "enunciado": "Etapa 4: monte o programa que exibe esta parte do cartão.",
       "saida_esperada": "Cartão de apresentação\nNome: Bia\nCidade: Salvador",
       "blocos": [
        {
         "id": "a",
         "codigo": "nome = \"Bia\""
        },
        {
         "id": "b",
         "codigo": "cidade = \"Salvador\""
        },
        {
         "id": "c",
         "codigo": "print(\"Cartão de apresentação\")"
        },
        {
         "id": "d",
         "codigo": "print(\"Nome:\", nome)"
        },
        {
         "id": "e",
         "codigo": "print(\"Cidade:\", cidade)"
        }
       ],
       "resposta": [
        [
         "a",
         "b",
         "c",
         "d",
         "e"
        ],
        [
         "a",
         "c",
         "b",
         "d",
         "e"
        ],
        [
         "a",
         "c",
         "d",
         "b",
         "e"
        ],
        [
         "b",
         "a",
         "c",
         "d",
         "e"
        ],
        [
         "b",
         "c",
         "a",
         "d",
         "e"
        ],
        [
         "c",
         "a",
         "b",
         "d",
         "e"
        ],
        [
         "c",
         "a",
         "d",
         "b",
         "e"
        ],
        [
         "c",
         "b",
         "a",
         "d",
         "e"
        ]
       ],
       "dicas": [
        "Os print aparecem na mesma ordem das linhas da saída.",
        "Cada variável precisa ser criada antes do print que a usa."
       ],
       "explicacao": "Os três print seguem a ordem da saída, e cada variável é criada antes de ser usada. As atribuições podem vir em posições diferentes, desde que antes do seu print."
      },
      {
       "id": "u1-l5-e05",
       "versao": 1,
       "tipo": "completar_lacuna",
       "objetivo": "Atualizar a idade e exibir o novo valor.",
       "conceitos": [
        "atualizacao",
        "variavel-vs-texto"
       ],
       "dificuldade": 2,
       "enunciado": "Etapa 5: Bia fez aniversário. Complete para atualizar a idade e exibir a saída abaixo.",
       "codigo": "idade = 28\nidade = ___1___\nprint(\"Idade:\", ___2___)",
       "saida_esperada": "Idade: 29",
       "lacunas": [
        {
         "id": "1",
         "opcoes": [
          "idade + 1",
          "idade - 1",
          "idade"
         ],
         "resposta": "idade + 1"
        },
        {
         "id": "2",
         "opcoes": [
          "idade",
          "\"idade\"",
          "Idade"
         ],
         "resposta": "idade"
        }
       ],
       "dicas": [
        "O novo valor é a idade atual mais 1.",
        "No print, use a variável sem aspas."
       ],
       "explicacao": "idade = idade + 1 guarda 29 em idade. Depois, o print exibe o rótulo e o valor atualizado."
      },
      {
       "id": "u1-l5-e06",
       "versao": 1,
       "tipo": "escolher_resultado",
       "objetivo": "Escolher o programa que cria a variável antes de usá-la e a usa sem aspas.",
       "conceitos": [
        "ordem-execucao",
        "variavel-vs-texto"
       ],
       "dificuldade": 2,
       "enunciado": "Etapa 6: qual programa exibe exatamente: Cidade: Salvador",
       "saida_esperada": "Cidade: Salvador",
       "opcoes_sao": "codigo",
       "opcoes": [
        {
         "id": "a",
         "texto": "print(\"Cidade:\", cidade)\ncidade = \"Salvador\"",
         "feedback": "A variável é usada antes de ser criada, e o Python mostra um erro."
        },
        {
         "id": "b",
         "texto": "cidade = \"Salvador\"\nprint(\"Cidade:\", \"cidade\")",
         "feedback": "Com aspas, \"cidade\" é um texto e aparece como está."
        },
        {
         "id": "c",
         "texto": "cidade = \"Salvador\"\nprint(\"Cidade:\", cidade)"
        }
       ],
       "resposta": "c",
       "dicas": [
        "Confira a ordem das linhas e as aspas."
       ],
       "explicacao": "A variável precisa ser criada antes de ser usada e aparecer no print sem aspas."
      },
      {
       "id": "u1-l5-e07",
       "versao": 1,
       "tipo": "ordenar_blocos",
       "objetivo": "Montar o cartão completo a partir de variáveis já criadas.",
       "conceitos": [
        "print-varios",
        "ordem-execucao",
        "variavel-vs-texto"
       ],
       "dificuldade": 3,
       "enunciado": "Etapa final: os dados já estão guardados. Monte o cartão completo.",
       "codigo_antes": "nome = \"Bia\"\nidade = 29\ncidade = \"Salvador\"",
       "saida_esperada": "Cartão de apresentação\nNome: Bia\nIdade: 29\nCidade: Salvador",
       "blocos": [
        {
         "id": "a",
         "codigo": "print(\"Cartão de apresentação\")"
        },
        {
         "id": "b",
         "codigo": "print(\"Nome:\", nome)"
        },
        {
         "id": "c",
         "codigo": "print(\"Idade:\", idade)"
        },
        {
         "id": "d",
         "codigo": "print(\"Cidade:\", cidade)"
        },
        {
         "id": "e",
         "codigo": "print(\"Nome:\", \"nome\")"
        }
       ],
       "resposta": [
        [
         "a",
         "b",
         "c",
         "d"
        ]
       ],
       "dicas": [
        "Siga a ordem das linhas da saída.",
        "Um dos blocos exibe o texto nome em vez do valor da variável."
       ],
       "explicacao": "Cada print exibe uma linha do cartão, na ordem da saída. O bloco com \"nome\" entre aspas exibiria a palavra nome, não Bia."
      }
     ],
     "revisao": [
      {
       "id": "u1-l5-r01",
       "versao": 1,
       "variacao_de": "u1-l5-e03",
       "tipo": "localizar_erro",
       "objetivo": "Encontrar aspas não fechadas em uma linha do cartão.",
       "conceitos": [
        "string-aspas",
        "print-varios"
       ],
       "dificuldade": 2,
       "enunciado": "Este programa mostra um erro. Selecione a linha com o problema.",
       "codigo": "nome = \"Davi\"\nprint(\"Nome:\", nome)\nprint(\"Cidade:, \"Natal\")",
       "erro": "SyntaxError",
       "resposta": 3,
       "correcao": "print(\"Cidade:\", \"Natal\")",
       "saida_esperada": "Nome: Davi\nCidade: Natal",
       "dicas": [
        "Confira se cada texto abre e fecha aspas."
       ],
       "explicacao": "Na linha 3, o texto Cidade: não fecha as aspas antes da vírgula. Cada texto do print precisa das próprias aspas."
      }
     ]
    }
   ]
  },
  {
   "id": "u2",
   "ordem": 2,
   "titulo": "Valores e operações",
   "descricao": "Tipos, números, textos e operadores."
  },
  {
   "id": "u3",
   "ordem": 3,
   "titulo": "Decisões",
   "descricao": "Comparações e if/else."
  }
 ]
};
