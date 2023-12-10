import {useMemo} from "react";

const useLogout = () => {
    const localStorageItem = localStorage.getItem("token");

    if (localStorageItem !== null)
        localStorage.removeItem("token");
}
