// CountdownTimer.tsx

import { Button, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';

interface CountdownTimerProps {
    minutes: number;
    title: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ minutes, title }) => {
    const [isActive, setIsActive] = useState(false);
    const [remainingTime, setRemainingTime] = useState({
        minutes: minutes,
        seconds: 0,
    });

    useEffect(() => {
        let interval: NodeJS.Timeout;

        const updateTimer = () => {
            if (remainingTime.minutes === 0 && remainingTime.seconds === 0) {
                clearInterval(interval);
                setIsActive(false);
                navigator.vibrate(Infinity);
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
    }, [isActive, remainingTime]);

    const startTimer = () => {
        setIsActive(true);
    };

    const stopOrResumeTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setRemainingTime({
            minutes,
            seconds: 0,
        });
        setIsActive(false);
    };

    const formatSeconds = (seconds: number) => {
        return seconds < 10 ? `0${seconds}` : `${seconds}`;
    };

    return (
        <Typography sx={{ fontWeight: "bold" }} textAlign={"center"}>
            {title}
            <Typography textAlign={"center"}>
                {remainingTime.minutes}:{formatSeconds(remainingTime.seconds)}
            </Typography>
            <Button sx={{ width: '100px' }} onClick={startTimer}>Start</Button>
            <Button sx={{ width: '100px' }} onClick={stopOrResumeTimer}>{isActive ? 'Stop' : 'Resume'}</Button>
            <Button sx={{ width: '100px' }} onClick={resetTimer}>Reset</Button>
        </Typography >
    );
};

export default CountdownTimer;
