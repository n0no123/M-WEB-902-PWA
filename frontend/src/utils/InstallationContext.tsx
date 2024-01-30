import {createContext, ReactElement, useContext, useEffect, useState} from 'react';

const InstallationContext = createContext({
    installationEvent: null as any | null,
    setInstallationEvent: (_: any | null) => {}
});

export const useInstallation = () => {
    return useContext(InstallationContext);
}

export const InstallationProvider = ({children}: { children: ReactElement }) => {
    const [installationEvent, setInstallationEvent] = useState<any | null >(null);

    useEffect(() => {
        console.log("useEffect HEADER");
        const lambda = (e: Event) => {
            e.preventDefault();
            console.log("useEffect HEADER lambda");
            setInstallationEvent(e);
        }
        window.addEventListener('beforeinstallprompt', lambda);
        return () => {
            console.log("useEffect HEADER demount");
            window.removeEventListener('beforeinstallprompt', lambda);
        }
    }, [setInstallationEvent]);
    return (
        <InstallationContext.Provider value={{
            installationEvent,
            setInstallationEvent
        }}>
            {children}
        </InstallationContext.Provider>
    );
};
