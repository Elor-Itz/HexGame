import React, { useState } from 'react';
import Modal from './Modal';
import OptionsModal from './OptionsModal';
import HowToPlayModal from './HowToPlayModal';
import '../styles/HexGameMenu.css';
import schemeBlackWhite from '../assets/images/scheme-black-white.png';
import schemeRedBlue from '../assets/images/scheme-red-blue.png';

// HexGameMenu component
const HexGameMenu = ({ onStartGame }) => {
    const [boardSize, setBoardSize] = useState(11);
    const [mode, setMode] = useState('sandbox');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showOptions, setShowOptions] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [swapRule, setSwapRule] = useState(false);
    const [colorScheme, setColorScheme] = useState('black-white');         

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
        }
    };

    // Handle modal close
    const handleCloseModal = () => {
        setShowModal(false);
        setModalMessage('');
        setShowInstructions(false);
    };

    // Handle new game button click
    const handleNewGame = () => {
        setShowSettings(true);
    };

    // Handle new game button click
    const handleOptions = () => {  
        setShowOptions(true);      
    };

    // Handle instructions button click
    const handleShowInstructions = () => {
        setShowInstructions(true);
        setShowModal(true);
    };    

    // Handle return button click
    const handleReturn = () => {
        setShowSettings(false);
    };

    // Handle theme change
    const handleThemeChange = (theme) => {
        document.body.className = theme;
    };

    // Handle volume change
    const handleVolumeChange = (volume) => {
        console.log(`Volume set to: ${volume}`);
        // Implement volume control logic here
    };

    return (
        <div id="menu-wrapper">
            {!showSettings ? (
                <div id="menu-container">
                    <h1 className="flash">Hex</h1>
                    <button onClick={handleNewGame}>New Game</button>
                    <button onClick={handleOptions}>Options</button> 
                    <button onClick={handleShowInstructions}>How to Play</button>                                       
                </div>
            ) : (
                <div id="menu-container">                    
                    <div className="settings-container">
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
                    <button onClick={handleReturn}>Return</button>
                </div>
            )}
            {showModal && (
                <Modal message={modalMessage} onClose={handleCloseModal} />
            )}
            {showOptions && (
                <OptionsModal
                    show={showOptions}
                    onClose={() => setShowOptions(false)}
                    onThemeChange={handleThemeChange}
                    onVolumeChange={handleVolumeChange}
                />
            )}
            {showInstructions && (
                <HowToPlayModal show={showInstructions} onClose={handleCloseModal} />
            )}            
        </div>
    );
};

export default HexGameMenu;