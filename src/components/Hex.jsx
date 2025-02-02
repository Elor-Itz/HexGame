import React from 'react';
import '../styles/Hex.css';

// Hex component
const Hex = ({ row, col, game, handleCellClick, style }) => {
    const player = game.board[row][col]; 
    
    // Handle the click event on the hexagon
    const handleClick = () => {        
        handleCellClick(row, col);
    };

    return (
        <div
            className={`hex ${player}`}
            data-row={row}
            data-col={col}
            onClick={handleClick}
            style={style}
        ></div>
    );
};

export default Hex;