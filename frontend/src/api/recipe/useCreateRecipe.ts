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
    image: Blob | undefined;
}

type Return = {
    id: string;
}

const useCreateRecipe = () =>
    useMutation<Return, ApiError, Params>(
        "createRecipe",
        async (params) => {
            const formData = new FormData();
            formData.append("name", params.name);
            formData.append("description", params.description);
            formData.append("steps", JSON.stringify(params.steps));
            formData.append("tags", JSON.stringify(params.tags));
            formData.append("cookingTimeInMinutes", params.cookingTimeInMinutes.toString());
            formData.append("preparationTimeInMinutes", params.preparationTimeInMinutes.toString());
            formData.append("servings", params.servings.toString());
            formData.append("ingredients", JSON.stringify(params.ingredients));

            if (params.image) {
                formData.append("image", params.image);
            }
            const res = await axiosBase
                .put<Return>(
                    "/recipe/",
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        }
                    })
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
            return res.data;
        }
    );

export default useCreateRecipe;
