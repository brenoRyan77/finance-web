
const CACHE_NAME = 'financas-pessoais-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Estratégia de cache: Network first, então fallback para cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Clone da resposta
        const responseToCache = response.clone();
        
        // Atualizar cache
        caches.open(CACHE_NAME)
          .then((cache) => {
            // Ignorar requisições de API e de terceiros
            if (event.request.url.startsWith(self.location.origin)) {
              cache.put(event.request, responseToCache);
            }
          });
        
        return response;
      })
      .catch(() => {
        // Se a rede falhar, tentar servir do cache
        return caches.match(event.request);
      })
  );
});

self.addEventListener("install", (event) => {
    self.skipWaiting(); // Ativar a nova versão imediatamente
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== "financas-pessoais-v1") {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    clients.claim(); // Garantir que o Service Worker assuma o controle imediatamente
});
