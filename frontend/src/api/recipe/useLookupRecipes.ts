import { useQuery } from "react-query";
import axiosBase from "../_misc/axios-base";
import { isApiError, parseApiError } from "../_misc/api-error";

type Return = {
    id: string;
    name: string;
    tags: string[];
    totalPreparationTimeInMinutes: number;
    avgRating: number;
    ownerId: string;
    servings: number;
}[]

const useLookupRecipes = () =>
    useQuery<Return, Error>(
        "lookupRecipes",
        async () => {
            const result = await axiosBase
                .get<Return>("/recipe/")
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

export default useLookupRecipes;
