// Verificação do app no navegador (E08.2, E08.3): celular e desktop, teclado, foco visível, som,
// redução de movimento, queda e travamento de conexão e retomada depois de recarregar.
//
// Requer o servidor em http://localhost:3100 (npm run dev -- --port 3100), o Chrome instalado e
// puppeteer-core acessível pelo require do Node (por exemplo, npm install puppeteer-core numa pasta
// fora do repositório, com NODE_PATH apontando para o node_modules dela). A parte da conta usa
// TESTE_EMAIL_1 e TESTE_SENHA de web/.env.local: conclui uma prática da lição 1 nessa conta e
// alterna o som duas vezes, voltando ao estado inicial.
//
// Uso: node ferramentas/verificar_navegador.mjs [demo|conta|tudo]
// As capturas de tela ficam na pasta CAPTURAS (padrão: uma pasta temporária nova).
import { execSync } from "node:child_process";
import fs from "node:fs";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const puppeteer = createRequire(import.meta.url)("puppeteer-core");
const BASE = process.env.BASE ?? "http://localhost:3100";
const WEB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../web");
const CAPTURAS = process.env.CAPTURAS ?? fs.mkdtempSync(path.join(os.tmpdir(), "sibi-navegador-"));
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
const RESPOSTAS = JSON.parse(execSync("npx tsx scripts/respostas-para-teste.mts", { cwd: WEB, encoding: "utf8", maxBuffer: 1 << 24 }));
const ENV = Object.fromEntries(
  fs.readFileSync(path.join(WEB, ".env.local"), "utf8").split(/\r?\n/).filter((l) => /^\w+=/.test(l)).map((l) => [l.slice(0, l.indexOf("=")), l.slice(l.indexOf("=") + 1)]),
);
const MODO = process.argv[2] ?? "tudo";
const CELULAR = { width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 };
const DESKTOP = { width: 1280, height: 800 };

const falhas = [];
function conferir(certo, texto, detalhe) {
  console.log(`${certo ? "ok   " : "FALHA"} ${texto}${certo || detalhe === undefined ? "" : ` → ${JSON.stringify(detalhe)}`}`);
  if (!certo) falhas.push(texto);
}
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
const foto = (page, nome) => page.screenshot({ path: path.join(CAPTURAS, `${nome}.png`) });

async function aguardar(page, fn, arg, ms = 15000) {
  try {
    await page.waitForFunction(fn, { timeout: ms, polling: 100 }, arg);
    return true;
  } catch {
    return false;
  }
}

async function semRolagemLateral(page, nome) {
  const r = await page.evaluate(() => {
    const cw = document.documentElement.clientWidth;
    const culpados = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > cw + 1 && getComputedStyle(el).position !== "fixed")
      .slice(0, 4)
      .map((el) => `${el.tagName.toLowerCase()}.${[...el.classList].join(".")} (${Math.round(el.getBoundingClientRect().right)})`);
    return { largura: document.documentElement.scrollWidth, visivel: cw, culpados };
  });
  conferir(r.largura <= r.visivel, `${nome}: sem rolagem lateral (${r.visivel} px)`, r);
}

/** Percorre a página com Tab e confere que cada elemento focado mostra o foco. */
async function focoVisivel(page, nome, toques = 25) {
  await page.reload({ waitUntil: "networkidle0" });
  const invisiveis = [];
  let primeiro = null;
  for (let i = 0; i < toques; i++) {
    await page.keyboard.press("Tab");
    const info = await page.evaluate(() => {
      const el = document.activeElement;
      // O indicador de desenvolvimento do Next (nextjs-portal) não existe em produção.
      if (!el || el === document.body || el.tagName === "NEXTJS-PORTAL") return null;
      const s = getComputedStyle(el);
      const visivel = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none";
      return { visivel, alvo: `${el.tagName.toLowerCase()} "${(el.getAttribute("aria-label") ?? el.textContent ?? "").trim().slice(0, 30)}"` };
    });
    if (!info) continue;
    primeiro ??= info.alvo;
    if (!info.visivel) invisiveis.push(info.alvo);
  }
  conferir(invisiveis.length === 0, `${nome}: foco visível em todos os elementos alcançados por Tab`, invisiveis.slice(0, 5));
  return primeiro;
}

