import { CSSProperties } from "react";
import Header from "../../components/Header";
import ReceipeCard from "../../components/ReceipeCard";

const mockData = [
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },

  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
  {
    image: 'veloute-de-giraumon.jpg',
    title: 'Velouté de giraumon',
    rating: 4.7
  },
]

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
  return (
    <div>
      <Header />
        <div className='centered' style={GridStyle}>
          {
            mockData.map((e, index) => <ReceipeCard key={index} image={e.image} title={e.title} rating={e.rating} />)
          }
      </div>
    </div>
  );
}

export default Trending;