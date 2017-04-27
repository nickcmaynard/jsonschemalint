const CACHE_NAME = (new Date()).toISOString();

// Eagerly cache everything when service worker is installed
self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(global.serviceWorkerOption.assets);
    })
  );
});

// Fetch from cache if it's there
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
