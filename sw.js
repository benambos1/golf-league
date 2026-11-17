// Network-first: always try to get the latest app and scores, and fall back to the
// last saved copy only when offline. Bump VERSION when changing the files below.
const VERSION = 'golf-league-v4';
const SHELL = ['./', 'index.html', 'data.json', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  const key = new URL(req.url); key.search = '';           // data.json?v=123 caches as data.json
  e.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(res => {
        if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(key.href, copy)); }
        return res;
      })
      .catch(() => caches.match(key.href).then(hit => hit || caches.match('./')))
  );
});
