// Get theme
export const getTheme = () => {
    return localStorage.getItem('theme') || '';    
};

// Get volume
export const getVolume = () => {
    const volume = parseInt(localStorage.getItem('volume'), 10);
    return isNaN(volume) ? 50 : volume;
};