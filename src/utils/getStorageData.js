export const getTheme = () => {
    return localStorage.getItem('theme') || '';    
};

export const getVolume = () => {
    const volume = parseInt(localStorage.getItem('volume'), 10);
    return isNaN(volume) ? 50 : volume;
};