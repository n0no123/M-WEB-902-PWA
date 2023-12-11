const useIsLoggedIn = () => ({
    data: localStorage.getItem("token") !== null
})

export default useIsLoggedIn;
