import { useState } from 'react';

// Get player class based on the color scheme
export const getPlayerClass = (player, colorScheme) => {    
    if (colorScheme === 'red-blue') {
        return player === 'Black' ? 'Red' : player === 'White' ? 'Blue' : '';
    }
    return player;    
};

// Get player color based on the color scheme
export const getPlayerColor = (player, colorScheme) => {
    if (colorScheme === 'red-blue') {
        return player === 'Black' ? 'red' : player === 'White' ? 'blue' : '';
    }
    return player === 'Black' ? 'black' : player === 'White' ? 'white' : '';        
};

// Get win text color based on the player
export const getWinTextColor = (player) => {
    return player === 'Black' ? '#df4204' : '#6d96e7';
};

// Manage player colors
const usePlayerColors = (initialScheme = 'black-white') => {
    const [colorScheme, setColorScheme] = useState(initialScheme);
    const [playerClass, setPlayerClass] = useState(getPlayerClass('Black', initialScheme));
    const [playerColor, setPlayerColor] = useState(getPlayerColor('black', initialScheme));

    // Update the player color and class    
    const updatePlayerColorAndClass = (player, isWinner = false) => {
        const color = isWinner ? getWinTextColor(player) : getPlayerColor(player, colorScheme);
        setPlayerColor(color);
        setPlayerClass(getPlayerClass(player, colorScheme));
    };

    return {
        colorScheme,
        setColorScheme,
        playerClass,
        playerColor,
        updatePlayerColorAndClass,
        getPlayerClass,
        getPlayerColor,
        getWinTextColor,
    };
};

export default usePlayerColors;