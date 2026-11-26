// Teste do Python no navegador (design/MELHORIAS_UX.md, E): roda programas no laboratório e confere a caixa isolada:
// erros traduzidos, laço infinito cortado, input(), import bloqueado e, de dentro da caixa, sem API, cookies nem
// armazenamento do Sibi. Requer o servidor em BASE (padrão http://localhost:3100) e puppeteer-core no NODE_PATH.
// Uso: node ferramentas/verificar_python.mjs [BASE]
import { createRequire } from "node:module";
import path from "node:path";
const puppeteer = createRequire(import.meta.url)("puppeteer-core");
const BASE = process.argv[2] ?? process.env.BASE ?? "http://localhost:3100";
const OUT = process.env.CAPTURAS ?? (await import("node:os")).tmpdir();
const espera = (ms) => new Promise((r) => setTimeout(r, ms));
let falhas = 0;
const conferir = (ok, texto, detalhe) => {
  console.log(`${ok ? "ok   " : "FALHA"} ${texto}${ok ? "" : " → " + JSON.stringify(detalhe)}`);
  if (!ok) falhas++;
};

const browser = await puppeteer.launch({ executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe", headless: true });
const page = await browser.newPage();
await page.setViewport({ width: 360, height: 740, isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
page.on("pageerror", (e) => console.log("ERRO NA PÁGINA:", e.message));
await page.goto(`${BASE}/laboratorio`, { waitUntil: "networkidle2" });

async function rodar(codigo, esperaMs = 60000) {
  await page.evaluate((c) => {
    const t = document.querySelector(".experimente-codigo");
    const set = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, "value").set;
    set.call(t, c);
    t.dispatchEvent(new Event("input", { bubbles: true }));
  }, codigo);
  await espera(100);
  const antes = Date.now();
  await page.evaluate(() => [...document.querySelectorAll(".experimente-acoes button")].find((b) => /Rodar/.test(b.textContent))?.click());
  await page.waitForFunction(() => [...document.querySelectorAll(".experimente-acoes button")].some((b) => /Rodar/.test(b.textContent) && !b.disabled), { timeout: esperaMs });
  await espera(150);
  const r = await page.evaluate(() => ({
    saida: document.querySelector(".experimente-saida")?.textContent ?? null,
    erro: document.querySelector(".experimente-erro")?.innerText ?? null,
    pergunta: document.querySelector(".experimente-entrada label")?.textContent ?? null,
    aviso: document.querySelector(".experimente-aviso")?.textContent ?? null,
    falha: document.querySelector(".experimente .mensagem-erro")?.textContent ?? null,
  }));
  return { ...r, ms: Date.now() - antes };
}

let r = await rodar('print("Olá", 1 + 2)', 120000);
console.log("primeira execução (com download):", r.ms, "ms");
conferir(r.saida === "Olá 3\n" || r.saida === "Olá 3", "roda print e conta", r);
await page.screenshot({ path: path.join(OUT, "python-1-ok.png"), fullPage: true });

r = await rodar("print(nome)");
conferir(/NameError/.test(r.erro ?? "") && /não conhece o nome nome/.test(r.erro ?? ""), "NameError traduzido", r);
r = await rodar('print("oi"');
conferir(/abriu e não fechou/.test(r.erro ?? ""), "parêntese não fechado traduzido", r);
await page.screenshot({ path: path.join(OUT, "python-2-erro.png"), fullPage: true });
r = await rodar("print(“curva”)");
conferir(r.saida?.trim() === "curva", "aspas curvas do celular viram retas", r);
r = await rodar("while True:\n    pass", 30000);
conferir(/demorou demais/.test(r.erro ?? "") && r.ms < 15000, "laço infinito é cortado", r);
r = await rodar('print("depois do corte")', 60000);
conferir(r.saida?.trim() === "depois do corte", "Python volta a funcionar depois do corte", r);
r = await rodar("import os\nprint(os.getcwd())");
conferir(/Importar ainda não vale/.test(r.erro ?? ""), "import bloqueado", r);
r = await rodar('__import__("js")');
conferir(/NameError/.test(r.erro ?? ""), "__import__ não existe para o aluno", r);
r = await rodar('n = input("Seu nome? ")\nprint("Oi,", n)');
conferir(/Seu nome\?/.test(r.pergunta ?? ""), "input pergunta na tela", r);
await page.type("#experimente-resposta", "Ana");
await page.evaluate(() => document.querySelector(".experimente-entrada button")?.click());
await page.waitForFunction(() => /Oi, Ana/.test(document.querySelector(".experimente-saida")?.textContent ?? ""), { timeout: 20000 }).catch(() => {});
r = await page.evaluate(() => document.querySelector(".experimente-saida")?.textContent);
conferir(/Oi, Ana/.test(r ?? ""), "input responde e roda de novo", r);
r = await rodar("for i in range(3):\n    print(i)");
conferir(r.saida?.trim() === "0\n1\n2", "for funciona", r);
r = await rodar("print('x' * 100000)");
conferir(/Saída grande demais/.test(r.erro ?? ""), "saída grande é cortada", r);

// Fuga pela classe base: tenta carregar o módulo js e usar a rede.
r = await rodar(`imp = [c for c in ().__class__.__base__.__subclasses__() if c.__name__ == "BuiltinImporter"][0]
try:
    js = imp.load_module("js")
except Exception as e:
    print("sem js:", type(e).__name__)
else:
    print("fetch:", js.fetch, "XMLHttpRequest:", js.XMLHttpRequest)`);
console.log("tentativa de fuga:", JSON.stringify(r.saida), r.erro);
conferir(!/function|JsProxy/.test(r.saida ?? ""), "mesmo achando o módulo js, não há fetch nem XMLHttpRequest", r);

// A caixa em si: de dentro do iframe, a API do Sibi não pode ser alcançada.
const caixa = page.frames().find((f) => f.url().includes("/python/caixa"));
conferir(!!caixa, "a caixa existe como iframe");
if (caixa) {
  const api = await caixa.evaluate(async () => {
    try {
      const resposta = await fetch("/api/perfil/exportacao", { credentials: "include" });
      return `respondeu ${resposta.status}`;
    } catch (e) {
      return `bloqueado: ${e.name}`;
    }
  });
  conferir(api.startsWith("bloqueado"), "fetch para a API a partir da caixa é bloqueado", api);
  const cookies = await caixa.evaluate(() => {
    try {
      return document.cookie;
    } catch (e) {
      return `bloqueado: ${e.name}`;
    }
  });
  conferir(cookies === "" || cookies.startsWith("bloqueado"), "a caixa não lê cookies", cookies);
  const armazenamento = await caixa.evaluate(() => {
    try {
      return String(localStorage.length);
    } catch (e) {
      return `bloqueado: ${e.name}`;
    }
  });
  conferir(armazenamento.startsWith("bloqueado"), "a caixa não lê o armazenamento do Sibi", armazenamento);
}
await browser.close();
console.log(falhas ? `${falhas} falha(s)` : "Tudo certo.");
process.exit(falhas ? 1 : 0);