/** Tab até o elemento marcado; devolve false se ele não for alcançável. */
async function tabAte(page, marcar, arg, limite = 70) {
  const existe = await page.evaluate(marcar, arg);
  if (!existe) return false;
  for (let i = 0; i < limite; i++) {
    await page.keyboard.press("Tab");
    if (await page.evaluate(() => document.activeElement?.hasAttribute("data-alvo"))) {
      await page.evaluate(() => document.querySelectorAll("[data-alvo]").forEach((e) => e.removeAttribute("data-alvo")));
      return true;
    }
  }
  return false;
}

const marcarPorTexto = ([seletor, texto]) => {
  document.querySelectorAll("[data-alvo]").forEach((e) => e.removeAttribute("data-alvo"));
  const el = [...document.querySelectorAll(seletor)].find((b) => b.textContent.trim() === texto && !b.disabled);
  el?.setAttribute("data-alvo", "1");
  return Boolean(el);
};

async function exercicioAtual(page) {
  return page.evaluate(async () => {
    const m = location.pathname.match(/^\/sessao\/([0-9a-f-]{36})/);
    if (m) return (await (await fetch(`/api/sessoes/${m[1]}`, { cache: "no-store" })).json()).exercicio ?? null;
    const d = JSON.parse(localStorage.getItem("sibi-demo") ?? "null");
    return d && !d.concluida ? d.exercicios.find((e) => e.id === d.fila.fila[0]) : null;
  });
}

/** Escolhe a resposta certa do exercício atual só com Tab e Espaço. */
async function escolherComTeclado(page, ex) {
  const r = RESPOSTAS[ex.id];
  const passos = [];
  if (r.tipo === "escolher_resultado") passos.push({ indice: ex.opcoes.findIndex((o) => o.id === r.opcao), sel: ".opcao" });
  if (r.tipo === "completar_lacuna") for (const [id, valor] of Object.entries(r.lacunas)) passos.push({ grupo: `Opções para a lacuna ${id}`, texto: valor });
  if (r.tipo === "ordenar_blocos") for (const codigo of r.codigos) passos.push({ rotulo: `Adicionar: ${codigo}` });
  if (r.tipo === "localizar_erro") passos.push({ prefixo: `Linha ${r.linha}:` });
  for (const p of passos) {
    const achou = await tabAte(page, (p) => {
      document.querySelectorAll("[data-alvo]").forEach((e) => e.removeAttribute("data-alvo"));
      let el = null;
      if (p.sel) el = document.querySelectorAll(p.sel)[p.indice];
      if (p.grupo) el = [...document.querySelectorAll(`[aria-label="${p.grupo}"] button`)].find((b) => b.textContent.trim() === p.texto);
      if (p.rotulo) el = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label") === p.rotulo);
      if (p.prefixo) el = [...document.querySelectorAll("button")].find((b) => b.getAttribute("aria-label")?.startsWith(p.prefixo));
      el?.setAttribute("data-alvo", "1");
      return Boolean(el);
    }, p);
    if (!achou) return `não alcançou ${JSON.stringify(p)} em ${ex.id}`;
    await page.keyboard.press("Space");
    await espera(80);
  }
  return null;
}

async function verificarComTeclado(page) {
  if (!(await tabAte(page, marcarPorTexto, ["button", "Verificar"]))) {
    if (!(await tabAte(page, marcarPorTexto, ["button", "Tentar novamente"]))) return "Verificar não alcançável";
  }
  await page.keyboard.press("Enter");
  return (await aguardar(page, () => document.querySelector(".feedback-titulo"))) ? null : "feedback não apareceu";
}

