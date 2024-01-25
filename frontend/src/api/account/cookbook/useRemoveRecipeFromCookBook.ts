import axiosBase from "../../_misc/axios-base";
import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../../_misc/api-error";

type Params = {
    recipeId: string;
}

const useRemoveRecipeToCookBook = () =>
    useMutation<void, ApiError, Params>(
        "removeRecipeToCookBook",
        async ({recipeId}) => {
            const res = await axiosBase
                .delete(`/account/cookbook/${recipeId}`)
                .catch(parseApiError);

            if (isApiError(res)) {
                throw res;
            }
        }
    );

export default useRemoveRecipeToCookBook;
