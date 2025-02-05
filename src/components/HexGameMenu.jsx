import React, { useState } from 'react';
import Modal from './Modal';
import '../styles/HexGameMenu.css';

// HexGameMenu component
const HexGameMenu = ({ onStartGame, setColorScheme }) => {
    const [boardSize, setBoardSize] = useState(11);
    const [mode, setMode] = useState('sandbox');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showInstructions, setShowInstructions] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [swapRule, setSwapRule] = useState(false);
    const [colorScheme, setLocalColorScheme] = useState('black-white');

    // Handle the input change event
    const handleInputChange = (event) => {
        setBoardSize(parseInt(event.target.value, 10));
    };
    
    // Handle the start game button click
    const handleStartGame = () => {
        if (boardSize >= 3 && boardSize <= 19) {
            onStartGame(mode, boardSize, swapRule);
            setColorScheme(colorScheme);
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
                    <label htmlFor="board-size-box">
                        Board Size (n x n):
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
                    <label htmlFor="color-scheme-box">
                        Color Scheme:
                        <select id="color-scheme-box" value={colorScheme} onChange={(e) => setLocalColorScheme(e.target.value)}>
                            <option value="black-white">Black/White</option>
                            <option value="red-blue">Red/Blue</option>
                        </select>
                    </label>
                    <button id="start-game" onClick={handleStartGame}>Start Game</button>
                    <button onClick={handleReturn}>Return</button>
                </div>
            )}
            {showModal && (
                <Modal message={modalMessage} onClose={handleCloseModal}>
                    {showInstructions && (
                        <div>
                            <h2>How to Play:</h2>
                            <img src="/img/example.png" alt="Example" className="modal-image" />
                            <p>
                                Hex is a game played on a two-dimensional board by two players - <span style={{ color: 'black', fontWeight: 'bold' }}>Black</span> and <span style={{ color: 'white', fontWeight: 'bold' }}>White</span>.
                                Your goal is to form a connected path of your color, linking two opposite sides of the board: 
                                <span style={{ color: 'black', fontWeight: 'bold' }}> Black</span> connects top and bottom, while <span style={{ color: 'white', fontWeight: 'bold' }}>White</span> connects left and right.
                                The player who completes such a connection wins the game!
                            </p>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};

export default HexGameMenu;