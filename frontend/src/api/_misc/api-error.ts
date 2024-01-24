import {AxiosError} from "axios";

export type ApiError = {
    status: 400 | 401 | 403 | 404 | 409 | 500
    errorMessage: string;
}

export const parseApiError = (err: AxiosError): ApiError => {
    if (err.response) {
        // Request made and server responded
        return {
            status: (err.response.status as ApiError["status"]),
            errorMessage: (err.response.data as { errorMessage: string }).errorMessage,
        };
    } else if (err.request) {
        // The request was made but no response was received
        return {
            status: 500,
            errorMessage: "No response from server",
        };
    } else {
        // Something happened in setting up the request that triggered an Error
        console.error(err);
        return {
            status: 500,
            errorMessage: "Error setting up request",
        };
    }
}

export const isApiError = <T>(err: T | ApiError): err is ApiError => {
    return (err as ApiError).status !== undefined && (err as ApiError).errorMessage !== undefined;
}
