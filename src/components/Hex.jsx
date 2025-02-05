import React from 'react';
import '../styles/Hex.css';
import { getPlayerClass } from '../hooks/usePlayerColors';

// Hex component
const Hex = ({ row, col, game, handleCellClick, style, colorScheme }) => {
    const player = game.board[row][col]; 
    
    // Handle the click event on the hexagon
    const handleClick = () => {        
        handleCellClick(row, col);
    };

    return (
        <div
            className={`hex ${getPlayerClass(player, colorScheme)}`}
            data-row={row}
            data-col={col}
            onClick={handleClick}
            style={style}
        ></div>
    );
};

export default Hex;