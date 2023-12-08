import {sign} from "jsonwebtoken";
import {compare} from "bcrypt";
import datasource from "../../misc/datasource";
import {User} from "../../models/user";
import {env} from "../../misc/env";
import {EndpointReturn} from "../_misc/endpoint-return";

type Params = {
    email: string;
    password: string;
}

type Response = {
    token: string;
}

const login = async ({email, password}: Params): Promise<EndpointReturn<Response>> => {
    const user = await datasource.getRepository(User)
        .findOneBy({ email });

    if (!user) {
        return { status: 401 };
    }
    const isPasswordValid = await compare(user.password, password);

    if (!isPasswordValid) {
        return { status: 401 };
    }
    const token = sign(
        user.id,
        env.token.secret,
        {expiresIn: env.token.expirationTime}
    );

    return {
        status: 200,
        body: { token }
    };
};

export default login;
