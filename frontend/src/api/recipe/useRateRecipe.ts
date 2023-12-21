import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";


type Params = {
    recipeId: string;
    rating: 0 | 1 | 2 | 3 | 4 | 5;
}

const useRateRecipe = () =>
    useMutation<void, ApiError, Params>(
        "rateRecipe",
        async ({recipeId, rating}) => {
            const res = await axiosBase
                .put("/recipe/" + recipeId, {rating})
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
        }
    );

export default useRateRecipe;
