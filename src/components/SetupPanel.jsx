import React, { useState } from 'react';
import '../styles/SetupPanel.css';

// SetupPanel component
const SetupPanel = ({ onStartGame }) => {
    const [boardSize, setBoardSize] = useState(11);

    // Handle the input change event
    const handleInputChange = (event) => {
        setBoardSize(parseInt(event.target.value, 10));
    };
    
    // Handle the start game button click
    const handleStartGame = () => {
        if (boardSize >= 3 && boardSize <= 19) {
            onStartGame(boardSize);
        } else {
            alert("Please enter a size between 3 and 19.");
        }
    };

    return (
        <div id="setup-wrapper">
            <div id="setup-container">
                <h1>Hex</h1>
                <h2>How to Play:</h2>
                <p>
                    Hex is a game played on a two-dimensional board by two players - <span style={{ color: 'black', fontWeight: 'bold' }}>Black</span> and <span style={{ color: 'white', fontWeight: 'bold' }}>White</span>.
                    Your goal is to form a connected path of your color, linking two opposite sides of the board: 
                    <span style={{ color: 'black', fontWeight: 'bold' }}> Black</span> connects top and bottom, while <span style={{ color: 'white', fontWeight: 'bold' }}>White</span> connects left and right.
                    The player who completes such a connection wins the game!
                </p>
                <label htmlFor="board-size-box">To begin, enter the size of your board (n x n):</label>
                <input
                    type="number"
                    id="board-size-box"
                    min="3"
                    max="19"
                    value={boardSize}
                    onChange={handleInputChange}
                />
                <button id="start-game" onClick={handleStartGame}>Start Game</button>
            </div>
        </div>
    );
};

export default SetupPanel;