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
  paddingTop: '2em',
  paddingBottom: '6em',
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
      <Header />
      <div className='centered' style={GridStyle}>
        {
          (recipes ?? []).map(e =>
            <RecipeCard
              key={e.id}
              id={e.id}
              image={e.image ? `${process.env.REACT_APP_API_URL}${e.image}` : '/assets/placeholder.png'}
              name={e.name}
              rating={e.avgRating}
            />)
        }
      </div>
      <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
    </>
  );
}

export default Trending;
