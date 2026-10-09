# Design e protótipo

Documento da etapa E03 do [plano de referência](../PLANO_PRODUTO_E_ARQUITETURA.md#e03--design-e-protótipo). O [protótipo navegável](prototipo/index.html) usa o conteúdo real da unidade 1, exportado por `ferramentas/exportar_prototipo.py`.

Para abrir: `python -m http.server 8766 --bind 127.0.0.1` dentro de `design/prototipo` e acessar `http://127.0.0.1:8766`. A página `#/componentes` reúne componentes e estados.

## 1. Identidade de trabalho (E03.1)

| Item | Decisão |
| --- | --- |
| Nome de trabalho | Sibi, de "sibilar". É o nome do produto e da cobrinha. Disponibilidade de marca e domínio a verificar antes de E10 |
| Tipografia | Nunito para interface e JetBrains Mono para código, ambas com licença aberta |
| Linguagem | "Você", frases curtas, tom encorajador sem infantilizar. Erro é "Ainda não.", nunca culpa |
| Mascote | Cobrinha verde com quatro estados: incentivo, comemoração, atenção e descanso |

Paleta, com contraste conferido pelo critério WCAG AA:

| Token | Cor | Uso | Contraste |
| --- | --- | --- | --- |
| verde | #1B7F45 | Botões e ações principais | 5,04:1 com texto branco |
| verde-borda | #12592F | Profundidade dos botões e texto de acerto | — |
| amarelo | #FFC23D | Sequência, meta e lições concluídas | 9,10:1 com texto escuro |
| amarelo-texto | #8A5A00 | Números de sequência | 5,93:1 sobre branco |
| vermelho | #D93A3A | Corações e erro | 4,55:1 sobre branco |
| azul | #2367C9 | Seleção, XP e links | 5,45:1 sobre branco |
| texto | #1E2A32 | Texto principal | 14,66:1 sobre branco |
| texto-suave | #55636D | Texto secundário | 6,19:1 sobre branco |
| bloqueado / ícone | #C9D2D8 / #5F6B73 | Itens indisponíveis | 3,57:1 entre si |

## 2. Componentes e telas (E03.2 a E03.5)

| Tarefa | Onde ver no protótipo |
| --- | --- |
| E03.2 Botões, nós da trilha, indicadores, cartões, mascote | `#/componentes` |
| E03.3 Trilha em desktop e celular, com estados concluída, atual, bloqueada e revisão | `#/aprender`. Desktop com menu, trilha e painel; celular com indicadores no topo e navegação inferior |
| E03.4 Quatro tipos de exercício, dicas, feedback e resultado | `#/licao/u1-l1` a `#/licao/u1-l5` e `#/resultado` |
| E03.5 Apresentação, introdução, acesso, prática, perfil e estados | `#/`, `#/introducao`, `#/cadastro`, `#/entrar`, `#/praticar`, `#/perfil`, `#/sem-coracoes` e estados em `#/componentes` |

Decisões de interação:

- Blocos são montados por toque ou Enter, sem precisar arrastar; tocar num bloco montado o devolve ao banco.
- Na lição, Enter aciona Verificar ou Continuar quando o foco não está num controle.
- O feedback mostra a resposta correta e a explicação; o exercício errado volta no fim.
- A demonstração não mostra corações (D-03), e o XP aparece como provisório.
- Sons são gerados pelo próprio app e podem ser desligados no topo da lição ou no perfil.
- Animações são desligadas quando o sistema pede movimento reduzido.

Diferenças em relação ao produto: o protótipo corrige respostas no navegador, guarda o estado no `localStorage` e trata toda a sessão como um único dia. No produto, isso fica no servidor (F-15).

## 3. Protótipo navegável (E03.6)

A jornada vai da apresentação até a conclusão da primeira lição, cadastro, transferência da demonstração, trilha, lição com corações, recuperação de corações, prática e perfil.

Parâmetros só para teste: `?simular=falha` faz a primeira verificação falhar, para mostrar a retomada; `?movimento=reduzido` simula a preferência de movimento reduzido.

## 4. Percurso e ajustes (E03.7)

Percurso automatizado em `ferramentas/testar_prototipo.js`, com Chrome sem interface. Em 8 de outubro de 2026, todos os passos passaram:

| Verificação | Resultado |
| --- | --- |
| Demonstração completa com erros | Itens errados voltam no fim; resultado com XP provisório |
| Recarga no meio da lição | Volta ao mesmo exercício |
| Cadastro sem aceite dos termos | Botão indisponível |
| Transferência da demonstração | Lição 1 concluída com 20 XP |
| Cinco erros na lição 2 | Leva a "Sem corações" |
| Recuperação de corações | Devolve 2 corações e retoma a lição pausada |
| Tempo até o feedback | Cerca de 150 ms, valor simulado |
| Largura de 360 px | Sem rolagem horizontal em seis telas |
| Erros no console | Nenhum |

Problemas encontrados e corrigidos:

| Problema | Correção |
| --- | --- |
| Ao verificar, a tela de feedback era desenhada com o exercício seguinte; com tipos diferentes, a lição travava | O exercício em tela fica fixo até Continuar |
| Espera simulada de 450 ms parecia travamento | Reduzida para 150 ms na verificação e 250 ms no carregamento |
| Etiqueta "Continuar" sobrepunha o nó de revisão | Espaço extra acima do nó atual |
| Opções de saída com caixa dentro de caixa | Saída sem borda dentro da opção |
| "1 dia seguidos" | Concordância corrigida |

Pendente para concluir E03.7: percorrer a jornada inteira só com teclado e com leitor de tela, abrir em um celular real e observar pelo menos uma pessoa iniciante usando o protótipo.
