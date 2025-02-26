import React, { useState } from 'react';
import Modal from './Modal';
import useModal from '../hooks/useModal';
import '../styles/GameSetup.css';
import schemeBlackWhite from '../assets/images/scheme-black-white.png';
import schemeRedBlue from '../assets/images/scheme-red-blue.png';

// GameSetup component
const GameSetup = ({ onStartGame, onReturn }) => {
    // Game setup settings
    const [boardSize, setBoardSize] = useState(11);
    const [gameMode, setGameMode] = useState('sandbox');
    const [swapRule, setSwapRule] = useState(false);
    const [colorScheme, setColorScheme] = useState('black-white');  
    const [AIplayer, setAIPlayer] = useState('Player1');    
    const invalidBoardSizeModal = useModal();    

    // Handle the start game button click
    const handleStartGame = () => {
        if (boardSize >= 3 && boardSize <= 19) {
            onStartGame(gameMode, boardSize, swapRule, colorScheme, AIplayer);
        } else {
            invalidBoardSizeModal.open();
            setBoardSize(11);
        }
    };

    return (
        <div id="menu-container">
            <div className="game-setup-container">
                <div className="input-container">
                    <label htmlFor="board-size-box">
                        Board Size (n×n):
                        <input
                            type="number"
                            id="board-size-box"
                            min="3"
                            max="19"
                            value={boardSize}
                            onChange={(e) => setBoardSize(e.target.value)}
                            title="Size can be between 3 and 19."
                        />
                    </label>
                    <label htmlFor="game-mode-box">
                        Game Mode:
                        <select id="game-mode-box" value={gameMode} onChange={(e) => setGameMode(e.target.value)}>
                            <option value="sandbox">Sandbox</option>
                            <option value="ai">Versus AI</option>
                        </select>                        
                        <select id="player-box" title="This is the AI player." value={AIplayer} onChange={(e) => setAIPlayer(e.target.value)} disabled={gameMode !== 'ai'}>
                            <option value="Player1">Player1</option>
                            <option value="Player2">Player2</option>
                        </select>
                    </label>
                    <label htmlFor="swap-rule-box">
                        Enable Swap Rule:
                        <input                            
                            type="checkbox"
                            id="swap-rule-box"
                            checked={swapRule}
                            onChange={(e) => setSwapRule(e.target.checked)}
                            title="The swap rule enables the second player to swap moves with the first player after the first move."
                        />
                    </label>
                </div>
                <div className="color-scheme-container">
                    <label id="scheme-label">Color Scheme:</label>
                    <div                     
                        className={`scheme-option ${colorScheme === 'black-white' ? 'selected' : ''}`}
                        onClick={() => setColorScheme('black-white')}                        
                    >
                        <img src={schemeBlackWhite} alt="Scheme_BW" className="scheme-icon" />
                    </div>
                    <div
                        className={`scheme-option ${colorScheme === 'red-blue' ? 'selected' : ''}`}
                        onClick={() => setColorScheme('red-blue')}                        
                    >
                        <img src={schemeRedBlue} alt="Scheme_RB" className="scheme-icon" />
                    </div>
                </div>
            </div>
            <button id="start-game" onClick={handleStartGame}>Start Game</button>
            <button onClick={onReturn}>Return</button>
            <Modal
                isVisible={invalidBoardSizeModal.isVisible}                
                message={"Please enter a size between 3 and 19."}
                onClose={invalidBoardSizeModal.close}                
            />
        </div>
    );
};

export default GameSetup;