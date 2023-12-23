import { CSSProperties } from 'react';
import '../styles/base.css'
import '../styles/main.css'

type Props = {
    id: string,
    image: string,
    name: string,
    rating: number,
}

const CardStyle: CSSProperties = {
    backgroundColor: 'var(--color-neutral-white)',
    borderRadius: '1em',
    height: '15em',
    width: '21.5em',
}

const ImageStyle: CSSProperties = {
    borderRadius: '1em',
    maxHeight: '8.75em',
    maxWidth: '21.5em',
    objectFit: 'cover'
}

const TitleStyle: CSSProperties = {
    color: 'var(--color-primary)',
    marginLeft: '0.5em'
}

const RatingStyle: CSSProperties = {
    color: 'var(--color-primary)',
    marginLeft: '0.5em'
}

function RecipeCard({ id, image, name, rating }: Props) {
    return (
        <div style={CardStyle} className='flex-v clickable' onClick={() => console.log(`recipeId: ${id}`)}>
            <img src={`${process.env.PUBLIC_URL}/assets/${image}`} alt="velouté de giraumon" style={ImageStyle} />
            <div>
                <h3 style={TitleStyle}>{name}</h3>
                <p style={RatingStyle}>{rating}</p>
            </div>
        </div>
    );
}

export default RecipeCard;
