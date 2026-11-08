# Estratégia de crescimento

Síntese do painel de especialistas (crescimento, aprendizagem, gamificação e UX) de 8 de novembro de 2026. Responde à pergunta: do que o Sibi precisa para se tornar um app que cresce sozinho?

## Diagnóstico

Hoje faltam três coisas:

1. **Conteúdo para meses, não dias.** As 15 lições de 5 minutos somam cerca de 75 minutos. Uma pessoa dedicada termina em 5 a 15 dias, então não existe retenção de 30 dias. O lançamento público precisa de 40 a 60 lições.
2. **Um motivo diário para voltar.** Não há lembrete, notificação nem app instalável (PWA).
3. **Um jeito de um aluno trazer outro.** Não há imagem de prévia dos links, cartão de resultado, desafio compartilhável nem convite.

Há ainda quatro pontos mais pontuais:

- **A promessa é genérica:** "Aprenda Python do zero" é igual à de qualquer concorrente.
- **O aluno nunca vê o próprio programa rodar:** falta o momento "funcionou!".
- **O cadastro é pesado:** não há login com Google.
- **A retenção não é medida:** os eventos são gravados, mas falta a consulta de D1, D7 e D30.

## Público e promessa

- **Primeiro público:** universitários de 18 a 24 anos de cursos fora da computação (engenharias, economia, administração, biologia) na primeira disciplina de programação em Python.
  - O conteúdo atual é o primeiro mês dessa disciplina.
  - A dor tem prazo: a reprovação passa de 30%, chegando a 46% a 58% em turmas da UnB e da UTFPR.
  - A rede é densa (grupos de turma, monitores), e todos têm mais de 18 anos.
- **Espaço livre:** ser a academia diária de Python em português, que complementa a aula em vez de competir com ela. O Duolingo não ensina programação. Mimo e Sololearn são traduzidos. A Codecademy é em inglês. Alura e Rocketseat exigem compromisso alto. O Curso em Vídeo é vídeo, sem prática diária.
- **Promessa:** "Treine Python 5 minutos por dia e chegue à prova sabendo prever o que o código faz."
- **Segundo público (fase 3):** profissionais de 25 a 45 anos que pedem código à IA. Promessa: "Entenda e corrija o código que a IA escreve para você."

## Dois loops de crescimento

1. **Desafio do dia**, no estilo do Wordle.
   - São 5 exercícios iguais para todos, que se jogam sem conta.
   - No fim, aparece um cartão com 🟩🟥 e o número do desafio, para mandar no WhatsApp.
   - Quem recebe joga na hora e é convidado a criar conta para guardar a sequência.
   - Meta: cada 100 alunos trazem 30 (k = 0,3).
2. **Vídeos curtos "Qual é a saída?"** (TikTok, Reels e Shorts).
   - Os exercícios viram vídeos de 20 segundos com resposta nos comentários.
   - O link da bio leva ao desafio do dia.
   - Gravação de 7 vídeos em cerca de 2 horas por semana.

Apoio:
- **Monitores e professores** indicando o Sibi como "lição de casa de 5 minutos".
- **"Meus programas"**: os desafios de cada unidade viram cartões com o código e a saída, personalizados com o nome do aluno, e podem ser compartilhados como imagem.

## Retenção

| Marco | Meta | O que precisa existir |
| --- | --- | --- |
| D1 | 35% ou mais | Lição sem conta em menos de 60 s (já existe), primeira impressão forte, desafio do dia, lembrete opcional na hora escolhida |
| D7 | 18% ou mais | Calendário e marcos da sequência, dia livre ganho estudando, aviso de conceitos para revisar, primeira semana guiada |
| D30 | 8% ou mais | 40 a 60 lições, Python rodando no navegador (Pyodide) com miniprojetos, mapa de domínio |

Referência: apps de educação ficam em 14% a 27% no D1 e 2% a 8% no D30. As metas acima são o topo da categoria.

## Próximo conteúdo

O fio é o PRIMM: prever, rodar, investigar, modificar e criar. Cada unidade fecha com um projeto útil para adultos.

