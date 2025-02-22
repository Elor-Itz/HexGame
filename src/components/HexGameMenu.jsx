import React, { useState, useEffect } from 'react';
import useAudio from '../hooks/useAudio';
import Modal from './Modal';
import OptionsModal from './OptionsModal';
import HowToPlayModal from './HowToPlayModal';
import '../styles/HexGameMenu.css';
import schemeBlackWhite from '../assets/images/scheme-black-white.png';
import schemeRedBlue from '../assets/images/scheme-red-blue.png';

// HexGameMenu component
const HexGameMenu = ({ onStartGame }) => {
    // Game setup settings
    const [showGameSetup, setShowGameSetup] = useState(false);
    const [boardSize, setBoardSize] = useState(11);
    const [mode, setMode] = useState('sandbox');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');    
    const [swapRule, setSwapRule] = useState(false);
    const [colorScheme, setColorScheme] = useState('black-white');
    
    // Options settings
    const [showOptions, setShowOptions] = useState(false);
    const [theme, setTheme] = useState('');
    const { volume, updateGameVolume } = useAudio(50);
    
    // How to play modal
    const [showHowToPlay, setShowHowToPlay] = useState(false);
    
    // Apply the theme when it changes
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

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
        setShowHowToPlay(false);
    };

    // Handle new game button click
    const handleNewGame = () => {
        setShowGameSetup(true);
    };

    // Handle new game button click
    const handleOptions = () => {  
        setShowOptions(true);      
    };

    // Handle instructions button click
    const handleShowInstructions = () => {
        setShowHowToPlay(true);
        setShowModal(true);
    };    

    // Handle return button click
    const handleReturn = () => {
        setShowGameSetup(false);
    };    

    return (
        <div id="menu-wrapper">
            {!showGameSetup ? (
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
                    initialTheme={theme}
                    initialVolume={volume}
                    onThemeChange={setTheme}
                    onVolumeChange={updateGameVolume}
                />
            )}
            {showHowToPlay && (
                <HowToPlayModal show={showHowToPlay} onClose={handleCloseModal} />
            )}            
        </div>
    );
};

export default HexGameMenu;