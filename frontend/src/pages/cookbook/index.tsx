import Header from "../../components/Header";
import useIsLoggedIn from "../../api/account/useIsLoggedIn";
import { useNavigate } from "react-router-dom";

function Cookbook() {
    const auth = useIsLoggedIn();
    const navigate = useNavigate();
  
    if (!auth.data) {
      navigate('/sign-in')
    }
  
    return (
        <div>
            <Header />
            C O O K B O O K
        </div>
    );
}

export default Cookbook;
