import { CSSProperties } from 'react';
import '../styles/base.css'
import '../styles/main.css'

type ReceipeCardProps = {
    image: string,
    title: string,
    rating: number
}

const ReceipeCardStyle: CSSProperties = {
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

function ReceipeCard({ image, title, rating }: ReceipeCardProps) {
    return (
        <div style={ReceipeCardStyle} className='flex-v clickable'>
            <img src={`${process.env.PUBLIC_URL}/assets/${image}`} alt="velouté de giraumon" style={ImageStyle} />
            <div>
                <h3 style={TitleStyle}>{title}</h3>
                <p style={RatingStyle}>{rating}</p>
            </div>
        </div>
    );
}

export default ReceipeCard;
