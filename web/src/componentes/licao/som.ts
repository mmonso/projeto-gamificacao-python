// Sons próprios, gerados no navegador (design/DESIGN.md: decisões de interação). Sem arquivos de áudio.
type Som = "acerto" | "erro" | "conclusao";

const NOTAS: Record<Som, number[]> = { acerto: [660, 880], erro: [262, 196], conclusao: [523, 659, 784, 1047] };

let contexto: AudioContext | undefined;

export function tocar(som: Som) {
  try {
    contexto ??= new AudioContext();
    if (contexto.state === "suspended") void contexto.resume();
    NOTAS[som].forEach((frequencia, i) => {
      const oscilador = contexto!.createOscillator();
      const ganho = contexto!.createGain();
      const inicio = contexto!.currentTime + i * 0.11;
      oscilador.type = som === "erro" ? "triangle" : "sine";
      oscilador.frequency.value = frequencia;
      ganho.gain.setValueAtTime(0.0001, inicio);
      ganho.gain.exponentialRampToValueAtTime(0.14, inicio + 0.02);
      ganho.gain.exponentialRampToValueAtTime(0.0001, inicio + 0.24);
      oscilador.connect(ganho).connect(contexto!.destination);
      oscilador.start(inicio);
      oscilador.stop(inicio + 0.3);
    });
  } catch {
    // Som indisponível neste navegador: a lição segue sem ele.
  }
}
