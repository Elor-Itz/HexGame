import React, { useEffect, useReducer } from 'react';
import { gameReducer, initialState } from '../reducers/gameReducer';
import HexGameMenu from './HexGameMenu';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import Modal from './Modal';
import useModal from '../hooks/useModal';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import HexGameLogic from '../services/hexGameLogic';
import HexAILogic from '../services/hexAILogic';
import { getNextPlayer, getPlayerColor } from '../utils/player';
import { logMove, logSwap, logWinner, logSurrender } from '../utils/logger';
import '../styles/HexGame.css';

// HexGame component
const HexGame = () => {
    // Game settings and hooks
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { game, ai, boardSize, colorScheme, swapRuleEnabled, isLobbyVisible, isStatusVisible, status, isBoardDisabled, isSurrenderDisabled, currentPlayer } = state;
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));
    const { playPlayer1Sound, playPlayer2Sound, playWinnerSound } = useAudio();
    const swapModal = useModal();
    const surrenderModal = useModal();
    const quitModal = useModal();

    // Initialize a new game
    const initializeGame = (gameMode, boardSize, swapRule, colorScheme, AIplayer) => {
        // Initialize game state
        const newGame = new HexGameLogic(boardSize);
        const newAI = gameMode === 'ai' ? new HexAILogic(newGame, AIplayer) : null;               
        
        dispatch({ type: 'INITIALIZE_GAME', payload: { game: newGame, ai: newAI, gameMode: gameMode, boardSize: boardSize, swapRule: swapRule, colorScheme: colorScheme },});                
        resetTimer();

        // Set the first player and update the status
        const firstPlayer = newGame.currentPlayer;
        dispatch({ type: 'UPDATE_GAME', payload: { currentPlayer: firstPlayer, status: `${getPlayerColor(firstPlayer, colorScheme)}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });

        // If AI is Player1, make the first move
        if (gameMode === 'ai' && AIplayer === 'Player1') {
            playAITurn(newGame, newAI);
        }
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves            
            const winnerColor = getPlayerColor(winner, colorScheme);            
            dispatch({ type: 'UPDATE_GAME', payload: { currentPlayer: winner, status: `${winnerColor} wins!`, isBoardDisabled: true, isSurrenderDisabled: true }, });                             
            logWinner(winnerColor, game.turnCount);
            stopTimer();            
            playWinnerSound();           
        } else {                      
            handlePlayerSwitch(game); // Switch the player  
            
            // If it's AI's turn, make a move            
            if (ai && getNextPlayer(currentPlayer) === ai.player) {                               
                playAITurn(game, ai);               
            }        
        }        
    };    

    // Switch the current player and update the status
    const handlePlayerSwitch = (game) => {
        const nextPlayer = game.switchPlayer();
        const nextPlayerColor = getPlayerColor(game.currentPlayer, colorScheme);               
        dispatch({ type: 'UPDATE_GAME', payload: { currentPlayer: nextPlayer, status: `${nextPlayerColor}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });                                
    };
    
    // Handle hex click
    const handleClick = (row, col) => {        
        // Check if the hex is already filled - else make the move
        if (game.board[row][col] !== null) return;        
        game.makeMove(row, col);  
        applyMoveEffects(game, row, col);
        
        updateGame(game, game.checkWinner()); // Update game state
    };

    // Apply move effects
    const applyMoveEffects = (game, row, col) => {
        const playerColor = getPlayerColor(game.currentPlayer, colorScheme);                
        logMove(game.turnCount, game.currentPlayer, playerColor, row, col, formatTime(timer)); // Log move
        
        (game.currentPlayer === "Player1" ? playPlayer1Sound() : playPlayer2Sound()); // Play sound based on current player
        
        if (swapRuleEnabled && game.turnCount <= 2) checkSwapRule(row, col); // Check swap rule condition
    };

    // Handle AI turn
    const playAITurn = (game, ai) => {
        
        if (ai.isDisabled) return; // Check if AI is disabled

        dispatch({ type: 'AI_TURN' });
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {
                applyMoveEffects(game, move.row, move.col);
                game.trackMove(move.row,move.col);
                handlePlayerSwitch(game);                
            }
        }, 1000);
    };

    // Check swap rule condition
    const checkSwapRule = (row, col) => {        
        game.trackMove(row, col); // Track the first two moves
    
        if (game.turnCount !== 2) return; // Check if it's the second move
        
        if (ai && game.currentPlayer === ai.player) {            
            if (Math.random() < 0.5) handleSwapRule(); // AI has a 50% chance to swap
        } else {
            if (ai) ai.isDisabled = true; // Disable AI while waiting for human player
            game.secondMove = { row, col }; // Track the second move
            setTimeout(() => swapModal.open(), 100); // Show modal for human player  
        }
    };
    
    // Handle swap rule
    const handleSwapRule = () => {                             
        game.performSwapRule();
        logSwap(getPlayerColor('Player1', colorScheme), getPlayerColor('Player2', colorScheme), game.firstMove, game.secondMove);
        handleSwapClose();
    };

    // Handle swap rule cancel
    const handleSwapClose = () => {
        swapModal.close();
    
        // Re-enable the AI
        if (ai && game.currentPlayer === ai.player) {            
            ai.isDisabled = false;
            playAITurn(game, ai);
        }        
    };
    
    // Handle surrender confirmation
    const handleSurrender = () => {        
        logSurrender(currentPlayer, getPlayerColor(currentPlayer, colorScheme));
        
        // Update game state
        const winner = getNextPlayer(currentPlayer);        
        updateGame(game, winner);
        surrenderModal.close();
    };

    // Handle new game button click
    const handleNewGame = () => {         
        dispatch({ type: 'RESET_GAME' });
        stopTimer();                   
    };

    // Handle keyboard key down events
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                // Prevent quit modal from opening if another modal is open
                if (!surrenderModal.isVisible && !swapModal.isVisible && !quitModal.isVisible) {
                    quitModal.open();
                }
            } else if (event.key === 'Enter') {
                // If quit modal is open, confirm quit
                if (quitModal.isVisible) {
                    handleQuitConfirm(); // Function to quit game
                } else if (surrenderModal.isVisible) {
                    handleSurrender(); // Function to surrender
                } else if (swapModal.isVisible) {
                    handleSwapRule(); // Function to confirm swap
                }
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [surrenderModal.isVisible, swapModal.isVisible, quitModal.isVisible]);

    // Handle quit confirmation
    const handleQuitConfirm = () => {
        dispatch({ type: 'RESET_GAME' });
        stopTimer();
        quitModal.close();
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
                        colorScheme={colorScheme}                        
                        onClick={handleClick}
                        isBoardDisabled={isBoardDisabled}
                        />}
                    {isStatusVisible && (
                        <StatusPanel
                            status={status}                            
                            playerColor={getPlayerColor(currentPlayer, colorScheme)}
                            turn={game ? game.turnCount : 1}  
                            timer={formatTime(timer)}                        
                            onSurrender={surrenderModal.open}
                            onNewGame={handleNewGame}                            
                            isVisible={isStatusVisible}
                            isSurrenderDisabled={isSurrenderDisabled}                            
                        />
                    )}
                    <Modal
                        isVisible={swapModal.isVisible}
                        message="Do you want to swap positions?"  
                        onClose={handleSwapClose}                                            
                        onConfirm={handleSwapRule}
                        onCancel={handleSwapClose}
                    />
                    <Modal
                        isVisible={surrenderModal.isVisible}
                        message="Are you sure you want to surrender?" 
                        onClose={surrenderModal.close}                                               
                        onConfirm={handleSurrender}
                        onCancel={surrenderModal.close}
                    />
                    <Modal
                        isVisible={quitModal.isVisible}
                        message="Are you sure you want to quit?"
                        onClose={quitModal.close}
                        onConfirm={handleQuitConfirm}
                        onCancel={quitModal.close}
                    />
                </div>
            )}
        </div>
    );
};

export default HexGame;