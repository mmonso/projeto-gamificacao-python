import type { Metadata } from "next";
import Link from "next/link";
import { DOCUMENTOS } from "@/modulos/conta/documentos";
import { Contato, Definir, Documento } from "../documento";

export const metadata: Metadata = { title: "Termos de uso" };

// Termos de uso (E08.9; ESPECIFICACAO_MVP, D-06, PR-02 e PR-04). Descrevem o app como ele funciona: conta
// só para maiores de 18 anos, sem compras nem anúncios, progresso sem valor em dinheiro e exclusão da
// conta no Perfil. Pontos em aberto para a revisão jurídica: REVISAO_JURIDICA.md.
export default function PaginaTermos() {
  const { responsavel, foro, idadeMinima } = DOCUMENTOS;
  return (
    <Documento titulo="Termos de uso">
      <p>
        Estes termos explicam as regras para usar o Sibi. Ao criar uma conta, você concorda com eles e com a <Link href="/privacidade">política de privacidade</Link>.
      </p>
      <p>
        O Sibi é um projeto pessoal de <Definir valor={responsavel} oQue="responsável pelo Sibi" />, pessoa física, e por enquanto é oferecido de graça. Nestes termos,
        &ldquo;nós&rdquo; se refere a ele.
      </p>

      <h2>1. O que é o Sibi</h2>
      <p>
        O Sibi ensina Python a iniciantes com lições curtas, exercícios corrigidos na hora, revisões e recompensas de jogo, como XP, corações, sequência e conquistas.
        O uso é gratuito, sem anúncios e sem compras.
      </p>
      <p>
        O Sibi está em fase de testes (beta). Lições, regras de recompensa e funcionalidades podem mudar, e o serviço pode ficar fora do ar para manutenção ou correções.
      </p>

      <h2>2. Quem pode usar</h2>
      <ul>
        <li>
          Para criar uma conta, você precisa ter {idadeMinima} anos ou mais. Ao se cadastrar, você declara que tem essa idade. O Sibi foi feito para adultos que estão começando
          a programar e não é direcionado a crianças nem a adolescentes.
        </li>
        <li>A lição de demonstração pode ser feita sem conta. Ela fica guardada só no navegador e não grava dados pessoais no servidor.</li>
        <li>
          Se soubermos que uma conta pertence a alguém com menos de {idadeMinima} anos, ela será excluída. Pai, mãe ou responsável que descobrir uma conta assim pode pedir a
          exclusão pelo contato no fim desta página.
        </li>
      </ul>

      <h2>3. Sua conta</h2>
      <ul>
        <li>Use um e-mail seu e válido. Ele é confirmado no cadastro e serve para entrar e recuperar o acesso.</li>
        <li>A senha é pessoal. Não a compartilhe e avise pelo contato abaixo se suspeitar que outra pessoa entrou na sua conta.</li>
        <li>Cada pessoa deve ter uma única conta, e o que for feito com ela é responsabilidade de quem a criou.</li>
      </ul>

      <h2>4. Uso permitido</h2>
      <p>O Sibi é para estudo pessoal. Não é permitido:</p>
      <ul>
        <li>tentar acessar a conta ou os dados de outra pessoa;</li>
        <li>usar programas para responder exercícios ou enviar pedidos em massa, ou tentar contornar os limites de uso;</li>
        <li>explorar falhas, sobrecarregar o serviço ou atrapalhar o uso por outras pessoas.</li>
      </ul>
      <p>Contas usadas dessa forma podem ser suspensas ou excluídas. Se encontrar uma falha, conte para nós pelo contato abaixo: isso ajuda muito.</p>

      <h2>5. Progresso e recompensas</h2>
      <p>
        XP, corações, sequência e conquistas medem o seu estudo e não têm valor em dinheiro. Eles não podem ser vendidos, trocados nem transferidos para outra conta. Se uma
        falha gerar recompensas a mais ou a menos, podemos corrigir o saldo.
      </p>

      <h2>6. Conteúdo</h2>
      <p>
        As lições, os exercícios, os textos, as ilustrações e o mascote do Sibi são protegidos por direitos autorais. Você pode usá-los para estudar, mas não pode copiá-los ou
        distribuí-los. Os pequenos exemplos de código Python das lições podem ser usados livremente nos seus próprios estudos e programas.
      </p>

      <h2>7. Disponibilidade e responsabilidade</h2>
      <p>
        Trabalhamos para manter o Sibi funcionando e o conteúdo correto, mas não garantimos que ele esteja sempre disponível ou livre de erros. O Sibi complementa o estudo e não
        substitui um curso formal. Na medida permitida pela lei, não respondemos por prejuízos causados por indisponibilidade ou por erros no conteúdo. Nada nestes termos limita
        direitos que a lei garante a você.
      </p>

      <h2>8. Saída e encerramento</h2>
      <p>
        Você pode excluir sua conta a qualquer momento em Perfil. A exclusão apaga o seu progresso de forma definitiva. Antes, se quiser, use &ldquo;Exportar meu histórico&rdquo; na mesma tela.
      </p>
      <p>Se o Sibi for encerrado, avisaremos por e-mail com antecedência, para que você possa baixar o seu histórico.</p>

      <h2>9. Mudanças nestes termos</h2>
      <p>
        Quando estes termos mudarem, avisaremos no app ou por e-mail antes de a mudança valer, e a data no topo da página será atualizada. Se a mudança for importante,
        pediremos que você aceite a nova versão para continuar usando a conta.
      </p>

      <h2>10. Lei e foro</h2>
      <p>
        Estes termos seguem as leis do Brasil. Fica eleito o foro da comarca de <Definir valor={foro} oQue="comarca" />, sem prejuízo do seu direito de buscar o foro do seu
        domicílio.
      </p>

      <h2>11. Contato</h2>
      <p>
        Dúvidas, pedidos e avisos de problemas: <Contato />.
      </p>
    </Documento>
  );
}
