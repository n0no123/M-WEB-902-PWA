import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";
import {Recipe} from "../../models/recipe";

type Return = {
    id: string;
    name: string;
    tags: string[];
    totalPreparationTimeInMinutes: number;
    avgRating: number;
    ownerId: string;
    servings: number;
}[]

const lookup = async (): Promise<EndpointReturn<Return>> => {
    const recipeRepository = datasource.getRepository(Recipe);

    const recipes = await recipeRepository.find({
        relations: ["owner", "ratings"]
    });

    const result = recipes.map(recipe => ({
        id: recipe.id,
        name: recipe.name,
        tags: recipe.tags,
        totalPreparationTimeInMinutes: recipe.cookingTimeInMinutes + recipe.preparationTimeInMinutes,
        avgRating: (recipe.ratings.length) > 0 ?
            recipe.ratings.reduce((acc, curr) => acc + curr.rating, 0) / recipe.ratings.length :
            0,
        ownerId: recipe.owner.id,
        servings: recipe.servings
    }));

    return {
        status: 200,
        body: result
    }
}

export default lookup;
