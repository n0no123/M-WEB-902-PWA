import Header from "../../components/Header";
import RecipeCard from "../../components/cookbook/RecipeCard";
import useIsLoggedIn from "../../api/account/useIsLoggedIn";
import { useNavigate } from "react-router-dom";
import { CSSProperties } from "react";
import useGetCookBookRecipes from "../../api/account/cookbook/useGetCookBookRecipes";

const GridStyle: CSSProperties = {
    display: 'grid',
    gap: '2em',
    gridTemplateColumns: 'repeat(auto-fit, minmax(21.5em, 1fr))',
    margin: 'auto',
    maxWidth: '75%',
    paddingTop: '2em',
    placeItems: 'center'
}

function Cookbook() {
    const auth = useIsLoggedIn();
    const navigate = useNavigate();

    if (!auth.data) {
        navigate('/sign-in')
    }

    const { data } = useGetCookBookRecipes();

    return (
        <div>
            <Header />
            <div className='centered' style={GridStyle}>
                {
                    data?.recipesIds.map((e, index) => <RecipeCard key={index} recipeId={e} image={'/assets/veloute-de-giraumon.jpg'} />)
                }
            </div>
        </div>
    );
}

export default Cookbook;
