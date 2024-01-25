import {sign} from "jsonwebtoken";
import {hash} from "bcrypt";
import datasource from "../../misc/datasource";
import {User} from "../../models/user";
import {env} from "../../misc/env";
import {EndpointReturn} from "../_misc/endpoint-return";
import {Cookbook} from "../../models/cookbook";

type Params = {
    email: string;
    password: string;
}

type Response = {
    token: string;
}

const create = async ({email, password}: Params): Promise<EndpointReturn<Response>> => {
    const userRepository = datasource.getRepository(User);
    const cookbookRepository = datasource.getRepository(Cookbook);
    const encryptedPassword = await hash(password, 10);
    const userAlreadyExists = await userRepository.countBy({email}) > 0;

    if (userAlreadyExists) {
        return {status: 409, errorMessage: 'User already exists'};
    }
    const createdCookBook = cookbookRepository.create({});

    const createdUser = userRepository.create({
        email,
        password: encryptedPassword,
        myRecipes: [],
        cookbook: createdCookBook,
    });
    const resultUser = await userRepository.save(createdUser);
    createdCookBook.user = resultUser;
    await cookbookRepository.save(createdCookBook);
    const token = sign(
        {id: resultUser.id},
        env.token.secret,
        {expiresIn: env.token.expirationTime}
    );

    return {
        status: 200,
        body: {token}
    };
};

export default create;
