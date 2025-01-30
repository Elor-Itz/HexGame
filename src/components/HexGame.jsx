import React, { useState, useEffect } from 'react';
import SetupPanel from './SetupPanel';
import HexGameLogic from '../utils/hexGameLogic';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import '../styles/HexGame.css';

// HexGame component
const HexGame = () => {
    const [game, setGame] = useState(null);
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");
    const [boardSize, setBoardSize] = useState(11);

    useEffect(() => {
        const newGameButton = document.getElementById("new-game");      

        // Handler for new game button
        const newGameHandler = () => {
            document.getElementById("lobby-container").style.display = "block";
            document.getElementById("main-container").style.display = "none";
            setGame(null);
            setStatus("");
        };
        
        newGameButton.addEventListener("click", newGameHandler);

        return () => {            
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
        
        // Hide the lobby and show the main game container
        document.getElementById("lobby-container").style.display = "none";
        document.getElementById("main-container").style.display = "flex";
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
                <SetupPanel onStartGame={createGame} />
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