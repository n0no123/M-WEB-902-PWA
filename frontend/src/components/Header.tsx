import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useLogout from '../api/account/useLogout';
import { AppBar, Button, IconButton, Toolbar, Typography, useMediaQuery, useTheme } from '@mui/material';
import CreateRecipe from './CreateRecipe';
import useIsLoggedIn from "../api/account/useIsLoggedIn";
import WhatshotIcon from '@mui/icons-material/Whatshot';
import CookieIcon from '@mui/icons-material/Cookie';
import LogoutIcon from '@mui/icons-material/Logout';
import DownloadIcon from '@mui/icons-material/Download';

export default function Header() {
    const location = useLocation();
    const navigate = useNavigate();

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const logout = useLogout();
    const isLoggedIn = useIsLoggedIn()

    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null)

    useMemo(() => {
        if (!isLoggedIn.data) {
            navigate('/sign-in');
        }
    }, [isLoggedIn, navigate]);

    const signOut = () => {
        logout.mutate();
        navigate('/sign-in');
    };

    const canInstall = useMemo(() => {
        return installPromptEvent !== null;
    }, [installPromptEvent]);

    useEffect(() => {
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        });
    }, [installPromptEvent]);

    const installApp = () => {
        if (!installPromptEvent) {
            return;
        }
        installPromptEvent.prompt();
        setInstallPromptEvent(null);
    }

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
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
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
