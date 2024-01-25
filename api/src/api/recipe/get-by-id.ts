import {EndpointReturn} from "../_misc/endpoint-return";
import {User} from "../../models/user";
import datasource from "../../misc/datasource";
import {Recipe} from "../../models/recipe";

type Params = {
    recipeId: string;
}

type IngredientDto = {
    name: string;
    quantityWithUnit: string;
}

type Return = {
    id: string;
    name: string;
    description: string;
    steps: string[];
    tags: string[];
    cookingTimeInMinutes: number;
    preparationTimeInMinutes: number;
    totalPreparationTimeInMinutes: number;
    ingredients: IngredientDto[];
    avgRating: number | undefined;
    yourRating: number | undefined;
    ownerId: string;
    servings: number;
    owner: boolean;
}

const getById = async (params: Params, user?: User): Promise<EndpointReturn<Return>> => {
    const recipeRepository = datasource.getRepository(Recipe);

    const recipe = await recipeRepository.findOne({
        where: {id: params.recipeId },
        relations: ["owner", "ingredients", "ratings"]
    });

    if (!recipe) {
        return {
            status: 404,
            errorMessage: "Recipe not found"
        }
    }
    return {
        status: 200,
        body: {
            id: recipe.id,
            name: recipe.name,
            description: recipe.description,
            steps: recipe.steps,
            tags: recipe.tags,
            cookingTimeInMinutes: recipe.cookingTimeInMinutes,
            preparationTimeInMinutes: recipe.preparationTimeInMinutes,
            totalPreparationTimeInMinutes: recipe.cookingTimeInMinutes + recipe.preparationTimeInMinutes,
            ingredients: recipe.ingredients.map(({name, quantityWithUnit}) => ({
                name,
                quantityWithUnit
            })),
            avgRating: (recipe.ratings.length) > 0 ?
                recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0) / recipe.ratings.length :
                undefined,
            yourRating: user ?
                recipe.ratings.find(rating => rating.user.id === user.id)?.rating :
                undefined,
            ownerId: recipe.owner.id,
            servings: recipe.servings,
            owner: user ? recipe.owner.id === user.id : false
        }
    }
}

export default getById;
