import React from 'react';
import '../styles/Hex.css';

// Hex component
const Hex = ({ row, col, game, handleCellClick, style, colorScheme }) => {
    const player = game.board[row][col]; 
    
    // Handle the click event on the hexagon
    const handleClick = () => {        
        handleCellClick(row, col);
    };

    // Get the player class based on the color scheme
    const getPlayerClass = () => {
        if (colorScheme === 'red-blue') {
            return player === 'Black' ? 'Red' : player === 'White' ? 'Blue' : '';
        }
        return player;
    };

    return (
        <div
            className={`hex ${getPlayerClass()}`}
            data-row={row}
            data-col={col}
            onClick={handleClick}
            style={style}
        ></div>
    );
};

export default Hex;