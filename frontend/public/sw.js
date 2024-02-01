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
            icon: "https://unpeumoinsdunkilo.prophecy-eip.com/icons/android/android-launchericon-144-144.png",
            data: {
                url: data.url
            }
        };

        //if (!isVisible()) {
        event.waitUntil(self.registration.showNotification(data.title, options));
        //}
    }
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(self.clients.openWindow(event.notification.data.url));
});

const STATIC_CACHE_VERSION = 1;
const STATIC_CACHE = `static-cache-v${STATIC_CACHE_VERSION}`;
const STATIC_CACHE_ASSETS = [
    '/',
    '/index.html',
    '/offline.html',
    '/assets/placeholder.png'
];

const DYNAMIC_CACHE_VERSION = 1;
const DYNAMIC_CACHE = `dynamic-cache-v${DYNAMIC_CACHE_VERSION}`;
const DYNAMIC_CACHE_BLACKLIST = [
    '/sign-in',
    '/sign-up'
];

const CURRENT_CACHES = {
    static: STATIC_CACHE,
    dynamic: DYNAMIC_CACHE
};

const isBlackListed = (url) => {
    DYNAMIC_CACHE_BLACKLIST.some(path => url.includes(path))
}

async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(CURRENT_CACHES.dynamic);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch {
        const cachedResponse = await caches.match(request);
        const offline = await caches.match('/offline.html')
        return cachedResponse || offline;
    }
}

self.addEventListener("install", (event) => {
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
    if (event.request.method !== 'GET' || isBlackListed(event.request.url)) {
        return;
    }
    event.respondWith(networkFirst(event.request));
});
