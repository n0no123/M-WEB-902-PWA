import {useAuthentication} from "../../utils/AuthenticationContext";

const useLogout = () => {
    const { setToken } = useAuthentication();

    return {
        mutate: () => setToken(null)
    }
};

export default useLogout;
