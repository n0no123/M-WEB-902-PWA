import {useMutation, useQuery} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";

type Params = {
    email: string;
    password: string;
};

type Result = {
    token: string;
};

const useCreateUserAccount = () =>
    useMutation<void, ApiError, Params>(
        "createUserAccount",
        async ({email, password}) => {
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


export default useCreateUserAccount
