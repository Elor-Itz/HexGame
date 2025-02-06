import { useState } from 'react';

// Get player class based on the color scheme
export const getPlayerClass = (player, colorScheme) => {
    if (colorScheme === 'red-blue') {
        return player === 'Player1' ? 'Red' : player === 'Player2' ? 'Blue' : '';
    }
    return player === 'Player1' ? 'Black' : player === 'Player2' ? 'White' : '';
};

// Get player color based on the color scheme
export const getPlayerColor = (player, colorScheme) => {
    if (colorScheme === 'red-blue') {
        return player === 'Player1' ? 'red' : player === 'Player2' ? 'blue' : '';
    }
    return player === 'Player1' ? 'black' : player === 'Player2' ? 'white' : '';
};

// Get win text color based on the player
export const getWinTextColor = (player) => {
    return player === 'Player1' ? '#df4204' : '#00ffff';
};

// Manage player colors
const usePlayerColors = (initialScheme = 'black-white') => {
    const [colorScheme, setColorScheme] = useState(initialScheme);
    const [playerClass, setPlayerClass] = useState(getPlayerClass('Player1', initialScheme));
    const [playerColor, setPlayerColor] = useState(getPlayerColor('Player1', initialScheme));

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
    };
};

export default usePlayerColors;