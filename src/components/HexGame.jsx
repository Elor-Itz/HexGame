import React, { useState, useEffect, useRef } from 'react';
import HexGameMenu from './HexGameMenu';
import HexGameLogic from '../utils/hexGameLogic';
import HexAILogic from '../utils/hexAILogic';
import useTimer from '../hooks/useTimer';
import useTurnCounter from '../hooks/useTurnCounter';
import usePlayerManager from '../hooks/usePlayerManager';
import useGameStatus from '../hooks/useGameStatus';
import useAudio from '../hooks/useAudio';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import '../styles/HexGame.css';
import backgroundImage from '../assets/images/background.jpg';

// HexGame component
const HexGame = () => {
    // Game settings
    const [gameSettings, setGameSettings] = useState({
        gameMode: 'sandbox',
        boardSize: 11,
        colorScheme: 'black-white',
        swapRuleEnabled: false,
        isLobbyVisible: true,
        isStatusVisible: true
    });
    const [game, setGame] = useState(null);    
    const [ai, setAI] = useState(null);

    // Game status
    const { status, updateStatus, isBoardDisabled, setIsBoardDisabled, isSurrenderDisabled, setIsSurrenderDisabled } = useGameStatus();

    // Player settings
    const { currentPlayer, playerName, playerColor, setCurrentPlayer, getPlayerAttributes, updatePlayerAttributes, getNextPlayer, switchPlayer, updatePlayer } = usePlayerManager(gameSettings.colorScheme);    
    const logColor = playerColor === 'white' ? 'silver' : playerColor;
    
    // Timer and turn counter hooks
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!gameSettings.isLobbyVisible && !status.includes('wins'));    
    const { turn, incrementTurnCount, resetTurnCount } = useTurnCounter();    
  
    // Audio hooks
    const { playPlayer1Sound, playPlayer2Sound, playWinnerSound } = useAudio();

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
        updatePlayer(firstPlayer, colorScheme);
        const { className: firstPlayerName } = getPlayerAttributes(firstPlayer, colorScheme);        
        updateStatus(`${firstPlayerName}'s turn`, false, false);           
    };    

    // Update game environment
    const updateGameEnvironment = (game, gameMode, boardSize, swapRule, colorScheme, isLobbyVisible, isStatusVisible, timerFunction ) => {
        setGame(game);
        setGameSettings({ gameMode: gameMode, boardSize: boardSize, colorScheme: colorScheme, swapRuleEnabled: swapRule, isLobbyVisible: isLobbyVisible, isStatusVisible: isStatusVisible });         
        timerFunction?.();
        resetTurnCount();
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves            
            const { className: winnerName, color: winnerColor } = getPlayerAttributes(winner, gameSettings.colorScheme);
            const winnerLogColor = winnerColor === 'white' ? 'silver' : winnerName;
            updateStatus(`${winnerName} wins!`, true, true);                  
            console.log(`%c${winnerName} wins! Turns: ${turn}`, `background: ${winnerLogColor}; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);                       
            stopTimer();
            resetTurnCount();
            playWinnerSound();           
        } else {
            // Switch the player            
            switchPlayer(game);            
            const { className: playerName } = getPlayerAttributes(game.currentPlayer, gameSettings.colorScheme);            
            updateStatus(`${playerName}'s turn`, false, false);
            
            // If it's AI's turn, make a move            
            if (getNextPlayer(currentPlayer) === "Player2" && ai) {                               
                playAITurn(game, ai);               
            }        
        }        
    }; 

    // Handle AI turn
    const playAITurn = (game, ai) => {
        setIsBoardDisabled(true);
        setIsSurrenderDisabled(true);
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {
                // Simulate a click on the cell returned by the AI
                handleClick(move.row, move.col);
                playPlayer2Sound();
    
                // Log the move before switching the player
                const { className: playerName } = getPlayerAttributes(game.currentPlayer, gameSettings.colorScheme);
                console.log(
                    `%cTurn ${turn} | ${game.currentPlayer} (${playerName}) | Row: ${move.row}, Col: ${move.col} | Time: ${formatTime(timer)}`,
                    `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
                );
    
                // Switch the player
                switchPlayer(game);
                updateStatus(`${playerName}'s turn`, false, false);
                incrementTurnCount();
                setIsBoardDisabled(false);
                setIsSurrenderDisabled(false);
            }
        }, 1000);
    };
    
    // Handle hex click
    const handleClick = (row, col) => {        
        // Check if the hex is already filled
        if (game.board[row][col] !== null) return;
        
        // Make the move and update the board
        game.makeMove(row, col);
        incrementTurnCount();
        
        // Log the move        
        console.log(
            `%cTurn ${turn} | ${game.currentPlayer} (${playerName}) | Row: ${row}, Col: ${col} | Time: ${formatTime(timer)}`, 
            `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
        );

        // Play sound based on current player
        (currentPlayer === "Player1" ? playPlayer1Sound() : playPlayer2Sound());

        updateGame(game, game.checkWinner());
    };
    
    // Handle swap rule
    const handleSwapRule = () => {
        if (window.confirm("Do you want to swap positions?")) {
            // Swap positions
            setCurrentPlayer("Player2");
            updateStatus("Player2's turn", false, false);
        }
    };
    
    // Handle surrender button click
    const handleSurrender = () => {
        console.log(`%c${currentPlayer} (${playerName}) has surrendered.`, `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);           
        const winner = getNextPlayer(currentPlayer);
        updatePlayerAttributes(winner, colorScheme);
        updateGame(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => { 
        updateGameEnvironment(null, gameSettings.gameMode, gameSettings.boardSize, false, 'black-white', true, false), stopTimer();                
    };

    // Set background image when the game is active
    // useEffect(() => {
    //     if (!isLobbyVisible) {
    //         document.body.style.backgroundImage = `url(${backgroundImage})`;
    //         document.body.style.backgroundSize = 'cover';
    //         document.body.style.backgroundPosition = 'center';
    //     } else {
    //         document.body.style.backgroundImage = '';
    //     }
    // }, [isLobbyVisible]);

    return (
        <div>
            {gameSettings.isLobbyVisible ? (
                <div id="lobby-container">
                    <HexGameMenu onStartGame={initializeGame} />
                </div>
            ) : (
                <div id="game-container">
                    {game && <HexBoard
                        game={game}
                        boardSize={gameSettings.boardSize}
                        colorScheme={gameSettings.colorScheme}                        
                        onClick={handleClick}
                        isBoardDisabled={isBoardDisabled}                        
                        getPlayerAttributes={getPlayerAttributes} 
                        />}
                    {gameSettings.isStatusVisible && (
                        <StatusPanel
                            status={status} 
                            playerName={playerName}
                            playerColor={playerColor}                           
                            timer={formatTime(timer)}                            
                            onSurrender={handleSurrender}
                            onNewGame={handleNewGame}                            
                            isVisible={gameSettings.isStatusVisible}
                            isSurrenderDisabled={isSurrenderDisabled}                            
                        />
                    )}
                </div>
            )}            
        </div>
    );
};

export default HexGame;