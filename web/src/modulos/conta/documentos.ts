// Dados dos termos de uso e da política de privacidade (E08.9). Precisam ser preenchidos e revisados
// antes do beta; enquanto um campo for null, as páginas mostram "a definir" em destaque.
export const DOCUMENTOS = {
  /** Data da versão em vigor, mostrada no topo das duas páginas. */
  versao: "6 de novembro de 2026",
  /** Enquanto true, as páginas avisam que o texto é preliminar e ainda será revisado. */
  preliminar: true,
  /** Pessoa ou empresa responsável pelo Sibi e pelo tratamento dos dados (controladora, LGPD art. 5º, VI). */
  responsavel: null as string | null,
  /** E-mail de atendimento para dúvidas, pedidos sobre dados pessoais e avisos de problemas. */
  contato: null as string | null,
  /** Comarca do foro dos termos de uso. */
  foro: null as string | null,
  /** Por quanto tempo as cópias de segurança guardam dados de uma conta já excluída (E08.8). */
  prazoBackup: null as string | null,
};
