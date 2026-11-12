"use client";
// Preferências do perfil (F-31): nome, meta diária, fuso horário confirmável e som.
import { AlternarTema } from "@/componentes/Tema";
import { useActionState, useEffect, useRef, useState } from "react";
import { BotaoEnviar, Mensagens } from "@/componentes/formulario";
import { chamar } from "@/componentes/licao/motor";
import { NOMES_META } from "@/modulos/gamificacao/parametros";
import { excluirConta, salvarFuso, salvarMeta, salvarNome, type EstadoPreferencia } from "./acoes";

const FUSOS_COMUNS = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Cuiaba",
  "America/Belem",
  "America/Fortaleza",
  "America/Recife",
  "America/Bahia",
  "America/Rio_Branco",
  "America/Porto_Velho",
  "America/Boa_Vista",
  "America/Noronha",
  "Europe/Lisbon",
  "America/New_York",
  "Europe/London",
  "UTC",
];

const nomeFuso = (f: string) => f.replaceAll("_", " ");

type Props = { nome: string; meta: number; fuso: string; fusoPendente: string | null; som: boolean };

export function Preferencias({ nome, meta, fuso, fusoPendente, som: somInicial }: Props) {
  const [estadoNome, acaoNome] = useActionState<EstadoPreferencia, FormData>(salvarNome, {});
  const [estadoMeta, acaoMeta] = useActionState<EstadoPreferencia, FormData>(salvarMeta, {});
  const [estadoFuso, acaoFuso] = useActionState<EstadoPreferencia, FormData>(salvarFuso, {});
  const [som, setSom] = useState(somInicial);
  const [doNavegador, setDoNavegador] = useState<string | null>(null);
  const formMeta = useRef<HTMLFormElement>(null);

  // O fuso do navegador só existe depois da montagem; se for diferente, o perfil sugere a troca (4.6).
  useEffect(() => {
    const f = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (f) setDoNavegador(f);
  }, []);

  const fusoDesejado = fusoPendente ?? fuso;
  const opcoes = [...new Set([fuso, fusoDesejado, ...(doNavegador ? [doNavegador] : []), ...FUSOS_COMUNS])];

  async function alternarSom() {
    const novo = !som;
    setSom(novo);
    // Sem conexão ou com a escolha recusada pelo servidor, o interruptor volta ao que está gravado.
    if (!(await chamar("/api/perfil/som", { som: novo })).ok) setSom(!novo);
  }

  return (
    <section className="cartao pilha" aria-labelledby="titulo-preferencias">
      <h2 id="titulo-preferencias">Preferências</h2>

      <form action={acaoNome} className="campo">
        <label htmlFor="p-nome">Nome ou apelido</label>
        <div className="flex gap-2">
          <input id="p-nome" name="nome" className="min-w-0 flex-1" size={1} defaultValue={nome} maxLength={40} autoComplete="nickname" />
          <BotaoEnviar classe="botao botao-secundario botao-pequeno">Salvar</BotaoEnviar>
        </div>
        <Mensagens erro={estadoNome.erro} aviso={estadoNome.aviso} />
      </form>

      <form action={acaoMeta} ref={formMeta} className="campo">
        <label htmlFor="p-meta">Meta diária</label>
        <select id="p-meta" name="meta" defaultValue={meta} onChange={() => formMeta.current?.requestSubmit()}>
          {[1, 2, 3].map((n) => (
            <option key={n} value={n}>
              {NOMES_META[n].nome}: {n} {n === 1 ? "sessão" : "sessões"} por dia ({NOMES_META[n].tempo})
            </option>
          ))}
        </select>
        <p className="ajuda">Qualquer lição, prática ou revisão concluída conta para a meta.</p>
        <Mensagens erro={estadoMeta.erro} aviso={estadoMeta.aviso} />
      </form>

      <div className="alternador">
        <span id="rotulo-som" className="font-extrabold">
          Sons de acerto e erro
        </span>
        <button type="button" aria-pressed={som} aria-labelledby="rotulo-som" onClick={() => void alternarSom()} />
      </div>

      <AlternarTema />

      <form action={acaoFuso} className="campo">
        <label htmlFor="p-fuso">Fuso horário</label>
        <select id="p-fuso" name="fuso" defaultValue={fusoDesejado} key={fusoDesejado}>
          {opcoes.map((f) => (
            <option key={f} value={f}>
              {nomeFuso(f)}
            </option>
          ))}
        </select>
        {fusoPendente && <p className="ajuda">O fuso {nomeFuso(fusoPendente)} passa a valer no próximo dia de estudo.</p>}
        {doNavegador && doNavegador !== fusoDesejado && (
          <p className="mensagem-aviso">
            Seu aparelho está no fuso {nomeFuso(doNavegador)}. Se você mudou de lugar, escolha-o acima e salve.
          </p>
        )}
        <p className="ajuda">O dia de estudo vai da meia-noite às 23h59 no seu fuso. Uma mudança vale a partir do próximo dia.</p>
        <BotaoEnviar classe="botao botao-secundario">Salvar fuso</BotaoEnviar>
        <Mensagens erro={estadoFuso.erro} aviso={estadoFuso.aviso} />
      </form>

      <p className="ajuda">As animações seguem a configuração de movimento reduzido do seu aparelho.</p>
    </section>
  );
}

export function ExcluirConta() {
  const [aberto, setAberto] = useState(false);
  const [estado, acao] = useActionState<EstadoPreferencia, FormData>(excluirConta, {});
  if (!aberto) {
    return (
      <button type="button" className="botao botao-fantasma text-[var(--vermelho-texto)]" onClick={() => setAberto(true)}>
        Excluir conta
      </button>
    );
  }
  return (
    <form action={acao} className="cartao pilha border-[var(--vermelho-tint)]">
      <h3>Excluir sua conta?</h3>
      <p>Seu progresso, XP, sequência e conquistas serão apagados, e o login deixará de funcionar. Isso não pode ser desfeito.</p>
      <div className="campo">
        <label htmlFor="confirmacao">Digite EXCLUIR para confirmar</label>
        <input id="confirmacao" name="confirmacao" autoComplete="off" required />
      </div>
      <Mensagens erro={estado.erro} />
      <BotaoEnviar classe="botao botao-perigo">Excluir conta</BotaoEnviar>
      <button type="button" className="botao botao-secundario" onClick={() => setAberto(false)}>
        Cancelar
      </button>
    </form>
  );
}
