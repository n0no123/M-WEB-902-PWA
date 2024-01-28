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