| Unidade | Conteúdo | Projeto |
| --- | --- | --- |
| 4 | Listas e `for` | Total e maior gasto da semana |
| 5 | Textos e f-strings | Mensagens personalizadas para uma lista de nomes |
| 6 | `input`, `elif` e `while` | Divisão da conta do restaurante |
| 7 | Funções | Desconto, parcela e juros |
| 8 | Dicionários | Gastos por categoria |
| 9 | Arquivos CSV | Extrato do banco organizado, rodando no próprio navegador |

Quando o Pyodide entra:
- **No fim da unidade 3 ou na 4:** modo "rode e mude um número".
- **Da unidade 5 em diante:** indispensável, porque escrever código tem muitas respostas certas.

Novo tipo de exercício prioritário: **digitar a saída**. Lembrar exige mais que reconhecer, e 74 itens de escolha podem virar esse tipo sem conteúdo novo.

## Monetização

- **Modelo:** freemium com assinatura. A trilha é grátis para sempre, porque é ela que faz o Sibi se espalhar.
- **Sibi Plus:**
  - tutor por IA que explica o erro;
  - modo prova com simulados;
  - projetos com execução de código;
  - certificado verificável;
  - visuais do Sibi.
- **Preço:** R$ 19,90 por mês, R$ 129,90 por ano ou passe do semestre de R$ 59,90 por Pix.
- **Quando cobrar:**
  - com D30 de 8% ou mais e 2.000 ativos por mês;
  - antes disso, uma pré-venda "Fundador" (R$ 99 por ano para sempre, 200 vagas) mede se as pessoas pagam;
  - antes de cobrar, abrir CNPJ (conversar com um contador) e atualizar os termos.
- **Nunca vender:** corações, dias livres ou cristais.

## Roadmap

| Fase | O que entra | Para passar de fase |
| --- | --- | --- |
| 1. Teste com amigos (nov. a dez. de 2026) | SMTP próprio; metade dos testadores no público-alvo; consulta de D1, D7 e D30; ondas 2A a 2D; cartão de resultado; lembrete por e-mail a partir da 3ª semana; 5 sessões observadas; pré e pós-teste de aprendizagem | 70% concluem a 1ª lição; 50% concluem a unidade 1; D7 de 35% ou mais; 40% ficariam "muito decepcionados" sem o Sibi |
| 2. Nicho (jan. a abr. de 2027, volta às aulas) | Cerca de 40 lições; login com Google; PWA com notificações; desafio do dia; Pyodide; vídeos; domínio próprio; banco e hospedagem pagos | 2.000 contas; D1 35%, D7 18%, D30 8%; k ≥ 0,3 |
| 3. Escala (2º semestre de 2027) | Sibi Plus; unidades de arquivos e planilhas; ligas opcionais; certificado; piloto com empresas | Ativos diários ≥ 20% dos mensais; conversão ≥ 2% |

## Riscos e o que não fazer agora

**Riscos:**
- **O conteúdo é o gargalo.** Use modelos de exercício e rascunhos assistidos, sempre passando pelo verificador automático.
- **Um vídeo viral derruba o plano gratuito:**
  - o banco pausa;
  - o pooler tem só 15 conexões;
  - o Gmail não aguenta e-mails em escala.

  Antes de qualquer divulgação, migrar para planos pagos.
- **Comunicação:** falar com adultos, nunca culpar o aluno pela sequência e não depender de público adolescente.

**O que não fazer agora:**
- app nativo (o PWA basta);
- anúncio pago antes de D30 de 8%;
- cobrar antes da fase 3;
- loja sem nada para comprar;
- ligas com poucos usuários;
- outras linguagens;
- abrir para menores;
- tutor por IA antes de haver conteúdo e execução de código.

## Riscos pedagógicos a vigiar

1. **Reconhecer em vez de prever:** 60% dos itens são de escolha. Mitigação: digitar a saída na revisão e "Por quê?" depois do acerto.
2. **Ilusão de competência:** ler não é escrever. Mitigação: dizer com clareza o que o aluno já consegue fazer e antecipar o "rode e modifique".
3. **Regras que quebram mais tarde:** falar da linha e do valor, não de regras gerais. Por exemplo, "a cópia nunca muda" deixa de valer com listas.

Fontes e números completos estão no parecer de crescimento: retenção em Business of Apps e GetStream; Duolingo em documentos à SEC; preços no RevenueCat 2026; reprovação em Watson e Li (2014), UnB e UTFPR.
