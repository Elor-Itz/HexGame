import { useState } from 'react';

// Manage player colors
const usePlayerColors = () => {
    const [colorScheme, setColorScheme] = useState('');    
    const [playerClass, setPlayerClass] = useState('');    
    const [playerColor, setPlayerColor] = useState('');

    // Get player class based on the color scheme
    const getPlayerAttributes = (player, colorScheme) => {
        let className = '', color = '';
        if (colorScheme === 'red-blue') {
            if (player === 'Player1') {
                className = 'Red';
                color = 'red';
            } else if (player === 'Player2') {
                className = 'Blue';
                color = 'blue';
            }
        } else {
            if (player === 'Player1') {
                className = 'Black';
                color = 'black';
            } else if (player === 'Player2') {
                className = 'White';
                color = 'white';
            }
        }
        return { className, color };
    };

    // Update the player color and class
    const updatePlayerAttributes = (player, colorScheme) => {
        const { className, color  } = getPlayerAttributes(player, colorScheme);        
        setPlayerClass(className);
        setPlayerColor(color);     
    };    

    return {
        colorScheme,
        setColorScheme,        
        playerClass,
        playerColor,
        getPlayerAttributes,
        updatePlayerAttributes,                       
    };
};

export default usePlayerColors;