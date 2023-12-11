import axiosBase from "../../_misc/axios-base";
import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../../_misc/api-error";

type Params = {
    recipeId: string;
}

const useAddRecipeToCookBook = () =>
    useMutation<void, ApiError, Params>(
        "addRecipeToCookBook",
        async ({recipeId}) => {
            const res = await axiosBase
                .delete(`/cookbook/${recipeId}`)
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
        }
    );

export default useAddRecipeToCookBook;
