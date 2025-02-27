import { useState, useEffect } from 'react';
import {getTheme, getColorScheme, getVolume} from '../utils/storage';

const useOptions = () => {
    // State variables for theme and volume
    const [theme, setTheme] = useState(getTheme());
    const [colorScheme, setColorScheme] = useState(getColorScheme());
    const [volume, setVolume] = useState(getVolume());

    // Update localStorage to save options
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        localStorage.setItem('colorScheme', colorScheme);
    }, [colorScheme]);

    useEffect(() => {
        localStorage.setItem('volume', volume);
    }, [volume]);

    // Update theme
    const updateTheme = (newTheme) => {
        setTheme(newTheme);
        document.body.className = newTheme;
    };

    const updateColorScheme = (newColorScheme) => {
        setColorScheme(newColorScheme);        
    };

    // Update volume
    const updateVolume = (newVolume) => {
        setVolume(newVolume);
    };

    // Load stored options
    const loadOptions = () => {
        document.body.className = getTheme();
        setColorScheme(getColorScheme());        
        setVolume(getVolume());
    };

    return {
        theme,
        colorScheme,
        volume,
        updateTheme,
        updateColorScheme,
        updateVolume,
        loadOptions,
    };
};

export default useOptions;