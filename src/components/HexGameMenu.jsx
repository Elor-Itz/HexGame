import React, { useEffect } from 'react';
import GameSetup from './GameSetup';
import OptionsModal from './OptionsModal';
import HowToPlayModal from './HowToPlayModal';
import useModal from '../hooks/useModal';
import useOptions from '../hooks/useOptions';
import '../styles/HexGameMenu.css';

// HexGameMenu component
const HexGameMenu = ({ onStartGame }) => {
    // Menu modals
    const gameSetupModal = useModal();
    const optionsModal = useModal();
    const howToPlayModal = useModal();
    const { loadOptions } = useOptions();     

    // Load stored options when the component mounts
    useEffect(() => {
        loadOptions();
    }, []);     
    
    // Close modals on Esc key press
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                document.activeElement.blur();
                if (optionsModal.isVisible || howToPlayModal.isVisible) {
                    optionsModal.close();
                    howToPlayModal.close();
                } else if (gameSetupModal.isVisible) {
                    gameSetupModal.close();
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameSetupModal.isVisible, optionsModal.isVisible, howToPlayModal.isVisible]);

    return (
        <div id="menu-wrapper">
            {!gameSetupModal.isVisible ? (
                <div id="menu-container">
                    <h1 className="flash">Hex</h1>
                    <button onClick={gameSetupModal.open}>New Game</button>
                    <button onClick={optionsModal.open}>Options</button> 
                    <button onClick={howToPlayModal.open}>How to Play</button>                                       
                </div>
            ) : (
                <GameSetup onStartGame={onStartGame} onReturn={gameSetupModal.close} />
            )}            
            {optionsModal.isVisible && (
                <OptionsModal show={optionsModal.isVisible} onClose={optionsModal.close} />                
            )}
            {howToPlayModal.isVisible && (
                <HowToPlayModal show={howToPlayModal.isVisible} onClose={howToPlayModal.close} />
            )}            
        </div>
    );
};

export default HexGameMenu;