const useLogout = () =>
    ({
        mutate: () => {
            const localStorageItem = localStorage.getItem("token");

            if (localStorageItem !== null)
                localStorage.removeItem("token");
        }
    });

export default useLogout;
