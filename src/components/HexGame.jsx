import React, { useState } from 'react';
import SetupPanel from './SetupPanel';
import HexGameLogic from '../utils/hexGameLogic';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import '../styles/HexGame.css';

// HexGame component
const HexGame = () => {
    const [game, setGame] = useState(null);
    const [boardSize, setBoardSize] = useState(11);
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");    
    const [statusColor, setStatusColor] = useState("black");
    const [isStatusVisible, setStatusVisiblity] = useState(true);
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);
    
    // Create a new game
    const createGame = (size) => {
        const newGame = new HexGameLogic(size);
        setGame(newGame);
        setBoardSize(size);        
        setLobbyVisiblity(false);

        // Show the status once the game starts            
        setStatus("Black's turn");
        setStatusColor("black");
        setCurrentPlayer("Black");
        setStatusVisiblity(true);
        setIsBoardDisabled(false);
        setIsSurrenderDisabled(false);          
    };

    // Update the status message
    const updateStatus = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves           
            setStatus(`${winner} wins!`);
            setStatusColor("#df4204");           
            setCurrentPlayer(winner);
            setIsBoardDisabled(true);
            setIsSurrenderDisabled(true);
        } else {
            // Switch the player
            const nextPlayer = game.currentPlayer === "Black" ? "White" : "Black";
            game.currentPlayer = nextPlayer;
            setCurrentPlayer(nextPlayer);                  
            setStatus(`${nextPlayer}'s turn`);
            setStatusColor(nextPlayer === "Black" ? "black" : "white");
        }
    };

    // Handle surrender button click
    const handleSurrender = () => {
        const winner = currentPlayer === "Black" ? "White" : "Black";
        updateStatus(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => {        
        setLobbyVisiblity(true);
        setGame(null);
        setStatus("");
        setStatusVisiblity(false);
    };

    return (
        <div>
            {isLobbyVisible ? (
                <div id="lobby-container">
                    <SetupPanel onStartGame={createGame} />
                </div>
            ) : (
                <div id="game-container">
                    {game && <HexBoard size={boardSize} game={game} updateStatus={updateStatus} isBoardDisabled={isBoardDisabled} />}
                    {isStatusVisible && (
                        <StatusPanel
                            status={status}
                            currentPlayer={currentPlayer}
                            onSurrender={handleSurrender}
                            onNewGame={handleNewGame}
                            statusColor={statusColor}
                            isVisible={isStatusVisible}
                            isSurrenderDisabled={isSurrenderDisabled}
                        />
                    )}
                </div>
            )}
        </div>
    );
};

export default HexGame;