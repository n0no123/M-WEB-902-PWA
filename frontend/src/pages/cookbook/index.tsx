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
    paddingTop: '2em',
    paddingBottom: '6em',
    placeItems: 'center'
}

function Cookbook() {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const {data} = useGetCookBookRecipes();

    return (
        <>
            <div>
                <Header />
                <div className='centered' style={GridStyle}>
                    {
                        (data?.recipesIds ?? []).map(
                                recipeId =>
                                    <RecipeCard
                                        key={recipeId}
                                        recipeId={recipeId}
                                    />
                            )
                    }
                </div>
            </div>
            <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
        </>

    );
}

export default Cookbook;
