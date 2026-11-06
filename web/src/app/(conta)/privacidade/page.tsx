import type { Metadata } from "next";
import Link from "next/link";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { Contato, Definir, Documento } from "../documento";

export const metadata: Metadata = { title: "Política de privacidade" };

// Política de privacidade (E08.9; LGPD; Resoluções CD/ANPD nº 2/2022 e nº 19/2024; ESPECIFICACAO_MVP, PR-02
// e CA-115 a CA-117). Descreve o que o app guarda hoje: conta, perfil, estudo, eventos só com
// identificadores, IP resumido na demonstração e erros sem dados pessoais. Ao mudar o que é guardado,
// atualizar esta página e a data em DOCUMENTOS. Pontos em aberto para a revisão jurídica: REVISAO_JURIDICA.md.
export default function PaginaPrivacidade() {
  const { responsavel, prazoBackup, idadeMinima } = DOCUMENTOS;
  return (
    <Documento titulo="Política de privacidade">
      <p>
        Esta política explica quais dados o Sibi guarda, para quê, com quem eles são compartilhados e como você controla tudo isso. Ela segue a Lei Geral de Proteção de Dados
        (Lei 13.709/2018, a LGPD).
      </p>

      <h2>1. Quem cuida dos seus dados</h2>
      <p>
        O responsável pelo tratamento dos dados (o controlador, na LGPD) é <Definir valor={responsavel} oQue="responsável pelo Sibi" />, pessoa física, que mantém o Sibi
        como projeto pessoal.
      </p>
      <p>
        Como agente de tratamento de pequeno porte (Resolução CD/ANPD nº 2/2022), o Sibi não tem encarregado de dados. O canal para qualquer pedido ou dúvida sobre seus dados é
        o e-mail <Contato />. Respondemos em até 15 dias.
      </p>

      <h2>2. O que guardamos e para quê</h2>
      <dl className="documento-lista">
        <dt>Conta</dt>
        <dd>
          E-mail e senha, para criar a conta, entrar e recuperar o acesso. A senha fica com o serviço de autenticação em forma cifrada, e nem nós conseguimos lê-la. Também
          guardamos a data e a hora em que você declarou ter {idadeMinima} anos ou mais e aceitou estes documentos.
        </dd>
        <dt>Perfil</dt>
        <dd>Nome ou apelido, meta diária, fuso horário e preferência de som, para personalizar o app e contar seus dias de estudo no seu horário.</dd>
        <dt>Estudo</dt>
        <dd>
          Lições iniciadas e concluídas, as respostas que você envia, dicas usadas, acertos, XP, corações, sequência, conquistas e a agenda de revisão de cada conceito. É o que
          permite corrigir os exercícios, guardar seu progresso e montar suas revisões.
        </dd>
        <dt>Eventos de uso</dt>
        <dd>
          Registros como &ldquo;lição iniciada&rdquo; ou &ldquo;exercício respondido&rdquo;, só com os identificadores da lição e do exercício e se a resposta estava certa, sem o
          conteúdo da resposta. Servem para descobrir onde iniciantes travam e melhorar o curso.
        </dd>
        <dt>Dados técnicos</dt>
        <dd>
          Ao acessar o site, a hospedagem recebe o seu endereço IP e informações do navegador, como em qualquer site. Na demonstração sem conta, usamos um resumo cifrado do
          endereço IP para limitar pedidos em excesso, descartado depois de cerca de uma hora. Quando algo dá errado, registramos só a tela e a mensagem técnica do erro, sem
          respostas nem dados da conta.
        </dd>
      </dl>
      <p>
        O tratamento é necessário para oferecer o serviço que você pediu ao criar a conta (LGPD, art. 7º, V). Os eventos de uso e os dados técnicos servem ao interesse legítimo de
        manter o Sibi seguro e melhorar as lições (art. 7º, IX), e você pode se opor a eles pelo contato acima.
      </p>
      <p>
        Não pedimos data de nascimento, documentos, telefone, localização nem fotos. Não usamos publicidade nem ferramentas de análise de outras empresas. Não vendemos dados.
      </p>

      <h2>3. Demonstração sem conta</h2>
      <p>
        A lição de demonstração fica guardada só no seu navegador. O servidor corrige as respostas sem gravar nada. Se você criar uma conta depois, o app pergunta se quer salvar o
        resultado. Só então as respostas são enviadas, corrigidas de novo e registradas na conta.
      </p>

      <h2>4. Cookies e armazenamento no navegador</h2>
      <ul>
        <li>Cookies de sessão, necessários para manter você conectado com segurança.</li>
        <li>Um cookie temporário com o e-mail que aguarda confirmação, para reenviar o link do cadastro. Ele dura até 24 horas.</li>
        <li>No armazenamento do navegador: a demonstração em andamento, o nome e a meta escolhidos na introdução e a resposta do exercício que está na tela, para nada se perder numa queda de conexão.</li>
      </ul>
      <p>São todos necessários para o app funcionar. Não usamos cookies de publicidade nem de rastreamento.</p>

      <h2>5. Com quem compartilhamos</h2>
      <p>Seus dados ficam com serviços contratados para o Sibi funcionar, que só podem usá-los para isso:</p>
      <ul>
        <li>Supabase, empresa dos Estados Unidos: banco de dados e autenticação, em servidores em São Paulo.</li>
        <li>Vercel, empresa dos Estados Unidos: hospedagem do site.</li>
        <li>Um provedor de envio de e-mails, para as mensagens de confirmação e de recuperação de acesso.</li>
      </ul>
      <p>Também podemos entregar dados a autoridades quando a lei exigir.</p>

      <h2>6. Dados fora do Brasil</h2>
      <p>
        O banco de dados fica no Brasil, mas parte do tratamento pode acontecer nos Estados Unidos: a Vercel pode processar os acessos ao site lá, o provedor de e-mail envia as
        mensagens de lá, e a Supabase pode acessar os dados de fora do Brasil para dar suporte e manter o serviço funcionando.
      </p>
      <p>
        Essas transferências servem só para o Sibi funcionar e duram enquanto a sua conta existir. Elas se apoiam nas garantias contratuais de proteção de dados desses
        fornecedores (LGPD, art. 33, e Resolução CD/ANPD nº 19/2024). Seus direitos continuam os mesmos, e você pode pedir pelo contato acima o texto das cláusulas que protegem
        essas transferências.
      </p>

      <h2>7. Por quanto tempo</h2>
      <ul>
        <li>Enquanto a conta existir. Ao excluí-la, conta, perfil, progresso, respostas e eventos são apagados na hora.</li>
        <li>
          Cópias de segurança do banco podem manter esses dados por <Definir valor={prazoBackup} oQue="prazo das cópias de segurança" />, até serem substituídas. Elas só são
          usadas para recuperar o serviço depois de uma falha.
        </li>
        <li>Registros técnicos de acesso e de erros ficam com a hospedagem pelo prazo curto que ela adota e depois são apagados automaticamente.</li>
      </ul>

      <h2>8. Seus direitos</h2>
      <p>Pela LGPD (art. 18), você pode:</p>
      <ul>
        <li>
          saber quais dados temos e levar uma cópia: em <Link href="/perfil">Perfil</Link>, &ldquo;Exportar meu histórico&rdquo; gera um arquivo com todos os dados da sua
          conta, que pode ser aberto por outros programas;
        </li>
        <li>corrigir nome, meta e fuso horário, também no Perfil;</li>
        <li>excluir a conta e todos os dados dela, no fim do Perfil;</li>
        <li>saber com quem compartilhamos seus dados, como descrito acima;</li>
        <li>se opor aos eventos de uso, ou fazer qualquer outro pedido sobre seus dados, pelo contato acima;</li>
        <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>

      <h2>9. Crianças e adolescentes</h2>
      <p>
        O Sibi foi feito para adultos, e só pessoas com {idadeMinima} anos ou mais podem criar uma conta. Não guardamos de propósito dados de crianças nem de adolescentes. Também
        não há perfil público, ranking, conversa entre pessoas nem publicidade.
      </p>
      <p>
        Se você é pai, mãe ou responsável e descobriu que alguém com menos de {idadeMinima} anos criou uma conta, escreva para o contato acima: a conta e todos os dados dela
        serão excluídos.
      </p>

      <h2>10. Segurança</h2>
      <p>
        A conexão com o site é cifrada. Os dados ficam num banco acessado só pelo servidor do Sibi, e cada conta só enxerga o próprio progresso. Se houver um incidente de segurança
        com risco para você, avisaremos você e a ANPD nos prazos da lei.
      </p>

      <h2>11. Mudanças nesta política</h2>
      <p>Quando esta política mudar, avisaremos no app ou por e-mail antes de a mudança valer, e a data no topo da página será atualizada.</p>
    </Documento>
  );
}
