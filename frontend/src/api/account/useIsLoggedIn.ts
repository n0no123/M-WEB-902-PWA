import {useAuthentication} from "../../utils/AuthenticationContext";

const useIsLoggedIn = () => {
    const {token} = useAuthentication();

    return {
        data: token !== null,
    };
}

export default useIsLoggedIn;
