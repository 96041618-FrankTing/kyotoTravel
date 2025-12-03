const CACHE_NAME = 'kyoto-travel-v1.0.0';
const STATIC_CACHE = 'kyoto-travel-static-v1.0.0';
const DYNAMIC_CACHE = 'kyoto-travel-dynamic-v1.0.0';

// Resources to cache immediately
const STATIC_ASSETS = [
  '/kyotoTravel/',
  '/kyotoTravel/index.html',
  '/kyotoTravel/manifest.json',
  '/kyotoTravel/offline.html'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  console.log('Service Worker installing...');

  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
    ]).then(() => {
      // Force activation
      return self.skipWaiting();
    })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');

  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - Cache First strategy for better iOS compatibility
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/kyotoTravel/index.html')
        .then(response => {
          return response || fetch(request);
        })
        .catch(() => {
          return caches.match('/kyotoTravel/offline.html');
        })
    );
    return;
  }

  // Cache First strategy for static assets
  if (STATIC_ASSETS.some(asset => url.pathname === asset)) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          return response || fetch(request).then(response => {
            if (response.ok) {
              const responseClone = response.clone();
              caches.open(STATIC_CACHE).then(cache => {
                cache.put(request, responseClone);
              });
            }
            return response;
          });
        })
    );
    return;
  }

  // Network First for dynamic content, fallback to cache
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(DYNAMIC_CACHE).then(cache => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        return caches.match(request)
          .then(response => {
            if (response) {
              console.log('Serving from cache:', request.url);
              return response;
            }

            // Return offline page for navigation requests
            if (request.mode === 'navigate') {
              return caches.match('/offline.html');
            }

            // For other requests, return a simple error response
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
