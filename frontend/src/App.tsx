import './styles/base.css';
import Trending from './pages/trending';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipe from "./pages/recipe";
import Cookbook from './pages/cookbook';
import { useEffect, useState } from "react";
import { Alert, Snackbar, ThemeProvider } from '@mui/material';
import AskForNotificationsPermission from "./components/AskForNotificationsPermission";
import theme from './styles/Theme';

const App = () => {
    const [registrationError, setRegistrationError] = useState(false);

    useEffect(() => {
        navigator.serviceWorker.register('/sw.js')
            .catch((registrationError) => {
                setRegistrationError(true);
                console.error(registrationError);
            });
    }, []);

    return <>
        <ThemeProvider theme={theme}>
            <AskForNotificationsPermission />
            <Snackbar
                open={registrationError}
                autoHideDuration={6000}
                onClose={() => setRegistrationError(false)}
            >
                <Alert severity={"error"}>An error occurred during service worker registration. Check console for more details</Alert>
            </Snackbar>
            <Router>
                <Routes>
                    <Route path="/">
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/cookbook" element={<Cookbook />} />
                        <Route index element={<Trending />} />
                        <Route path="recipe/:id" element={<Recipe />} />
                    </Route>
                </Routes>
            </Router>
        </ThemeProvider>
    </>;
}

export default App;
