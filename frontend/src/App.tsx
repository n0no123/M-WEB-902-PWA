import './styles/base.css';
import Trending from './pages/trending';
import SignUp from './pages/sign-up';
import SignIn from './pages/sign-in';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipe from "./pages/recipe";
import Cookbook from './pages/cookbook';

const App = () =>
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
    </Router>;

export default App;
