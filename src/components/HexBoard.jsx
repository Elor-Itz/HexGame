import React from 'react';
import Hex from './Hex';

// HexBoard component
const HexBoard = ({ size, game, updateStatus, isBoardDisabled }) => {
    
    const boardWidth = 1400;
    const boardHeight = 850;   
        
    const hexagons = [];

    for (let row = 0; row < size; row++) {
        const startCol = Math.max(0, row - (size - 1));
        const endCol = Math.min(size - 1, row + size - 1);

        for (let col = startCol; col <= endCol; col++) {
            hexagons.push(
                <Hex
                    key={`${row}-${col}`}
                    row={row}
                    col={col}
                    game={game}
                    updateStatus={updateStatus}
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
        <div id="board-container" style={{ width: `${boardWidth}px`, height: `${boardHeight}px`, position: 'relative', pointerEvents: isBoardDisabled ? 'none' : 'auto' }}>            
            {hexagons}
        </div>
    );
};

export default HexBoard;