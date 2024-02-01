import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLogout from '../api/account/useLogout';
import { AppBar, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import CreateRecipe from './CreateRecipe';
import useIsLoggedIn from "../api/account/useIsLoggedIn";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CookieIcon from '@mui/icons-material/Cookie';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';
import { useInstallation } from "../utils/InstallationContext";

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const logout = useLogout();
    const isLoggedIn = useIsLoggedIn()

    const {installationEvent, setInstallationEvent} = useInstallation();

    useEffect(() => {
        if (!isLoggedIn.data) {
            navigate('/sign-in');
        }
    }, [isLoggedIn, navigate]);

    const signOut = useCallback(() => {
        logout.mutate();
        navigate('/sign-in');
    }, [logout, navigate]);

    const canInstall = useMemo(() => {
        return installationEvent !== null;
    }, [installationEvent]);

    const installApp = useCallback(() => {
        if (!installationEvent) {
            return;
        }
        installationEvent.prompt();
        setInstallationEvent(null);
    }, [installationEvent, setInstallationEvent]);

    return (
        isMobile ?
            <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
                <Toolbar sx={{ justifyContent: 'space-around' }}>
                    {
                        canInstall &&
                        <IconButton color="inherit" onClick={installApp}>
                            <DownloadIcon />
                        </IconButton>
                    }
                    <IconButton color="inherit" onClick={() => navigate(location.pathname === "/cookbook" ? "/" : "/cookbook")}>
                        {location.pathname === "/cookbook" ? <WhatshotIcon /> : <CookieIcon />}
                    </IconButton>
                    <CreateRecipe isMobile={isMobile} />
                    <IconButton color="inherit" onClick={signOut}>
                        <LogoutIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            :
            <AppBar position="static" onSubmit={signOut}>
                <Toolbar sx={{ gap: '1%' }}>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
                        UN PEU MOINS D'UN KILO
                    </Typography>
                    {
                        canInstall &&
                        <Button color="inherit" onClick={installApp}>Install App</Button>
                    }
                    <Button onClick={() => navigate(location.pathname === "/cookbook" ? "/" : "/cookbook")} color="inherit">
                        {location.pathname === "/cookbook" ? "TRENDING" : "COOKBOOK"}
                    </Button>
                    <CreateRecipe isMobile={isMobile} />
                    <Button color="inherit" onClick={signOut}>Sign Out</Button>
                </Toolbar>
            </AppBar>
    );
}
