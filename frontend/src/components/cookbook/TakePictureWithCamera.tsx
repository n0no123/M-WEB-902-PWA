import {useEffect, useMemo, useRef} from "react";
import {Button} from "@mui/material";

type TakePictureWithCameraProps = {
    picture: string,
    setPicture: (value: string) => void
}

const TakePictureWithCamera = ({picture, setPicture}: TakePictureWithCameraProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    useEffect(() => {
            navigator.mediaDevices.enumerateDevices()
                .then(async devices => {
                    // const videoDevices = devices.filter(device => device.kind === 'videoinput');
                    // videoDevice.current = videoDevices[0];
                    //
                    // if (!videoDevice.current)
                    //     return;
                    streamRef.current = await navigator.mediaDevices.getUserMedia({
                        video: {
                            // deviceId: videoDevice.current.deviceId
                        }
                    });
                    if (videoRef.current) {
                        await videoRef.current.play()
                        videoRef.current.srcObject = streamRef.current;
                    }
                })
                .catch(console.error);
        },
        []
    );

    return <>
        <video ref={videoRef}/>
        <canvas ref={canvasRef}/>
        <Button>
            Take picture
        </Button>
    </>
}

export default TakePictureWithCamera;
