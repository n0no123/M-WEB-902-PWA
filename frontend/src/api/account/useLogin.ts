import axios from "axios";
import {useMutation, useQuery} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";

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
            const result = await axios.get<Result>("/account", {
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
