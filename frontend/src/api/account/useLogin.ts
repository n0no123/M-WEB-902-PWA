import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";

type Params = {
    email: string;
    password: string;
};

type Result = {
    token: string;
};

const useLogin = () =>
    useMutation<void, ApiError, Params>(
        "login",
        async ({ email, password}) => {
            const result = await axiosBase.get<Result>("/account", {
                params: {
                    email,
                    password,
                }
            }).catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            }
            localStorage.setItem("token", result.data.token);
        }
    );

export default useLogin;
