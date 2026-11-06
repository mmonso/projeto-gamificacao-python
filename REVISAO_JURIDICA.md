# Revisão jurídica dos termos de uso e da política de privacidade

Pontos para um advogado conferir antes de o Sibi ser aberto ao público (E08.9). Os textos estão em `/termos` e `/privacidade` no app. Os dados variáveis, como responsável, contato, foro, prazo das cópias de segurança e idade mínima, ficam em `web/src/modulos/conta/documentos.ts`. Rascunho feito em 6 de novembro de 2026, a partir das fontes citadas abaixo, sem revisão profissional.

## O serviço, em resumo

- Curso gratuito de Python para iniciantes. Não tem anúncios, compras, chat, perfil público nem ranking.
- Tem gamificação: XP, corações (vidas), sequência de dias e conquistas.
- É mantido por uma pessoa física, Marcelo Linhares Monsó, de Florianópolis/SC, sem empresa e sem receita.
- O primeiro beta é para 10 a 20 adultos convidados.
- Dados guardados: e-mail, senha (com o Supabase Auth), nome ou apelido, meta, fuso, respostas, progresso e eventos de uso só com identificadores.
- Na demonstração sem conta, o servidor guarda apenas um resumo (hash) do IP, por cerca de 1 hora.
- Banco e autenticação: Supabase, em São Paulo. Hospedagem: Vercel. Envio de e-mails: provedor a definir.

## Pontos para revisar

1. **Idade mínima e ECA Digital (Lei 15.211/2025, em vigor desde 17/03/2026).**
   - O projeto previa conta sem idade mínima. O rascunho passou a exigir 18 anos ou mais, por declaração no cadastro ("Tenho 18 anos ou mais e aceito..."), sem verificar documentos.
   - O motivo: sem idade mínima, o serviço poderia ser considerado "de acesso provável" por adolescentes (art. 1º, parágrafo único). Nesse caso valeriam:
     - supervisão parental e limite de tempo de uso (art. 17);
     - vínculo de contas de até 16 anos à conta de um responsável (art. 24, caput, que não se restringe a redes sociais);
     - configurações que evitem uso compulsivo (art. 8º, IV), que alcançam sequência e recompensas.
   - Perguntas:
     - (a) Os três incisos do parágrafo único são cumulativos? O inciso II termina em "; e". Se forem, um serviço sem interação social, e portanto sem "significativo grau de risco", talvez fique fora da lei mesmo sem idade mínima.
     - (b) Autodeclaração basta para um serviço de baixo risco? O Decreto 12.880/2026, art. 24, I, pede proporcionalidade ao risco. O art. 9º da lei veda a autodeclaração só para conteúdo impróprio.
     - (c) A orientação de aferição de idade da ANPD muda algo? A orientação preliminar é de março de 2026, e a definitiva estava prevista a partir de agosto de 2026. A fiscalização começa em janeiro de 2027.
2. **Pessoa física como controladora.**
   - O rascunho se apoia na Resolução CD/ANPD nº 2/2022. O art. 2º, I, inclui pessoas naturais entre os agentes de pequeno porte. Daí:
     - não indica encarregado e oferece o e-mail como canal (art. 11);
     - adota o prazo em dobro (art. 14), inclusive para comunicar incidentes. Pela Resolução 15/2024, seriam 6 dias úteis.
   - A política promete resposta em até 15 dias. Confirmar se o enquadramento se sustenta.
3. **Transferência internacional (Resolução CD/ANPD nº 19/2024).**
   - Vercel e Supabase são empresas dos EUA. O provedor de e-mail provavelmente também será.
   - O prazo para incorporar as cláusulas-padrão da ANPD terminou em agosto de 2025.
   - Não encontrei confirmação de que os contratos padrão (DPA) desses fornecedores tragam as cláusulas-padrão brasileiras.
   - Perguntas: o que uma pessoa física que aceita termos padrão pode e deve fazer? O texto da seção 6 da política basta como transparência?
4. **Bases legais.**
   - Conta e estudo: execução de contrato (art. 7º, V).
   - Eventos de uso e dados técnicos: legítimo interesse (art. 7º, IX), com oposição pelo contato.
   - Avaliar se é preciso registrar o teste de balanceamento do legítimo interesse (art. 10).
5. **Registros de acesso (Marco Civil, art. 15).**
   - A guarda por 6 meses vale para provedor "constituído na forma de pessoa jurídica" com fins econômicos.
   - O rascunho parte do princípio de que uma pessoa física sem fins econômicos não precisa guardar esses registros, e diz apenas que a hospedagem os guarda por pouco tempo. Confirmar.
6. **Cópias de segurança.**
   - O plano gratuito do Supabase não faz backup automático. O plano Pro guarda 7 dias.
   - A política fixa "até 30 dias" como limite para dados de contas excluídas ainda existirem em cópias. A rotina de backup (E08.8) precisa respeitar esse limite.
7. **Termos de uso.**
   - Conferir:
     - a cláusula de limitação de responsabilidade, num serviço gratuito em que o CDC pode ou não se aplicar;
     - o foro de Florianópolis/SC, com ressalva do domicílio do usuário;
     - a correção de saldos de recompensas;
     - a exclusão de contas de menores e de contas usadas de forma abusiva.
8. **Registro do aceite.**
   - O app guarda a data e a hora do aceite (`perfis.termos_aceitos_em`). Isso inclui a declaração de idade.
   - A versão aceita é deduzida pela data da versão em vigor.
   - Avaliar se é preciso guardar também a versão e a cópia do texto aceito.
9. **Registro das operações de tratamento** (LGPD, art. 37; Resolução 2/2022, art. 9º).
   - Ainda não foi feito. A ANPD oferece modelo simplificado para agentes de pequeno porte.

## Fontes consultadas

- [Lei 15.211/2025 (ECA Digital)](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/lei/L15211.htm) e [Decreto 12.880/2026](https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2026/decreto/d12880.htm)
- [Página do ECA Digital na ANPD](https://www.gov.br/anpd/pt-br/assuntos/eca-digital), com cronograma e orientações preliminares de aferição de idade
- [Resolução CD/ANPD nº 2/2022](https://www.normasbrasil.com.br/norma/resolucao-2-2022_426801.html) (republicação; conferir no DOU)
- Resolução CD/ANPD nº 19/2024: resumos de [Mattos Filho](https://www.mattosfilho.com.br/?p=107482) e [Mayer Brown](https://www.mayerbrown.com/pt/insights/publications/2025/08/end-of-grace-period-implementation-of-brazils-standard-contractual-clauses-in-international-transfers-of-personal-data)
- Enunciado CD/ANPD nº 1/2023, sobre bases legais para dados de crianças e adolescentes: [resumo de Felsberg](https://www.felsberg.com.br/importante-anpd-publica-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes/)
- Resolução CD/ANPD nº 15/2024, sobre comunicação de incidentes: [resumo de Cescon Barrieu](https://cesconbarrieu.com.br/anpd-aprova-o-regulamento-de-comunicacao-de-incidente-de-seguranca/)
- [Backups do Supabase](https://supabase.com/docs/guides/platform/backups) e [preços](https://supabase.com/pricing)
