import React from 'react';
import '../styles/SetupPanel.css';

// SetupPanel component
const SetupPanel = ({ onStartGame }) => {
    const handleStartGame = () => {
        const size = parseInt(document.getElementById("board-size").value, 10);
        if (size >= 3 && size <= 19) {
            onStartGame(size);
        } else {
            alert("Please enter a size between 3 and 19.");
        }
    };

    return (
        <div id="setup-wrapper">
            <div id="setup-container">
                <h1>Hex</h1>
                <h2>Instructions:</h2>
                <p>
                    Hex is a game played on a two-dimensional board by two players - <span style={{ color: 'black', fontWeight: 'bold' }}>Black</span> and <span style={{ color: 'white', fontWeight: 'bold' }}>White</span>.
                    Your goal is to form a connected path of your color, linking two opposite sides of the board: 
                    <span style={{ color: 'black', fontWeight: 'bold' }}> Black</span> connects top and bottom, while <span style={{ color: 'white', fontWeight: 'bold' }}>White</span> connects left and right.
                    The player who completes such a connection wins the game!
                </p>
                <label htmlFor="board-size">To begin, enter the size of your board (n x n):</label>
                <input type="number" id="board-size" min="3" max="19" defaultValue="11" />
                <button id="start-game" onClick={handleStartGame}>Start Game</button>
            </div>
        </div>
    );
};

export default SetupPanel;