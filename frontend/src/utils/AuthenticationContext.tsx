import {createContext, ReactElement, useContext, useEffect, useState} from 'react';

const AuthenticationContext = createContext({
    token: undefined as string | undefined | null,
    setToken: (_: string | null) => {}
});

export const useAuthentication = () => {
    return useContext(AuthenticationContext);
}

export const AuthenticationProvider = ({children}: { children: ReactElement }) => {
    const [token, setToken] = useState<string | undefined | null>(undefined);

    useEffect(
        () => {
            if (token === undefined)
                setToken(localStorage.getItem('token'));
            else {
                if (token !== null)
                    localStorage.setItem('token', token);
                else
                    localStorage.removeItem('token');
            }
        },
        [token]
    );
    return (
        <AuthenticationContext.Provider value={{
            token,
            setToken
        }}>
            {children}
        </AuthenticationContext.Provider>
    );
};
