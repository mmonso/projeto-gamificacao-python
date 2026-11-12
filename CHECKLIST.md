# Checklist do Sibi

Lista para rodar antes de cada entrega e depois de cada mudança grande. Cada item diz o comando e o que
significa passar. Os resultados da última rodada completa estão na seção "Última rodada".

Todos os comandos rodam a partir da pasta indicada. No Windows, use o Git Bash ou o PowerShell.

---

## 1. Git

- [ ] `git status` mostra a árvore limpa (ou só as mudanças que você está fazendo).
- [ ] `git status -sb` mostra `## main...origin/main` sem `ahead` nem `behind`.
- [ ] A mensagem do commit diz o que mudou e por quê, em português.
- [ ] O commit vai para `main` (o projeto não usa branch).
- [ ] Depois do `git push`, a Vercel publica sozinha. Veja o item 8.

## 2. Qualidade automatizada (pasta `web/`)

| Verificação | Comando | Passa quando |
|---|---|---|
| Testes unitários e de integração | `npx vitest run` | 194 testes passando, 0 falhas (25 arquivos) |
| Tipos | `npx tsc --noEmit` | Nenhuma saída |
| Lint | `npm run lint` | Nenhum erro |
| Build de produção | `npm run build` | Termina com `BUILD_EXIT=0` e lista as rotas |

Se o teste travar, confira o item 9 (problemas conhecidos).

## 3. Conteúdo (pasta raiz do repositório)

Rode para cada unidade (1 a 4). Ao criar uma unidade nova, acrescente a linha.

```
C:/Python314/python.exe ferramentas/verificar_conteudo.py conteudo/unidade-1
C:/Python314/python.exe ferramentas/verificar_conteudo.py conteudo/unidade-2
C:/Python314/python.exe ferramentas/verificar_conteudo.py conteudo/unidade-3
C:/Python314/python.exe ferramentas/verificar_conteudo.py conteudo/unidade-4
```

- [ ] Termina com `Nenhum erro.`
- [ ] A linha "Entenda melhor: N de N conceitos" mostra o mesmo número nos dois lados.
- [ ] Avisos (`AVISO`) são anotados. Um aviso não bloqueia, mas deve ser decidido de propósito.
- [ ] Use `--leitura` quando mudar o texto de leitura, para regenerar `LEITURA.md`.
- [ ] Sem `-I` no comando. O `-I` impede o Python de achar os módulos locais.

Publicação do conteúdo no banco: em `web/`, `npm run db:publicar`. Só depois de o verificador passar.

## 4. Navegador (site local, celular e desktop)

1. Em `web/`: `npm run build`.
2. Em `web/`, em segundo plano:
   `SIBI_AMBIENTE=homologacao URL_DO_SITE=http://localhost:3100 npx next start -p 3100`
3. Na raiz, com o navegador de teste do scratchpad:
   `NODE_PATH=<scratchpad>/navegador/node_modules CAPTURAS=<pasta> BASE=http://localhost:3100 node ferramentas/verificar_navegador.mjs tudo`
4. Passa quando a última linha é `Todas as verificações passaram.` e o comando sai com código 0.
5. Encerre o servidor com PowerShell, filtrando pela linha de comando (não pelo Bash).

O modo `tudo` cobre: demonstração, desafio do dia, conta de teste e prática. Ele não cria visitantes.

Modos separados (rodar quando mexer na área):

- [ ] `visitante`: cria usuários anônimos reais. Rodar só quando mexer no acesso de visitante ou no resultado da lição (confere o botão de compartilhar e a rolagem do resultado).
- [ ] `jornada`: fluxo completo de aprendizagem.

## 5. Vigilância de abuso

Em `web/`: `npm run db:vigilancia`

- [ ] Imprime "Tudo normal: nenhum sinal de abuso." Se disser ATENÇÃO ou ALERTA, avise o dono.
- [ ] O código de saída é 2 quando há ALERTA.

## 6. Relatório de retenção

Em `web/`: `npm run db:retencao`

- [ ] Roda sem erro. Contas de teste e visitantes ficam fora dos números.

## 7. Produção (Vercel)

- [ ] `https://sibi-three.vercel.app/` responde 200.
- [ ] `https://sibi-three.vercel.app/api/manutencao` sem o segredo responde 401.
  Isso mostra que a rota diária está protegida.
- [ ] O Cron diário (9h, horário UTC do arquivo `web/vercel.json`) está registrado.
- [ ] Depois de um push no `main`, o painel da Vercel mostra o deploy como "Ready".

## 8. Fluxos do dono (manual, só se mexer na área)

- [ ] Cadastro com e-mail. Só vale depois do SMTP do dono (`PASSO_A_PASSO_EMAIL.md`).
- [ ] Entrar na conta de teste (`web/.env.local`, nunca no chat).
- [ ] Desafio do dia abre sem conta e mostra o placar.
- [ ] Instalar o app (PWA) no celular, pelo card no Perfil.
- [ ] Alternar o tema claro e o escuro no Perfil.

## 9. Problemas conhecidos

- Cache do Turbopack pode ignorar mudanças de CSS. Solução: apagar `.next/dev` e reiniciar.
- O Supabase pausa com inatividade. Se o banco não responder, restaure no painel antes de testar.
- Vitest pode travar se um teste que republica `u1-l1` roda antes de outros. Mantenha a ordem atual.
- Rodar o servidor com `next start` sem `URL_DO_SITE` dá erro 500.
- Deploy manual de dentro de `web/` cria um projeto Vercel errado. Sempre da raiz do repositório.

---

## Última rodada: 12/11/2026

| Item | Resultado |
|---|---|
| Git antes da rodada | `main` limpo, sincronizado com `origin/main` (commit 82c2b04) |
| 2. Testes (`vitest`) | 24 arquivos, 190 testes, todos passaram |
| 2. Tipos (`tsc --noEmit`) | Sem erros |
| 2. Lint (`eslint`) | Sem erros |
| 2. Build | Concluído (saída 0) |
| 3. Conteúdo u1 | Nenhum erro. 11 de 11 "Entenda melhor". 1 aviso: `u1-l5-e04` sem blocos distratores (conhecido, não bloqueia) |
| 3. Conteúdo u2 | Nenhum erro. 8 de 8 |
| 3. Conteúdo u3 | Nenhum erro. 6 de 6 |
| 3. Conteúdo u4 | Nenhum erro. 5 de 5 |
| 4. Navegador `tudo` | Todas as verificações passaram. Capturas em `scratchpad/capturas-checklist` |
| 4. Modo `visitante` e `jornada` | Não rodados nesta rodada (ver item 4) |
| 5. Vigilância | Tudo normal. 4 visitantes em 24 h, 0 sinais de abuso |
| 6. Retenção | Roda sem erro (saída 0). Só 4 começos de desafio e 0 abertos de Entenda melhor: números ainda pequenos |
| 7. Produção | `/` 200; `/api/manutencao` sem segredo 401 |
| 8. Manual | Não testado nesta rodada (depende do dono) |
