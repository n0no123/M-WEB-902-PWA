import {useCallback, useEffect, useRef, useState} from "react";
import {Button} from "@mui/material";

const dataURLtoBlob = (dataURL: string): Blob => {
    const byteString = atob(dataURL.split(',')[1]);
    const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i)
    }

    return new Blob([ab], {type: mimeString});
}

type TakePictureWithCameraProps = {
    setPicture: (value: Blob) => void
}

const TakePictureWithCamera = ({setPicture}: TakePictureWithCameraProps) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const [retakePicture, setRetakePicture] = useState(false);

    useEffect(
        () => {
            navigator.mediaDevices.getUserMedia({
                video: {}
            }).then(async stream => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                    await videoRef.current.play()
                }
            }).catch(console.error);
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
            setPicture(dataURLtoBlob(canvasRef.current.toDataURL()));
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
        <canvas ref={canvasRef} style={{display: "none"}}/>
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
