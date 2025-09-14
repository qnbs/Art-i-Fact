const CACHE_NAME = 'art-i-fact-cache-v1';

// App Shell: The minimal resources needed for the app to start.
const APP_SHELL_URLS = [
  '/',
  '/index.html',
  '/index.tsx',
  // Using the data URI icon from index.html
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='0' y1='0' y2='1'%3E%3Cstop offset='0%25' stop-color='%23fbbf24'/%3E%3Cstop offset='100%25' stop-color='%23d97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' rx='15' fill='url(%23g)'/%3E%3Cpath d='M25 80 L50 30 L75 80' stroke='white' stroke-width='10' fill='none' stroke-linecap='round' stroke-linejoin='round'/%3E%3Ccircle cx='50' cy='60' r='7' fill='white'/%3E%3C/svg%3E",
];

// Third-party resources to cache
const THIRD_PARTY_URLS = [
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap',
  'https://esm.sh/react@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1',
  'https://esm.sh/react-dom@^19.1.1/client',
  'https://esm.sh/@google/genai@^1.15.0',
  'https://aistudiocdn.com/uuid@^13.0.0',
];

const urlsToCache = [...APP_SHELL_URLS, ...THIRD_PARTY_URLS];

// Install event: cache the app shell and third-party resources.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Pre-caching App Shell');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[Service Worker] Failed to cache App Shell:', error);
      })
  );
});

// Activate event: clean up old caches.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Clearing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event: serve from cache, falling back to network.
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
      return;
  }
  
  // Strategy: Cache First, then Network
  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from the network.
      try {
        const networkResponse = await fetch(event.request);
        // If the request is for a third-party resource, cache it.
        // Avoid caching Chrome extension requests.
        if (networkResponse && networkResponse.status === 200 && !event.request.url.startsWith('chrome-extension://')) {
          await cache.put(event.request, networkResponse.clone());
        }
        return networkResponse;
      } catch (error) {
        console.error('[Service Worker] Fetch failed:', error);
        // Fallback for navigation requests is the main app page.
        if (event.request.mode === 'navigate') {
            const indexPage = await cache.match('/index.html');
            if (indexPage) return indexPage;
        }
        return new Response(null, { status: 500, statusText: "Service Worker fetch failed" });
      }
    })
  );
});
