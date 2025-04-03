
/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

const CACHE_NAME = 'financas-pessoais-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-72x72.png',
    '/icons/icon-96x96.png',
    '/icons/icon-128x128.png',
    '/icons/icon-144x144.png',
    '/icons/icon-152x152.png',
    '/icons/icon-192x192.png',
    '/icons/icon-384x384.png',
    '/icons/icon-512x512.png'
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Cache aberto');
                return cache.addAll(urlsToCache);
            })
    );
    // Force the waiting service worker to become the active service worker
    self.skipWaiting();
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
                    return null;
                })
            );
        })
    );
    // Claim any clients immediately
    self.clients.claim();
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
                return caches.match(event.request)
                    .then(response => {
                        return response || caches.match('/');
                    });
            })
    );
});

// Garantir que o app funcione offline
self.addEventListener('fetch', (event) => {
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' &&
            event.request.headers.get('accept')?.includes('text/html'))) {
        event.respondWith(
            fetch(event.request).catch(() => {
                return caches.match('/');
            })
        );
    }
});