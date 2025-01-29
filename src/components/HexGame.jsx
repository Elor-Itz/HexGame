import React, { useState, useEffect } from 'react';
import HexGameLogic from '../utils/hexGame';
import StatusPanel from './StatusPanel';

const HexGame = () => {
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");

    useEffect(() => {        
        const startGameButton = document.getElementById("start-game");
        const newGameButton = document.getElementById("new-game");

        // Handler for starting a new game
        const startGameHandler = () => {
            const size = parseInt(document.getElementById("board-size").value, 10);
            if (size >= 3 && size <= 19) {
                document.getElementById("lobby-container").style.display = "none";
                document.getElementById("main-container").style.display = "flex";
                createGame(size);
            } else {
                alert("Please enter a size between 3 and 19.");
            }
        };

        // Handler for new game button
        const newGameHandler = () => {
            document.getElementById("lobby-container").style.display = "block";
            document.getElementById("main-container").style.display = "none";
            setGame(null);
            setStatus("");
        };

        startGameButton.addEventListener("click", startGameHandler);
        newGameButton.addEventListener("click", newGameHandler);

        return () => {
            startGameButton.removeEventListener("click", startGameHandler);
            newGameButton.removeEventListener("click", newGameHandler);
        };       
    }, []);

    // Create a new game
    const createGame = (size) => {
        const newGame = new HexGameLogic(size);
        setGame(newGame);
        createBoard(size, newGame);

        // Show the status once the game starts
        const status = document.getElementById("status");
        status.style.display = "block";
        status.style.color = "black";
        setStatus("Black's turn");
        setCurrentPlayer("Black");        
    };

    // Create a new board
    const createBoard = (size, game) => {
        const container = document.getElementById("game-container");
        container.innerHTML = ""; // Clear the previous game board
        container.style.pointerEvents = "auto"

        const hexWidth = 60;
        const hexHeight = 60;

        // Set up container size based on board dimensions
        const boardWidth = (size - 1) * hexWidth * 0.75 + hexWidth;
        const boardHeight = size * hexHeight;

        container.style.width = `${boardWidth}px`;
        container.style.height = `${boardHeight}px`;

        for (let row = 0; row < size; row++) {
            const startCol = Math.max(0, row - (size - 1));
            const endCol = Math.min(size - 1, row + size - 1);

            for (let col = startCol; col <= endCol; col++) {
                const hex = document.createElement("div");
                hex.classList.add("hex");
                hex.dataset.row = row;
                hex.dataset.col = col;

                // Adjust for staggered columns to create a rhombus shaped board
                hex.style.position = "absolute";
                hex.style.left = `${col * 59 + row * 29}px`;
                hex.style.top = `${row * 44}px`;

                // Add event listener for clicks
                hex.addEventListener("click", () => {
                    // Check if the cell is already filled
                    if (game.board[row][col] !== null) return;
                    // Make the move and update the board
                    game.makeMove(row, col);
                    hex.classList.add(game.currentPlayer);

                    const winner = game.checkWinner();
                    updateStatus(game, winner);
                });

                // Append the hex to the container
                container.appendChild(hex);
            }
        }
    };

    // Update the status message
    const updateStatus = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves
            document.getElementById("status").style.color = "#df4204";
            setStatus(`${winner} wins!`);            
            setCurrentPlayer(winner);
            document.getElementById("game-container").style.pointerEvents = "none";            
            document.getElementById("surrender").disabled = true;
        } else {
            // Switch the player
            const nextPlayer = game.currentPlayer === "Black" ? "White" : "Black";
            game.currentPlayer = nextPlayer;
            setCurrentPlayer(nextPlayer);
            setStatus(`${nextPlayer}'s turn`);
        }
    };

    // Handle surrender button click
    const handleSurrender = () => {
        const winner = currentPlayer === "Black" ? "White" : "Black";
        updateStatus(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => {
        document.getElementById("lobby-container").style.display = "block";
        document.getElementById("main-container").style.display = "none";
        setGame(null);
        setStatus("");
    };

    return (
        <div>
            <div id="lobby-container">
                <div id="setup-wrapper">
                <div id="setup-container">                                     
                    <h1>Hex</h1>
                    <h2>Instructions:</h2>
                    <p>
                        Hex is a game played on a two-dimensional board by two players - black and white.
                        Your goal is to form a connected path of your color, linking two opposite sides of the board:
                        black connects top and bottom, while white connects left and right.
                        The player who completes such a connection wins the game!
                    </p>
                    <label htmlFor="board-size">To begin, enter the size of your board (n x n):</label>
                    <input type="number" id="board-size" min="3" max="19" defaultValue="11" />
                    <button id="start-game">Start Game</button>
                </div>
                </div>                
            </div>
            <div id="main-container">
                <div id="game-container"></div>
                <StatusPanel
                    status={status}
                    currentPlayer={currentPlayer}
                    onSurrender={handleSurrender}
                    onNewGame={handleNewGame}
                />
            </div>
        </div>
    );
};

export default HexGame;