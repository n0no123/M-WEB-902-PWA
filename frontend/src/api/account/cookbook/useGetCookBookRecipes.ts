import {useQuery} from "react-query";
import axiosBase from "../../_misc/axios-base";
import {isApiError, parseApiError} from "../../_misc/api-error";

type Return = {
    recipesIds: string[];
}

const useGetCookBookRecipes = () =>
    useQuery<Return, Error>(
        "getCookBookRecipes",
        async () => {
            const result = await axiosBase
                .get<Return>("/account/cookbook")
                .catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            }
            return result.data;
        },
        {
            refetchInterval: 6000
        }
    );

export default useGetCookBookRecipes;
