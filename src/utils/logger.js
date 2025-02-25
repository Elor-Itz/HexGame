import { getLogColor } from './player';

// Log a move
export const logMove = (turn, player, playerColor, row, col, timer) => {
    console.log(
        `%cTurn ${turn} | ${player} (${playerColor}) | Row: ${row}, Col: ${col} | Time: ${timer}`,
        `color: ${getLogColor(playerColor)}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`
    );
};

// Log swap rule
export const logSwap = (player1Color, player2Color, firstMove, secondMove) => {
    const firstMoveStyle = `color: ${getLogColor(player2Color)}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`;
    const secondMoveStyle = `color: ${getLogColor(player1Color)}; font-weight: bold; padding: 2px 4px; border-radius: 4px;`;

    console.log(
        `%cSwap rule performed: %c[Row: ${firstMove.row}, Col: ${firstMove.col}] %c<-> %c[Row: ${secondMove.row}, Col: ${secondMove.col}]`,
        "font-weight: bold;",
        firstMoveStyle,
        "font-weight: bold;",
        secondMoveStyle
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