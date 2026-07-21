const CACHE = "jeongcheogi-v19";
const QUESTIONS = "/api/questions?v=20260721-19";
const SHELL = ["/manifest.webmanifest", "/icon.svg", "/icon-192.png", "/icon-512.png", "/icon-maskable-512.png", "/apple-touch-icon.png"];

async function cacheResponse(cache, request) {
  const response = await fetch(request, { cache: "reload" });
  if (response.ok) await cache.put(request, response.clone());
  return response;
}

async function precache() {
  const cache = await caches.open(CACHE);
  await Promise.all(SHELL.map((url) => cacheResponse(cache, url)));

  const root = await cacheResponse(cache, "/");
  const html = await root.clone().text();
  const chunks = [...html.matchAll(/(?:src|href)=["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((url) => url.startsWith("/_next/static/"));
  await Promise.all(chunks.map((url) => cacheResponse(cache, url)));

  const questionResponse = await cacheResponse(cache, QUESTIONS);
  const payload = await questionResponse.clone().json();
  const assets = [...new Set((payload.questions || []).map((question) => question.assetUrl).filter(Boolean))];
  await Promise.all(assets.map((url) => cacheResponse(cache, url)));
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) await (await caches.open(CACHE)).put(request, response.clone());
  return response;
}

async function networkFirst(request, navigation = false) {
  try {
    const response = await fetch(request);
    if (response.ok) await (await caches.open(CACHE)).put(request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (navigation) return caches.match("/");
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith("/_next/static/") || SHELL.includes(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }
  event.respondWith(networkFirst(event.request, event.request.mode === "navigate"));
});
