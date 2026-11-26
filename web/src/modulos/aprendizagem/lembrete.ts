// Lembrete diário na agenda do próprio aluno (design/MELHORIAS_UX.md, D3): sem servidor, sem e-mail. Gera um
// link do Google Agenda e um arquivo .ics (iPhone e outros calendários) com um evento que se repete todo dia.
// Nada pessoal vai no link: só o título, a hora e o endereço do Sibi.

export const TITULO_LEMBRETE = "Estudar Python no Sibi (5 min)";

const dois = (n: number) => String(n).padStart(2, "0");

/** Data local (YYYYMMDD) do próximo dia em que a hora escolhida ainda não passou. */
export function proximoDia(agora: Date, hora: number): string {
  const d = new Date(agora);
  if (d.getHours() >= hora) d.setDate(d.getDate() + 1);
  return `${d.getFullYear()}${dois(d.getMonth() + 1)}${dois(d.getDate())}`;
}

function descricao(site: string) {
  return `Uma lição curta por dia mantém o Python na cabeça. Abrir: ${site}/aprender`;
}

/** Link do Google Agenda que abre o evento já preenchido, repetindo todo dia, no fuso do aparelho. */
export function linkGoogleAgenda(agora: Date, hora: number, fuso: string, site: string): string {
  const dia = proximoDia(agora, hora);
  const inicio = `${dia}T${dois(hora)}0000`;
  const fim = `${dia}T${dois(hora)}1000`;
  const p = new URLSearchParams({
    action: "TEMPLATE",
    text: TITULO_LEMBRETE,
    details: descricao(site),
    dates: `${inicio}/${fim}`,
    ctz: fuso,
    recur: "RRULE:FREQ=DAILY",
  });
  return `https://calendar.google.com/calendar/render?${p.toString()}`;
}

/** Arquivo .ics com o evento diário em hora local ("flutuante"), com aviso na hora do evento. */
export function arquivoIcs(agora: Date, hora: number, site: string): string {
  const dia = proximoDia(agora, hora);
  const carimbo = agora.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Sibi//Lembrete diario//PT",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:sibi-lembrete-${dia}-${dois(hora)}@sibi`,
    `DTSTAMP:${carimbo}`,
    `DTSTART:${dia}T${dois(hora)}0000`,
    "DURATION:PT10M",
    "RRULE:FREQ=DAILY",
    `SUMMARY:${TITULO_LEMBRETE}`,
    `DESCRIPTION:${descricao(site)}`,
    `URL:${site}/aprender`,
    "BEGIN:VALARM",
    "TRIGGER:PT0M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Hora do Sibi!",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}
