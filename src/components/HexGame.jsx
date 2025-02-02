import React, { useState, useEffect, useRef } from 'react';
import HexGameMenu from './HexGameMenu';
import HexGameLogic from '../utils/hexGameLogic';
import HexAILogic from '../utils/hexAILogic';
import useTimer from '../hooks/useTimer';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import '../styles/HexGame.css';

// HexGame component
const HexGame = () => {
    // Game settings
    const [game, setGame] = useState(null);    
    const [gameMode, setGameMode] = useState('sandbox');
    const [ai, setAI] = useState(null);    
    const [boardSize, setBoardSize] = useState(11);
    
    // Game status
    const [status, setStatus] = useState("");
    const [currentPlayer, setCurrentPlayer] = useState("Black");    
    const [statusColor, setStatusColor] = useState("black");
    const [isStatusVisible, setStatusVisiblity] = useState(true);
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);

    // Timer hook
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));
  
    // Refs for audio elements
    const blackSoundRef = useRef(null);
    const whiteSoundRef = useRef(null);

    // Initialize a new game
    const initializeGame = (gameMode, boardSize) => {
        // Set up game environment
        const newGame = new HexGameLogic(boardSize); 
        
        if (gameMode === 'ai') {
            const newAI = new HexAILogic(newGame);
            setAI(newAI);
        } else {
            setAI(null);
        }

        updateGameEnvironment(newGame, gameMode, boardSize, false, true, resetTimer());      
        updateStatus("Black's turn", "black", "Black", false, false);             
    };

    // Update game environment
    const updateGameEnvironment = (game, gameMode, size, isLobbyVisible, isStatusVisible, timerFunction ) => {
        setGame(game);
        setGameMode(gameMode);
        setBoardSize(size);
        setLobbyVisiblity(isLobbyVisible);
        setStatusVisiblity(isStatusVisible);
        if (timerFunction) {
            timerFunction();
        }
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves
            updateStatus(`${winner} wins!`, "#df4204", winner, true, true);
            stopTimer();
        } else {
            // Switch the player
            switchPlayer(game);            
            
            // If it's AI's turn, make a move            
            if (game.currentPlayer === "White" && ai) {                
                playAITurn(game, ai);
            }
        }
    };
    
    // Update the status message
    const updateStatus = (status, statusColor, currentPlayer, isBoardDisabled, isSurrenderDisabled ) => {
        setStatus(status);
        setStatusColor(statusColor);
        setCurrentPlayer(currentPlayer);
        setStatusVisiblity(true);
        setIsBoardDisabled(isBoardDisabled);
        setIsSurrenderDisabled(isSurrenderDisabled);
    };

    // Handle player switch
    const switchPlayer = (game) => {
        const nextPlayer = game.currentPlayer === "Black" ? "White" : "Black";
        game.currentPlayer = nextPlayer;
        updateStatus(`${nextPlayer}'s turn`, nextPlayer === "Black" ? "black" : "white", nextPlayer, false, false);        
    };       

    // Play AI turn
    const playAITurn = (game, ai) => {
        setIsBoardDisabled(true);
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {
                // Simulate a click on the cell returned by the AI
                handleCellClick(move.row, move.col); 
                whiteSoundRef.current.play();                       
                switchPlayer(game);
            }
        }, 1000);
    }
    
    // Handle cell click
    const handleCellClick = (row, col) => {        
        // Check if the cell is already filled
        if (game.board[row][col] !== null) return;
        
        // Make the move and update the board
        game.makeMove(row, col);
        console.log('player:', game.currentPlayer, 'row:', row, 'col:', col, 'time:', formatTime(timer));        
        
        // Play sound based on current player
        if (currentPlayer === "Black") {
            blackSoundRef.current.play();
        } else {
            whiteSoundRef.current.play();
        }

        updateGame(game, game.checkWinner());        
    };    

    // Handle surrender button click
    const handleSurrender = () => {
        const winner = currentPlayer === "Black" ? "White" : "Black";
        updateGame(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => { 
        updateGameEnvironment(null, gameMode, boardSize, true, false), stopTimer();
        setStatus("");
    };

    return (
        <div>
            {isLobbyVisible ? (
                <div id="lobby-container">
                    <HexGameMenu onStartGame={initializeGame} />
                </div>
            ) : (
                <div id="game-container">
                    {game && <HexBoard
                        game={game}
                        boardSize={boardSize}                        
                        handleCellClick={handleCellClick}
                        isBoardDisabled={isBoardDisabled} />}
                    {isStatusVisible && (
                        <StatusPanel
                            status={status}
                            timer={formatTime(timer)}
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
            {/* Audio elements for sound effects */}
            <audio ref={blackSoundRef} src="/sound/black.mp3" />
            <audio ref={whiteSoundRef} src="/sound/white.mp3" />
        </div>
    );
};

export default HexGame;