import React from 'react';
import '../styles/Hex.css';

// Hex component
const Hex = ({ row, col, onClick, color, isBoardDisabled, style }) => {
    // Handle the click event on the hexagon
    const handleClick = () => {
        if (!isBoardDisabled) {
            onClick(row, col);
        }
    };

    return (
        <div
            className={`hex ${color ? color : ''}`}
            data-row={row}
            data-col={col}
            onClick={handleClick}
            style={style}
        ></div>
    );
};

export default Hex;