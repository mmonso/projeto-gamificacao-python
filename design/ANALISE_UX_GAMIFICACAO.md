# Análise de UX, UI e gamificação

Análise feita em 6 de novembro de 2026, depois do primeiro uso no site publicado (https://sibi-three.vercel.app). Ela partiu de três observações do responsável pelo produto:

- uma dica que manda voltar à lição anterior;
- nenhum som durante a lição;
- pouca comemoração no acerto.

Também foram revistos as telas, o código e as regras de [ESPECIFICACAO_MVP.md, seção 4](../ESPECIFICACAO_MVP.md#4-regras-de-gamificação). As propostas estão em ondas, da mais rápida à que muda regras.

## 1. Diagnóstico das três observações

### Dicas

- **Total:** 143 exercícios, todos com uma ou duas dicas.
- **Dicas que mandam para outro lugar:** `unidade-1/licao-2.yaml:62` ("Lembre o que as aspas significam na lição anterior") e `unidade-2/licao-4.yaml:155` ("Pense no // da lição anterior").
- **Dicas sem conteúdo próprio:** muitas são curtas demais para ajudar quem não lembra do conceito, como "É uma conta sem aspas."
- **Causa:** as dicas foram escritas como lembretes. Não existe na lição um lugar com a explicação do conceito para onde a dica possa levar.

**Proposta:**

- **Dois níveis de dica:**
  - A dica 1 aponta onde olhar.
  - A dica 2 traz uma mini explicação com um exemplo diferente do exercício, sem entregar a resposta.
  - Nenhuma dica cita outra lição.
- **Botão "Rever o conceito":** abre o cartão do conceito (onda 2) por cima do exercício. Não custa coração e não conta como dica na revisão espaçada.

### Som

- **Implementação:** está em `web/src/componentes/licao/som.ts`. São três sons (acerto, erro e conclusão), feitos de notas senoidais de 0,24 s com volume 0,14. Ficam quase inaudíveis em alto-falante de celular.
- **O som está ligado:** nos perfis das duas contas de teste, o som está ligado (`perfis.som = true`).
- **Momento em que toca:** `tocar()` é chamado depois que a resposta volta do servidor (`Licao.tsx:144`), fora do toque do usuário. No iPhone, o `AudioContext` só começa a tocar se for criado ou retomado dentro do próprio gesto, então provavelmente nada toca. Com a chave de silencioso ligada, o iPhone também corta o Web Audio.
- **Pouca variedade:** com só três sons, não há como marcar sequência de acertos, conquista, coração perdido ou meta cumprida.

**Proposta:**

- Liberar o áudio no primeiro toque da lição (criar e retomar o contexto no `pointerdown` de Verificar).
- Criar sons mais ricos:
  - acerto com brilho;
  - acertos seguidos subindo de tom;
  - conclusão com fanfarra curta;
  - conquista;
  - coração perdido, suave.
- Vibração curta (`navigator.vibrate`) no acerto e no erro, nos aparelhos que permitem e com o som ligado.

### Comemoração do acerto

Hoje o acerto mostra só a faixa verde "Isso mesmo!" com a explicação. A opção escolhida continua azul, com a cor de "selecionada", e não fica verde.

- **Elementos de festa que faltam:** mascote na faixa, animação, contagem de acertos seguidos e frases variadas.
- **No erro:** a opção errada também não fica vermelha.
- **Confete:** aparece só nas celebrações de sequência, unidade e conquista (`Resultado.tsx:46`), não na conclusão comum.

## 2. O que já funciona e deve ser mantido

- **Regras justas:**
  - o XP nunca diminui;
  - dica não pune;
  - os corações voltam com uma revisão de 5 itens, ou seja, estudando, e não com dinheiro.
- **Revisão espaçada de verdade:**
  - intervalos de 1, 3 e 7 dias por conceito;
  - estados iniciado, praticando e consolidando;
  - o exercício errado volta no fim da lição.
- **Feedback que ensina:** o erro mostra a resposta correta e a explicação.
- **Navegação:** trilha clara, com estados concluída, atual, bloqueada e revisão, e navegação simples (Aprender, Praticar, Perfil).
- **Acessibilidade verificada:** teclado, foco visível, movimento reduzido e 360 px. As novas animações e sons precisam respeitar isso: com movimento reduzido, sem animação; com som desligado, sem som nem vibração.

## 3. Propostas por área

### A. O momento do acerto (maior impacto, baixo esforço)

- **Animação nas opções:**
  - A opção certa fica verde com ✓ e dá um pequeno salto.
  - A errada fica vermelha e balança.
  - A certa acende quando o aluno erra.
  - O mesmo vale para lacunas e blocos.
- **Mascote na faixa de feedback:** o Sibi aparece com humor de comemoração ou de incentivo. As frases variam em vez de "Isso mesmo!" sempre:
  - Acerto: "Mandou bem!", "Perfeito!", "É isso!".
  - Erro: "Quase!", "Vamos de novo no fim.".
- **Acertos seguidos:** a partir de 3 acertos de primeira, aparece um selo "3 seguidas!" com chama. O som sobe de tom a cada acerto.
- **Barra de progresso:** avança com um brilho, em vez de só mudar de largura.
- **Faíscas no acerto:** algumas partículas curtas saindo da opção certa.

### B. O fim da lição

- **Contagem animada:** os números do XP sobem um a um, a barra da meta do dia enche e a chama da sequência acende com "+1 dia".
- **Lição perfeita:** sem erros. O nó da trilha ganha uma coroa ou fica dourado. Pode ou não render XP extra; isso é decisão de regra (ver seção 5).
- **Resumo do que aprendeu:** "Você aprendeu: print, aspas, contas", a partir dos conceitos da lição.
- **Confete na conclusão comum:** mais discreto que nas celebrações especiais.

### C. Trilha e progresso

- **Visual da trilha:**
  - linha ligando os nós;
  - uma cor por unidade;
  - o mascote ao lado do nó atual.
- **Fim de unidade:** troféu e tela de unidade concluída. A conquista "Primeira unidade" já existe.
- **Mapa de conceitos no Perfil ou no Praticar:** cada conceito com uma barra de força, a partir dos estados que já existem na revisão espaçada. Mostra ao aluno o que ele já domina e reforça a revisão.

### D. Hábito: meta e sequência

- **Anel da meta do dia no topo**, junto dos indicadores. Hoje a meta só aparece no perfil e no painel do desktop.
- **Calendário da semana na sequência**, com marcos em 3, 7, 14 e 30 dias e uma celebração própria em cada um.
- **Proteção de sequência**, já prevista para a segunda entrega. Pode ser ganha cumprindo a meta, sem dinheiro.

### E. Conquistas

Hoje são 3. Proposta: chegar a 15 ou 20, com níveis e uma tela de desbloqueio com som. Exemplos:

| Grupo | Conquistas |
| --- | --- |
| Primeiros passos | Primeiro print, Primeira lição, Primeira unidade, Curso concluído |
| Hábito | Sequência de 3, 7, 14 e 30 dias; Meta cumprida 5 vezes |
| Habilidade | Caçador de bugs (10 "localize o erro" de primeira), Montador (10 blocos de primeira), Sem dica (lição sem dica), Lição perfeita |
| Revisão | Revisor (5 revisões), Memória forte (1 conceito consolidado), Tudo consolidado (unidade inteira) |
| XP | 100, 500 e 1.000 XP |

As conquistas continuam sem dar XP no MVP (4.2), ou passam a dar cristais na onda 3.

### F. Aprendizagem

- **Cartão "Conceito novo":** aparece antes do primeiro exercício de cada conceito, com uma explicação curta, um exemplo e o botão "Entendi". As dicas podem reabri-lo.
- **Variedade de exercícios:** 86 dos 143 (60%) são "escolha o resultado". Proposta:
  - equilibrar com mais lacunas, blocos e erros;
  - criar tipos novos: digitar a saída, verdadeiro ou falso, ligar código à saída.
- **Destaque no erro:** a explicação marca no código o trecho que importa.
- **"Por quê?" também no acerto,** para quem acertou no chute.

### G. Recompensas e economia (segunda entrega da especificação)

- **Cristais** ganhos em lições, missões e conquistas.
- **Loja** com proteção de sequência e visuais do Sibi, como chapéus e cores.
- **Baús com conteúdo fixo e conhecido**, sem sorteio. Evita a lógica de caixa de recompensa e facilita uma futura abertura para menores, que o ECA Digital, art. 20, regula.
- **Missões diárias**, 3 por dia: "acerte 10 de primeira", "faça uma revisão", "conclua uma lição sem dica".

### H. Social (terceira entrega)

Ligas, amigos e a opção de compartilhar uma conquista como imagem. Só com participação opcional e apelido.

### I. O que evitar

- Notificações que culpam o aluno ("o Sibi está triste").
- Perder tudo de uma vez.
- Recompensas aleatórias.
- Ranking público sem opção de sair.
- Recompensas pelo tempo de uso, em vez de pelo aprendizado.

## 4. Plano em ondas

| Onda | O que entra | Muda regras? |
| --- | --- | --- |
| 1. Sentir | Áudio liberado no toque, sons novos e vibração; animação de acerto e erro nas opções; mascote e frases variadas no feedback; acertos seguidos; brilho na barra; contagem animada no resultado; revisão das 143 dicas em dois níveis, sem citar outra lição (lições em nova versão) | Não |
| 2. Ver o progresso | Cartão "Conceito novo" e "Rever o conceito"; trilha com linha, cores por unidade, coroa de lição perfeita e troféu de unidade; tela de unidade concluída; anel da meta no topo; calendário e marcos da sequência; mapa de conceitos; mais conquistas | Só as conquistas novas (4.7) |
| 3. Recompensas | Missões diárias, cristais, loja e proteção de sequência; novos tipos de exercício; depois, ligas e amigos | Sim (4.2, 4.5 e PR-04) |

## 5. Decisões pendentes do responsável pelo produto

- A lição perfeita rende XP extra, ou só a coroa na trilha?
- Os cristais e a loja entram antes do beta, ou depois?
- Quantas conquistas e quais nomes?
