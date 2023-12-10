import axios from "axios";

const axiosBase = axios.create({
    baseURL: process.env.REACT_APP_API_URL
});

axiosBase.interceptors.request.use(
    config => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    }
);

export default axiosBase;
