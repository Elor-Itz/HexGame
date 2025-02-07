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
    const [boardSize, setBoardSize] = useState(11);
    const [currentPlayer, setCurrentPlayer] = useState("Player1");
    const [ai, setAI] = useState(null);
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isStatusVisible, setStatusVisiblity] = useState(true);

    // Player color hook
    const { colorScheme, setColorScheme, playerClass, playerColor, getPlayerAttributes, updatePlayerAttributes } = usePlayerColors();

    // Swap rule
    const [swapRuleEnabled, setSwapRuleEnabled] = useState(false);      
    
    // Game status
    const [status, setStatus] = useState("");
    const [isBoardDisabled, setIsBoardDisabled] = useState(false);
    const [isSurrenderDisabled, setIsSurrenderDisabled] = useState(false);

    // Timer and turn counter hooks
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));    
    const { turn, incrementTurnCount, resetTurnCount } = useTurnCounter();
  
    // Refs for audio elements
    const player1SoundRef = useRef(null);
    const player2SoundRef = useRef(null);

    // Initialize a new game
    const initializeGame = (gameMode, boardSize, swapRule, colorScheme) => {
        // Create a new game and AI instance (if needed)
        const newGame = new HexGameLogic(boardSize);
        const newAI = gameMode === 'ai' ? new HexAILogic(newGame) : null;
        setAI(newAI);

        // Set up game environment
        updateGameEnvironment(newGame, gameMode, boardSize, swapRule, colorScheme, false, true, resetTimer());        

        // Set the first player
        const firstPlayer = "Player1";
        newGame.currentPlayer = firstPlayer;        
        updateCurrentPlayer(firstPlayer, colorScheme);        
        incrementTurnCount();
    };    

    // Update game environment
    const updateGameEnvironment = (game, gameMode, size, swapRule, colorScheme, isLobbyVisible, isStatusVisible, timerFunction ) => {
        setGame(game);
        setGameMode(gameMode);
        setBoardSize(size);        
        setSwapRuleEnabled(swapRule);  
        setColorScheme(colorScheme);  
        setLobbyVisiblity(isLobbyVisible);
        setStatusVisiblity(isStatusVisible);
        if (timerFunction) {
            timerFunction();
        }
        resetTurnCount();
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves            
            const { className: winnerColor } = getPlayerAttributes(winner, colorScheme);
            updateStatus(`${winnerColor} wins!`, winner, true, true);
            console.log(winnerColor, "wins, turns:", turn - 1)
            stopTimer();
            resetTurnCount();
        } else {
            // Switch the player
            switchPlayer(game);
            
            // If it's AI's turn, make a move            
            if (game.currentPlayer === "Player2" && ai) {                               
                playAITurn(game, ai);
                incrementTurnCount();                              
            } else {
                incrementTurnCount();
            }        
        }        
    };
    
    // Update the status message
    const updateStatus = (status, currentPlayer, isBoardDisabled, isSurrenderDisabled) => {                
        setStatus(status);
        setCurrentPlayer(currentPlayer);                    
        setIsBoardDisabled(isBoardDisabled);
        setIsSurrenderDisabled(isSurrenderDisabled);
        console.log("Turn number: ", turn);        
    };

    // Handle player switch
    const switchPlayer = (game) => {
        const nextPlayer = game.currentPlayer === "Player1" ? "Player2" : "Player1";
        game.currentPlayer = nextPlayer;
        updateCurrentPlayer(nextPlayer, colorScheme);        
    }; 
    
    // Update current player
    const updateCurrentPlayer = (player, colorScheme) => {
        setCurrentPlayer(player);
        updatePlayerAttributes(player, colorScheme, false);
        const { className: playerName } = getPlayerAttributes(player, colorScheme);
        updateStatus(`${playerName}'s turn`, player, false, false);
    }

    // Handle AI turn
    const playAITurn = (game, ai) => {
        setIsBoardDisabled(true);        
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {    
                // Simulate a click on the cell returned by the AI
                handleCellClick(move.row, move.col);
                player2SoundRef.current.play(); 
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
        console.log('player:', game.currentPlayer, 'color', playerClass, 'row:', row, 'col:', col, 'time:', formatTime(timer));
        
        // Play sound based on current player
        if (currentPlayer === "Player1") {
            player1SoundRef.current.play();
        } else {
            player2SoundRef.current.play();
        }

        updateGame(game, game.checkWinner());
    };
    
    // Handle swap rule
    const handleSwapRule = () => {
        if (window.confirm("Do you want to swap positions?")) {
            // Swap positions
            setCurrentPlayer("Player2");
            updateStatus("Player2's turn", "Player2", false, false);
        }
    };
    
    // Handle surrender button click
    const handleSurrender = () => {
        const winner = currentPlayer === "Player1" ? "Player2" : "Player1";
        updateGame(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => { 
        updateGameEnvironment(null, gameMode, boardSize, false, 'black-white', true, false), stopTimer();
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
                        isBoardDisabled={isBoardDisabled}
                        colorScheme={colorScheme}
                        getPlayerAttributes={getPlayerAttributes} 
                        />}
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
            <audio ref={player1SoundRef} src="/sound/player1.mp3" />
            <audio ref={player2SoundRef} src="/sound/player2.mp3" />
        </div>
    );
};

export default HexGame;