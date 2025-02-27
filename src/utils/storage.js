import appearanceIconB from '../assets/icons/options-appearance-b.png';
import appearanceIconW from '../assets/icons/options-appearance-w.png';
import soundIconB from '../assets/icons/options-sound-b.png';
import soundIconW from '../assets/icons/options-sound-w.png';
import howToPlayIconB from '../assets/icons/how-to-play-b.png';
import howToPlayIconW from '../assets/icons/how-to-play-w.png';

// Get theme
export const getTheme = () => {
    return localStorage.getItem('theme') || '';    
};

// Get color scheme
export const getColorScheme = () => {
    return localStorage.getItem('colorScheme') || '';    
};

// Get volume
export const getVolume = () => {
    const volume = parseInt(localStorage.getItem('volume'), 10);
    return isNaN(volume) ? 50 : volume;
};

// Get icon based on the tab
export const getIcon = (tab) => {
    if (tab === 'appearance') {
        return getTheme().includes('dark') ? appearanceIconW : appearanceIconB;
    } else if (tab === 'sound') {
        return getTheme().includes('dark') ? soundIconW : soundIconB;
    } else if (tab === 'how-to-play') {
        return getTheme().includes('dark') ? howToPlayIconW : howToPlayIconB;
    }
};