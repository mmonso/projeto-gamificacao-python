/* Protótipo navegável do MVP (E03.6).
 *
 * Simula no navegador o que, no produto, é feito pelo servidor: correção,
 * XP, corações e sequência. Serve para avaliar a experiência, não a arquitetura.
 * Parâmetros de URL só para testes: ?simular=falha e ?movimento=reduzido.
 */
(function () {
  "use strict";

  const UNIDADES = window.CONTEUDO.unidades;
  const LICOES = UNIDADES[0].licoes;
  const EXERCICIOS = {};
  LICOES.forEach((l) => [...l.exercicios, ...(l.revisao || [])].forEach((ex) => (EXERCICIOS[ex.id] = ex)));

  const params = new URLSearchParams(location.search);
  if (params.get("movimento") === "reduzido") document.documentElement.classList.add("movimento-reduzido");
  const SIMULAR_FALHA = params.get("simular") === "falha";

  const app = document.getElementById("app");
  const CHAVE = "sibi-prototipo-v1";
  const PADRAO = {
    nome: "", meta: 1, introPasso: 0, conta: false, demo: null,
    coracoes: 5, xp: 0, sessoesHoje: 0, praticasRecompensadas: 0, sequencia: 0, maiorSequencia: 0,
    concluidas: [], conquistas: [], som: true, sessoes: {}, resultado: null, transferenciaPendente: false,
  };
  let estado = carregar();
  let acoes = {};
  let sessao = null;
  let falhaSimulada = false;

  function carregar() {
    try {
      const salvo = localStorage.getItem(CHAVE);
      return salvo ? { ...PADRAO, ...JSON.parse(salvo) } : { ...PADRAO };
    } catch (e) {
      return { ...PADRAO };
    }
  }
  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) { /* armazenamento indisponível */ }
  }

  /* Utilidades */

  function esc(t) {
    return String(t).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function anunciar(msg) {
    const el = document.getElementById("anuncio");
    el.textContent = "";
    setTimeout(() => (el.textContent = msg), 50);
  }
  let toastTimer;
  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => (el.hidden = true), 3200);
  }
  function licaoPorId(id) { return LICOES.find((l) => l.id === id); }
  function plural(n, um, varios) { return n === 1 ? um : varios; }

  const ICONES = {
    coracao: '<path d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z" fill="currentColor"/>',
    chama: '<path d="M12 2c1 3.2 4.6 5.4 4.6 10a4.6 4.6 0 0 1-9.2 0c0-2.1 1-3.5 2.1-4.6.2 1.7 1 2.8 2.2 3.3C11 8.5 10.9 5 12 2z" fill="currentColor"/><path d="M12 22a7 7 0 0 1-7-7c0-3.2 2-5.4 3.4-6.9" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    raio: '<path d="M13.5 2 4 13.5h7L9.5 22 20 9.5h-7L13.5 2z" fill="currentColor"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
    x: '<path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>',
    cadeado: '<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" fill="none" stroke="currentColor" stroke-width="2.5"/>',
    estrela: '<path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3-4.6-4.4 6.3-.9L12 2.8z" fill="currentColor"/>',
    trofeu: '<path d="M7 3h10v5a5 5 0 0 1-10 0V3z" fill="currentColor"/><path d="M7 5H4v1.5A3.5 3.5 0 0 0 7.5 10M17 5h3v1.5a3.5 3.5 0 0 1-3.5 3.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="M10 13h4v3h2v4H8v-4h2v-3z" fill="currentColor"/>',
    revisao: '<path d="M20 12a8 8 0 1 1-2.4-5.7M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
    casa: '<path d="M4 11 12 4l8 7v9h-5v-6H9v6H4v-9z" fill="currentColor"/>',
    halter: '<path d="M3 10v4M6 7v10M18 7v10M21 10v4M6 12h12" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
    pessoa: '<circle cx="12" cy="8" r="4" fill="currentColor"/><path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7H4z" fill="currentColor"/>',
    lampada: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    som: '<path d="M4 9h4l5-4v14l-5-4H4V9z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    semSom: '<path d="M4 9h4l5-4v14l-5-4H4V9z" fill="currentColor"/><path d="m16 9 5 6M21 9l-5 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
    alerta: '<path d="M12 3 2 20h20L12 3z" fill="currentColor"/><path d="M12 9v5M12 17v.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>',
    semRede: '<path d="M2 8.5a15 15 0 0 1 20 0M5.5 12a10 10 0 0 1 13 0M9 15.5a5 5 0 0 1 6 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><path d="M3 3l18 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>',
    play: '<path d="M8 5v14l11-7L8 5z" fill="currentColor"/>',
    seta: '<path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  function icone(nome, classe) {
    return `<svg class="icone ${classe || ""}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONES[nome]}</svg>`;
  }

  const DESCRICAO_MASCOTE = {
    incentivo: "Sibi, a cobrinha, sorrindo",
    comemoracao: "Sibi, a cobrinha, comemorando",
    atencao: "Sibi, a cobrinha, com expressão preocupada",
    descanso: "Sibi, a cobrinha, dormindo",
  };
  function mascote(humor, classe) {
    const olhos = {
      incentivo: '<circle cx="76" cy="34" r="6" fill="#fff"/><circle cx="94" cy="34" r="6" fill="#fff"/><circle cx="77.5" cy="35" r="3" fill="#1E2A32"/><circle cx="95.5" cy="35" r="3" fill="#1E2A32"/>',
      comemoracao: '<path d="M70 36q6-8 12 0M88 36q6-8 12 0" fill="none" stroke="#1E2A32" stroke-width="3.2" stroke-linecap="round"/>',
      atencao: '<circle cx="76" cy="35" r="6.5" fill="#fff"/><circle cx="94" cy="35" r="6.5" fill="#fff"/><circle cx="76" cy="36" r="3" fill="#1E2A32"/><circle cx="94" cy="36" r="3" fill="#1E2A32"/><path d="M69 25l12 3M101 25l-12 3" stroke="#1E2A32" stroke-width="3" stroke-linecap="round"/>',
      descanso: '<path d="M70 36q6 5 12 0M88 36q6 5 12 0" fill="none" stroke="#1E2A32" stroke-width="3" stroke-linecap="round"/>',
    }[humor];
    const boca = {
      incentivo: '<path d="M77 46q8 7 16 0" fill="none" stroke="#1E2A32" stroke-width="3" stroke-linecap="round"/>',
      comemoracao: '<path d="M75 44q10 13 20 0z" fill="#B3263A"/><path d="M85 52v9l-3 3M85 61l3 3" fill="none" stroke="#D93A3A" stroke-width="2.2" stroke-linecap="round"/>',
      atencao: '<ellipse cx="85" cy="48" rx="4" ry="5" fill="#1E2A32"/>',
      descanso: '<path d="M80 47h10" stroke="#1E2A32" stroke-width="3" stroke-linecap="round"/>',
    }[humor];
    const extra = {
      incentivo: "",
      comemoracao: '<path d="M30 20l3 7 7 3-7 3-3 7-3-7-7-3 7-3z" fill="#FFC23D"/><path d="M110 64l2 4.5 4.5 2-4.5 2-2 4.5-2-4.5-4.5-2 4.5-2z" fill="#FFC23D"/>',
      atencao: '<rect x="104" y="6" width="12" height="24" rx="6" fill="#D93A3A"/><circle cx="110" cy="23" r="2.5" fill="#fff"/><rect x="108.5" y="10" width="3" height="9" rx="1.5" fill="#fff"/>',
      descanso: '<text x="104" y="22" font-family="Nunito, sans-serif" font-weight="900" font-size="15" fill="#55636D">z</text><text x="112" y="12" font-family="Nunito, sans-serif" font-weight="900" font-size="11" fill="#55636D">z</text>',
    }[humor];
    return `<svg class="${classe || "mascote-medio"}" viewBox="0 0 120 120" role="img" aria-label="${DESCRICAO_MASCOTE[humor]}">
      <path d="M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4" fill="none" stroke="#12592F" stroke-width="22" stroke-linecap="round"/>
      <path d="M16 104c0-16 26-14 34-26s-6-24 8-34c8-6 18-4 22-4" fill="none" stroke="#2FA85E" stroke-width="17" stroke-linecap="round"/>
      <circle cx="30" cy="96" r="2.6" fill="#1B7F45"/><circle cx="47" cy="82" r="2.6" fill="#1B7F45"/><circle cx="52" cy="58" r="2.6" fill="#1B7F45"/>
      <ellipse cx="85" cy="38" rx="25" ry="22" fill="#12592F"/>
      <ellipse cx="85" cy="37" rx="23" ry="20" fill="#2FA85E"/>
      <ellipse cx="70" cy="45" rx="4" ry="2.6" fill="#F7A8B8"/><ellipse cx="100" cy="45" rx="4" ry="2.6" fill="#F7A8B8"/>
      ${olhos}${boca}${extra}
    </svg>`;
  }

  /* Som próprio, gerado no navegador */

  let audio;
  function tocar(tipo) {
    if (!estado.som) return;
    try {
      audio = audio || new (window.AudioContext || window.webkitAudioContext)();
      const notas = { acerto: [660, 880], erro: [262, 196], conclusao: [523, 659, 784, 1047] }[tipo];
      notas.forEach((f, i) => {
        const o = audio.createOscillator();
        const g = audio.createGain();
        const t = audio.currentTime + i * 0.11;
        o.type = tipo === "erro" ? "triangle" : "sine";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.14, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.24);
        o.connect(g).connect(audio.destination);
        o.start(t);
        o.stop(t + 0.3);
      });
    } catch (e) { /* som indisponível */ }
  }

  /* Rotas */

  const ROTAS = {
    "": telaApresentacao,
    introducao: telaIntroducao,
    licao: telaLicao,
    resultado: telaResultado,
    cadastro: telaCadastro,
    "verificar-email": telaVerificarEmail,
    entrar: telaEntrar,
    recuperar: telaRecuperar,
    aprender: telaAprender,
    praticar: telaPraticar,
    perfil: telaPerfil,
    "sem-coracoes": telaSemCoracoes,
    componentes: telaComponentes,
  };

  function rotaAtual() {
    const partes = location.hash.replace(/^#\/?/, "").split("/");
    return { nome: partes[0] || "", param: partes.slice(1).join("/") };
  }
  function ir(destino) {
    if (location.hash === "#/" + destino) render();
    else location.hash = "/" + destino;
  }

  function render(opcoes) {
    const manterRolagem = opcoes && opcoes.manterRolagem;
    fecharModal();
    acoes = {};
    const r = rotaAtual();
    (ROTAS[r.nome] || telaApresentacao)(r.param);
    if (!manterRolagem) window.scrollTo(0, 0);
    const titulo = app.querySelector("h1");
    if (titulo) {
      titulo.setAttribute("tabindex", "-1");
      titulo.focus({ preventScroll: true });
    }
  }

  app.addEventListener("click", (e) => {
    const alvo = e.target.closest("[data-acao]");
    if (!alvo || alvo.disabled || !app.contains(alvo)) return;
    const fn = acoes[alvo.dataset.acao];
    if (fn) {
      e.preventDefault();
      fn(alvo);
    }
  });
  document.body.addEventListener("click", (e) => {
    const alvo = e.target.closest(".modal [data-acao], .celebracao [data-acao]");
    if (alvo && acoes[alvo.dataset.acao]) {
      e.preventDefault();
      acoes[alvo.dataset.acao](alvo);
    }
    if (e.target.closest(".pular")) {
      e.preventDefault();
      const alvoPrincipal = document.getElementById("conteudo-principal");
      if (alvoPrincipal) { alvoPrincipal.setAttribute("tabindex", "-1"); alvoPrincipal.focus(); }
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (document.querySelector(".fundo-modal")) { fecharModal(); return; }
      const balao = app.querySelector(".balao-no");
      if (balao) { balaoAberto = null; render({ manterRolagem: true }); }
    }
    if (e.key === "Enter" && !e.repeat) {
      const t = e.target;
      const interativo = t.closest && t.closest("button, a, input, select, textarea, [role=dialog]");
      if (interativo) return;
      const principal = document.querySelector("[data-primario]:not(:disabled)");
      if (principal) { e.preventDefault(); principal.click(); }
    }
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("offline", () => mostrarOffline(true));
  window.addEventListener("online", () => mostrarOffline(false));
  function mostrarOffline(sim) {
    let faixa = document.querySelector(".faixa-offline");
    if (sim && !faixa) {
      faixa = document.createElement("div");
      faixa.className = "faixa-offline";
      faixa.setAttribute("role", "status");
      faixa.innerHTML = `${icone("semRede")} Sem conexão. Suas respostas ficam guardadas até a conexão voltar.`;
      document.body.prepend(faixa);
    }
    if (!sim && faixa) faixa.remove();
  }

  /* Modal */

  function abrirModal(html, rotulo) {
    fecharModal();
    const fundo = document.createElement("div");
    fundo.className = "fundo-modal";
    fundo.innerHTML = `<div class="modal surgir" role="dialog" aria-modal="true" aria-labelledby="titulo-modal" aria-label="${esc(rotulo || "")}">${html}</div>`;
    document.body.appendChild(fundo);
    const primeiro = fundo.querySelector("button, input");
    if (primeiro) primeiro.focus();
    fundo.addEventListener("click", (e) => { if (e.target === fundo) fecharModal(); });
    fundo.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focaveis = [...fundo.querySelectorAll("button, input, a[href]")];
      const ultimo = focaveis[focaveis.length - 1];
      if (e.shiftKey && document.activeElement === focaveis[0]) { e.preventDefault(); ultimo.focus(); }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); focaveis[0].focus(); }
    });
  }
  function fecharModal() {
    document.querySelectorAll(".fundo-modal, .celebracao").forEach((el) => el.remove());
  }

  /* Estrutura com navegação */

  function indicadores() {
    return `<div class="indicadores" aria-label="Seus indicadores">
      <span class="indicador indicador-sequencia" title="Sequência">${icone("chama")}<span>${estado.sequencia}</span><span class="so-leitor">${plural(estado.sequencia, "dia de sequência", "dias de sequência")}</span></span>
      <span class="indicador indicador-coracoes" title="Corações">${icone("coracao")}<span>${estado.coracoes}</span><span class="so-leitor">corações</span></span>
      <span class="indicador indicador-xp" title="XP">${icone("raio")}<span>${estado.xp}</span><span class="so-leitor">XP</span></span>
    </div>`;
  }

  function itensNav(atual) {
    return [["aprender", "Aprender", "casa"], ["praticar", "Praticar", "halter"], ["perfil", "Perfil", "pessoa"]]
      .map(([r, nome, ic]) => `<a class="nav-item" href="#/${r}" ${atual === r ? 'aria-current="page"' : ""}>${icone(ic)}<span>${nome}</span></a>`)
      .join("");
  }

  function painelLateral() {
    const metaFeita = Math.min(estado.sessoesHoje, estado.meta);
    return `<aside class="painel" aria-label="Seu progresso">
      ${indicadores()}
      <div class="cartao">
        <h3><span class="indicador-sequencia">${icone("chama")}</span> Sequência</h3>
        <p>${estado.sequencia ? `${estado.sequencia} ${plural(estado.sequencia, "dia seguido", "dias seguidos")}. Estude hoje para manter.` : "Conclua uma lição para começar sua sequência."}</p>
      </div>
      <div class="cartao">
        <h3><span class="indicador-sequencia">${icone("estrela")}</span> Meta do dia</h3>
        <p>${metaFeita} de ${estado.meta} ${plural(estado.meta, "lição", "lições")}</p>
        <div class="progresso-meta" role="progressbar" aria-label="Meta do dia" aria-valuemin="0" aria-valuemax="${estado.meta}" aria-valuenow="${metaFeita}"><span style="width:${(metaFeita / estado.meta) * 100}%"></span></div>
      </div>
      <div class="cartao">
        <h3><span class="indicador-coracoes">${icone("coracao")}</span> Corações</h3>
        <p>${estado.coracoes} de 5.${estado.coracoes < 5 ? ' <a href="#/praticar">Recuperar com uma revisão</a>' : " Seus corações estão cheios."}</p>
      </div>
    </aside>`;
  }

  function comNavegacao(atual, conteudo) {
    app.innerHTML = `<div class="layout">
      <nav class="nav-lateral" aria-label="Navegação principal"><p class="marca">Sibi</p>${itensNav(atual)}</nav>
      <div class="coluna-central">
        <header class="barra-topo so-celular"><p class="marca" style="font-size:1.4rem">Sibi</p>${indicadores()}</header>
        <main class="principal" id="conteudo-principal">${conteudo}</main>
      </div>
      ${painelLateral()}
      <nav class="nav-inferior" aria-label="Navegação principal">${itensNav(atual)}</nav>
    </div>`;
  }

  /* FL-01 — Apresentação e introdução */

  function telaApresentacao() {
    const demoPronta = estado.demo && estado.demo.concluida && !estado.conta;
    app.innerHTML = `<main class="tela-centro centro" id="conteudo-principal">
      ${mascote("incentivo", "mascote-grande")}
      <h1 class="marca">Sibi</h1>
      <p class="subtitulo">Aprenda Python do zero, com lições de 5 minutos por dia.</p>
      ${demoPronta ? `<div class="aviso-conta" style="text-align:left">${mascote("comemoracao", "mascote-pequeno")}<div><p>Você já concluiu a primeira lição. Crie uma conta para salvar seu progresso.</p></div></div>` : ""}
      <div class="acoes">
        ${demoPronta
          ? '<button class="botao" data-acao="criarConta" data-primario>Criar conta para salvar</button>'
          : `<button class="botao" data-acao="comecar" data-primario>${estado.conta ? "Continuar" : "Começar"}</button>`}
        <button class="botao botao-secundario" data-acao="entrar">Já tenho conta</button>
      </div>
      <p class="ajuda"><a href="#/componentes">Ver componentes e estados do protótipo</a></p>
    </main>`;
    acoes.comecar = () => ir(estado.conta ? "aprender" : "introducao");
    acoes.criarConta = () => ir("cadastro");
    acoes.entrar = () => ir("entrar");
  }

  function telaIntroducao() {
    const passo = estado.introPasso || 0;
    let corpo;
    if (passo === 0) {
      corpo = `${mascote("incentivo")}
        <h1>Oi! Eu sou o Sibi.</h1>
        <p class="subtitulo">Vou acompanhar você nos primeiros passos em Python. Como posso te chamar?</p>
        <div class="campo"><label for="nome">Seu nome ou apelido (opcional)</label>
          <input id="nome" autocomplete="given-name" maxlength="40" value="${esc(estado.nome)}"></div>
        <div class="acoes"><button class="botao" data-acao="avancar" data-primario>Continuar</button></div>`;
    } else if (passo === 1) {
      const opcoes = [[1, "Leve", "1 lição por dia, cerca de 5 minutos"], [2, "Regular", "2 lições por dia, cerca de 10 minutos"], [3, "Intensa", "3 lições por dia, cerca de 15 minutos"]];
      corpo = `<h1>Qual vai ser sua meta diária?</h1>
        <p class="subtitulo">Você pode mudar depois, no perfil.</p>
        <div class="opcoes" role="group" aria-label="Meta diária">
          ${opcoes.map(([n, nome, desc]) => `<button class="opcao" data-acao="meta" data-valor="${n}" aria-pressed="${estado.meta === n}">
            <span class="opcao-texto"><strong>${nome}</strong><br><span style="font-weight:600;color:var(--texto-suave)">${desc}</span></span></button>`).join("")}
        </div>
        <div class="acoes"><button class="botao" data-acao="avancar" data-primario>Continuar</button></div>`;
    } else {
      corpo = `${mascote("comemoracao")}
        <h1>${estado.nome ? `Tudo pronto, ${esc(estado.nome)}!` : "Tudo pronto!"}</h1>
        <p class="subtitulo">Sua trilha tem lições curtas. Em cada uma, você responde alguns exercícios e recebe ajuda quando errar. Vamos à primeira?</p>
        <div class="acoes"><button class="botao" data-acao="iniciar" data-primario>Começar a lição</button>
        <button class="botao botao-fantasma" data-acao="voltar">Voltar</button></div>`;
    }
    app.innerHTML = `<main class="tela-centro" id="conteudo-principal">
      <button class="botao-icone" data-acao="voltar" aria-label="Voltar">${icone("seta")}</button>
      ${corpo}</main>`;
    acoes.voltar = () => {
      if (passo === 0) ir("");
      else { estado.introPasso = passo - 1; salvar(); render(); }
    };
    acoes.meta = (el) => {
      estado.meta = Number(el.dataset.valor);
      salvar();
      app.querySelectorAll("[data-acao=meta]").forEach((b) => b.setAttribute("aria-pressed", b === el));
    };
    acoes.avancar = () => {
      const campo = document.getElementById("nome");
      if (campo) estado.nome = campo.value.trim();
      estado.introPasso = passo + 1;
      salvar();
      render();
    };
    acoes.iniciar = () => ir("licao/u1-l1");
  }

  /* Motor de lição (FL-03, FL-04, FL-05, FL-06) */

  function modoDaLicao(id) {
    if (id === "recuperacao") return "recuperacao";
    if (!estado.conta) return "demo";
    if (id === "revisao" || estado.concluidas.includes(id)) return "pratica";
    return "principal";
  }

  function montarFila(id, modo) {
    if (modo === "recuperacao" || id === "revisao") {
      const abertas = Object.values(estado.sessoes).map((s) => s.id);
      const vistas = LICOES.filter((l) => estado.concluidas.includes(l.id) || abertas.includes(l.id) || l.id === "u1-l1");
      const itens = [...vistas.flatMap((l) => l.revisao || []), ...vistas.flatMap((l) => l.exercicios)].map((ex) => ex.id);
      return (modo === "recuperacao" ? itens.slice(0, 5) : itens.slice(0, 8));
    }
    return licaoPorId(id).exercicios.map((ex) => ex.id);
  }

  function obterSessao(id) {
    const modo = modoDaLicao(id);
    const chave = `${id}:${modo}`;
    if (!estado.sessoes[chave]) {
      const fila = montarFila(id, modo);
      estado.sessoes[chave] = { chave, id, modo, fila, total: fila.length, resolvidos: 0, acertosPrimeira: 0, errados: [], dicas: {}, pausada: false };
      salvar();
    }
    const salva = estado.sessoes[chave];
    return { ...salva, exercicioId: salva.fila[0], resposta: null, fase: "respondendo", dicasVisiveis: 0, resultado: null, erroEnvio: false };
  }

  function telaLicao(id) {
    if (id !== "recuperacao" && id !== "revisao" && !licaoPorId(id)) return ir("aprender");
    if (id !== "u1-l1" && id !== "recuperacao" && !estado.conta) return ir("aprender");
    const modo = modoDaLicao(id);
    if (modo === "principal" && estado.coracoes === 0) return ir("sem-coracoes");
    app.innerHTML = `<div class="licao"><main class="licao-corpo" id="conteudo-principal">
      <h1 class="so-leitor">Carregando a lição</h1>
      <div class="carregando" aria-busy="true">
        <div class="esqueleto" style="height:18px;width:40%"></div>
        <div class="esqueleto" style="height:28px;width:85%"></div>
        <div class="esqueleto" style="height:96px"></div>
        <div class="esqueleto" style="height:56px"></div>
        <div class="esqueleto" style="height:56px"></div>
      </div></main></div>`;
    setTimeout(() => {
      if (rotaAtual().nome !== "licao") return;
      sessao = obterSessao(id);
      desenharExercicio(true);
    }, 250);
  }

  // O exercício em tela fica fixo até o aluno tocar em Continuar, mesmo depois de a fila andar.
  function exercicioAtual() { return EXERCICIOS[sessao.exercicioId]; }

  function nomeTipo(tipo) {
    return { escolher_resultado: "Escolha o resultado", completar_lacuna: "Complete o código", ordenar_blocos: "Monte o programa", localizar_erro: "Encontre o erro" }[tipo];
  }

  function realcar(codigo) {
    const partes = String(codigo).split(/("[^"\n]*"?|'[^'\n]*'?|\b\d+\b|\bprint\b|___\d___)/g);
    return partes.map((p, i) => {
      if (i % 2 === 0 || !p) return esc(p);
      if (/^___\d___$/.test(p)) return p;
      if (p === "print") return `<span class="t-kw">${p}</span>`;
      if (/^\d+$/.test(p)) return `<span class="t-num">${p}</span>`;
      return `<span class="t-str">${esc(p)}</span>`;
    }).join("");
  }

  function blocoSaida(texto, rotulo) {
    return `<p class="rotulo-bloco">${rotulo || "Saída esperada"}</p><pre class="saida">${esc(texto)}</pre>`;
  }

  function respostaCompleta(ex, r) {
    if (r == null) return false;
    if (ex.tipo === "completar_lacuna") return ex.lacunas.every((lc) => r[lc.id] != null);
    if (ex.tipo === "ordenar_blocos") return r.length > 0;
    return true;
  }

  function corrigir(ex, r) {
    switch (ex.tipo) {
      case "escolher_resultado": return r === ex.resposta;
      case "completar_lacuna": return ex.lacunas.every((lc) => r[lc.id] === lc.resposta);
      case "ordenar_blocos": return ex.resposta.some((seq) => seq.join("|") === r.join("|"));
      case "localizar_erro": return r === ex.resposta;
    }
    return false;
  }

  function areaExercicio(ex) {
    const r = sessao.resposta;
    const bloqueado = sessao.fase !== "respondendo" ? "disabled" : "";
    let html = "";
    if (ex.tipo === "escolher_resultado") {
      if (ex.codigo) html += `<pre class="codigo">${realcar(ex.codigo)}</pre>`;
      if (ex.opcoes_sao === "codigo") html += blocoSaida(ex.saida_esperada);
      html += `<div class="opcoes" role="group" aria-label="Opções">` + ex.opcoes.map((o, i) => {
        const letra = String.fromCharCode(65 + i);
        let conteudo;
        if (o.erro) conteudo = `<span class="opcao-texto">O programa mostra um erro</span>`;
        else if (ex.opcoes_sao === "codigo") conteudo = `<span class="codigo bloco-pre">${realcar(o.texto)}</span>`;
        else if (ex.opcoes_sao === "saida") conteudo = `<span class="saida bloco-pre">${esc(o.texto)}</span>`;
        else conteudo = `<span class="opcao-texto">${esc(o.texto)}</span>`;
        return `<button class="opcao" data-acao="escolher" data-valor="${esc(o.id)}" aria-pressed="${r === o.id}" ${bloqueado}><span class="opcao-letra" aria-hidden="true">${letra}</span>${conteudo}</button>`;
      }).join("") + "</div>";
    } else if (ex.tipo === "completar_lacuna") {
      let codigo = realcar(ex.codigo);
      ex.lacunas.forEach((lc) => {
        const valor = r && r[lc.id];
        codigo = codigo.replace(`___${lc.id}___`, `<span class="lacuna ${valor ? "preenchida" : ""}">${valor ? esc(valor) : `&nbsp;${lc.id}&nbsp;`}</span>`);
      });
      html += `<pre class="codigo">${codigo}</pre>${blocoSaida(ex.saida_esperada)}`;
      html += ex.lacunas.map((lc) => `<div class="grupo-lacuna" role="group" aria-label="Opções para a lacuna ${lc.id}">
        <p class="rotulo-bloco">${ex.lacunas.length > 1 ? `Lacuna ${lc.id}` : "Escolha o que falta"}</p>
        <div class="fichas">${lc.opcoes.map((o) => `<button class="ficha" data-acao="lacuna" data-lacuna="${esc(lc.id)}" data-valor="${esc(o)}" aria-pressed="${!!(r && r[lc.id] === o)}" ${bloqueado}>${esc(o)}</button>`).join("")}</div></div>`).join("");
    } else if (ex.tipo === "ordenar_blocos") {
      const escolhidos = r || [];
      html += blocoSaida(ex.saida_esperada);
      html += `<p class="rotulo-bloco" id="rotulo-montagem">Seu programa</p><div class="area-montagem" aria-labelledby="rotulo-montagem">`;
      if (ex.codigo_antes) html += `<div class="linhas-fixas" aria-label="Linhas fixas">${esc(ex.codigo_antes)}</div>`;
      html += escolhidos.length
        ? escolhidos.map((bid, i) => {
            const b = ex.blocos.find((x) => x.id === bid);
            return `<button class="bloco escolhido" data-acao="removerBloco" data-valor="${esc(bid)}" aria-label="Linha ${i + 1}: ${esc(b.codigo)}. Remover" ${bloqueado}><span class="numero" aria-hidden="true">${i + 1}</span>${realcar(b.codigo)}</button>`;
          }).join("")
        : `<p class="vazio">Toque ou pressione Enter nos blocos abaixo, na ordem certa.</p>`;
      if (ex.codigo_depois) html += `<div class="linhas-fixas">${esc(ex.codigo_depois)}</div>`;
      html += `</div><p class="rotulo-bloco">Blocos disponíveis</p><div class="banco">`;
      html += ex.blocos.filter((b) => !escolhidos.includes(b.id))
        .map((b) => `<button class="bloco" data-acao="adicionarBloco" data-valor="${esc(b.id)}" aria-label="Adicionar: ${esc(b.codigo)}" ${bloqueado}>${realcar(b.codigo)}</button>`).join("");
      html += "</div>";
    } else if (ex.tipo === "localizar_erro") {
      if (ex.erro === "saida_incorreta") html += blocoSaida(ex.saida_esperada);
      html += `<div class="linhas-codigo" role="group" aria-label="Linhas do programa">` + ex.codigo.split("\n").map((linha, i) =>
        `<button class="linha-codigo" data-acao="linha" data-valor="${i + 1}" aria-pressed="${r === i + 1}" aria-label="Linha ${i + 1}: ${esc(linha)}" ${bloqueado}><span class="numero" aria-hidden="true">${i + 1}</span><span>${realcar(linha)}</span></button>`).join("") + "</div>";
    }
    const dicas = ex.dicas.slice(0, sessao.dicasVisiveis);
    if (dicas.length) {
      html += `<div class="dicas" aria-live="polite">${dicas.map((d, i) => `<div class="dica">${icone("lampada")}<span><strong>Dica ${i + 1}:</strong> ${esc(d)}</span></div>`).join("")}</div>`;
    }
    return html;
  }

  function respostaCorretaHtml(ex) {
    switch (ex.tipo) {
      case "escolher_resultado": {
        const o = ex.opcoes.find((x) => x.id === ex.resposta);
        if (o.erro) return "<p>O programa mostra um erro.</p>";
        return ex.opcoes_sao === "codigo" ? `<pre class="codigo">${realcar(o.texto)}</pre>` : `<pre class="saida">${esc(o.texto)}</pre>`;
      }
      case "completar_lacuna": {
        let c = ex.codigo;
        ex.lacunas.forEach((lc) => (c = c.replace(`___${lc.id}___`, lc.resposta)));
        return `<pre class="codigo">${realcar(c)}</pre>`;
      }
      case "ordenar_blocos": {
        const seq = ex.resposta[0].map((id) => ex.blocos.find((b) => b.id === id).codigo);
        return `<pre class="codigo">${realcar([ex.codigo_antes, ...seq, ex.codigo_depois].filter(Boolean).join("\n"))}</pre>`;
      }
      case "localizar_erro":
        return `<p>Linha ${ex.resposta}. Correção:</p><pre class="codigo">${realcar(ex.correcao)}</pre>`;
    }
    return "";
  }

  function rodape(ex) {
    if (sessao.fase === "feedback") {
      const res = sessao.resultado;
      const opcao = ex.tipo === "escolher_resultado" && !res.correta ? ex.opcoes.find((o) => o.id === sessao.resposta) : null;
      const volta = !res.correta;
      return `<div class="rodape-licao ${res.correta ? "acerto" : "erro"}"><div class="rodape-conteudo surgir">
        <div class="feedback" id="feedback">
          <p class="feedback-titulo" tabindex="-1"><span class="selo">${icone(res.correta ? "check" : "x")}</span>${res.correta ? res.titulo : "Ainda não."}</p>
          ${opcao && opcao.feedback ? `<p class="feedback-texto"><strong>${esc(opcao.feedback)}</strong></p>` : ""}
          ${!res.correta ? `<div class="feedback-resposta"><p class="rotulo-bloco">Resposta correta</p>${respostaCorretaHtml(ex)}</div>` : ""}
          <p class="feedback-texto">${esc(ex.explicacao)}</p>
          ${volta ? '<p class="retorno-aviso">Este exercício volta no fim da lição.</p>' : ""}
          ${res.perdeuCoracao ? `<p class="retorno-aviso">${icone("coracao", "icone-pequeno")} Você perdeu um coração. Restam ${estado.coracoes}.</p>` : ""}
        </div>
        <button class="botao" data-acao="continuar" data-primario>Continuar</button>
      </div></div>`;
    }
    const pronto = respostaCompleta(ex, sessao.resposta);
    const restantes = ex.dicas.length - sessao.dicasVisiveis;
    return `<div class="rodape-licao"><div class="rodape-conteudo">
      ${sessao.erroEnvio ? `<p class="erro-envio" role="alert">${icone("semRede")} Não foi possível verificar agora. Sua resposta foi guardada.</p>` : ""}
      <div class="rodape-acoes">
        <button class="botao botao-secundario botao-dica" data-acao="dica" ${restantes > 0 && sessao.fase === "respondendo" ? "" : "disabled"}>${icone("lampada")} Dica${restantes > 0 ? ` (${restantes})` : ""}</button>
      </div>
      <button class="botao" data-acao="verificar" data-primario ${pronto && sessao.fase === "respondendo" ? "" : "disabled"}>${sessao.fase === "verificando" ? "Verificando…" : sessao.erroEnvio ? "Tentar novamente" : "Verificar"}</button>
    </div></div>`;
  }

  function desenharExercicio(focarEnunciado) {
    const ex = exercicioAtual();
    const progresso = Math.round((sessao.resolvidos / sessao.total) * 100);
    const titulo = { demo: "Demonstração", principal: licaoPorId(sessao.id) ? licaoPorId(sessao.id).titulo : "", pratica: "Prática", recuperacao: "Recuperar corações" }[sessao.modo];
    app.innerHTML = `<div class="licao">
      <header class="licao-topo">
        <button class="botao-icone" data-acao="sair" aria-label="Sair da lição">${icone("x")}</button>
        <div class="barra-progresso" role="progressbar" aria-label="Progresso da lição" aria-valuemin="0" aria-valuemax="${sessao.total}" aria-valuenow="${sessao.resolvidos}"><span style="width:${progresso}%"></span></div>
        <button class="botao-icone" data-acao="som" aria-label="${estado.som ? "Desligar som" : "Ligar som"}" aria-pressed="${estado.som}">${icone(estado.som ? "som" : "semSom")}</button>
        ${sessao.modo === "principal" ? `<span class="indicador indicador-coracoes">${icone("coracao")}<span>${estado.coracoes}</span><span class="so-leitor">corações</span></span>` : ""}
      </header>
      <main class="licao-corpo" id="conteudo-principal">
        <p class="etiqueta-tipo">${esc(titulo)} · ${nomeTipo(ex.tipo)}</p>
        <h1 id="enunciado">${esc(ex.enunciado)}</h1>
        ${areaExercicio(ex)}
      </main>
      ${rodape(ex)}
    </div>`;
    ligarAcoesLicao(ex);
    if (focarEnunciado) {
      const h = document.getElementById("enunciado");
      h.setAttribute("tabindex", "-1");
      h.focus({ preventScroll: true });
    }
  }

  function redesenharMantendoFoco() {
    const ativo = document.activeElement;
    const seletor = ativo && ativo.dataset && ativo.dataset.acao
      ? `[data-acao="${ativo.dataset.acao}"]${ativo.dataset.valor ? `[data-valor="${CSS.escape(ativo.dataset.valor)}"]` : ""}${ativo.dataset.lacuna ? `[data-lacuna="${CSS.escape(ativo.dataset.lacuna)}"]` : ""}`
      : null;
    desenharExercicio(false);
    const alvo = (seletor && app.querySelector(seletor)) || app.querySelector(".banco .bloco, .area-montagem .bloco, [data-acao=verificar]");
    if (alvo && !alvo.disabled) alvo.focus({ preventScroll: true });
  }

  function ligarAcoesLicao(ex) {
    acoes.escolher = (el) => { sessao.resposta = el.dataset.valor; redesenharMantendoFoco(); };
    acoes.linha = (el) => { sessao.resposta = Number(el.dataset.valor); redesenharMantendoFoco(); };
    acoes.lacuna = (el) => {
      sessao.resposta = { ...(sessao.resposta || {}), [el.dataset.lacuna]: el.dataset.valor };
      redesenharMantendoFoco();
    };
    acoes.adicionarBloco = (el) => {
      const b = ex.blocos.find((x) => x.id === el.dataset.valor);
      sessao.resposta = [...(sessao.resposta || []), el.dataset.valor];
      anunciar(`Adicionado na linha ${sessao.resposta.length}: ${b.codigo}`);
      redesenharMantendoFoco();
    };
    acoes.removerBloco = (el) => {
      sessao.resposta = (sessao.resposta || []).filter((id) => id !== el.dataset.valor);
      if (!sessao.resposta.length) sessao.resposta = null;
      anunciar("Bloco removido");
      redesenharMantendoFoco();
    };
    acoes.dica = () => {
      sessao.dicasVisiveis += 1;
      const salva = estado.sessoes[sessao.chave];
      salva.dicas[ex.id] = Math.max(salva.dicas[ex.id] || 0, sessao.dicasVisiveis);
      salvar();
      redesenharMantendoFoco();
    };
    acoes.som = () => { estado.som = !estado.som; salvar(); redesenharMantendoFoco(); };
    acoes.verificar = verificar;
    acoes.continuar = continuar;
    acoes.sair = () => {
      abrirModal(`<h2 id="titulo-modal">Sair da lição?</h2>
        <p>Seu progresso nesta lição fica salvo. Você pode continuar depois, de onde parou.</p>
        <button class="botao" data-acao="ficar">Continuar estudando</button>
        <button class="botao botao-secundario" data-acao="confirmarSaida">Sair</button>`);
      acoes.ficar = fecharModal;
      acoes.confirmarSaida = () => { fecharModal(); ir(estado.conta ? "aprender" : ""); };
    };
  }

  function verificar() {
    const ex = exercicioAtual();
    sessao.fase = "verificando";
    sessao.erroEnvio = false;
    desenharExercicio(false);
    setTimeout(() => {
      if (SIMULAR_FALHA && !falhaSimulada) {
        falhaSimulada = true;
        sessao.fase = "respondendo";
        sessao.erroEnvio = true;
        desenharExercicio(false);
        const botao = app.querySelector("[data-acao=verificar]");
        if (botao) botao.focus();
        return;
      }
      const correta = corrigir(ex, sessao.resposta);
      const salva = estado.sessoes[sessao.chave];
      const primeira = !salva.errados.includes(ex.id);
      let perdeuCoracao = false;
      if (correta) {
        salva.fila.shift();
        salva.resolvidos += 1;
        if (primeira) salva.acertosPrimeira += 1;
      } else {
        if (primeira) {
          salva.errados.push(ex.id);
          if (sessao.modo === "principal" && estado.coracoes > 0) {
            estado.coracoes -= 1;
            perdeuCoracao = true;
          }
        }
        salva.fila.push(salva.fila.shift());
      }
      salvar();
      sessao.resolvidos = salva.resolvidos;
      const titulos = ["Muito bem!", "Isso mesmo!", "Correto!"];
      sessao.resultado = { correta, perdeuCoracao, titulo: titulos[salva.resolvidos % titulos.length] };
      sessao.fase = "feedback";
      tocar(correta ? "acerto" : "erro");
      desenharExercicio(false);
      const titulo = app.querySelector(".feedback-titulo");
      if (titulo) titulo.focus({ preventScroll: true });
      anunciar(correta ? sessao.resultado.titulo : "Resposta incorreta.");
    }, 150);
  }

  function continuar() {
    const salva = estado.sessoes[sessao.chave];
    if (sessao.modo === "principal" && estado.coracoes === 0 && salva.fila.length) {
      salva.pausada = true;
      salvar();
      return ir("sem-coracoes");
    }
    if (!salva.fila.length) return concluir();
    Object.assign(sessao, salva, { exercicioId: salva.fila[0], resposta: null, fase: "respondendo", dicasVisiveis: 0, resultado: null, erroEnvio: false });
    desenharExercicio(true);
  }

  function concluir() {
    const salva = estado.sessoes[sessao.chave];
    delete estado.sessoes[sessao.chave];
    const resultado = { modo: sessao.modo, id: sessao.id, total: salva.total, acertosPrimeira: salva.acertosPrimeira, xp: 0, novasConquistas: [], coracoesRecuperados: 0 };
    if (sessao.modo === "demo") {
      estado.demo = { concluida: true, acertosPrimeira: salva.acertosPrimeira, total: salva.total };
      resultado.xp = 20;
    } else {
      if (sessao.modo === "principal" && !estado.concluidas.includes(sessao.id)) {
        estado.concluidas.push(sessao.id);
        resultado.xp = 20;
      } else if (estado.praticasRecompensadas < 3) {
        estado.praticasRecompensadas += 1;
        resultado.xp = 10;
      } else {
        resultado.limitePratica = true;
      }
      if (sessao.modo === "recuperacao") {
        resultado.coracoesRecuperados = Math.min(5, estado.coracoes + 2) - estado.coracoes;
        estado.coracoes = Math.min(5, estado.coracoes + 2);
      }
      registrarAtividade(resultado);
    }
    estado.resultado = resultado;
    salvar();
    tocar("conclusao");
    ir("resultado");
  }

  function registrarAtividade(resultado) {
    estado.xp += resultado.xp;
    if (estado.sessoesHoje === 0) {
      estado.sequencia += 1;
      estado.maiorSequencia = Math.max(estado.maiorSequencia, estado.sequencia);
      resultado.sequenciaNova = true;
    }
    estado.sessoesHoje += 1;
    resultado.metaCumprida = estado.sessoesHoje === estado.meta;
    const conquistar = (id) => {
      if (!estado.conquistas.includes(id)) { estado.conquistas.push(id); resultado.novasConquistas.push(id); }
    };
    if (estado.concluidas.length >= 1) conquistar("primeira-licao");
    if (LICOES.every((l) => estado.concluidas.includes(l.id))) conquistar("primeira-unidade");
    if (estado.sequencia >= 7) conquistar("sete-dias");
  }

  const CONQUISTAS = {
    "primeira-licao": ["Primeira lição", "Concluiu a primeira lição"],
    "primeira-unidade": ["Primeira unidade", "Concluiu as cinco lições de uma unidade"],
    "sete-dias": ["Sete dias", "Estudou sete dias seguidos"],
  };

  /* Resultado e celebração */

  function telaResultado() {
    const r = estado.resultado;
    if (!r) return ir(estado.conta ? "aprender" : "");
    const demo = r.modo === "demo";
    const titulo = { demo: "Lição concluída!", principal: "Lição concluída!", pratica: "Prática concluída!", recuperacao: "Corações recuperados!" }[r.modo];
    app.innerHTML = `<main class="tela-centro centro" id="conteudo-principal">
      ${mascote("comemoracao", "mascote-grande")}
      <h1>${titulo}</h1>
      ${r.coracoesRecuperados ? `<p class="subtitulo">${icone("coracao", "icone-pequeno")} Você recuperou ${r.coracoesRecuperados} ${plural(r.coracoesRecuperados, "coração", "corações")}.</p>` : ""}
      <div class="estatisticas">
        <div class="estatistica xp"><div class="topo">XP</div><div class="valor">${icone("raio", "icone-pequeno")}+${r.xp}</div>${demo ? '<span class="selo-provisorio">provisório</span>' : ""}</div>
        <div class="estatistica acertos"><div class="topo">De primeira</div><div class="valor">${r.acertosPrimeira}/${r.total}</div></div>
        <div class="estatistica sequencia"><div class="topo">Sequência</div><div class="valor">${icone("chama", "icone-pequeno")}${demo ? "–" : estado.sequencia}</div></div>
      </div>
      ${demo ? '<p>Crie uma conta para salvar este XP, começar sua sequência e liberar a próxima lição.</p>' : ""}
      ${r.limitePratica ? "<p>Você já recebeu XP de prática três vezes hoje. Pode continuar praticando, sem XP.</p>" : ""}
      ${!demo && r.metaCumprida ? `<p class="cartao cartao-destaque">${icone("estrela", "icone-pequeno")} Meta do dia cumprida!</p>` : ""}
      <div class="acoes">
        ${demo
          ? '<button class="botao" data-acao="criarConta" data-primario>Criar conta para salvar</button><button class="botao botao-fantasma" data-acao="agoraNao">Agora não</button>'
          : `<button class="botao" data-acao="seguir" data-primario>Continuar</button>`}
      </div>
    </main>`;
    acoes.criarConta = () => ir("cadastro");
    acoes.agoraNao = () => ir("");
    acoes.seguir = () => {
      const fila = [...(r.novasConquistas || [])];
      if (r.sequenciaNova && estado.sequencia > 0) fila.unshift("sequencia");
      r.novasConquistas = [];
      r.sequenciaNova = false;
      salvar();
      mostrarCelebracoes(fila, () => {
        const pausada = Object.values(estado.sessoes).find((s) => s.pausada);
        if (r.modo === "recuperacao" && pausada) {
          pausada.pausada = false;
          salvar();
          ir(`licao/${pausada.id}`);
        } else ir("aprender");
      });
    };
  }

  function mostrarCelebracoes(fila, fim) {
    if (!fila.length) return fim();
    const item = fila.shift();
    const [titulo, texto] = item === "sequencia"
      ? [`${estado.sequencia} ${plural(estado.sequencia, "dia", "dias")} de sequência!`, "Estude amanhã para manter a chama acesa."]
      : [`Conquista: ${CONQUISTAS[item][0]}`, CONQUISTAS[item][1]];
    fecharModal();
    const el = document.createElement("div");
    el.className = "celebracao";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-labelledby", "titulo-celebracao");
    const cores = ["#FFC23D", "#2FA85E", "#2367C9", "#D93A3A"];
    el.innerHTML = Array.from({ length: 24 }, (_, i) =>
      `<span class="confete" aria-hidden="true" style="left:${(i * 41) % 100}%;background:${cores[i % 4]};animation-delay:${(i % 8) * 0.25}s"></span>`).join("") +
      `<div class="conteudo surgir">${mascote("comemoracao", "mascote-grande")}
        <h2 id="titulo-celebracao" tabindex="-1">${esc(titulo)}</h2><p class="subtitulo">${esc(texto)}</p>
        <button class="botao" data-acao="fecharCelebracao" data-primario>Continuar</button></div>`;
    document.body.appendChild(el);
    el.querySelector("button").focus();
    tocar("conclusao");
    acoes.fecharCelebracao = () => { el.remove(); mostrarCelebracoes(fila, fim); };
  }

  /* FL-02 — Conta */

  function telaCadastro() {
    app.innerHTML = `<main class="tela-centro" id="conteudo-principal">
      <button class="botao-icone" data-acao="voltar" aria-label="Voltar">${icone("seta")}</button>
      <h1>Crie sua conta</h1>
      <p class="subtitulo">Para salvar seu progresso e continuar em qualquer aparelho.</p>
      <form id="form-cadastro" novalidate style="display:grid;gap:14px">
        <div class="campo"><label for="c-nome">Nome ou apelido</label><input id="c-nome" autocomplete="nickname" value="${esc(estado.nome)}"></div>
        <div class="campo"><label for="c-email">E-mail</label><input id="c-email" type="email" autocomplete="email" required></div>
        <div class="campo"><label for="c-senha">Senha</label><input id="c-senha" type="password" autocomplete="new-password" minlength="8" required aria-describedby="ajuda-senha"><p class="ajuda" id="ajuda-senha">Pelo menos 8 caracteres.</p></div>
        <label class="caixa-termos"><input type="checkbox" id="c-termos"> <span>Li e aceito os <a href="#/cadastro">termos de uso</a> e a <a href="#/cadastro">política de privacidade</a>.</span></label>
        <p class="ajuda" id="erro-cadastro" role="alert"></p>
        <button class="botao" type="submit" id="c-enviar" disabled>Criar conta</button>
      </form>
      <p class="centro">Já tem conta? <button class="link" data-acao="entrar">Entrar</button></p>
    </main>`;
    acoes.voltar = () => history.length > 1 ? history.back() : ir("");
    acoes.entrar = () => ir("entrar");
    const termos = document.getElementById("c-termos");
    const enviar = document.getElementById("c-enviar");
    termos.addEventListener("change", () => (enviar.disabled = !termos.checked));
    document.getElementById("form-cadastro").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("c-email").value.trim();
      const senha = document.getElementById("c-senha").value;
      const erro = document.getElementById("erro-cadastro");
      if (!/^\S+@\S+\.\S+$/.test(email)) { erro.textContent = "Informe um e-mail válido."; return document.getElementById("c-email").focus(); }
      if (senha.length < 8) { erro.textContent = "A senha precisa ter pelo menos 8 caracteres."; return document.getElementById("c-senha").focus(); }
      estado.nome = document.getElementById("c-nome").value.trim();
      estado.emailPendente = email;
      salvar();
      ir("verificar-email");
    });
  }

  function telaVerificarEmail() {
    app.innerHTML = `<main class="tela-centro centro" id="conteudo-principal">
      ${mascote("incentivo", "mascote-medio")}
      <h1>Confira seu e-mail</h1>
      <p class="subtitulo">Enviamos um link para <strong>${esc(estado.emailPendente || "seu e-mail")}</strong>. Abra o link para ativar sua conta.</p>
      ${estado.demo && estado.demo.concluida ? "<p>Sua lição da demonstração fica guardada neste navegador até lá.</p>" : ""}
      <div class="acoes">
        <button class="botao botao-secundario" data-acao="reenviar">Reenviar link</button>
        <button class="botao" data-acao="abrirLink" data-primario>Simular: abri o link</button>
      </div>
      <p class="ajuda">O segundo botão existe só no protótipo.</p>
    </main>`;
    acoes.reenviar = () => toast("Enviamos um novo link.");
    acoes.abrirLink = () => entrarNaConta();
  }

  function entrarNaConta() {
    estado.conta = true;
    estado.introPasso = 0;
    salvar();
    if (estado.demo && estado.demo.concluida && !estado.concluidas.includes("u1-l1")) {
      estado.transferenciaPendente = true;
      salvar();
      ir("aprender");
    } else {
      estado.demo = null;
      salvar();
      ir("aprender");
    }
  }

  function ofertaTransferencia() {
    abrirModal(`${mascote("comemoracao", "mascote-medio")}
      <h2 id="titulo-modal">Salvar sua primeira lição?</h2>
      <p>Você concluiu a lição 1 na demonstração. Podemos salvar o resultado na sua conta e liberar a lição 2.</p>
      <button class="botao" data-acao="salvarDemo">Salvar na minha conta</button>
      <button class="botao botao-fantasma" data-acao="descartarDemo">Não salvar</button>`);
    acoes.salvarDemo = () => {
      fecharModal();
      const resultado = { xp: 20, novasConquistas: [] };
      estado.concluidas.push("u1-l1");
      registrarAtividade(resultado);
      estado.demo = null;
      salvar();
      const fila = ["sequencia", ...resultado.novasConquistas];
      mostrarCelebracoes(fila, () => render());
    };
    acoes.descartarDemo = () => { fecharModal(); estado.demo = null; salvar(); toast("Tudo bem. A lição 1 continua disponível."); render(); };
  }

  function telaEntrar() {
    app.innerHTML = `<main class="tela-centro" id="conteudo-principal">
      <button class="botao-icone" data-acao="voltar" aria-label="Voltar">${icone("seta")}</button>
      <h1>Entrar</h1>
      <form id="form-entrar" novalidate style="display:grid;gap:14px">
        <div class="campo"><label for="e-email">E-mail</label><input id="e-email" type="email" autocomplete="email"></div>
        <div class="campo"><label for="e-senha">Senha</label><input id="e-senha" type="password" autocomplete="current-password"></div>
        <p class="ajuda" id="erro-entrar" role="alert"></p>
        <button class="botao" type="submit">Entrar</button>
      </form>
      <p class="centro"><button class="link" data-acao="recuperar">Esqueci minha senha</button></p>
      <p class="centro">Ainda não tem conta? <button class="link" data-acao="cadastro">Criar conta</button></p>
    </main>`;
    acoes.voltar = () => ir("");
    acoes.recuperar = () => ir("recuperar");
    acoes.cadastro = () => ir("cadastro");
    document.getElementById("form-entrar").addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("e-email").value.trim();
      const senha = document.getElementById("e-senha").value;
      if (!email || !senha) {
        document.getElementById("erro-entrar").textContent = "E-mail ou senha incorretos.";
        return;
      }
      entrarNaConta();
    });
  }

  function telaRecuperar() {
    app.innerHTML = `<main class="tela-centro" id="conteudo-principal">
      <button class="botao-icone" data-acao="voltar" aria-label="Voltar">${icone("seta")}</button>
      <h1>Recuperar acesso</h1>
      <p class="subtitulo">Informe seu e-mail. Se houver uma conta com ele, você vai receber um link para criar uma nova senha.</p>
      <form id="form-recuperar" style="display:grid;gap:14px">
        <div class="campo"><label for="r-email">E-mail</label><input id="r-email" type="email" autocomplete="email"></div>
        <button class="botao" type="submit">Enviar link</button>
      </form>
    </main>`;
    acoes.voltar = () => ir("entrar");
    document.getElementById("form-recuperar").addEventListener("submit", (e) => {
      e.preventDefault();
      toast("Se o e-mail estiver cadastrado, o link chega em alguns minutos.");
    });
  }

  /* Trilha */

  let balaoAberto = null;

  function estadoNo(licao, i) {
    if (estado.concluidas.includes(licao.id)) return "concluida";
    const primeiraPendente = LICOES.find((l) => !estado.concluidas.includes(l.id));
    if (primeiraPendente && primeiraPendente.id === licao.id && (estado.conta || i === 0)) return "atual";
    return "bloqueada";
  }

  function telaAprender() {
    const deslocamentos = [0, 56, 84, 56, 0, -56, -84, -56];
    const itens = [];
    LICOES.forEach((l, i) => {
      itens.push({ tipo: "licao", licao: l, indice: i });
      if (i === 1) itens.push({ tipo: "revisao", depois: 1 });
    });
    itens.push({ tipo: "revisao", depois: 4 });
    const nos = itens.map((item, pos) => {
      const desloc = deslocamentos[pos % deslocamentos.length];
      if (item.tipo === "revisao") {
        const liberada = estado.conta && estado.concluidas.length > item.depois;
        const chave = `revisao-${item.depois}`;
        return `<li style="transform:translateX(${desloc}px)">
          <button class="no revisao ${liberada ? "" : "bloqueada"}" data-acao="no" data-valor="${chave}" aria-expanded="${balaoAberto === chave}" aria-label="Revisão${liberada ? "" : ", bloqueada"}">${icone(liberada ? "revisao" : "cadeado")}</button>
          <span class="no-rotulo">Revisão</span>
          ${balaoAberto === chave ? `<div class="balao-no ${liberada ? "" : "bloqueado"} surgir" role="region" aria-label="Revisão">
            <h3>Revisão</h3><p>${liberada ? "Pratique os conceitos das lições anteriores." : `Conclua a lição ${item.depois + 1} para liberar esta revisão.`}</p>
            <button class="botao" data-acao="abrirRevisao" ${liberada ? "" : "disabled"}>${liberada ? "Revisar" : "Bloqueada"}</button></div>` : ""}
        </li>`;
      }
      const l = item.licao;
      const st = estadoNo(l, item.indice);
      const desafio = item.indice === LICOES.length - 1;
      const abertaSessao = Object.values(estado.sessoes).some((s) => s.id === l.id && s.modo === "principal");
      const ic = st === "concluida" ? "check" : st === "bloqueada" ? "cadeado" : desafio ? "trofeu" : "estrela";
      const rotuloEstado = { concluida: "concluída", atual: "lição atual", bloqueada: "bloqueada" }[st];
      let balao = "";
      if (balaoAberto === l.id) {
        const anterior = LICOES[item.indice - 1];
        const texto = st === "bloqueada"
          ? (!estado.conta && item.indice > 0 ? "Crie uma conta para liberar as próximas lições." : `Conclua “${esc(anterior.titulo)}” para desbloquear.`)
          : esc(l.objetivo);
        const botao = st === "bloqueada"
          ? (!estado.conta ? '<button class="botao" data-acao="criarConta">Criar conta</button>' : '<button class="botao" disabled>Bloqueada</button>')
          : `<button class="botao" data-acao="abrirLicao" data-valor="${l.id}" data-primario>${st === "concluida" ? "Praticar" : abertaSessao ? "Continuar" : "Começar"}</button>`;
        balao = `<div class="balao-no ${st === "bloqueada" ? "bloqueado" : ""} surgir" role="region" aria-label="${esc(l.titulo)}">
          <h3>${esc(l.titulo)}</h3><p>${texto}</p>${botao}</div>`;
      }
      return `<li class="${st === "atual" ? "li-atual" : ""}" style="transform:translateX(${desloc}px)">
        ${st === "atual" ? `<span class="etiqueta-atual" aria-hidden="true">${abertaSessao ? "Continuar" : "Começar"}</span>` : ""}
        <button class="no ${st} ${st === "atual" ? "atual" : ""}" data-acao="no" data-valor="${l.id}" aria-expanded="${balaoAberto === l.id}" aria-label="Lição ${item.indice + 1}: ${esc(l.titulo)}, ${rotuloEstado}">${icone(ic)}</button>
        <span class="no-rotulo">${esc(l.titulo)}</span>
        ${balao}
      </li>`;
    }).join("");
    const futuras = UNIDADES.slice(1).map((u) => `<div class="unidade-banner bloqueada"><p class="rotulo">Unidade ${u.ordem}</p><h2>${esc(u.titulo)}</h2><p>${esc(u.descricao)}</p></div>
      <ol class="trilha" aria-label="Lições da unidade ${u.ordem}">${[0, 1, 2].map((i) => `<li style="transform:translateX(${deslocamentos[i]}px)"><span class="no bloqueada" role="img" aria-label="Lição bloqueada">${icone("cadeado")}</span></li>`).join("")}</ol>`).join("");
    const aviso = !estado.conta ? `<div class="aviso-conta">${mascote("incentivo", "mascote-pequeno")}<div><p>Crie uma conta para salvar seu progresso e liberar as próximas lições.</p><button class="botao botao-pequeno" data-acao="criarConta">Criar conta</button></div></div>` : "";
    const saudacao = estado.nome ? `<p class="subtitulo">Olá, ${esc(estado.nome)}!</p>` : "";
    comNavegacao("aprender", `<h1 class="so-leitor">Aprender</h1>${aviso}${saudacao}
      <div class="unidade-banner"><p class="rotulo">Unidade 1</p><h2>${esc(UNIDADES[0].titulo)}</h2><p>${esc(UNIDADES[0].descricao)}</p></div>
      <ol class="trilha" aria-label="Lições da unidade 1">${nos}</ol>${futuras}`);
    acoes.no = (el) => {
      balaoAberto = balaoAberto === el.dataset.valor ? null : el.dataset.valor;
      render({ manterRolagem: true });
      const botao = app.querySelector(".balao-no .botao:not(:disabled)") || app.querySelector(`[data-acao=no][data-valor="${el.dataset.valor}"]`);
      if (botao) botao.focus();
    };
    if (estado.transferenciaPendente) {
      estado.transferenciaPendente = false;
      salvar();
      ofertaTransferencia();
    }
    acoes.abrirLicao = (el) => { balaoAberto = null; ir(`licao/${el.dataset.valor}`); };
    acoes.abrirRevisao = () => { balaoAberto = null; ir("licao/revisao"); };
    acoes.criarConta = () => ir("cadastro");
  }

  /* Praticar e recuperação */

  function telaSemCoracoes() {
    app.innerHTML = `<main class="tela-centro centro" id="conteudo-principal">
      ${mascote("atencao", "mascote-grande")}
      <h1>Você ficou sem corações</h1>
      <p class="subtitulo">Seu progresso na lição está salvo. Faça uma revisão rápida de 5 exercícios para recuperar 2 corações.</p>
      <div class="acoes">
        <button class="botao" data-acao="recuperar" data-primario>Recuperar corações</button>
        <button class="botao botao-secundario" data-acao="trilha">Voltar à trilha</button>
      </div>
    </main>`;
    acoes.recuperar = () => ir("licao/recuperacao");
    acoes.trilha = () => ir("aprender");
  }

  function telaPraticar() {
    if (!estado.conta) return ir("aprender");
    const concluidas = LICOES.filter((l) => estado.concluidas.includes(l.id));
    const conteudo = concluidas.length
      ? `<div class="cartao cartao-destaque"><h3>${icone("revisao")} Revisão recomendada</h3>
          <p>Exercícios dos conceitos que você viu, com novos exemplos.</p>
          <button class="botao" data-acao="revisao" data-primario>Começar revisão</button></div>
         ${estado.coracoes < 5 ? `<div class="cartao"><h3>${icone("coracao")} Recuperar corações</h3><p>Você tem ${estado.coracoes} de 5. Uma revisão de 5 exercícios devolve 2 corações.</p><button class="botao botao-secundario" data-acao="recuperar">Recuperar</button></div>` : `<p class="cartao">${icone("coracao", "icone-pequeno")} Seus corações estão cheios.</p>`}
         <div class="cartao"><h3>Lições concluídas</h3><ul class="lista-licoes">${concluidas.map((l) => `<li><span>${esc(l.titulo)}</span><button class="botao botao-secundario botao-pequeno" data-acao="praticarLicao" data-valor="${l.id}">Praticar</button></li>`).join("")}</ul></div>`
      : `<div class="estado-vazio">${mascote("descanso", "mascote-medio")}<h2>Nada para revisar ainda</h2><p>As revisões aparecem depois da sua primeira lição.</p><button class="botao botao-pequeno" data-acao="trilha">Ir para a trilha</button></div>`;
    comNavegacao("praticar", `<h1>Praticar</h1><div style="display:grid;gap:16px">${conteudo}</div>`);
    acoes.revisao = () => ir("licao/revisao");
    acoes.recuperar = () => ir("licao/recuperacao");
    acoes.praticarLicao = (el) => ir(`licao/${el.dataset.valor}`);
    acoes.trilha = () => ir("aprender");
  }

  /* Perfil */

  function telaPerfil() {
    if (!estado.conta) {
      comNavegacao("perfil", `<h1>Perfil</h1><div class="estado-vazio">${mascote("incentivo", "mascote-medio")}<p>Crie uma conta para ter um perfil com seu progresso.</p><button class="botao botao-pequeno" data-acao="criarConta">Criar conta</button></div>`);
      acoes.criarConta = () => ir("cadastro");
      return;
    }
    comNavegacao("perfil", `<h1>${esc(estado.nome || "Seu perfil")}</h1>
      <div style="display:grid;gap:16px">
        <div class="estatisticas">
          <div class="estatistica xp"><div class="topo">XP total</div><div class="valor">${estado.xp}</div></div>
          <div class="estatistica sequencia"><div class="topo">Maior sequência</div><div class="valor">${estado.maiorSequencia}</div></div>
          <div class="estatistica acertos"><div class="topo">Lições</div><div class="valor">${estado.concluidas.length}</div></div>
        </div>
        <section class="cartao"><h2>Conquistas</h2><div class="conquistas">${Object.entries(CONQUISTAS).map(([id, [nome]]) => {
          const tem = estado.conquistas.includes(id);
          return `<div class="conquista ${tem ? "" : "bloqueada"}"><div class="medalha">${icone(tem ? "trofeu" : "cadeado")}</div>${esc(nome)}<span class="so-leitor">${tem ? ", conquistada" : ", ainda não conquistada"}</span></div>`;
        }).join("")}</div></section>
        <section class="cartao" style="display:grid;gap:14px"><h2>Preferências</h2>
          <div class="campo"><label for="p-meta">Meta diária</label>
            <select id="p-meta">${[1, 2, 3].map((n) => `<option value="${n}" ${estado.meta === n ? "selected" : ""}>${n} ${plural(n, "lição", "lições")} por dia</option>`).join("")}</select></div>
          <div class="alternador"><span id="rotulo-som" style="font-weight:800">Sons</span><button data-acao="som" aria-pressed="${estado.som}" aria-labelledby="rotulo-som"></button></div>
          <div class="campo"><label for="p-fuso">Fuso horário</label>
            <select id="p-fuso"><option>America/Sao_Paulo</option><option>America/Manaus</option><option>America/Recife</option><option>America/Noronha</option><option>Europe/Lisbon</option></select>
            <p class="ajuda">Uma mudança de fuso vale a partir do próximo dia de estudo.</p></div>
          <p class="ajuda">As animações seguem a configuração de movimento reduzido do seu aparelho.</p>
        </section>
        <section class="cartao" style="display:grid;gap:10px"><h2>Conta</h2>
          <button class="botao botao-secundario" data-acao="exportar">Exportar meu histórico</button>
          <button class="botao botao-secundario" data-acao="sair">Sair</button>
          <button class="botao botao-fantasma" data-acao="excluir" style="color:var(--vermelho-texto)">Excluir conta</button>
        </section>
      </div>`);
    document.getElementById("p-meta").addEventListener("change", (e) => { estado.meta = Number(e.target.value); salvar(); toast("Meta atualizada."); });
    acoes.som = (el) => { estado.som = !estado.som; salvar(); el.setAttribute("aria-pressed", estado.som); };
    acoes.exportar = () => toast("No produto, o arquivo com seu histórico é baixado aqui.");
    acoes.sair = () => { estado.conta = false; salvar(); ir(""); };
    acoes.excluir = () => {
      abrirModal(`<h2 id="titulo-modal">Excluir sua conta?</h2>
        <p>Seu progresso, XP, sequência e conquistas serão apagados. Isso não pode ser desfeito.</p>
        <button class="botao botao-perigo" data-acao="confirmarExclusao">Excluir conta</button>
        <button class="botao botao-secundario" data-acao="cancelar">Cancelar</button>`);
      acoes.cancelar = fecharModal;
      acoes.confirmarExclusao = () => { fecharModal(); estado = { ...PADRAO }; salvar(); ir(""); };
    };
  }

  /* Componentes e estados (E03.2 e E03.5) */

  function telaComponentes() {
    const cores = [["--verde", "Verde", "Ações principais"], ["--verde-borda", "Verde escuro", "Profundidade e texto em fundo claro"], ["--amarelo", "Amarelo", "Sequência, meta e lições concluídas"], ["--vermelho", "Vermelho", "Corações e erro"], ["--azul", "Azul", "Seleção, XP e links"], ["--texto", "Texto", "Texto principal"], ["--texto-suave", "Texto suave", "Texto secundário"], ["--bloqueado", "Bloqueado", "Itens indisponíveis"]];
    app.innerHTML = `<main class="principal" id="conteudo-principal" style="max-width:960px;padding-bottom:48px">
      <p><a href="#/">Voltar ao início</a></p>
      <h1>Componentes e estados</h1>
      <div class="galeria">
        <section><h2>Cores</h2><div class="amostras">${cores.map(([v, n, uso]) => `<div class="amostra-cor"><span style="background:var(${v})"></span><p><strong>${n}</strong><br>${uso}</p></div>`).join("")}</div></section>
        <section><h2>Botões</h2><div style="display:grid;gap:12px;max-width:360px">
          <button class="botao">Principal</button><button class="botao botao-secundario">Secundário</button>
          <button class="botao botao-fantasma">Fantasma</button><button class="botao" disabled>Indisponível</button><button class="botao botao-perigo">Perigo</button></div></section>
        <section><h2>Nós da trilha</h2><div class="amostras" style="gap:28px">
          ${[["concluida", "check", "Concluída"], ["atual", "estrela", "Atual"], ["bloqueada", "cadeado", "Bloqueada"], ["revisao", "revisao", "Revisão"], ["atual", "trofeu", "Desafio"]].map(([c, ic, n]) => `<div class="amostra-mascote"><span class="no ${c}" role="img" aria-label="${n}" style="margin-bottom:12px">${icone(ic)}</span>${n}</div>`).join("")}</div></section>
        <section><h2>Indicadores</h2>${indicadores()}<div class="cartao" style="max-width:360px"><h3>${icone("estrela")} Meta do dia</h3><p>1 de 2 lições</p><div class="progresso-meta"><span style="width:50%"></span></div></div></section>
        <section><h2>Mascote</h2><div class="amostras">${["incentivo", "comemoracao", "atencao", "descanso"].map((m) => `<div class="amostra-mascote">${mascote(m, "mascote-medio")}${{ incentivo: "Incentivo", comemoracao: "Comemoração", atencao: "Atenção", descanso: "Descanso" }[m]}</div>`).join("")}</div></section>
        <section><h2>Feedback</h2>
          <div class="rodape-licao acerto" style="position:static;border-radius:16px"><div class="rodape-conteudo"><div class="feedback"><p class="feedback-titulo"><span class="selo">${icone("check")}</span>Muito bem!</p><p class="feedback-texto">Explicação curta da regra.</p></div><button class="botao">Continuar</button></div></div>
          <div class="rodape-licao erro" style="position:static;border-radius:16px"><div class="rodape-conteudo"><div class="feedback"><p class="feedback-titulo"><span class="selo">${icone("x")}</span>Ainda não.</p><p class="feedback-texto"><strong>Feedback da opção escolhida.</strong></p><p class="retorno-aviso">Este exercício volta no fim da lição.</p></div><button class="botao">Continuar</button></div></div>
          <div class="dica">${icone("lampada")}<span><strong>Dica 1:</strong> Texto da dica.</span></div></section>
        <section><h2>Estados</h2>
          <div class="cartao"><h3>Carregando</h3><div class="carregando"><div class="esqueleto" style="height:20px;width:50%"></div><div class="esqueleto" style="height:64px"></div></div></div>
          <div class="cartao"><h3>${icone("alerta")} Erro ao carregar</h3><p>Não foi possível abrir a trilha agora. Seu progresso está salvo.</p><button class="botao botao-pequeno">Tentar de novo</button></div>
          <div class="faixa-offline" style="border-radius:12px">${icone("semRede")} Sem conexão. Suas respostas ficam guardadas até a conexão voltar.</div>
          <p class="erro-envio">${icone("semRede")} Não foi possível verificar agora. Sua resposta foi guardada.</p>
          <div class="cartao cartao-destaque"><h3>${icone("play")} Retomada</h3><p>Você parou na lição “Números na tela”. Continue de onde parou.</p><button class="botao botao-pequeno">Continuar</button></div>
          <div class="estado-vazio cartao">${mascote("descanso", "mascote-medio")}<h3>Estado vazio</h3><p>As revisões aparecem depois da sua primeira lição.</p></div>
        </section>
        <section><h2>Protótipo</h2><p>Testes: <a href="?simular=falha#/licao/u1-l1">lição com falha de envio simulada</a> · <a href="?movimento=reduzido#/">movimento reduzido</a></p>
          <button class="botao botao-secundario botao-pequeno" data-acao="reiniciar">Reiniciar protótipo</button></section>
      </div></main>`;
    acoes.reiniciar = () => { estado = { ...PADRAO }; salvar(); toast("Protótipo reiniciado."); ir(""); };
  }

  render();
})();
