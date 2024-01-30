import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { useCallback, useState, useMemo, useEffect } from "react";
import { useInstallation } from "../utils/InstallationContext";

const AskForInstallation = () => {
    const [open, setOpen] = useState(false);
    const close = useCallback(
        () => setOpen(false),
        [setOpen]
    );
    const { installationEvent, setInstallationEvent } = useInstallation();

    useEffect(() => {
        if (installationEvent) {
            setOpen(true);
        }
    }, [installationEvent, setOpen]);

    const canInstall = useMemo(() => {
        return installationEvent !== null;
    }, [installationEvent]);

    const installApp = () => {
        close();
        if (!installationEvent) {
            return;
        }
        installationEvent.prompt();
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