/** Responde certo a todos os exercícios só com o teclado, até a tela de resultado. */
async function fazerLicao(page, nome, { aoExercicio } = {}) {
  const problemas = [];
  let focoNoFeedback = true;
  for (let n = 0; n < 20; n++) {
    let ex = await exercicioAtual(page);
    if (!ex) break;
    if (aoExercicio) {
      await aoExercicio(n, ex);
      // O gancho pode ter respondido exercícios por conta própria: segue do que está na tela agora.
      ex = await exercicioAtual(page);
      if (!ex) break;
    }
    const p1 = await escolherComTeclado(page, ex);
    if (p1) {
      problemas.push(p1);
      break;
    }
    const p2 = await verificarComTeclado(page);
    if (p2) {
      problemas.push(`${ex.id}: ${p2}`);
      break;
    }
    focoNoFeedback &&= await page.evaluate(() => document.activeElement?.classList.contains("feedback-titulo"));
    await page.keyboard.press("Enter");
    await aguardar(page, (id) => !document.querySelector(".feedback-titulo"), ex.id, 8000);
    await espera(150);
  }
  conferir(problemas.length === 0, `${nome}: lição inteira respondida só com o teclado`, problemas);
  conferir(focoNoFeedback, `${nome}: depois de Verificar, o foco vai para o feedback`);
  const chegou = await aguardar(page, () => /XP/.test(document.body.innerText) && document.querySelector("h1, h2"), null, 15000);
  conferir(chegou, `${nome}: chega ao resultado`);
}

async function novaPagina(browser, viewport, { reduzirMovimento = false } = {}) {
  const page = await browser.newPage();
  await page.setViewport(viewport);
  if (reduzirMovimento) await page.emulateMediaFeatures([{ name: "prefers-reduced-motion", value: "reduce" }]);
  page.on("pageerror", (e) => console.log(`  erro na página: ${e.message}`));
  return page;
}

async function conferirMovimento(page, nome) {
  const r = await page.evaluate(() => {
    const confetes = [...document.querySelectorAll(".confete")];
    const animados = [...document.querySelectorAll("body *")].filter((el) => getComputedStyle(el).animationName !== "none").length;
    return { confetesVisiveis: confetes.filter((c) => getComputedStyle(c).display !== "none").length, animados };
  });
  conferir(r.confetesVisiveis === 0 && r.animados === 0, `${nome}: com redução de movimento, sem confete nem animação`, r);
}

async function demonstracao(browser) {
  console.log("\n— Demonstração (celular, sem conta)");
  const page = await novaPagina(browser, CELULAR, { reduzirMovimento: true });
  for (const rota of ["/", "/entrar", "/cadastro", "/recuperar", "/introducao"]) {
    await page.goto(BASE + rota, { waitUntil: "networkidle0" });
    await semRolagemLateral(page, rota);
  }
  await page.goto(BASE + "/", { waitUntil: "networkidle0" });
  const primeiro = await focoVisivel(page, "início");
  conferir(/Pular para o conteúdo/.test(primeiro ?? ""), "o primeiro Tab leva ao atalho Pular para o conteúdo", primeiro);

  await page.goto(BASE + "/demo", { waitUntil: "networkidle0" });
  await page.evaluate(() => localStorage.removeItem("sibi-demo"));
  await page.reload({ waitUntil: "networkidle0" });
  await semRolagemLateral(page, "/demo");
  await foto(page, "demo-celular");

  await fazerLicao(page, "demonstração", {
    aoExercicio: async (n, ex) => {
      if (n === 1) {
        // Recarga no meio da lição: volta ao mesmo item (CA-04).
        await page.reload({ waitUntil: "networkidle0" });
        const depois = await exercicioAtual(page);
        conferir(depois?.id === ex.id, "recarregar no meio da demonstração volta ao mesmo exercício", { antes: ex.id, depois: depois?.id });
      }
      if (n === 2) {
        // Queda de conexão (F-35, CA-50, CA-61): aviso, resposta guardada e Tentar novamente.
        const erro = await escolherComTeclado(page, ex);
        if (erro) return conferir(false, "queda de conexão: escolher a resposta", erro);
        await page.setOfflineMode(true);
        const aviso = await aguardar(page, () => document.querySelector(".faixa-offline"), null, 3000);
        conferir(aviso, "sem conexão, aparece o aviso persistente");
        await tabAte(page, marcarPorTexto, ["button", "Verificar"]);
        await page.keyboard.press("Enter");
        const msg = await aguardar(page, () => /Não foi possível verificar agora/.test(document.body.innerText), null, 8000);
        conferir(msg, "verificar sem conexão avisa que a resposta foi guardada");
        await foto(page, "demo-sem-conexao");
        await page.setOfflineMode(false);
        conferir(await aguardar(page, () => !document.querySelector(".faixa-offline"), null, 3000), "com a conexão de volta, o aviso some");
        // A resposta continua escolhida; o próximo Verificar (Tentar novamente) leva ao feedback.
        const p = await verificarComTeclado(page);
        conferir(!p, "Tentar novamente leva ao feedback", p);
        await page.keyboard.press("Enter");
        await aguardar(page, () => !document.querySelector(".feedback-titulo"), null, 8000);
        await espera(150);
        // O próximo exercício segue o fluxo normal no laço.
        const proximo = await exercicioAtual(page);
        if (!proximo) return;
        // Conexão travada: o pedido não responde nunca.
        const erro2 = await escolherComTeclado(page, proximo);
        if (erro2) return conferir(false, "conexão travada: escolher a resposta", erro2);
        await page.setRequestInterception(true);
        const presos = [];
        const prender = (req) => (req.url().includes("/api/demo/correcao") ? presos.push(req) : req.continue());
        page.on("request", prender);
        await tabAte(page, marcarPorTexto, ["button", "Verificar"]);
        await page.keyboard.press("Enter");
        const destravou = await aguardar(page, () => /Não foi possível verificar agora/.test(document.body.innerText), null, 25000);
        conferir(destravou, "com a conexão travada, a tela desiste em até 25 s e oferece Tentar novamente", { presos: presos.length });
        page.off("request", prender);
        for (const req of presos) await req.abort().catch(() => {});
        await page.setRequestInterception(false);
        if (destravou) {
          const p3 = await verificarComTeclado(page);
          conferir(!p3, "depois do travamento, Tentar novamente leva ao feedback", p3);
          await page.keyboard.press("Enter");
          await aguardar(page, () => !document.querySelector(".feedback-titulo"), null, 8000);
          await espera(150);
        }
      }
    },
  });
  await semRolagemLateral(page, "resultado da demonstração");
  await conferirMovimento(page, "resultado da demonstração");
  await foto(page, "demo-resultado");
  await page.close();
}

