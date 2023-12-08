import {sign} from "jsonwebtoken";
import {hash} from "bcrypt";
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

const create = async ({email, password}: Params): Promise<EndpointReturn<Response>> => {
    const repository = datasource.getRepository(User);
    const encryptedPassword = await hash(password, 10);
    const createdUser = repository.create({
        email,
        password: encryptedPassword,
        myRecipes: []
    });
    const resultUser = await repository.save(createdUser);
    const token = sign(
        resultUser.id,
        env.token.secret,
        {expiresIn: env.token.expirationTime}
    );

    return {
        status: 200,
        body: { token }
    };
};

export default create;
