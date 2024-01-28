import webPush, {PushSubscription} from 'web-push';
import {env} from "../misc/env";

type SendNotificationParams = {
    userEndpoint: PushSubscription;
    message: string;
    url: string;
    title: string;
}

class PushNotification {
    private webPush = webPush;

    constructor() {
        this.webPush.setVapidDetails(
            'https://zazuapp.com',
            env.vapid.publicKey,
            env.vapid.privateKey,
        );

    }

    sendNotification(
        {message, userEndpoint, url, title}: SendNotificationParams
    ) {
        this.webPush.sendNotification(
            userEndpoint,
            JSON.stringify({
                title,
                body: message,
                url,
            }),
        ).catch((err) => {
            console.error(err);
        });
    }
}

let instance: PushNotification | null = null
const pushNotificationSingleton = () => {
    if (instance === null) {
        instance = new PushNotification()
    }
    return instance;
}

export default pushNotificationSingleton;
