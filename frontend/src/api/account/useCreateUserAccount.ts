import {useQuery} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";

type Params = {
    email: string;
    password: string;
};

type Result = {
    token: string;
};

const useCreateUserAccount = ({email, password}: Params) => {
    return useQuery<void, ApiError>(
        "createUserAccount",
        async () => {
            const result = await axiosBase.put<Result>("/account", {
                email,
                password,
            }).catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            }
            localStorage.setItem("token", result.data.token);
        }
    );
}

export default useCreateUserAccount

//TODO: needs to be refactored (createUserAccount & login) shouldnt be hooks
