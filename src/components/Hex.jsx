import React, { useState, useEffect } from 'react';
import '../styles/Hex.css';

// Hex component
const Hex = ({ row, col, game, updateStatus, style }) => {
    const [player, setPlayer] = useState(null); 
    
    useEffect(() => {
        setPlayer(game.board[row][col]);
    }, [game.board, row, col]);

    // Handle the click event on the hexagon
    const handleClick = () => {
        // Check if the cell is already filled
        if (game.board[row][col] !== null) return;
        // Make the move and update the board
        game.makeMove(row, col);
        setPlayer(game.currentPlayer);
        updateStatus(game, game.checkWinner());
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