class HexAILogic {
    constructor(game) {
        this.game = game;
    }

    makeMove() {
        if (this.game.currentPlayer !== "White") {
            return null;
        }

        let bestMove = null;
        let bestScore = -Infinity;

        for (let row = 0; row < this.game.size; row++) {
            for (let col = 0; col < this.game.size; col++) {
                if (this.game.board[row][col] === null) {
                    // Simulate the move
                    this.game.makeMove(row, col);

                    // Evaluate move with minimax
                    const score = this.minimax(this.game, 2, -Infinity, Infinity, false);

                    // Undo move
                    this.game.board[row][col] = null;
                    this.resetDSU(row, col);

                    if (score > bestScore) {
                        bestScore = score;
                        bestMove = { row, col };
                    }
                }
            }
        }

        console.log("AI Move:", bestMove);

        if (bestMove) {
            this.game.makeMove(bestMove.row, bestMove.col);
        }

        return bestMove;
    }

    minimax(game, depth, alpha, beta, isMaximizing) {
        const winner = game.checkWinner();
        if (winner === "White") return 1000;
        if (winner === "Black") return -1000;
        if (depth === 0) return this.evaluateBoard(game);

        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let row = 0; row < game.size; row++) {
                for (let col = 0; col < game.size; col++) {
                    if (game.board[row][col] === null) {
                        game.makeMove(row, col);
                        let evalScore = this.minimax(game, depth - 1, alpha, beta, false);
                        game.board[row][col] = null;
                        this.resetDSU(row, col);
                        maxEval = Math.max(maxEval, evalScore);
                        alpha = Math.max(alpha, evalScore);
                        if (beta <= alpha) break;
                    }
                }
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let row = 0; row < game.size; row++) {
                for (let col = 0; col < game.size; col++) {
                    if (game.board[row][col] === null) {
                        game.makeMove(row, col);
                        let evalScore = this.minimax(game, depth - 1, alpha, beta, true);
                        game.board[row][col] = null;
                        this.resetDSU(row, col);
                        minEval = Math.min(minEval, evalScore);
                        beta = Math.min(beta, evalScore);
                        if (beta <= alpha) break;
                    }
                }
            }
            return minEval;
        }
    }

    resetDSU(row, col) {
        const index = this.game.index(row, col);
        if (this.game.currentPlayer === "Black") {
            this.game.dsuB.reset(index);
        } else {
            this.game.dsuW.reset(index);
        }
    }

    evaluateBoard(game) {
        let score = 0;

        // Get the opponent's strongest connections
        let opponentThreats = this.findStrongestOpponentPath(game);

        for (let row = 0; row < game.size; row++) {
            for (let col = 0; col < game.size; col++) {
                if (game.board[row][col] === "White") {
                    score += 10; // AI's move
                } else if (game.board[row][col] === "Black") {
                    score -= 50; // Heavy penalty for opponent moves
                }
            }
        }

        // Prioritize blocking the opponent's best paths
        for (const { row, col } of opponentThreats) {
            if (game.board[row][col] === null) {
                score += 100; // Strong incentive for AI to play here
            }
        }

        return score;
    }

    findStrongestOpponentPath(game) {
        let criticalMoves = [];

        for (let row = 0; row < game.size; row++) {
            for (let col = 0; col < game.size; col++) {
                if (game.board[row][col] === "Black") {
                    let connections = 0;
                    for (const [r, c] of game.neighbors(row, col)) {
                        if (game.board[r][c] === "Black") {
                            connections++;
                        }
                    }
                    if (connections >= 2) {
                        criticalMoves.push({ row, col });
                    }
                }
            }
        }

        return criticalMoves;
    }
}

export default HexAILogic;