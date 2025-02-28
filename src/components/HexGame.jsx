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
    const modal = useModal();    

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
            showGameOverModal(winnerColor, `${winnerColor} wins!`); // Show game over modal                 
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
            setTimeout(() => modal.open("Do you want to swap positions?", handleSwapRule, handleSwapClose), 100); // Show modal for human player  
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
        modal.close();
    
        // Re-enable the AI
        if (ai && game.currentPlayer === ai.player) {            
            ai.isDisabled = false;
            playAITurn(game, ai);
        }        
    };
    
    // Handle surrender confirmation
    const handleSurrender = () => {        
        logSurrender(currentPlayer, getPlayerColor(currentPlayer, colorScheme));
        modal.close();
        
        // Update game state
        const winner = getNextPlayer(currentPlayer);        
        updateGame(game, winner);
    };

    // Handle new game button click
    const handleNewGame = () => {         
        dispatch({ type: 'RESET_GAME' });
        stopTimer();
        modal.close();                   
    };

    // Handle quit confirmation
    const handleQuitConfirm = () => {
        dispatch({ type: 'RESET_GAME' });
        stopTimer();        
        modal.close();
    };

    // Show game over modal
    const showGameOverModal = (winnerColor, winStatus) => {
        modal.open(
            <>
            <div id="status-container">
                <div id="status-hex" className={`hex ${winnerColor}`}></div>
                <h2>
                    <span id="status-text" style={{ color: (winnerColor).toLowerCase() }}>{winStatus}</span>
                </h2>
            </div> 
            <h3>Play Time: {formatTime(timer)}</h3>
            <h3>Total Turns: {game.turnCount}</h3>
            <p>Do you want to start a new game?</p>            
            </>,
            handleNewGame,
            handleQuitConfirm
        );           
    }    

    // Handle keyboard key down events
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                // Prevent quit modal from opening if another modal is open
                if (!modal.isVisible) {
                    modal.open(
                        "Are you sure you want to quit?",
                        handleQuitConfirm, () => modal.close()
                    );
                }
            } else if (event.key === 'Enter') {
                // If quit modal is open, confirm quit
                if (modal.isVisible && modal.onConfirm) modal.onConfirm();                
            }
        };
    
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modal.isVisible, modal.onConfirm]);        

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
                            onSurrender={() => modal.open(
                                "Are you sure you want to surrender?",
                                handleSurrender,
                                () => modal.close()
                            )}
                            onNewGame={handleNewGame}                            
                            isVisible={isStatusVisible}
                            isSurrenderDisabled={isSurrenderDisabled}                            
                        />
                    )} 
                    <Modal
                        isVisible={modal.isVisible}
                        message={modal.message}  
                        onClose={modal.onCancel}                                            
                        onConfirm={modal.onConfirm}
                        onCancel={modal.onCancel}
                    />
                </div>
            )}
        </div>
    );
};

export default HexGame;