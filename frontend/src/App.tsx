import './styles/base.css';
import Trending from './pages/trending';
import SignUp from './pages/sign-up';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Recipe from "./pages/recipe";

const App = () =>
    <Router>
        <Routes>
            <Route path="/">
                <Route path="/sign-up" element={<SignUp />} />
                <Route index element={<Trending />} />
                <Route path="recipe/:id" element={<Recipe />} />
            </Route>
        </Routes>
    </Router>;

export default App;
