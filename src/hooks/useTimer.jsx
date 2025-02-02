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

    // Format the timer value into MM:SS format
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };    

    return { timer, resetTimer, stopTimer, formatTime };
};

export default useTimer;