import {User} from "../../models/user";
import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";
import {PushSubscription} from "web-push";
import pushNotificationProvider from "../../providers/push-notification";

type Params = {
    subscription: PushSubscription;
}

const subscribe = async ({subscription}: Params, user: User): Promise<EndpointReturn<never>> => {
    user.notificationLink = subscription;
    await datasource.getRepository(User).save(user);

    return {
        status: 200
    }
}

export default subscribe;
