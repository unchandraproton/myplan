const CACHE_NAME = 'studtrack-cache-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  'https://img.icons8.com/fluent/192/calendar.png',
  'https://img.icons8.com/fluent/512/calendar.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://cdn.jsdelivr.net/npm/chart.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS).catch(err => console.warn("Caching bypass active for remote assets:", err));
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((cacheResponse) => {
      return cacheResponse || fetch(e.request).catch(() => {
        // Safe offline fallback
      });
    })
  );
});