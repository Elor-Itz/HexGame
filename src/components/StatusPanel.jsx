import React from 'react';

const StatusPanel = ({ status, currentPlayer, onSurrender, onNewGame }) => {
    return (
        <div id="status">
            <div id="status-hex" className={`hex ${currentPlayer}`}></div>
            <span id="status-text">{status}</span>
            <button id="surrender" onClick={onSurrender} disabled={status.includes('wins')}>Surrender</button>
            <button id="new-game" onClick={onNewGame}>New Game</button>
        </div>
    );
};

export default StatusPanel;