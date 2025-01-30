import React, { useState, useEffect } from 'react';
import HexGameLogic from '../utils/hexGameLogic';
import StatusPanel from './StatusPanel';
import HexBoard from './HexBoard';

const HexGame = () => {
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");
    const [boardSize, setBoardSize] = useState(11);

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
        setBoardSize(size);        

        // Show the status once the game starts
        const status = document.getElementById("status");
        status.style.display = "block";
        status.style.color = "black";
        setStatus("Black's turn");
        setCurrentPlayer("Black");        
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
            document.getElementById("status").style.color = nextPlayer === "Black" ? "black" : "white";            
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
                        Hex is a game played on a two-dimensional board by two players - <span style={{ color: 'black', fontWeight: 'bold' }}>Black</span> and <span style={{ color: 'white', fontWeight: 'bold' }}>White</span>.
                        Your goal is to form a connected path of your color, linking two opposite sides of the board: 
                        <span style={{ color: 'black', fontWeight: 'bold' }}> Black</span> connects top and bottom, while <span style={{ color: 'white', fontWeight: 'bold' }}>White</span> connects left and right.
                        The player who completes such a connection wins the game!
                    </p>
                    <label htmlFor="board-size">To begin, enter the size of your board (n x n):</label>
                    <input type="number" id="board-size" min="3" max="19" defaultValue="11" />
                    <button id="start-game">Start Game</button>
                </div>
                </div>                
            </div>
            <div id="main-container">
                {game && <HexBoard size={boardSize} game={game} updateStatus={updateStatus} />}
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