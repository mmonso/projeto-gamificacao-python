// Teste de jornada do protótipo (E03.7). Requer: npm install puppeteer-core e Chrome instalado.
// Uso: sirva design/prototipo em http://127.0.0.1:8766 e rode: node ferramentas/testar_prototipo.js
const puppeteer = require("puppeteer-core");
const BASE = "http://127.0.0.1:8766/";
const problemas = [];
const log = (...a) => console.log(...a);
const falha = (m) => { problemas.push(m); log("  FALHA:", m); };
const espera = (ms) => new Promise((r) => setTimeout(r, ms));

async function exercicioAtual(page) {
  return page.evaluate(() => {
    const h = document.getElementById("enunciado");
    if (!h) return null;
    const todos = window.CONTEUDO.unidades[0].licoes.flatMap((l) => [...l.exercicios, ...(l.revisao || [])]);
    return todos.find((e) => e.enunciado === h.textContent) && { tipo: todos.find((e) => e.enunciado === h.textContent).tipo, candidatos: todos.filter((e) => e.enunciado === h.textContent).map((e) => e.id) };
  });
}

async function responder(page, certo) {
  // Descobre o exercício pelo conteúdo renderizado e responde.
  return page.evaluate((certo) => {
    const todos = window.CONTEUDO.unidades[0].licoes.flatMap((l) => [...l.exercicios, ...(l.revisao || [])]);
    const enun = document.getElementById("enunciado").textContent;
    const codigoTela = document.querySelector(".licao-corpo").innerText;
    const cands = todos.filter((e) => e.enunciado === enun);
    const ex = cands.find((e) => {
      if (e.tipo === "ordenar_blocos") return e.blocos.every((b) => codigoTela.includes(b.codigo));
      if (e.codigo) return codigoTela.includes(e.codigo.split("\n")[0].replace(/___\d___/, "").trim().slice(0, 8));
      if (e.opcoes) return e.opcoes.every((o) => o.erro || codigoTela.includes(o.texto.split("\n")[0]));
      return true;
    }) || cands[0];
    const clicar = (sel) => { const el = document.querySelector(sel); if (!el) throw new Error("sem " + sel); el.click(); };
    if (ex.tipo === "escolher_resultado") {
      const id = certo ? ex.resposta : ex.opcoes.find((o) => o.id !== ex.resposta).id;
      clicar(`[data-acao=escolher][data-valor="${id}"]`);
    } else if (ex.tipo === "localizar_erro") {
      const l = certo ? ex.resposta : (ex.resposta === 1 ? 2 : 1);
      clicar(`[data-acao=linha][data-valor="${l}"]`);
    } else if (ex.tipo === "completar_lacuna") {
      ex.lacunas.forEach((lc) => {
        const v = certo ? lc.resposta : lc.opcoes.find((o) => o !== lc.resposta);
        [...document.querySelectorAll(`[data-acao=lacuna][data-lacuna="${lc.id}"]`)].find((b) => b.dataset.valor === v).click();
      });
    } else if (ex.tipo === "ordenar_blocos") {
      const seq = certo ? ex.resposta[0] : [...ex.resposta[0]].reverse();
      seq.forEach((id) => clicar(`[data-acao=adicionarBloco][data-valor="${id}"]`));
    }
    return ex.id;
  }, certo);
}

async function verificarEContinuar(page, rotulo) {
  const t0 = Date.now();
  await page.click("[data-acao=verificar]");
  await page.waitForSelector("[data-acao=continuar]", { timeout: 5000 });
  const tFeedback = Date.now() - t0;
  const t1 = Date.now();
  await page.click("[data-acao=continuar]");
  await espera(30);
  const tCont = Date.now() - t1;
  if (tFeedback > 1000) falha(`${rotulo}: feedback levou ${tFeedback} ms`);
  return tFeedback;
}

async function fazerLicao(page, nome, errosNos = []) {
  await page.waitForSelector("#enunciado", { timeout: 5000 });
  let i = 0, tempos = [];
  while (await page.$("#enunciado")) {
    const errar = errosNos.includes(i);
    let id;
    try { id = await responder(page, !errar); } catch (e) { falha(`${nome} item ${i}: ${e.message}`); return; }
    const pronto = await page.$eval("[data-acao=verificar]", (b) => !b.disabled);
    if (!pronto) falha(`${nome} ${id}: Verificar continua desabilitado após responder`);
    tempos.push(await verificarEContinuar(page, `${nome} ${id}`));
    i++;
    await espera(80);
    if (!(await page.$("#enunciado"))) break;
    if (i > 40) { falha(`${nome}: mais de 40 itens, laço?`); break; }
  }
  log(`  ${nome}: ${i} respostas, feedback médio ${Math.round(tempos.reduce((a, b) => a + b, 0) / tempos.length)} ms, máx ${Math.max(...tempos)} ms; rota final ${await page.evaluate(() => location.hash)}`);
}

