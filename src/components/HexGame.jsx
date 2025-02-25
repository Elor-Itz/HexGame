import React, { useReducer } from 'react';
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
import backgroundImage from '../assets/images/background.jpg';

// HexGame component
const HexGame = () => {
    // Game settings and hooks
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { game, ai, boardSize, colorScheme, swapRuleEnabled, isLobbyVisible, isStatusVisible, status, isBoardDisabled, isSurrenderDisabled, currentPlayer } = state;
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));
    const { playPlayer1Sound, playPlayer2Sound, playWinnerSound } = useAudio();
    const swapModal = useModal();
    const surrenderModal = useModal();

    // Initialize a new game
    const initializeGame = (gameMode, boardSize, swapRule, colorScheme) => {
        // Initialize game state
        const newGame = new HexGameLogic(boardSize);
        const newAI = gameMode === 'ai' ? new HexAILogic(newGame, 'Player2') : null;           
        dispatch({ type: 'INITIALIZE_GAME', payload: { game: newGame, ai: newAI, gameMode: gameMode, boardSize: boardSize, swapRule: swapRule, colorScheme: colorScheme },});                
        resetTimer();

        // Set the first player and update the status
        const firstPlayer = newGame.currentPlayer;
        dispatch({ type: 'UPDATE_GAME', payload: { currentPlayer: firstPlayer, status: `${getPlayerColor(firstPlayer, colorScheme)}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });
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
            // Switch the player            
            handlePlayerSwitch(game);
            
            // If it's AI's turn, make a move            
            if (getNextPlayer(currentPlayer) === "Player2" && ai) {                               
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
        applyMoveEffects(row, col);

        // Update game state
        updateGame(game, game.checkWinner());
    };

    // Apply move effects
    const applyMoveEffects = (row, col) => {
        // Log move
        const playerColor = getPlayerColor(game.currentPlayer, colorScheme);                
        logMove(game.turnCount, game.currentPlayer, playerColor, row, col, formatTime(timer));

        // Play sound based on current player
        (game.currentPlayer === "Player1" ? playPlayer1Sound() : playPlayer2Sound());

        // Check swap rule condition
        if (swapRuleEnabled && game.turnCount <= 2) checkSwapRule(row, col);
    };

    // Handle AI turn
    const playAITurn = (game, ai) => {
        dispatch({ type: 'AI_TURN' });
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {
                applyMoveEffects(move.row, move.col);
                handlePlayerSwitch(game);                
            }
        }, 1000);
    };

    // Check swap rule condition
    const checkSwapRule = (row, col) => {
        // Track the first two moves
        game.trackMove(row, col);
    
        if (game.turnCount !== 2) return;    
        
        if (ai && game.currentPlayer === ai.player) {
            // AI has a 50% chance to swap
            if (Math.random() < 0.5) handleSwapRule();
        } else {
            // Show modal for human player
            swapModal.open();
        }
    };
    
    // Handle swap rule
    const handleSwapRule = () => {
        game.performSwapRule();
        logSwap(getPlayerColor('Player1', colorScheme), getPlayerColor('Player2', colorScheme), game.firstMove, game.secondMove);
        swapModal.close();
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
                        onClose={swapModal.close}                                            
                        onConfirm={handleSwapRule}
                        onCancel={swapModal.close}
                    />
                    <Modal
                        isVisible={surrenderModal.isVisible}
                        message="Are you sure you want to surrender?" 
                        onClose={surrenderModal.close}                                               
                        onConfirm={handleSurrender}
                        onCancel={surrenderModal.close}
                    />
                </div>
            )}
        </div>
    );
};

export default HexGame;