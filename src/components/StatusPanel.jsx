import React from 'react';
import '../styles/StatusPanel.css';

const StatusPanel = ({ status, currentPlayer, onSurrender, onNewGame, statusColor, isVisible, isSurrenderDisabled }) => {
    return (
        <div id="status" style = {{ display: isVisible ? 'block' : 'none' }}>
            <div id="status-container">
                <div id="status-hex" className={`hex ${currentPlayer}`}></div>
                <span id="status-text" style={{ color: statusColor }}>{status}</span>
            </div>            
            <div id="button-container">
                <button id="surrender" onClick={onSurrender} disabled={isSurrenderDisabled}>Surrender</button>                
                <button id="new-game" onClick={onNewGame}>New Game</button>
            </div>            
        </div>
    );
};

export default StatusPanel;