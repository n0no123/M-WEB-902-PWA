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
        const lambda = (e: Event) => {
            e.preventDefault();
            setInstallationEvent(e);
        }
        window.addEventListener('beforeinstallprompt', lambda);
        return () => {
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
