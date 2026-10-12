/* Mahadev service worker — app kholda hamesha naya file linxa (online bhaye), offline bhaye cache bata */
const CACHE = 'mahadev-v6';   // <-- app ma thulo change gareko bela v3, v4 ... banaunu
const SHELL = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'logo.png', 'logo-192.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL).catch(() => {})).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const ok = url.origin === location.origin || url.hostname === 'www.gstatic.com';
  if (!ok) return; // Firestore ko network call haru Firebase le aafai handle garchha
  e.respondWith(
    fetch(req).then(res => {
      if (res && (res.ok || res.type === 'opaque')) {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      }
      return res;
    }).catch(() =>
      caches.match(req, { ignoreSearch: true }).then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : Response.error()))
    )
  );
});
