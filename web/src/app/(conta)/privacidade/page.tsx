import type { Metadata } from "next";
import Link from "next/link";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { Definir, Documento } from "../documento";

export const metadata: Metadata = { title: "Política de privacidade" };

// Política de privacidade (E08.9; LGPD; ESPECIFICACAO_MVP, PR-02 e CA-115 a CA-117). Descreve o que o app
// guarda hoje: conta, perfil, estudo, eventos só com identificadores, IP resumido na demonstração e erros
// sem dados pessoais. Ao mudar o que é guardado, atualizar esta página e a data em DOCUMENTOS.
export default function PaginaPrivacidade() {
  const { responsavel, contato, prazoBackup } = DOCUMENTOS;
  return (
    <Documento titulo="Política de privacidade">
      <p>
        Esta política explica quais dados o Sibi guarda, para quê, com quem eles são compartilhados e como você controla tudo isso. Ela segue a Lei Geral de Proteção de Dados
        (Lei 13.709/2018, a LGPD).
      </p>

      <h2>1. Quem cuida dos seus dados</h2>
      <p>
        Quem responde pelo tratamento dos dados é <Definir valor={responsavel} oQue="responsável pelo Sibi" />. Para qualquer pedido ou dúvida sobre seus dados, escreva para{" "}
        <Definir valor={contato} oQue="e-mail de contato" />.
      </p>

      <h2>2. O que guardamos e para quê</h2>
      <dl className="documento-lista">
        <dt>Conta</dt>
        <dd>
          E-mail e senha, para criar a conta, entrar e recuperar o acesso. A senha fica com o serviço de autenticação em forma cifrada, e nem nós conseguimos lê-la. Também
          guardamos quando você aceitou estes documentos.
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
        manter o Sibi seguro e melhorar as lições (art. 7º, IX).
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
      <p>Não usamos cookies de publicidade nem de rastreamento.</p>

      <h2>5. Com quem compartilhamos</h2>
      <p>Seus dados ficam com serviços contratados para funcionar o Sibi, que só podem usá-los para isso:</p>
      <ul>
        <li>Supabase: banco de dados e autenticação, em servidores em São Paulo.</li>
        <li>Vercel: hospedagem do site. Ela pode processar os acessos fora do Brasil, com as garantias contratuais exigidas pela LGPD (art. 33).</li>
        <li>Um provedor de envio de e-mails, para as mensagens de confirmação e de recuperação de acesso.</li>
      </ul>
      <p>Também podemos entregar dados a autoridades quando a lei exigir.</p>

      <h2>6. Por quanto tempo</h2>
      <ul>
        <li>Enquanto a conta existir. Ao excluí-la, perfil, progresso, respostas e eventos são apagados na hora.</li>
        <li>
          Cópias de segurança do banco podem manter esses dados por <Definir valor={prazoBackup} oQue="prazo das cópias de segurança" />, até serem substituídas.
        </li>
        <li>Registros de acesso da hospedagem, pelo prazo que a lei exigir.</li>
      </ul>

      <h2>7. Seus direitos</h2>
      <p>Pela LGPD, você pode, entre outras coisas:</p>
      <ul>
        <li>
          ver e levar seus dados: em <Link href="/perfil">Perfil</Link>, &ldquo;Exportar meu histórico&rdquo; gera um arquivo com todos os dados da sua conta;
        </li>
        <li>corrigir nome, meta e fuso horário, também no Perfil;</li>
        <li>excluir a conta e todos os dados dela, no fim do Perfil;</li>
        <li>pedir informações sobre o uso e o compartilhamento dos seus dados, ou se opor aos eventos de uso, pelo contato acima;</li>
        <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
      </ul>

      <h2>8. Crianças e adolescentes</h2>
      <p>
        O Sibi foi pensado para adultos iniciantes, mas não tem idade mínima e não pergunta a idade de ninguém. Por isso, guardamos para todo mundo só o necessário para estudar.
        Não há perfil público, ranking, conversa entre pessoas nem publicidade.
      </p>
      <p>
        Crianças com menos de 12 anos só devem usar o Sibi com uma conta criada por pai, mãe ou responsável, que dá o consentimento exigido pela LGPD (art. 14). Responsáveis podem
        pedir acesso aos dados ou a exclusão da conta pelo contato acima. Se soubermos que uma criança usa o Sibi sem esse consentimento, a conta poderá ser excluída.
      </p>

      <h2>9. Segurança</h2>
      <p>
        A conexão com o site é cifrada. Os dados ficam num banco acessado só pelo servidor do Sibi, e cada conta só enxerga o próprio progresso. Se houver um incidente de segurança
        com risco para você, avisaremos você e a ANPD.
      </p>

      <h2>10. Mudanças nesta política</h2>
      <p>Quando esta política mudar, avisaremos no app ou por e-mail antes de a mudança valer, e a data no topo da página será atualizada.</p>
    </Documento>
  );
}
