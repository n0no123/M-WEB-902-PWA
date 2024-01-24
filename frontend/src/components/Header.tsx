import { CSSProperties } from 'react';

const HeaderStyle: CSSProperties = {
    backgroundColor: 'var(--color-neutral-white)',
    borderBottom: '1px solid black'
}

const TitleStyle: CSSProperties = {
    color: 'var(--color-primary)'
}

function Header() {
    return (
        <div style={HeaderStyle} className='flex-h centered'>
            <h1 style={TitleStyle}>Un peu moins d'un kilo</h1>
        </div>
    );
}

export default Header;
