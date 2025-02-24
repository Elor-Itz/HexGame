import { useState, useEffect } from 'react';
import {getTheme, getVolume} from '../utils/storage';

const useOptions = () => {
    // State variables for theme and volume
    const [theme, setTheme] = useState(getTheme());
    const [volume, setVolume] = useState(getVolume());

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
        document.body.className = getTheme();        
        setVolume(getVolume());
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