async function entrar(page) {
  await page.goto(BASE + "/entrar", { waitUntil: "networkidle0" });
  await page.type("#email", ENV.TESTE_EMAIL_1);
  await page.type("#senha", ENV.TESTE_SENHA);
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), page.keyboard.press("Enter")]);
  const ok = !page.url().includes("/entrar");
  conferir(ok, "entrar na conta de teste pelo teclado");
  return ok;
}

async function conta(browser) {
  console.log("\n— Conta de teste (celular e desktop)");
  const page = await novaPagina(browser, CELULAR, { reduzirMovimento: true });
  if (!(await entrar(page))) return;
  for (const rota of ["/aprender", "/praticar", "/perfil", "/licao/u1-l1"]) {
    await page.goto(BASE + rota, { waitUntil: "networkidle0" });
    await semRolagemLateral(page, `${rota} no celular`);
    await foto(page, `celular${rota.replace(/\//g, "-")}`);
  }
  await page.setViewport(DESKTOP);
  for (const rota of ["/aprender", "/praticar", "/perfil"]) {
    await page.goto(BASE + rota, { waitUntil: "networkidle0" });
    await semRolagemLateral(page, `${rota} no desktop`);
    await focoVisivel(page, `${rota} no desktop`);
    await foto(page, `desktop${rota.replace(/\//g, "-")}`);
  }

  // Som no perfil: o interruptor responde ao teclado e a escolha fica gravada.
  await page.goto(BASE + "/perfil", { waitUntil: "networkidle0" });
  const lerSom = () => page.evaluate(() => document.querySelector(".alternador button[aria-pressed]")?.getAttribute("aria-pressed") ?? null);
  const marcarSom = () => {
    const b = document.querySelector(".alternador button[aria-pressed]");
    b?.setAttribute("data-alvo", "1");
    return Boolean(b);
  };
  const somAntes = await lerSom();
  const rotuloSom = await page.evaluate(() => {
    const b = document.querySelector(".alternador button[aria-pressed]");
    return b && document.getElementById(b.getAttribute("aria-labelledby") ?? "")?.textContent.trim();
  });
  conferir(somAntes !== null && Boolean(rotuloSom), "o perfil tem o controle de som, com nome e estado anunciados", { somAntes, rotuloSom });
  if (somAntes !== null) {
    await tabAte(page, marcarSom);
    await page.keyboard.press("Space");
    await espera(800);
    await page.reload({ waitUntil: "networkidle0" });
    const gravado = await lerSom();
    conferir(gravado !== somAntes, "alternar o som pelo teclado fica gravado depois de recarregar", { somAntes, gravado });
    await tabAte(page, marcarSom);
    await page.keyboard.press("Space");
    await espera(800);
  }

  // Prática da lição 1 no celular, só com teclado, com uma recarga no meio.
  await page.setViewport(CELULAR);
  await page.goto(BASE + "/licao/u1-l1", { waitUntil: "networkidle0" });
  const botao = await page.evaluate(() => [...document.querySelectorAll("main button, main a")].map((b) => b.textContent.trim()).filter(Boolean));
  const rotulo = botao.find((t) => /Praticar|Continuar|Começar/.test(t));
  conferir(Boolean(rotulo), "a lição concluída oferece praticar", botao);
  if (!rotulo) return page.close();
  await tabAte(page, marcarPorTexto, ["main button, main a", rotulo]);
  await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }).catch(() => {}), page.keyboard.press("Enter")]);
  conferir(/\/sessao\//.test(page.url()), "Enter no botão abre a sessão", page.url());
  await semRolagemLateral(page, "lição no celular");

  // Botão de som da lição: alterna pelo teclado e anuncia o estado.
  const somLicao = await page.evaluate(() => document.querySelector('button[aria-label$="som"]')?.getAttribute("aria-pressed"));
  await tabAte(page, (r) => {
    const b = document.querySelector('button[aria-label$="som"]');
    b?.setAttribute("data-alvo", "1");
    return Boolean(b);
  });
  await page.keyboard.press("Enter");
  await espera(300);
  const somDepois = await page.evaluate(() => document.querySelector('button[aria-label$="som"]')?.getAttribute("aria-pressed"));
  conferir(somLicao !== somDepois && somDepois !== undefined, "o botão de som da lição alterna pelo teclado", { somLicao, somDepois });
  await page.keyboard.press("Enter");
  await espera(300);

  await fazerLicao(page, "prática na conta", {
    aoExercicio: async (n, ex) => {
      if (n !== 2) return;
      const erro = await escolherComTeclado(page, ex);
      if (erro) return conferir(false, "prática: escolher antes da queda", erro);
      await page.setOfflineMode(true);
      await tabAte(page, marcarPorTexto, ["button", "Verificar"]);
      await page.keyboard.press("Enter");
      conferir(await aguardar(page, () => /Não foi possível verificar agora/.test(document.body.innerText), null, 8000), "prática: verificar sem conexão guarda a resposta");
      await page.setOfflineMode(false);
      // Recarga com o envio guardado: o mesmo id é reenviado e o feedback volta (CA-52).
      await page.reload({ waitUntil: "networkidle0" });
      const voltou = await aguardar(page, () => document.querySelector(".feedback-titulo"), null, 10000);
      conferir(voltou, "prática: recarregar depois da falha reenvia a resposta guardada e mostra o feedback");
      if (voltou) {
        await page.focus(".feedback-titulo");
        await page.keyboard.press("Enter");
        await aguardar(page, () => !document.querySelector(".feedback-titulo"), null, 8000);
        await espera(150);
      }
    },
  });
  await semRolagemLateral(page, "resultado da prática");
  await conferirMovimento(page, "resultado da prática");
  await foto(page, "pratica-resultado");
  await page.close();
}

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ["--no-first-run", "--no-default-browser-check"] });
try {
  if (MODO === "demo" || MODO === "tudo") await demonstracao(browser);
  if (MODO === "conta" || MODO === "tudo") await conta(browser);
} finally {
  await browser.close();
}
console.log(falhas.length ? `\n${falhas.length} verificação(ões) falharam.` : "\nTodas as verificações passaram.");
console.log(`Capturas em ${CAPTURAS}`);
process.exit(falhas.length ? 1 : 0);
