import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";

export type IngredientDto = {
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
}

type Return = {
    id: string;
}

const useCreateRecipe = () =>
    useMutation<Return, ApiError, Params>(
        "createRecipe",
        async (params) => {
            const res = await axiosBase
                .put<Return>("/recipe/", params)
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
            return res.data;
        }
    );

export default useCreateRecipe;
