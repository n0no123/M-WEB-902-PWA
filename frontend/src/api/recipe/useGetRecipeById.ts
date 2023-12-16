import {useQuery} from "react-query";
import axiosBase from "../_misc/axios-base";
import {isApiError, parseApiError} from "../_misc/api-error";

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
    avgRating: number;
    yourRating: number | undefined;
    ownerId: string;
    servings: number;
}

const useGetRecipeById = ({ recipeId }: Params) =>
    useQuery<Return, Error>(
        "getRecipeById",
        async () => {
            const result = await axiosBase
                .get<Return>("/recipe/" + recipeId)
                .catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            }
            return result.data;
        }
    );

export default useGetRecipeById;
