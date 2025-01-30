import React from 'react';
import '../styles/StatusPanel.css';

const StatusPanel = ({ status, currentPlayer, onSurrender, onNewGame }) => {
    return (
        <div id="status">
            <div id="status-container">
                <div id="status-hex" className={`hex ${currentPlayer}`}></div>
                <span id="status-text">{status}</span>
            </div>            
            <div id="button-container">
                <button id="surrender" onClick={onSurrender} disabled={status.includes('wins')}>Surrender</button>
                <button id="new-game" onClick={onNewGame}>New Game</button>
            </div>            
        </div>
    );
};

export default StatusPanel;