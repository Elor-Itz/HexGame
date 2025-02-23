import { useState } from 'react';

const usePlayerManager = (colorScheme) => {
    const [currentPlayer, setCurrentPlayer] = useState("Player1");    
    const [playerName, setPlayerName] = useState('');
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
        setPlayerName(className);
        setPlayerColor(color);     
    }; 

    // Get the next player
    const getNextPlayer = (currentPlayer) => currentPlayer === "Player1" ? "Player2" : "Player1";

    // Switch the current player    
    const switchPlayer = (game) => {        
        const nextPlayer = getNextPlayer(game.currentPlayer);
        game.currentPlayer = nextPlayer;        
        updatePlayer(nextPlayer);      
    };

    // Update the player color and class
    const updatePlayer = (player, scheme = colorScheme) => {
        setCurrentPlayer(player);
        updatePlayerAttributes(player, scheme);        
    };

    return {
        currentPlayer,
        playerName,
        playerColor,        
        setCurrentPlayer,        
        getPlayerAttributes,
        updatePlayerAttributes,
        getNextPlayer,
        switchPlayer,
        updatePlayer
    };
};

export default usePlayerManager;