import {User} from "../../models/user";
import {EndpointReturn} from "../_misc/endpoint-return";
import datasource from "../../misc/datasource";
import {Recipe} from "../../models/recipe";
import {Ingredient} from "../../models/ingredient";

type IngredientDto = {
    name: string;
    quantityWithUnit: string;
}

type Params = {
    recipeId: string;
    name: string;
    description: string;
    steps: string[];
    tags: string[];
    cookingTimeInMinutes: number;
    preparationTimeInMinutes: number;
    ingredients: IngredientDto[];
    servings: number;
}

type Return = void;

const edit = async (params: Params, user?: User): Promise<EndpointReturn<Return>> => {
    const recipeRepository = datasource.getRepository(Recipe);
    const ingredientRepository = datasource.getRepository(Ingredient);

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
    if (recipe.owner.id !== user?.id) {
        return {
            status: 403,
            errorMessage: "You are not allowed to edit this recipe"
        }
    }
    recipe.name = params.name;
    recipe.description = params.description;
    recipe.steps = params.steps;
    recipe.tags = params.tags;
    recipe.cookingTimeInMinutes = params.cookingTimeInMinutes;
    recipe.preparationTimeInMinutes = params.preparationTimeInMinutes;
    recipe.servings = params.servings;
    recipe.ingredients = params.ingredients.map(ingredient =>
        ingredientRepository.create({
            name: ingredient.name,
            quantityWithUnit: ingredient.quantityWithUnit
        }));

    await recipeRepository.save(recipe);
    await ingredientRepository.save(recipe.ingredients);
    return {
        status: 200,
        body: undefined
    }
};

export default edit;
