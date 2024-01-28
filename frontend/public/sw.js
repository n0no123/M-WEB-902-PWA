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

const CACHE_VERSION = 1;
const CURRENT_CACHES = {
    cache: `cache-v${CACHE_VERSION}`,
};

this.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open("v1")
            .then((cache) =>
                cache.addAll([
                    "/",
                    "/index.html",
                ]),
            ),
    );
});

this.addEventListener("activate", (event) => {
    const expectedCacheNamesSet = new Set(Object.values(CURRENT_CACHES));
    event.waitUntil(
        caches.keys().then((cacheNames) =>
            Promise.all(
                cacheNames.map((cacheName) => {
                    if (!expectedCacheNamesSet.has(cacheName)) {
                        console.log("Deleting out of date cache:", cacheName);
                        return caches.delete(cacheName);
                    }
                    return null;
                }),
            ),
        ),
    );
});

this.addEventListener("fetch", (event) => {
    console.log("Handling fetch event for", event.request.url);
    event.respondWith(
        caches.open(CURRENT_CACHES.cache).then((cache) => {
            return cache
                .match(event.request)
                .then((response) => {
                    if (response) {
                        console.log(" Found response in cache:", response);
                        return response;
                    }
                    console.log(
                        " No response for %s found in cache. About to fetch " +
                        "from network…",
                        event.request.url,
                    );
                    return fetch(event.request.clone()).then((response) => {
                        console.log(
                            "  Response for %s from network is: %O",
                            event.request.url,
                            response,
                        );
                        if (
                            response.status < 400
                        ) {
                            console.log("  Caching the response to", event.request.url);
                            cache.put(event.request, response.clone());
                        } else {
                            console.log("  Not caching the response to", event.request.url);
                        }
                        return response;
                    });
                })
                .catch((error) => {
                    console.error("  Error in fetch handler:", error);
                    throw error;
                });
        }),
    );
});
