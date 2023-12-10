import {User} from "../../../models/user";
import {EndpointReturn} from "../../_misc/endpoint-return";
import datasource from "../../../misc/datasource";
import {Cookbook} from "../../../models/cookbook";
import {Recipe} from "../../../models/recipe";
import {Equal} from "typeorm";

type Params = {
    recipeId: string;
}

const removeRecipe = async (params: Params, user: User): Promise<EndpointReturn<never>> => {
    const cookbookRepository = datasource.getRepository(Cookbook);
    const recipeRepository = datasource.getRepository(Recipe);
    const cookbook = await cookbookRepository.findOneBy({user: Equal(user)});
    const recipe = await recipeRepository.findOneBy({id: params.recipeId});

    if (!cookbook) {
        return {status: 404, errorMessage: 'Cookbook not found'};
    }
    if (!recipe) {
        return {status: 404, errorMessage: 'Recipe not found'};
    }

    const recipeInCookbook = cookbook.recipes.find(r => r.id === recipe.id);
    if (!recipeInCookbook) {
        return {status: 404, errorMessage: 'Recipe not found in cookbook'};
    }

    cookbook.recipes = cookbook.recipes.filter(r => r.id !== recipe.id);

    await cookbookRepository.save(cookbook);
    return {status: 200};
}

export default removeRecipe;
