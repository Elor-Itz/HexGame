import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/GameSetup.css';
import schemeBlackWhite from '../assets/images/scheme-black-white.png';
import schemeRedBlue from '../assets/images/scheme-red-blue.png';

// GameSetup component
const GameSetup = ({ onStartGame, onReturn }) => {
    // Game setup settings
    const [boardSize, setBoardSize] = useState(11);
    const [mode, setMode] = useState('sandbox');
    const [swapRule, setSwapRule] = useState(false);
    const [colorScheme, setColorScheme] = useState('black-white');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    // Handle the input change event
    const handleInputChange = (event) => {
        setBoardSize(parseInt(event.target.value, 10));
    };

    // Handle color scheme selection
    const handleColorSchemeSelect = (scheme) => {
        setColorScheme(scheme);
    };

    // Handle the start game button click
    const handleStartGame = () => {
        if (boardSize >= 3 && boardSize <= 19) {
            onStartGame(mode, boardSize, swapRule, colorScheme);
        } else {
            setModalMessage("Please enter a size between 3 and 19.");
            setShowModal(true);
            setBoardSize(11);
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
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
                            onChange={handleInputChange}
                        />
                    </label>
                    <label htmlFor="game-mode-box">
                        Game Mode:
                        <select id="game-mode-box" value={mode} onChange={(e) => setMode(e.target.value)}>
                            <option value="sandbox">Sandbox</option>
                            <option value="ai">Versus AI</option>
                        </select>
                    </label>
                    <label htmlFor="swap-rule-box">
                        Enable Swap Rule:
                        <input
                            type="checkbox"
                            id="swap-rule-box"
                            checked={swapRule}
                            onChange={(e) => setSwapRule(e.target.checked)}
                        />
                    </label>
                </div>
                <div className="color-scheme-container">
                    <label id="scheme-label">Color Scheme:</label>
                    <div
                        className={`scheme-option ${colorScheme === 'black-white' ? 'selected' : ''}`}
                        onClick={() => handleColorSchemeSelect('black-white')}
                    >
                        <img src={schemeBlackWhite} alt="Scheme BW" className="scheme-icon" />
                    </div>
                    <div
                        className={`scheme-option ${colorScheme === 'red-blue' ? 'selected' : ''}`}
                        onClick={() => handleColorSchemeSelect('red-blue')}
                    >
                        <img src={schemeRedBlue} alt="Scheme RB" className="scheme-icon" />
                    </div>
                </div>
            </div>
            <button id="start-game" onClick={handleStartGame}>Start Game</button>
            <button onClick={onReturn}>Return</button>
            {showModal && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
        </div>
    );
};

export default GameSetup;