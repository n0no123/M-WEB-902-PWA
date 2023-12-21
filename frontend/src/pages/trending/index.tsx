import { CSSProperties } from "react";
import Header from "../../components/Header";
import RecipeCard from "../../components/RecipeCard";
import useLookupRecipes from "../../api/recipe/useLookupRecipes";

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

  const {data} = useLookupRecipes();

  return (
    <div>
      <Header />
        <div className='centered' style={GridStyle}>
          {
            data?.map((e, index) => <RecipeCard key={index} id={e.id} image={'veloute-de-giraumon.jpg'} name={e.name} rating={e.avgRating} />)
          }
      </div>
    </div>
  );
}

export default Trending;