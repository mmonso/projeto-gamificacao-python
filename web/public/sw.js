// Service worker do Sibi (PWA). De propósito, quase nada: o app sempre busca a versão mais nova na rede,
// e só quando a rede falha numa navegação mostra a página "sem conexão" guardada na instalação.
// Nada de telas, respostas ou dados do aluno fica em cache.
const CACHE = "sibi-offline-v1";
const OFFLINE = "/offline.html";

self.addEventListener("install", (evento) => {
  evento.waitUntil(caches.open(CACHE).then((cache) => cache.add(new Request(OFFLINE, { cache: "reload" }))));
  self.skipWaiting();
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nomes) => Promise.all(nomes.filter((n) => n !== CACHE).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  if (evento.request.mode !== "navigate") return;
  evento.respondWith(fetch(evento.request).catch(() => caches.match(OFFLINE)));
});
