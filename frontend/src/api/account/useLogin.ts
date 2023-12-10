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

const useLogin = ({email, password}: Params) => {
    return useMutation<void, ApiError>(
        "login",
        async () => {
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
}

export default useLogin;
