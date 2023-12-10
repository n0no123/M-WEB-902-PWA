import {User} from "../../../models/user";
import {EndpointReturn} from "../../_misc/endpoint-return";
import datasource from "../../../misc/datasource";
import {Cookbook} from "../../../models/cookbook";
import {Equal} from "typeorm";

type Response = {
    recipesIds: string[];
}

const getRecipes = async (user: User): Promise<EndpointReturn<Response>> => {
    const cookBook = await datasource.getRepository(Cookbook).findOneBy({user: Equal(user)});

    if (!cookBook) {
        return {status: 404, errorMessage: 'Cookbook not found'};
    }
    const recipesIds = cookBook.recipes.map(r => r.id);
    return {status: 200, body: {recipesIds}};
}

export default getRecipes;
