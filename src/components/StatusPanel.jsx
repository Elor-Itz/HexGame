import React from 'react';
import '../styles/StatusPanel.css';

// StatusPanel component
const StatusPanel = ({ status, playerColor, timer, onSurrender, onNewGame, isVisible, isSurrenderDisabled }) => {    

    return (
        <div id="status" style = {{ display: isVisible ? 'block' : 'none' }}>
            <div id="elapsed-time">
                Elapsed Time: {timer}
            </div>
            <div id="status-container">
                <div id="status-hex" className={`hex ${playerColor}`}></div>
                <span id="status-text" style={{ color: (playerColor).toLowerCase() }}>{status}</span>
            </div>            
            <div id="button-container">
                <button id="surrender" onClick={onSurrender} disabled={isSurrenderDisabled}>Surrender</button>                
                <button id="new-game" onClick={onNewGame}>New Game</button>
            </div>            
        </div>
    );
};

export default StatusPanel;