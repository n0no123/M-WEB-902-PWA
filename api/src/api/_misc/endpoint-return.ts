type RawEndpointReturn<ReturnType> = {
    status: 200;
    body: ReturnType;
}

type WithoutNever<T> = {
    [K in keyof RawEndpointReturn<T> as RawEndpointReturn<T>[K] extends never ? never : K]: RawEndpointReturn<T>[K];
}

export type EndpointReturn<T> = WithoutNever<T> | {
    status: 400 | 401 | 403 | 404 | 409 | 500;
    errorMessage: string;
}
