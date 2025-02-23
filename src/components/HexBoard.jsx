import React from 'react';
import Hex from './Hex';

// HexBoard component
const HexBoard = ({ game, boardSize, onClick, isBoardDisabled, colorScheme, getPlayerAttributes }) => {
    
    const boardWidth = 1400;
    const boardHeight = 850;   
        
    const hexagons = [];

    for (let row = 0; row < boardSize; row++) {
        const startCol = Math.max(0, row - (boardSize - 1));
        const endCol = Math.min(boardSize - 1, row + boardSize - 1);

        for (let col = startCol; col <= endCol; col++) {
            const player = game.board[row][col];
            const { className: color } = getPlayerAttributes(player, colorScheme);

            hexagons.push(
                <Hex
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    game={game}
                    onClick={onClick}
                    color={color}
                    isBoardDisabled={isBoardDisabled}
                    style={{
                        position: 'absolute',
                        left: `${col * 59 + row * 29}px`,
                        top: `${row * 44}px`,
                    }}
                />
            );
        }
    }

    return (
        <div className="hex-board" style={{ width: boardWidth, height: boardHeight, position: 'relative' }}>
            {hexagons}
        </div>
    );
};

export default HexBoard;