import { CSSProperties, useMemo, useState } from "react";
import Header from "../../components/Header";
import RecipeCard from "../../components/RecipeCard";
import useLookupRecipes from "../../api/recipe/useLookupRecipes";
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

function Trending() {
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const lookupRecipes = useLookupRecipes();

  const recipes = useMemo(() => {
    if (lookupRecipes.isSuccess) {
      return lookupRecipes.data;
    } else if (lookupRecipes.isError) {
      setOpen(true);
      setMessage('An error has occured.');
    }
  }, [lookupRecipes]);
  
  return (
    <>
      <div>
        <Header />
        <div className='centered' style={GridStyle}>
          {
            (recipes ?? []).map((e, index) => <RecipeCard key={index} id={e.id} image={'/assets/veloute-de-giraumon.jpg'} name={e.name} rating={e.avgRating} />)
          }
        </div>
      </div>
      <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
    </>
  );
}

export default Trending;