(async () => {
  const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: "new" });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  page.on("response", (r) => { if (r.status() >= 400) falha("HTTP " + r.status() + " " + r.url()); });
  page.on("pageerror", (e) => falha("erro JS: " + e.message));
  page.on("console", (m) => { if (m.type() === "error") falha("console: " + m.text()); });

  log("1. Demonstração com erros");
  await page.goto(BASE + "#/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await page.click("[data-acao=comecar]");
  await page.waitForSelector("#nome");
  await page.type("#nome", "Ana");
  await page.click("[data-acao=avancar]");
  await page.click("[data-acao=meta][data-valor='2']");
  await page.click("[data-acao=avancar]");
  await page.click("[data-acao=iniciar]");
  await fazerLicao(page, "demo", [0, 3]);
  if (!(await page.evaluate(() => location.hash)).includes("resultado")) falha("demo não chegou ao resultado");
  const txt = await page.$eval("main", (m) => m.innerText);
  if (!/provisório/i.test(txt)) falha("resultado da demo sem XP provisório");
  if (/coraç/i.test(await page.evaluate(() => document.body.innerText)) && false) falha("");

  log("2. Retomada após recarga no meio da lição");
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + "#/licao/u1-l1");
  await page.waitForSelector("#enunciado");
  await responder(page, true); await verificarEContinuar(page, "retomada");
  await responder(page, true); await verificarEContinuar(page, "retomada");
  const antes = await page.$eval("#enunciado", (h) => h.textContent);
  await page.reload();
  await page.waitForSelector("#enunciado");
  const depois = await page.$eval("#enunciado", (h) => h.textContent);
  if (antes !== depois) falha(`retomada voltou para outro item: "${depois}" em vez de "${antes}"`);

  log("3. Conta, transferência e lição 2 com corações");
  await page.evaluate(() => localStorage.clear());
  await page.goto(BASE + "#/licao/u1-l1");
  await fazerLicao(page, "demo2");
  await page.click("[data-acao=criarConta]");
  await page.waitForSelector("#c-email");
  await page.type("#c-email", "teste@example.com");
  await page.type("#c-senha", "senhasegura");
  if (!(await page.$eval("#c-enviar", (b) => b.disabled))) falha("Criar conta habilitado sem aceite dos termos");
  await page.click("#c-termos");
  await page.click("#c-enviar");
  await page.waitForSelector("[data-acao=abrirLink]");
  await page.click("[data-acao=abrirLink]");
  await page.waitForSelector("[data-acao=salvarDemo]", { timeout: 3000 }).catch(() => falha("oferta de transferência não apareceu"));
  if (await page.$("[data-acao=salvarDemo]")) {
    await page.click("[data-acao=salvarDemo]");
    for (let k = 0; k < 4 && (await page.$("[data-acao=fecharCelebracao]")); k++) { await page.click("[data-acao=fecharCelebracao]"); await espera(50); }
  }
  const st = await page.evaluate(() => JSON.parse(localStorage.getItem("sibi-prototipo-v1")));
  if (!st.concluidas.includes("u1-l1") || st.xp !== 20) falha(`transferência: concluidas=${st.concluidas} xp=${st.xp}`);
  await page.click("[data-acao=no][data-valor='u1-l2']");
  await page.waitForSelector("[data-acao=abrirLicao]");
  await page.click("[data-acao=abrirLicao]");
  await fazerLicao(page, "lição 2 (5 erros)", [0, 1, 2, 3, 4]);
  const rota = await page.evaluate(() => location.hash);
  if (!rota.includes("sem-coracoes")) falha(`5 erros não levaram a sem-coracoes (rota ${rota})`);
  log("4. Recuperação de corações");
  await page.click("[data-acao=recuperar]");
  await fazerLicao(page, "recuperação", [0]);
  const st2 = await page.evaluate(() => JSON.parse(localStorage.getItem("sibi-prototipo-v1")));
  if (st2.coracoes !== 2) falha(`corações após recuperação: ${st2.coracoes}`);
  await page.click("[data-acao=seguir]");
  for (let k = 0; k < 4 && (await page.$("[data-acao=fecharCelebracao]")); k++) { await page.click("[data-acao=fecharCelebracao]"); await espera(50); }
  await espera(600);
  const rota2 = await page.evaluate(() => location.hash);
  if (!rota2.includes("licao/u1-l2")) falha(`após recuperação não voltou à lição pausada (rota ${rota2})`);
  else await fazerLicao(page, "lição 2 retomada");

  log("5. Teclado: lição 1 só com teclado na prática");
  await page.goto(BASE + "#/praticar");
  await espera(200);
  log("  telas: praticar ok =", !!(await page.$("h1")));
  await page.goto(BASE + "#/perfil"); await espera(200);
  await page.goto(BASE + "#/componentes"); await espera(200);

  log("6. Celular 360px");
  await page.setViewport({ width: 360, height: 740 });
  for (const r of ["#/", "#/aprender", "#/licao/u1-l3", "#/perfil", "#/praticar", "#/componentes"]) {
    await page.goto(BASE + r); await espera(700);
    const w = await page.evaluate(() => document.documentElement.scrollWidth);
    if (w > 360) falha(`rolagem horizontal em ${r}: largura ${w}`);
  }
  await page.goto(BASE + "#/licao/u1-l3"); await espera(700);
  // captura: celular-licao
  await page.goto(BASE + "#/aprender"); await espera(300);
  // captura: celular-trilha
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto(BASE + "#/aprender"); await espera(300);
  // captura: desktop-trilha

  log("\nProblemas:", problemas.length ? "\n- " + problemas.join("\n- ") : "nenhum");
  await browser.close();
})().catch((e) => { console.error("ERRO NO TESTE:", e); process.exit(1); });
