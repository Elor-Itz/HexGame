import React from 'react';
import '../styles/StatusPanel.css';

// StatusPanel component
const StatusPanel = ({ status, playerColor, turn, timer, onSurrender, onNewGame, isVisible, isSurrenderDisabled }) => {    

    return (
        <div id="status" style = {{ display: isVisible ? 'block' : 'none' }}>            
            <div id="turn-time-container">
                {`Turn: ${turn+1} | Elapsed Time: ${timer}`}
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