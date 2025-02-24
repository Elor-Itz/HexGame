import { getLogColor } from './player';

// Log a move
export const logMove = (turn, player, playerColor, row, col, timer) => {
    console.log(
        `%cTurn ${turn} | ${player} (${playerColor}) | Row: ${row}, Col: ${col} | Time: ${timer}`,
        `color: ${getLogColor(playerColor)}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
    );
};

// Log winner
export const logWinner = (winnerColor, turnCount) => {
    console.log(
        `%c${winnerColor} wins! Turns: ${turnCount}`,
        `background: ${getLogColor(winnerColor)}; color: white; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
    );
};

// Log surrender
export const logSurrender = (player, playerColor) => {
    console.log(
        `%c${player} (${playerColor}) has surrendered.`,
        `color: ${getLogColor(playerColor)}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
    );
};