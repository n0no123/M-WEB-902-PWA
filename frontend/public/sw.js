const isVisible = () => {
    return self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    })
        .then(
            (windowClients) =>
                windowClients.some(windowClient => windowClient.visibilityState === 'visible')
        );
}

self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const options = {
            body: data.body,
            icon: data.icon,
            image: data.image,
            badge: data.badge,
            data: {
                url: data.url
            }
        };

        if (!isVisible()) {
            event.waitUntil(self.registration.showNotification(data.title, options));
        }
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow(event.notification.data.url));
});

const STATIC_CACHE_VERSION = 4;
const STATIC_CACHE = `static-cache-v${STATIC_CACHE_VERSION}`;
const STATIC_CACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
];

const DYNAMIC_CACHE_VERSION = 4;
const DYNAMIC_CACHE = `dynamic-cache-v${DYNAMIC_CACHE_VERSION}`;
const DYNAMIC_CACHE_BLACKLIST = [
    '/sign-in',
    '/sign-up'
];

const CURRENT_CACHES = {
    static: STATIC_CACHE,
    dynamic: DYNAMIC_CACHE
};

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CURRENT_CACHES.static)
            .then((cache) =>
                cache.addAll(STATIC_CACHE_ASSETS),
            ),
    );
});

self.addEventListener("activate", (event) => {
    const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!expectedCacheNamesSet.has(cacheName)) {
                        return caches.delete(cacheName);
                    }
                    return null;
                }),
            ),
        ),
    );
});

self.addEventListener("fetch", (event) => {

    if (event.request.method == 'GET') {
        event.respondWith(
            caches.open(CURRENT_CACHES.dynamic).then((cache) => {
                return cache
                    .match(event.request)
                    .then((response) => {
                        if (response) {
                            return response;
                        }
                        return fetch(event.request.clone()).then((response) => {
                            if (
                                response.status < 400
                            ) {
                                if (!DYNAMIC_CACHE_BLACKLIST.some(path => event.request.url.includes(path))) {
                                    cache.put(event.request, response.clone());
                                }
                            }
                            return response;
                        }).catch(() => {
                            return caches.match('/offline.html');
                        });
                    })
                    .catch((error) => {
                        throw error;
                    });
            }),
        );
    }
});