import urlB64ToUint8Array from "./url-b64-to-uint8-array";
import axiosBase from "../api/_misc/axios-base";


export const requestNotificationPermission = async () => {
    if (Notification.permission === 'granted')
        return;
    return Notification.requestPermission()
        .then((permission) => {
            if (permission !== 'granted') {
                throw new Error('Permission not granted for Notification');
            }
        });
}

const subscribeUser = async (registration: ServiceWorkerRegistration): Promise<PushSubscription> => {
    const response = await fetch('/vapid-public-key.txt');
    const vapidPublicKey = await response.text();
    const convertedVapidKey = urlB64ToUint8Array(vapidPublicKey.trim());

    return registration
        .pushManager
        .subscribe({
            userVisibleOnly: true,
            applicationServerKey: convertedVapidKey
        });
}

export const handleSubscription = async (registration: ServiceWorkerRegistration) =>
    registration
        .pushManager
        .getSubscription()
        .then(async (subscription) => subscription ?? await subscribeUser(registration))
        .then(e => axiosBase.post("/account/subscribe", {subscription: e}))
