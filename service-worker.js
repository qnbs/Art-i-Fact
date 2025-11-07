const CACHE_NAME = 'art-i-fact-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Main script and key assets will be cached on first load.
  // Caching the main pages is the most crucial part for the app shell.
];

// Install the service worker and cache the app shell
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate the service worker and remove old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  // We only want to handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // For API calls (like wikimedia), always go to the network.
  if (event.request.url.includes('api.php')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // For other requests, use a cache-first, falling back to network strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // If a cached response is found, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch from the network
        return fetch(event.request).then(networkResponse => {
          // If we get a valid response, clone it and cache it for future use
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
          }
          return networkResponse;
        });
      })
  );
});
