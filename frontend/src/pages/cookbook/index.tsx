import { CSSProperties, useMemo, useState } from "react";
import Header from "../../components/Header";
import RecipeCard from "../../components/cookbook/RecipeCard";
import useGetCookBookRecipes from "../../api/account/cookbook/useGetCookBookRecipes";
import Error from "../../components/Error";

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
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const getCookBookRecipes = useGetCookBookRecipes();

    const recipeIds = useMemo(() => {
        if (getCookBookRecipes.isSuccess) {
            return getCookBookRecipes.data.recipesIds;
        } else if (getCookBookRecipes.isError) {
            setOpen(true);
            setMessage('An error has occured.');
        }
    }, [getCookBookRecipes]);

    return (
        <>
            <div>
                <Header />
                <div className='centered' style={GridStyle}>
                    {
                        (recipeIds ?? []).map((e, index) => <RecipeCard key={index} recipeId={e} image={'/assets/veloute-de-giraumon.jpg'} />)
                    }
                </div>
            </div>
            <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
        </>

    );
}

export default Cookbook;
