const CACHE_NAME = 'art-i-fact-cache-v2';
const BASE_PATH = '/Art-i-Fact/';

const urlsToCache = [
  BASE_PATH,
  BASE_PATH + 'index.html',
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
  // Activate immediately
  self.skipWaiting();
});

// Activate the service worker and remove old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  self.clients.claim();
});

// Intercept fetch requests — Cache First for app shell, Network First for API
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip caching for external API calls
  if (url.origin !== location.origin) return;

  // Skip caching for Chrome extensions
  if (url.protocol === 'chrome-extension:') return;

  // For API calls (like wikimedia), always go to the network.
  if (url.pathname.includes('api.php')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response for caching
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // Offline fallback: return the cached index.html for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(BASE_PATH + 'index.html');
            }
          });
      })
  );
});
