// Dados dos termos de uso e da política de privacidade (E08.9). Os pontos que ainda dependem de revisão
// jurídica estão em REVISAO_JURIDICA.md; enquanto um campo for null, as páginas mostram "a definir".
export const DOCUMENTOS = {
  /** Data da versão em vigor, mostrada no topo das duas páginas. Mudou o texto, muda a data. */
  versao: "12 de novembro de 2026",
  /** Enquanto true, as páginas avisam que o texto é preliminar e ainda será revisado. */
  preliminar: true,
  /** Pessoa responsável pelo Sibi e pelo tratamento dos dados (controlador, LGPD art. 5º, VI). */
  responsavel: "Marcelo Linhares Monsó" as string | null,
  /** E-mail de atendimento: dúvidas, pedidos sobre dados pessoais e avisos de problemas. */
  contato: "marcelomonso.art@gmail.com" as string | null,
  /** Comarca do foro dos termos de uso. */
  foro: "Florianópolis/SC" as string | null,
  /**
   * Por quanto tempo as cópias de segurança podem guardar dados de uma conta já excluída. É um limite
   * que a rotina de backup (E08.8) precisa respeitar: o plano Pro do Supabase guarda 7 dias.
   */
  prazoBackup: "até 30 dias" as string | null,
  /** Idade mínima para criar conta (PR-02, revisada em 06/11/2026 por causa do ECA Digital). */
  idadeMinima: 18,
};
