import { Alert, Snackbar } from '@mui/material';

type Props = {
    open: boolean,
    message: string,
    setOpen: (value: boolean) => void,
    setMessage: (message: string) => void
}

export default function Error({ open, message, setOpen, setMessage }: Props) {


    const onClose = () => {
        setOpen(false);
        setMessage('');
    }

    return (
        <Snackbar
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            open={open}
            autoHideDuration={6000}
            onClose={onClose}
        >
            <Alert
                onClose={onClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
