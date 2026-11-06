// Sons próprios, gerados no navegador (design/DESIGN.md: decisões de interação). Sem arquivos de áudio.
// O Safari do iPhone só deixa uma página começar a tocar dentro de um gesto do usuário, e os sons tocam
// depois, quando o servidor responde. Por isso o áudio é liberado no toque (liberarSom) e só então usado.
// Com o iPhone no silencioso, o sistema corta estes sons, como nos jogos.
export type Som = "acerto" | "erro" | "conclusao" | "celebracao";

type Nota = { freq: number; inicio: number; duracao: number; volume: number; forma?: OscillatorType };

let contexto: AudioContext | undefined;
let saida: AudioNode | undefined;

function preparar(): AudioContext | undefined {
  if (typeof window === "undefined") return undefined;
  const Construtor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Construtor) return undefined;
  if (!contexto) {
    contexto = new Construtor();
    // O compressor evita distorção quando várias notas soam juntas.
    const compressor = contexto.createDynamicsCompressor();
    compressor.connect(contexto.destination);
    saida = compressor;
  }
  if (contexto.state === "suspended") void contexto.resume().catch(() => {});
  return contexto;
}

/** Chamada dentro de um toque ou tecla: cria e destrava o áudio para os sons que vêm depois. */
export function liberarSom() {
  try {
    if (contexto?.state === "running") return;
    const ctx = preparar();
    if (!ctx) return;
    const silencio = ctx.createBufferSource();
    silencio.buffer = ctx.createBuffer(1, 1, 22050);
    silencio.connect(ctx.destination);
    silencio.start(0);
  } catch {
    // Sem áudio neste navegador: a lição segue sem som.
  }
}

/** Frequência a n semitons acima de outra. */
const subir = (freq: number, semitons: number) => freq * 2 ** (semitons / 12);

function tocarNotas(notas: Nota[]) {
  const ctx = preparar();
  if (!ctx || !saida) return;
  const agora = ctx.currentTime + 0.02;
  for (const n of notas) {
    // Fundamental com dois harmônicos suaves: timbre de sininho, mais audível em alto-falante de celular.
    const parciais: [number, number][] = n.forma === "triangle" ? [[1, 1]] : [[1, 1], [2, 0.3], [3, 0.1]];
    for (const [multiplo, peso] of parciais) {
      const oscilador = ctx.createOscillator();
      const ganho = ctx.createGain();
      const inicio = agora + n.inicio;
      oscilador.type = n.forma ?? "sine";
      oscilador.frequency.value = n.freq * multiplo;
      ganho.gain.setValueAtTime(0.0001, inicio);
      ganho.gain.exponentialRampToValueAtTime(n.volume * peso, inicio + 0.012);
      ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + n.duracao);
      oscilador.connect(ganho).connect(saida);
      oscilador.start(inicio);
      oscilador.stop(inicio + n.duracao + 0.05);
    }
  }
}

const MI5 = 659.25;
const LA5 = 880;
const DO5 = 523.25;

/** Notas de cada som. No acerto, cada resposta certa seguida sobe um tom, até cinco tons acima. */
export function notasDe(som: Som, seguidas = 1): Nota[] {
  switch (som) {
    case "acerto": {
      const t = Math.min(Math.max(seguidas - 1, 0), 5) * 2;
      return [
        { freq: subir(MI5, t), inicio: 0, duracao: 0.22, volume: 0.32 },
        { freq: subir(LA5, t), inicio: 0.08, duracao: 0.4, volume: 0.32 },
        { freq: subir(LA5 * 2, t), inicio: 0.16, duracao: 0.3, volume: 0.08 },
      ];
    }
    case "erro":
      return [
        { freq: 220, inicio: 0, duracao: 0.22, volume: 0.3, forma: "triangle" },
        { freq: 174.6, inicio: 0.13, duracao: 0.36, volume: 0.3, forma: "triangle" },
      ];
    case "conclusao":
      return [
        { freq: DO5, inicio: 0, duracao: 0.22, volume: 0.28 },
        { freq: MI5, inicio: 0.1, duracao: 0.22, volume: 0.28 },
        { freq: 783.99, inicio: 0.2, duracao: 0.22, volume: 0.28 },
        { freq: DO5 * 2, inicio: 0.32, duracao: 0.8, volume: 0.3 },
        { freq: MI5 * 2, inicio: 0.32, duracao: 0.8, volume: 0.14 },
      ];
    case "celebracao":
      return [
        { freq: 392, inicio: 0, duracao: 0.16, volume: 0.26 },
        { freq: DO5, inicio: 0.12, duracao: 0.16, volume: 0.26 },
        { freq: MI5, inicio: 0.24, duracao: 0.16, volume: 0.26 },
        { freq: 783.99, inicio: 0.36, duracao: 0.3, volume: 0.28 },
        { freq: DO5 * 2, inicio: 0.56, duracao: 1, volume: 0.3 },
        { freq: MI5 * 2, inicio: 0.56, duracao: 1, volume: 0.16 },
        { freq: 130.81, inicio: 0.56, duracao: 1, volume: 0.22, forma: "triangle" },
      ];
  }
}

const VIBRACAO: Record<Som, number | number[]> = { acerto: 18, erro: [40, 60, 40], conclusao: [20, 40, 20, 40, 60], celebracao: [30, 50, 30, 50, 90] };

/** Toca um som e, nos aparelhos que permitem, vibra junto. Só é chamada com o som ligado. */
export function tocar(som: Som, seguidas = 1) {
  try {
    tocarNotas(notasDe(som, seguidas));
  } catch {
    // Som indisponível neste navegador: a lição segue sem ele.
  }
  try {
    navigator.vibrate?.(VIBRACAO[som]);
  } catch {
    // Sem vibração neste aparelho.
  }
}
