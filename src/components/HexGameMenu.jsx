import React, { useState, useEffect } from 'react';
import GameSetup from './GameSetup';
import OptionsModal from './OptionsModal';
import useOptions from '../hooks/useOptions';
import HowToPlayModal from './HowToPlayModal';
import '../styles/HexGameMenu.css';

// HexGameMenu component
const HexGameMenu = ({ onStartGame }) => {
    // Menu modals
    const [showGameSetup, setShowGameSetup] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const { loadOptions } = useOptions();
    const [showHowToPlay, setShowHowToPlay] = useState(false);  

    // Load stored options when the component mounts
    useEffect(() => {
        loadOptions();
    }, []);

    // Handle new game button click
    const handleNewGame = () => {
        setShowGameSetup(true);
    };
    
    // Handle return button click
    const handleReturn = () => {
        setShowGameSetup(false);
    };
    
    // Handle new game button click
    const handleOptions = () => {  
        setShowOptions(true);      
    };

    // Handle instructions button click
    const handleShowHowToPlay = () => {
        setShowHowToPlay(true);        
    };
    
    // Handle modal close
    const handleCloseModal = () => {        
        setShowOptions(false);
        setShowHowToPlay(false);
    };    
    
    // Close modals on Esc key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                document.activeElement.blur();
                if (showOptions || showHowToPlay) {
                    handleCloseModal();
                } else if (showGameSetup) {
                    handleReturn();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, );

    return (
        <div id="menu-wrapper">
            {!showGameSetup ? (
                <div id="menu-container">
                    <h1 className="flash">Hex</h1>
                    <button onClick={handleNewGame}>New Game</button>
                    <button onClick={handleOptions}>Options</button> 
                    <button onClick={handleShowHowToPlay}>How to Play</button>                                       
                </div>
            ) : (
                <GameSetup onStartGame={onStartGame} onReturn={handleReturn} />
            )}            
            {showOptions && (
                <OptionsModal show={showOptions} onClose={handleCloseModal} />                
            )}
            {showHowToPlay && (
                <HowToPlayModal show={showHowToPlay} onClose={handleCloseModal} />
            )}            
        </div>
    );
};

export default HexGameMenu;