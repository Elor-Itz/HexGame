import React, { useReducer } from 'react';
import { gameReducer, initialState } from '../reducers/gameReducer';
import HexGameMenu from './HexGameMenu';
import HexBoard from './HexBoard';
import StatusPanel from './StatusPanel';
import useTimer from '../hooks/useTimer';
import useAudio from '../hooks/useAudio';
import HexGameLogic from '../services/hexGameLogic';
import HexAILogic from '../services/hexAILogic';
import { getNextPlayer, getPlayerAttributes } from '../utils/getData';
import '../styles/HexGame.css';
import backgroundImage from '../assets/images/background.jpg';

// HexGame component
const HexGame = () => {
    // Game settings
    const [state, dispatch] = useReducer(gameReducer, initialState);
    const { game, ai, gameMode, boardSize, colorScheme, swapRuleEnabled, isLobbyVisible, isStatusVisible, status, isBoardDisabled, isSurrenderDisabled, currentPlayer, playerName, playerColor } = state;
    const logColor = playerColor === 'white' ? 'silver' : playerColor;
    
    // Timer and audio hooks
    const { timer, resetTimer, stopTimer, formatTime } = useTimer(!isLobbyVisible && !status.includes('wins'));
    const { playPlayer1Sound, playPlayer2Sound, playWinnerSound } = useAudio();

    // Initialize a new game
    const initializeGame = (gameMode, boardSize, swapRule, colorScheme) => {
        // Initialize game state
        const newGame = new HexGameLogic(boardSize);
        const newAI = gameMode === 'ai' ? new HexAILogic(newGame) : null; 
        const firstPlayer = newGame.currentPlayer;        
        dispatch({ type: 'INITIALIZE_GAME', payload: { game: newGame, ai: newAI, gameMode: gameMode, boardSize: boardSize, swapRule: swapRule, colorScheme: colorScheme, currentPlayer: firstPlayer, playerName: getPlayerAttributes(firstPlayer, colorScheme).className, playerColor: getPlayerAttributes(firstPlayer, colorScheme).color },});
        resetTimer();        
        dispatch({ type: 'UPDATE_STATUS', payload: { status: `${getPlayerAttributes(firstPlayer, colorScheme).className}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });              
    };

    // Handle game update
    const updateGame = (game, winner) => {
        if (winner) {
            // Display the winner and disable further moves            
            const { className: winnerName, color: winnerColor } = getPlayerAttributes(winner, colorScheme);
            const winnerLogColor = winnerColor === 'white' ? 'silver' : winnerName;
            dispatch({ type: 'UPDATE_STATUS', payload: { status: `${winnerName} wins!`, isBoardDisabled: true, isSurrenderDisabled: true }, });                             
            console.log(`%c${winnerName} wins! Turns: ${game.turnCount}`, `background: ${winnerLogColor}; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);                       
            stopTimer();            
            playWinnerSound();           
        } else {
            // Switch the player            
            switchPlayer(game);            
            const { className: playerName } = getPlayerAttributes(game.currentPlayer, colorScheme);  
            dispatch({ type: 'UPDATE_STATUS', payload: { status: `${playerName}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });            
            
            // If it's AI's turn, make a move            
            if (getNextPlayer(currentPlayer) === "Player2" && ai) {                               
                playAITurn(game, ai);               
            }        
        }        
    }; 

    // Handle AI turn
    const playAITurn = (game, ai) => {
        dispatch({ type: 'AI_TURN' });
        setTimeout(() => {
            const move = ai.makeMove();
            if (move) {
                // Simulate a click on the cell returned by the AI
                handleClick(move.row, move.col);
                playPlayer2Sound();
    
                // Log the move before switching the player                
                const { className: playerName, color: playerColor } = getPlayerAttributes(game.currentPlayer, colorScheme);
                const logColor = playerColor === 'white' ? 'silver' : playerName;
                console.log(
                    `%cTurn ${game.turnCount} | ${game.currentPlayer} (${playerName}) | Row: ${move.row}, Col: ${move.col} | Time: ${formatTime(timer)}`,
                    `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
                );
    
                // Switch the player
                switchPlayer(game);
                dispatch({ type: 'UPDATE_STATUS', payload: { status: `${playerName}'s turn`, isBoardDisabled: false, isSurrenderDisabled: false }, });                                
            }
        }, 1000);
    };

    // Switch the current player    
    const switchPlayer = (game) => {
        const nextPlayer = game.switchPlayer();
        dispatch({ type: 'UPDATE_PLAYER', payload: { currentPlayer: nextPlayer, playerName: getPlayerAttributes(nextPlayer, colorScheme).className, playerColor: getPlayerAttributes(nextPlayer, colorScheme).color }, });    
    };
    
    // Handle hex click
    const handleClick = (row, col) => {        
        // Check if the hex is already filled
        if (game.board[row][col] !== null) return;
        
        // Make the move and update the board
        game.makeMove(row, col);               
        
        // Log the move        
        console.log(
            `%cTurn ${game.turnCount} | ${game.currentPlayer} (${playerName}) | Row: ${row}, Col: ${col} | Time: ${formatTime(timer)}`, 
            `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
        );

        // Play sound based on current player
        (currentPlayer === "Player1" ? playPlayer1Sound() : playPlayer2Sound());

        updateGame(game, game.checkWinner());
    };
    
    // Handle swap rule
    const handleSwapRule = () => {
        // if (window.confirm("Do you want to swap positions?")) {
        //     // Swap positions
        //     setCurrentPlayer("Player2");
        //     dispatch({ type: 'UPDATE_STATUS', payload: { status: "Player2's turn", isBoardDisabled: false, isSurrenderDisabled: false }, });            
        // }
    };
    
    // Handle surrender button click
    const handleSurrender = () => {
        console.log(`%c${currentPlayer} (${playerName}) has surrendered.`, `color: ${logColor}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`);           
        const winner = getNextPlayer(currentPlayer);        
        dispatch({ type: 'UPDATE_PLAYER', payload: { currentPlayer: winner, playerName: getPlayerAttributes(winner, colorScheme).className, playerColor: getPlayerAttributes(winner, colorScheme).color }, });
        updateGame(game, winner);
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
        </div>
    );
};

export default HexGame;