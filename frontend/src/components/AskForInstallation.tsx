import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import {useCallback, useEffect, useState, useMemo} from "react";

const AskForInstallation = () => {
    const [open, setOpen] = useState(false);
    const close = useCallback(
        () => setOpen(false),
        [setOpen]
    );

    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null)

    const canInstall = useMemo(() => {
        return installPromptEvent !== null;
    }, [installPromptEvent]);

    useEffect(() => {
        setOpen(canInstall);
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        });
    }, [installPromptEvent]);

    const installApp = () => {
        close();
        if (!installPromptEvent) {
            return;
        }
        installPromptEvent.prompt();
    }

    return <Dialog
        open={open}
        onClose={close}
    >
        <DialogTitle>This website can be an application!</DialogTitle>
        <DialogContent dividers>
            <Typography>
                You'll be able to install it on your device and use it offline.
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
                onClick={installApp}
                variant={"contained"}
            >
                Sure!
            </Button>
        </DialogActions>
    </Dialog>;
}

export default AskForInstallation;
