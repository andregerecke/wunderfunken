// Kleiner Service Worker: statische Dateien und bereits geöffnete Häppchen.
const CACHE = "wf-v2";
const BASE = new URL(self.registration.scope).pathname;

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin) return;
  const staticAsset = ["_next/static/", "illustrations/", "icons/"].some((p) => url.pathname.startsWith(BASE + p));
  if (staticAsset) {
    e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    })));
    return;
  }
  if (e.request.mode === "navigate" && url.pathname.startsWith(`${BASE}wissen/`)) {
    e.respondWith(fetch(e.request).then((res) => {
      if (res.ok && !res.redirected) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
      return res;
    }).catch(() => caches.match(e.request).then((hit) => hit || Response.error())));
  }
});
