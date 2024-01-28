import {useMutation} from "react-query";
import {ApiError, isApiError, parseApiError} from "../_misc/api-error";
import axiosBase from "../_misc/axios-base";
import {useAuthentication} from "../../utils/AuthenticationContext";

type Params = {
    email: string;
    password: string;
};

type Result = {
    token: string;
};

const useLogin = () => {
    const {setToken} = useAuthentication();

    return useMutation<void, ApiError, Params>(
        "login",
        async ({email, password}) => {
            const result = await axiosBase.get<Result>("/account", {
                params: {
                    email,
                    password,
                }
            }).catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            }
            setToken(result.data.token);
        }
    );
}
export default useLogin;
