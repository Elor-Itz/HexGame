// Storage data

// Get theme
export const getTheme = () => {
    return localStorage.getItem('theme') || '';    
};

// Get volume
export const getVolume = () => {
    const volume = parseInt(localStorage.getItem('volume'), 10);
    return isNaN(volume) ? 50 : volume;
};


// Player data

// Get the next player
export const getNextPlayer = (currentPlayer) => currentPlayer === "Player1" ? "Player2" : "Player1";

// Get player class based on the color scheme
export const getPlayerAttributes = (player, colorScheme) => {
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