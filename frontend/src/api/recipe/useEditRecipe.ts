import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";

export type IngredientDto = {
    name: string;
    quantityWithUnit: string;
}

type Params = {
    id: string;
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

const useEditRecipe = () =>
    useMutation<Return, ApiError, Params>(
        "createRecipe",
        async (params) => {
            const res = await axiosBase
                .put<Return>(`/recipe/${params.id}`, params)
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
            return res.data;
        }
    );

export default useEditRecipe;
