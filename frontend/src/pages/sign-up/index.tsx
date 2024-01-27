import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CssBaseline from '@mui/material/CssBaseline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import useCreateUserAccount from '../../api/account/useCreateUserAccount';
import Error from '../../components/Error';
import { validateEmail } from '../../utils/email-utils';

export default function SignUp() {
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    const signUp = useCreateUserAccount();
    const navigate = useNavigate();

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        const email = data.get('email');
        const password = data.get('password');

        if (email && password) {
            if (validateEmail(email.toString())) {
                signUp.mutate({ email: email.toString(), password: password.toString() }, {
                    onSuccess: () => {
                        navigate('/');
                    },
                    onError: (error) => {
                        setOpen(true);
                        setMessage(error.errorMessage);
                    }
                });
            } else {
                setOpen(true);
                setMessage('Please enter valid email address.');
            }
        } else {
            setOpen(true);
            setMessage('Please enter valid email address / password.');
        }
    };

    return (
        <>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box component="form" onSubmit={submit} noValidate sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="email"
                            label="Email Address"
                            name="email"
                            autoComplete="email"
                            autoFocus
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                        >
                            Sign Up
                        </Button>
                        <Grid container>
                            <Grid item>
                                <Link href="/sign-in" variant="body2">
                                    {"Already have an account? Sign In"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
            <Error open={open} message={message} setOpen={setOpen} setMessage={setMessage} />
        </>
    );
}
