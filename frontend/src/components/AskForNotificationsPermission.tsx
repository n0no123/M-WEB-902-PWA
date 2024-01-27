import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useCallback, useEffect, useState} from "react";
import {handleSubscription} from "../utils/sw-utils";
import useIsLoggedIn from "../api/account/useIsLoggedIn";

const AskForNotificationsPermission = () => {
    const {data: isLoggedIn} = useIsLoggedIn();
    const [open, setOpen] = useState(false);
    const close = useCallback(
        () => setOpen(false),
        [setOpen]
    );

    const requestNotificationPermission = useCallback(
        () => {
            close();
            Notification.requestPermission()
                .then(async permission => {
                    if (permission === 'granted') {
                        const registration = await navigator.serviceWorker.getRegistration();

                        if (!registration)
                            console.error('Service worker not registered');
                        else
                            await handleSubscription(registration);
                    }
                });
        },
        [close]
    );

    useEffect(
        () => {
            console.log('useEffect');
        if (isLoggedIn && Notification.permission === 'default')
            setOpen(true);
        },
        [isLoggedIn]
    );

    return <Dialog
        open={open}
        onClose={close}
    >
        <DialogTitle>We'd love to send you notifications</DialogTitle>
        <DialogContent dividers>
            <Typography>
                We'll send you notifications when someone likes your recipe !
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button
                onClick={close}
                variant={"outlined"}
            >
                No thanks
            </Button>
            <Button
                onClick={requestNotificationPermission}
                variant={"contained"}
            >
                Sure!
            </Button>
        </DialogActions>
    </Dialog>;
}

export default AskForNotificationsPermission;
