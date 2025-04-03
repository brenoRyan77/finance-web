
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
    '/icons/icon-512x512.png',
    // Adicionar mais recursos essenciais para funcionamento offline
    '/assets/index.css',
    '/assets/index.js'
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

// Função para verificar se uma requisição é cacheável
function isRequestCacheable(request) {
    // Verificar se é uma requisição GET
    if (request.method !== 'GET') {
        return false;
    }

    // Verificar se a URL é válida e é do mesmo origem
    const url = new URL(request.url);
    if (!url.protocol.startsWith('http')) {
        return false;
    }

    // Verificar se não é uma requisição de API ou de terceiros
    if (!request.url.startsWith(self.location.origin)) {
        return false;
    }

    return true;
}

// Manusear requisições de rede - Estratégia network first com fallback para cache
self.addEventListener('fetch', (event) => {
    // Não interceptar requisições para URLs de terceiros
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    // Para recursos HTML (navegação), sempre tente rede primeiro, depois cache
    if (event.request.mode === 'navigate' ||
        (event.request.method === 'GET' &&
            event.request.headers.get('accept')?.includes('text/html'))) {
        event.respondWith(
            fetch(event.request)
                .catch(() => {
                    return caches.match(event.request) || caches.match('/');
                })
        );
        return;
    }

    // Para outros recursos, use network-first com fallback para cache
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Clone da resposta
                const responseToCache = response.clone();

                // Atualizar cache apenas para requisições válidas
                if (isRequestCacheable(event.request) && response.status === 200) {
                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            try {
                                cache.put(event.request, responseToCache);
                            } catch (error) {
                                console.error('Erro ao armazenar no cache:', error);
                            }
                        });
                }

                return response;
            })
            .catch(() => {
                // Se a rede falhar, tentar servir do cache
                return caches.match(event.request);
            })
    );
});

// Evento de mensagem para atualizações
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});