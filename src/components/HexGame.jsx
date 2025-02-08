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

// HexGame component
const HexGame = () => {
    // Game settings
    const [game, setGame] = useState(null);    
    const [gameMode, setGameMode] = useState('sandbox');
    const [boardSize, setBoardSize] = useState(11);
    const [isLobbyVisible, setLobbyVisiblity] = useState(true);
    const [isStatusVisible, setStatusVisiblity] = useState(true);
    const [ai, setAI] = useState(null);
    const [swapRuleEnabled, setSwapRuleEnabled] = useState(false);

    // Game status
    const { status, updateStatus, isBoardDisabled, setIsBoardDisabled, isSurrenderDisabled, setIsSurrenderDisabled } = useGameStatus();

    // Player settings
    const { currentPlayer, playerName, playerColor, colorScheme, setCurrentPlayer, setColorScheme, getPlayerAttributes, updatePlayerAttributes, getNextPlayer, switchPlayer, updatePlayer } = usePlayerManager();    
    const logColor = playerColor === 'white' ? 'silver' : playerColor;
    
    // Timer and turn counter hooks
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));    
    const { turn, incrementTurnCount, resetTurnCount } = useTurnCounter();    
  
    // Audio hooks
    const { player1SoundRef, player2SoundRef, winnerSoundRef, playPlayer1Sound, playPlayer2Sound, playWinnerSound } = useAudio();

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
    const updateGameEnvironment = (game, gameMode, size, swapRule, colorScheme, isLobbyVisible, isStatusVisible, timerFunction ) => {
        setGame(game);
        setGameMode(gameMode);
        setBoardSize(size);        
        setSwapRuleEnabled(swapRule);  
        setColorScheme(colorScheme);  
        setLobbyVisiblity(isLobbyVisible);
        setStatusVisiblity(isStatusVisible);
        timerFunction?.();
        resetTurnCount();
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves            
            const { className: winnerName, color: winnerColor } = getPlayerAttributes(winner, colorScheme);
            const winnerLogColor = winnerColor === 'white' ? 'silver' : winnerName;
            updateStatus(`${winnerName} wins!`, true, true);                  
            console.log(`%c${winnerName} wins! Turns: ${turn}`, `background: ${winnerLogColor}; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);                       
            stopTimer();
            resetTurnCount();
            playWinnerSound();           
        } else {
            // Switch the player            
            switchPlayer(game);            
            const { className: playerName } = getPlayerAttributes(game.currentPlayer, colorScheme);            
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
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {    
                // Simulate a click on the cell returned by the AI
                handleCellClick(move.row, move.col);
                playPlayer2Sound(); 
                switchPlayer(game);
                const { className: playerName } = getPlayerAttributes(game.currentPlayer, colorScheme);            
                updateStatus(`${playerName}'s turn`, false, false);                
                incrementTurnCount();
                console.log(
                    `%cTurn ${turn} | ${game.currentPlayer} (${playerName}) | Row: ${move.row}, Col: ${move.col} | Time: ${formatTime(timer)}`, 
                    `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
                );
            }
        }, 1000);                    
    };
    
    // Handle cell click
    const handleCellClick = (row, col) => {        
        // Check if the cell is already filled
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
        updateGameEnvironment(null, gameMode, boardSize, false, 'black-white', true, false), stopTimer();                
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
                            playerName={playerName}
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
            <audio ref={winnerSoundRef} src="/sound/winner.mp3" />
        </div>
    );
};

export default HexGame;