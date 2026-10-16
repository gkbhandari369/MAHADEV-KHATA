/* Mahadev service worker — app kholda hamesha naya file linxa (online bhaye), network ramro chhaina bhane cache bata */
const CACHE = 'mahadev-v19';   // <-- app ma thulo change gareko bela v13, v14 ... banaunu
const SHELL = ['./', 'index.html', 'style.css', 'manifest.webmanifest', 'logo.png', 'logo-192.png'];
const WAIT = 4000;             // network 4 sec ma nabolyo bhane cache dekhaunchha

self.addEventListener('install', e => {
  // addAll() le ek file nabhetda sabai nai fail garchha — tesaile ek-ek garera rakhne
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const store = (req, res) => {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
  }
};

// Firebase ko version lekheko file haru kahile pani badlindaina -> cache pahila (offline ma pani turuntai khulchha)
function cacheFirst(req) {
  return caches.match(req).then(r => r || fetch(req).then(res => { store(req, res); return res; }));
}

// aafnai app ko file -> online bhaye hamesha naya, haleko network ma timeout lagchha bhane cache
function networkFirst(req) {
  return new Promise(resolve => {
    let done = false;
    const fromCache = () => caches.match(req, { ignoreSearch: true })
      .then(r => r || (req.mode === 'navigate' ? caches.match('index.html') : null));
    const timer = setTimeout(() => {
      fromCache().then(r => { if (r && !done) { done = true; resolve(r); } });
    }, WAIT);
    fetch(req).then(res => {
      store(req, res);
      clearTimeout(timer);
      if (!done) { done = true; resolve(res); }
    }).catch(() => {
      clearTimeout(timer);
      if (!done) fromCache().then(r => { done = true; resolve(r || Response.error()); });
    });
  });
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.hostname === 'www.gstatic.com') { e.respondWith(cacheFirst(req)); return; }
  if (url.origin !== location.origin) return; // Firestore ko network call haru Firebase le aafai handle garchha
  e.respondWith(networkFirst(req));
});
