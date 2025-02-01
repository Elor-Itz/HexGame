import React from 'react';
import '../styles/StatusPanel.css';

const StatusPanel = ({ status, timer, currentPlayer, onSurrender, onNewGame, statusColor, isVisible, isSurrenderDisabled }) => {       

    // Format the time in MM:SS format
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div id="status" style = {{ display: isVisible ? 'block' : 'none' }}>
            <div id="elapsed-time">
                Elapsed Time: {formatTime(timer)}
            </div>
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