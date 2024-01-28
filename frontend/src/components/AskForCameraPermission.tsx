import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";

const AskForCameraPermission = () => {
    const [open, setOpen] = useState(false);
    const close = useCallback(
        () => setOpen(false),
        [setOpen]
    );

    const noCamera = useMemo(
        () => !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia,
        []
    );

    const requestCameraPermission = useCallback(
        () => {
            close();
            navigator.mediaDevices.getUserMedia({video: true})
                .catch(console.error);
        },
        [close]
    );

    useEffect(() => {
        if (!noCamera) {
            return;
        }
        navigator.permissions.query({name: 'camera' as unknown as PermissionName})
            .then(permission => {
                if (permission.state === 'prompt') {
                    setOpen(true);
                }
            });
    }, []);

    return <Dialog
        open={open}
        onClose={close}
    >
        <DialogTitle>We'd love to use your camera</DialogTitle>
        <DialogContent dividers>
            <Typography>
                We'll use your camera to take pictures of your recipes !
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
                onClick={requestCameraPermission}
                variant={"contained"}
            >
                Allow
            </Button>
        </DialogActions>
    </Dialog>
}

export default AskForCameraPermission;
