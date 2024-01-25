import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useLogout from '../api/account/useLogout';
import { useLocation, useNavigate } from "react-router-dom";
import CreateRecipe from './CreateRecipe';

export default function Header() {
    const hook = useLogout();
    const location = useLocation();
    const navigate = useNavigate();


    const handleSubmit = () => {
        hook.mutate();
        navigate('/sign-in');
    };

    return (
        <AppBar position="static" onSubmit={handleSubmit}>
            <Toolbar sx={{ gap: '1%' }}>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    UN PEU MOINS D'UN KILO
                </Typography>
                <Link href={location.pathname === "/cookbook" ? "/" : "/cookbook"} color="inherit" underline='none'>
                    {location.pathname === "/cookbook" ? "TRENDING" : "COOKBOOK"}
                </Link>
                <CreateRecipe />
                <Button color="inherit" onClick={handleSubmit}>Sign Out</Button>
            </Toolbar>
        </AppBar>
    );
}
