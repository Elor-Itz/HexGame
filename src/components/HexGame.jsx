import React, { useState } from 'react';
import HexGameMenu from './HexGameMenu';
import HexGameLogic from '../utils/hexGameLogic';
import HexAILogic from '../utils/hexAILogic';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import '../styles/HexGame.css';

// HexGame component
const HexGame = () => {
    const [game, setGame] = useState(null);    
    const [gameMode, setGameMode] = useState('sandbox');
    const [boardSize, setBoardSize] = useState(11);
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");    
    const [statusColor, setStatusColor] = useState("black");
    const [isStatusVisible, setStatusVisiblity] = useState(true);
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);
    const [ai, setAI] = useState(null);

    // Create a new game
    const createGame = (size, mode) => {
        const newGame = new HexGameLogic(size);
        setGame(newGame);
        setGameMode(mode);
        setBoardSize(size);        
        setLobbyVisiblity(false);
        
        if (mode === 'ai') {
            const newAI = new HexAILogic(newGame);
            setAI(newAI);
        } else {
            setAI(null);
        }

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
            
            // If it's AI's turn, make a move            
            if (nextPlayer === "White" && ai) {                
                setIsBoardDisabled(true);
                setTimeout(() => {
                    const move = ai.makeMove();
                    if (move) {
                        // Simulate a click on the cell returned by the AI
                        handleCellClick(move.row, move.col);
                        handlePlayerSwitch();    
                        setIsBoardDisabled(false);                    
                    }
                }, 1000);
            }
        }
    };    
    
    // Handle cell click
    const handleCellClick = (row, col) => {
        // Check if the cell is already filled
        if (game.board[row][col] !== null) return;
        // Make the move and update the board
        game.makeMove(row, col);
        updateStatus(game, game.checkWinner());        
    };

    // Handle player switch
    const handlePlayerSwitch = () => {
        const nextPlayer = game.currentPlayer === "Black" ? "White" : "Black";
        game.currentPlayer = nextPlayer;
        setCurrentPlayer(nextPlayer);                  
        setStatus(`${nextPlayer}'s turn`);
        setStatusColor(nextPlayer === "Black" ? "black" : "white");        
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
                    <HexGameMenu onStartGame={createGame} />
                </div>
            ) : (
                <div id="game-container">
                    {game && <HexBoard
                        size={boardSize}
                        game={game}
                        handleCellClick={handleCellClick}
                        isBoardDisabled={isBoardDisabled} />}
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