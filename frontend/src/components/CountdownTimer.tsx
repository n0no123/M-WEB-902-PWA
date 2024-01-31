import { Button, Stack, Typography } from '@mui/material';
import { useState, useEffect } from 'react';

type CountdownTimerProps = {
    minutes: number;
    title: string;
}

export default function CountdownTimer({ minutes, title }: CountdownTimerProps) {
    const [isActive, setIsActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState({
        minutes: minutes,
        seconds: 0,
    });
    const [vibrate, setVibrate] = useState<boolean>(false);
    const [vibrateInterval, setVibrateInterval] = useState<NodeJS.Timeout>()

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const updateTimer = () => {
            if (remainingTime.minutes === 0 && remainingTime.seconds === 0) {
                clearInterval(interval);
                setIsActive(false);
                setVibrate(true);
                if (vibrate) {
                    setVibrateInterval(setInterval(() => navigator.vibrate(6000), 7000));
                }
            } else {
                setRemainingTime((prev) => {
                    if (prev.seconds === 0) {
                        return {
                            minutes: prev.minutes - 1,
                            seconds: 59,
                        };
                    } else {
                        return {
                            minutes: prev.minutes,
                            seconds: prev.seconds - 1,
                        };
                    }
                });
            }
        };

        if (isActive) {
            interval = setInterval(updateTimer, 1000);
        }

        return () => {
            clearInterval(interval);
        };
    }, [isActive, remainingTime, vibrate]);

    const startTimer = () => {
        setIsActive(true);
    };

    const stopOrResumeTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setRemainingTime({
            minutes: minutes,
            seconds: 0,
        });
        setIsActive(false);
    };

    const formatSeconds = (seconds: number) => {
        return seconds < 10 ? `0${seconds}` : `${seconds}`;
    };

    return (
        minutes === 0 ?
            <Typography sx={{ fontWeight: "bold" }} textAlign={"center"}>
                {title}
                <Typography textAlign={"center"}>
                    00:00
                </Typography>
            </Typography >
            :
            <Stack direction={"column"} display={"flex"}>
                <Typography sx={{ fontWeight: "bold", height: '25px' }} textAlign={"center"}>
                    {title}
                </Typography >
                {
                    remainingTime.minutes === 0 && remainingTime.seconds === 0 ?
                        <Button sx={{ width: '100px' }} onClick={() => { setVibrate(false); clearInterval(vibrateInterval); resetTimer(); }}>STOP</Button>
                        : <Typography textAlign={"center"}>{remainingTime.minutes}:{formatSeconds(remainingTime.seconds)}</Typography>
                }
                <Button sx={{ width: '100px' }} onClick={startTimer}>Start</Button>
                <Button sx={{ width: '100px' }} onClick={stopOrResumeTimer}>{isActive ? 'Pause' : 'Resume'}</Button>
                <Button sx={{ width: '100px' }} onClick={resetTimer}>Reset</Button>
            </Stack>
    );
};
