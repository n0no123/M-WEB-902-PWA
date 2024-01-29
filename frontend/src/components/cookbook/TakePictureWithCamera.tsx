import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Button} from "@mui/material";

type TakePictureWithCameraProps = {
    setPicture: (value: string) => void
}

const TakePictureWithCamera = ({setPicture}: TakePictureWithCameraProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [retakePicture, setRetakePicture] = useState(false);

    useEffect(() => {
        navigator.mediaDevices.enumerateDevices()
            .then(async devices => {
                streamRef.current = await navigator.mediaDevices.getUserMedia({
                    video: {}
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    await videoRef.current.play()
                }
            })
            .catch(console.error);
        },
        []
    );

    const takePicture = useCallback(
        () => {
            if (!canvasRef.current || !videoRef.current) {
                return;
            }
            const context = canvasRef.current.getContext('2d');

            if (!context) {
                return;
            }
            canvasRef.current.width = videoRef.current.videoWidth;
            canvasRef.current.height = videoRef.current.videoHeight;
            context.drawImage(videoRef.current, 0, 0);
            setRetakePicture(true);
            videoRef.current.pause();
            setPicture(canvasRef.current.toDataURL());
        },
        []
    );

    const resumeVideo = useCallback(
        () => {
            if (!videoRef.current) {
                return;
            }
            setRetakePicture(false);
            videoRef.current.play();
        },
        []
    );

    return <>
        <video ref={videoRef} autoPlay/>
        <canvas ref={canvasRef} style={{display: "none"}} />
        <Button onClick={
            retakePicture ? resumeVideo : takePicture
        }>
            {
                retakePicture ? "Retake picture" : "Take picture"
            }
        </Button>
    </>
}

export default TakePictureWithCamera;
