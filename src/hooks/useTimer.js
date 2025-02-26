import { useState, useEffect, useRef } from 'react';

const useTimer = (isRunning) => {
    const [timer, setTimer] = useState(0);
    const intervalRef = useRef(null);

    // Start the timer
    useEffect(() => {
        if (isRunning) {
            intervalRef.current = setInterval(() => {
                setTimer((prevTimer) => prevTimer + 1);
            }, 1000);
        }

        return () => clearInterval(intervalRef.current);
    }, [isRunning]);

    // Reset the timer
    const resetTimer = () => {
        setTimer(0);
        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setTimer((prevTimer) => prevTimer + 1);
        }, 1000);
    };

    // Stop the timer
    const stopTimer = () => {
        clearInterval(intervalRef.current);
    };

    // Format the timer value into HH:MM:SS format
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs < 10 ? '0' : ''}${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };   

    return { timer, resetTimer, stopTimer, formatTime };
};

export default useTimer;