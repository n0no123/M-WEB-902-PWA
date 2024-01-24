import { CSSProperties } from "react";

const CardStyle: CSSProperties = {
    backgroundColor: 'var(--color-neutral-white)',
    borderRadius: '1em',
    height: '15em',
    margin: 'auto',
    width: '21.5em'
};

function SignUp() {
    return (
        <form action="/trending" method="put" className="centered flex-v" style={CardStyle}>
            <h2>Sign up</h2>
            <label htmlFor="mail">Email:</label>
            <input type="email" id="mail" name="user_email" />
            <label htmlFor="password">Password:</label>
            <input id="password" name="user_password" type="password" />
            <button type="submit">Sign up</button>
            <a href="http://localhost:3000/sign-in">Already have an account? Click here!</a>
        </form>
    );
}

export default SignUp;
