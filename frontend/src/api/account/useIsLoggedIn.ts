import {useMemo} from "react";

const useIsLoggedIn = () => localStorage.getItem("token") !== null;

export default useIsLoggedIn;
