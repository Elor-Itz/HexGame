class HexAILogic {
    constructor(game, player) {
        this.game = game;
        this.player = player;
        this.opponent = player === 'Player1' ? 'Player2' : 'Player1';
        this.isDisabled = false;
    }

    makeMove() {
        if (this.game.currentPlayer !== this.player) {
            return null;
        }

        let bestMove = null;
        let bestScore = -Infinity;
        let moves = this.getAvailableMoves();

        // Evaluate each move and choose the best one
        for (const move of moves) {
            let score = this.evaluateMove(move.row, move.col);
            if (score > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }

        // Make the move if a valid one is found
        if (bestMove) {
            this.game.makeMove(bestMove.row, bestMove.col);
        }

        return bestMove;
    }

    getAvailableMoves() {
        let moves = [];
        for (let row = 0; row < this.game.size; row++) {
            for (let col = 0; col < this.game.size; col++) {
                if (this.game.board[row][col] === null) {
                    moves.push({ row, col });
                }
            }
        }
        return moves;
    }

    evaluateMove(row, col) {
        let score = 0;

        // 1. Prioritize positions near the center of the board
        let center = Math.floor(this.game.size / 2);
        let distanceFromCenter = Math.abs(row - center) + Math.abs(col - center);
        score -= distanceFromCenter;  // Closer to center is better

        // 2. Check if the move helps in blocking Player 1's path
        score += this.blockPlayer1(row, col) * 50;

        // 3. Check if the move creates or extends a possible path for Player 2 (Left-to-right)
        score += this.formPlayer2Path(row, col) * 30;

        // 4. Check for connections to other Player 2 stones (clinging to Player 1's path)
        score += this.clingToPlayer1(row, col) * 20;

        // 5. Formation of Bridges (helpful for creating new connections)
        score += this.findPotentialBridges(row, col) * 15;

        // 6. Look ahead for future threats or opportunities (e.g., Player 1 about to win)
        score += this.lookAheadForThreats(row, col) * 40;

        return score;
    }

    blockPlayer1(row, col) {
        let score = 0;

        // Check if placing a piece here blocks Player 1's path at critical junctures
        const criticalBlockingPoints = this.findCriticalBlockingPoints();
        for (const point of criticalBlockingPoints) {
            if (point.row === row && point.col === col) {
                score += 100;  // Major block to Player 1's progress
            }
        }

        return score;
    }

    formPlayer2Path(row, col) {
        let score = 0;

        // Simulate Player 2's move and check if it helps in connecting left to right
        let tempBoard = JSON.parse(JSON.stringify(this.game.board));
        tempBoard[row][col] = this.player; // Simulate Player 2's move

        // Check if Player 2 connects to the right side of the board
        if (this.game.dsuW.find(this.game.leftNode) === this.game.dsuW.find(this.game.rightNode)) {
            score += 30;  // Successful left-to-right connection
        }

        return score;
    }

    clingToPlayer1(row, col) {
        let score = 0;

        // Look for Player 1's stones in neighboring cells to cling to
        let tempBoard = JSON.parse(JSON.stringify(this.game.board));
        tempBoard[row][col] = this.player // Simulate Player 2's move

        // Check if Player 2 is adjacent to Player 1's stones
        for (const [r, c] of this.game.neighbors(row, col)) {
            if (this.game.board[r][c] === this.opponent) {
                score += 10;  // Cling to Player 1's stones to prevent them from connecting
            }
        }

        return score;
    }

    findCriticalBlockingPoints() {
        let criticalPoints = [];

        // Look for Player 1's path and determine critical junctures
        for (let row = 0; row < this.game.size; row++) {
            for (let col = 0; col < this.game.size; col++) {
                if (this.game.board[row][col] === this.opponent) {
                    // Check for connections that are about to form a top-to-bottom or left-to-right path
                    this.checkForCriticalPaths(row, col, criticalPoints);
                }
            }
        }

        return criticalPoints;
    }

    checkForCriticalPaths(row, col, criticalPoints) {
        // Analyze Player 1's stone to check if it could be forming part of a winning path
        // For simplicity, we'll assume top-to-bottom or left-to-right path detection
        const directions = [[0, 1], [1, 0], [1, 1], [-1, -1]];  // Check horizontal, vertical, and diagonal directions
        for (const [dr, dc] of directions) {
            let r = row + dr;
            let c = col + dc;
            let count = 0;

            // Check if Player 1 is about to form a connected path
            while (this.isValidCell(r, c) && this.game.board[r][c] === this.opponent) {
                count++;
                r += dr;
                c += dc;
            }

            // If a potential path for Player 1 is forming, mark critical points to block
            if (count >= 2) {  // If a path of at least 2 stones is forming, mark the next point
                r -= dr;
                c -= dc;
                criticalPoints.push({ row: r, col: c });
            }
        }
    }

    findPotentialBridges(row, col) {
        let bridgeCount = 0;
        const directions = [[1, -1], [-1, 1], [1, 1], [-1, -1]];
        
        for (const [dr, dc] of directions) {
            let r1 = row + dr, c1 = col + dc;
            let r2 = row - dr, c2 = col - dc;

            if (this.isValidCell(r1, c1) && this.isValidCell(r2, c2)) {
                if (this.game.board[r1][c1] === this.player && this.game.board[r2][c2] === null) {
                    bridgeCount++;
                }
                if (this.game.board[r2][c2] === this.player && this.game.board[r1][c1] === null) {
                    bridgeCount++;
                }
            }
        }

        return bridgeCount;
    }

    lookAheadForThreats(row, col) {
        let score = 0;

        // Simulate Player 1's next move and check if it would lead to a win
        let tempBoard = JSON.parse(JSON.stringify(this.game.board));
        tempBoard[row][col] = this.player; // Simulate Player 2's move

        // Check if Player 1 is one move away from winning (e.g., completing their top-bottom path)
        if (this.game.dsuB.find(this.game.topNode) === this.game.dsuB.find(this.game.bottomNode)) {
            score += 50;  // Prevent Player 1 from completing the top-to-bottom path
        }

        return score;
    }

    isValidCell(row, col) {
        return row >= 0 && row < this.game.size && col >= 0 && col < this.game.size;
    }
}

export default HexAILogic;