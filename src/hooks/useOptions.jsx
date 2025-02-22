import { useState, useEffect } from 'react';

const useOptions = () => {
    // Retrieve initial settings from localStorage
    const getInitialTheme = () => localStorage.getItem('theme') || '';
    const getInitialVolume = () => parseInt(localStorage.getItem('volume'), 10) || 50;

    // State variables for theme and volume
    const [theme, setTheme] = useState(getInitialTheme());
    const [volume, setVolume] = useState(getInitialVolume());

    // Update localStorage to save options
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('volume', volume);
    }, [volume]);

    // Update theme
    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    // Update volume
    const updateVolume = (newVolume) => {
        setVolume(newVolume);
    };

    // Load stored options
    const loadOptions = () => {
        document.body.className = getInitialTheme();        
        setVolume(getInitialVolume());
    };

    return {
        theme,
        volume,
        updateTheme,
        updateVolume,
        loadOptions,
    };
};

export default useOptions;