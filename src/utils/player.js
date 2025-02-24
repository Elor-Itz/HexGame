// Get the next player
export const getNextPlayer = (currentPlayer) => currentPlayer === "Player1" ? "Player2" : "Player1";

// Get player class based on the color scheme
export const getPlayerColor = (player, colorScheme) => {
    let color = '';
    if (colorScheme === 'red-blue') {
        if (player === 'Player1') {            
            color = 'Red';
        } else if (player === 'Player2') {            
            color = 'Blue';
        }
    } else {
        if (player === 'Player1') {            
            color = 'Black';
        } else if (player === 'Player2') {            
            color = 'White';
        }
    }
    return color;
};

// Get log color
export const getLogColor = (playerColor) => {
    return playerColor.toLowerCase() === 'white' ? 'silver' : playerColor.toLowerCase();
};