import {Ingredient} from "../../models/ingredient";
import {User} from "../../models/user";
import {Recipe} from "../../models/recipe";
import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";

type IngredientDto = {
    name: string;
    quantityWithUnit: string;
}

type Params = {
    name: string;
    description: string;
    steps: string[];
    tags: string[];
    cookingTimeInMinutes: number;
    preparationTimeInMinutes: number;
    ingredients: IngredientDto[];
    servings: number;
    imageName: string | undefined;
}

type Return = {
    id: string;
}

const create = async (params: Params, user: User): Promise<EndpointReturn<Return>> => {
    const recipeRepository = datasource.getRepository(Recipe);
    const ingredientRepository = datasource.getRepository(Ingredient);
    const recipe = recipeRepository.create({
        name: params.name,
        description: params.description,
        steps: params.steps,
        tags: params.tags,
        cookingTimeInMinutes: params.cookingTimeInMinutes,
        preparationTimeInMinutes: params.preparationTimeInMinutes,
        servings: params.servings,
        ingredients: params.ingredients.map(ingredient =>
            ingredientRepository.create({
                name: ingredient.name,
                quantityWithUnit: ingredient.quantityWithUnit
            })),
        owner: user,
        imageName: params.imageName
    });
    await ingredientRepository.save(recipe.ingredients);
    const savedRecipe = await recipeRepository.save(recipe);

    return {
        status: 200,
        body: { id: savedRecipe.id }
    }
}

export default create;
