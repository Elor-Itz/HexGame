import React, { useState, useEffect, useRef } from 'react';
import HexGameMenu from './HexGameMenu';
import HexGameLogic from '../utils/hexGameLogic';
import HexAILogic from '../utils/hexAILogic';
import useTimer from '../hooks/useTimer';
import useTurnCounter from '../hooks/useTurnCounter';
import usePlayerColors from '../hooks/usePlayerColors';
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
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isStatusVisible, setStatusVisiblity] = useState(true);

    // Player color hook
    const { colorScheme, setColorScheme, playerClass, playerColor, updatePlayerColorAndClass, getPlayerClass, getPlayerColor } = usePlayerColors();

    // Swap rule
    const [swapRuleEnabled, setSwapRuleEnabled] = useState(false);      
    
    // Game status
    const [status, setStatus] = useState("");    
    const [currentPlayer, setCurrentPlayer] = useState("Player1");    
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);

    // Timer hook
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));

    // Turn counter hook
    const { turn, incrementTurn, updateTurn, resetTurn } = useTurnCounter();
  
    // Refs for audio elements
    const blackSoundRef = useRef(null);
    const whiteSoundRef = useRef(null);

    // Initialize a new game
    const initializeGame = (gameMode, boardSize, swapRule) => {        
        const newGame = new HexGameLogic(boardSize); 
       
        // Set AI
        const newAI = gameMode === 'ai' ? new HexAILogic(newGame) : null;
        setAI(newAI);        

        // Set swap rule
        setSwapRuleEnabled(swapRule);        

        // Set up game environment
        updateGameEnvironment(newGame, gameMode, boardSize, false, true, resetTimer());        
        
        // Determine the first player
        const firstPlayerColor = getPlayerClass(newGame.currentPlayer, newGame.colorScheme);
        updateStatus(`${firstPlayerColor}'s turn`, newGame.currentPlayer, false, false);
        incrementTurn();
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
            const winnerColor = getPlayerClass(winner, colorScheme);
            updateStatus(`${winnerColor} wins!`, winner, true, true, true);
            console.log(winnerColor, "wins, turns:", turn - 1)
            stopTimer();
            resetTurn();
        } else {
            // Switch the player
            switchPlayer(game);
            
            // If it's AI's turn, make a move            
            if (game.currentPlayer === "Player2" && ai) {                               
                playAITurn(game, ai);
                incrementTurn();                              
            } else {
                incrementTurn();
            }        
        }        
    };
    
    // Update the status message
    const updateStatus = (status, currentPlayer, isWinner, isBoardDisabled, isSurrenderDisabled) => {                
        setStatus(status);
        setCurrentPlayer(currentPlayer); 
        updatePlayerColorAndClass(currentPlayer, isWinner);       
        setIsBoardDisabled(isBoardDisabled);
        setIsSurrenderDisabled(isSurrenderDisabled);
        console.log("Turn number: ", turn);
    };

    // Handle player switch    
    const switchPlayer = (game) => {
        const nextPlayer = game.currentPlayer === "Player1" ? "Player2" : "Player1";
        game.currentPlayer = nextPlayer;        
        const nextPlayerName = getPlayerClass(nextPlayer, colorScheme);        
        updateStatus(`${nextPlayerName}'s turn`, nextPlayer, false, false, false);
    };    

    // Handle AI turn
    const playAITurn = (game, ai) => {
        setIsBoardDisabled(true);        
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {    
                // Simulate a click on the cell returned by the AI
                handleCellClick(move.row, move.col);
                whiteSoundRef.current.play(); 
                switchPlayer(game);
                setIsBoardDisabled(false);                                                                       
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
        if (currentPlayer === "Player1") {
            blackSoundRef.current.play();
        } else {
            whiteSoundRef.current.play();
        }

        updateGame(game, game.checkWinner());        
    };
    
    // Handle swap rule
    const handleSwapRule = () => {
        if (window.confirm("Do you want to swap positions?")) {
            // Swap positions
            setCurrentPlayer("Player2");
            updateStatus("Player2's turn", "Player2", false, false, false);
        }
    };
    
    // Handle surrender button click
    const handleSurrender = () => {
        const winner = currentPlayer === "Player1" ? "Player2" : "Player1";
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
                    <HexGameMenu onStartGame={initializeGame} setColorScheme={setColorScheme} />
                </div>
            ) : (
                <div id="game-container">
                    {game && <HexBoard
                        game={game}
                        boardSize={boardSize}                        
                        handleCellClick={handleCellClick}
                        isBoardDisabled={isBoardDisabled}
                        colorScheme={colorScheme} />}
                    {isStatusVisible && (
                        <StatusPanel
                            status={status} 
                            playerClass={playerClass}
                            playerColor={playerColor}                           
                            timer={formatTime(timer)}                            
                            onSurrender={handleSurrender}
                            onNewGame={handleNewGame}                            
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