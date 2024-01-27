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

const useCreateUserAccount = () => {
    const {setToken} = useAuthentication();

    return useMutation<void, ApiError, Params>(
        "createUserAccount",
        async ({email, password}) => {
            const result = await axiosBase.put<Result>("/account", {
                email,
                password,
            }).catch(parseApiError);

            if (isApiError(result)) {
                throw result;
            } else {
                setToken(result.data.token);
            }
        }
    );
}

export default useCreateUserAccount
