import DisjointSetUnion from "../utils/disjointSetUnion.js";
import { getNextPlayer } from "../utils/player.js";

// Game logic
class HexGameLogic {
    // Initialize the game board
    constructor(size) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill(null));
        this.currentPlayer = "Player1";
        this.turnCount = 0;
        this.firstMove = null;
        this.secondMove = null;

        // Assign unique indices to virtual nodes
        this.topNode = size * size;
        this.bottomNode = size * size + 1; 
        this.leftNode = size * size + 2; 
        this.rightNode = size * size + 3; 

        // Initialize DSUs with enough space for board cells + virtual nodes
        this.dsuW = new DisjointSetUnion(size * size + 4);
        this.dsuB = new DisjointSetUnion(size * size + 4);

        // Connect virtual nodes with the board
        for (let i = 0; i < size; i++) {
            // Connect top and bottom rows for Black
            this.dsuB.union(this.index(0, i), this.topNode);
            this.dsuB.union(this.index(size - 1, i), this.bottomNode);

            // Connect left and right columns for White
            this.dsuW.union(this.index(i, 0), this.leftNode);
            this.dsuW.union(this.index(i, size - 1), this.rightNode);
        }
    }

    // Get the 1D index of a cell in the board
    index(row, col) {
        return row * this.size + col;
    }

    // Get hexagonal neighbors of a cell in the board
    neighbors(row, col) {
        const directions = [
            [1, 0], [1, -1], [0, 1], [0, -1], [-1, 0], [-1, 1],
        ];

        return directions
            .map(([dr, dc]) => [row + dr, col + dc])
            .filter(([r, c]) => r >= 0 && r < this.size && c >= 0 && c < this.size);
    }

    // Player move logic
    makeMove(row, col) {
        // Update the board with the current player
        this.board[row][col] = this.currentPlayer;
        const index = this.index(row, col);

        // Connect with neighbors of the same color
        for (const [r, c] of this.neighbors(row, col)) {
            const neighborIndex = this.index(r, c);
            if (this.board[r][c] === this.currentPlayer) {
                if (this.currentPlayer === "Player1") {
                    this.dsuB.union(index, neighborIndex);
                } else {
                    this.dsuW.union(index, neighborIndex);
                }
            }
        }

        this.turnCount++;        
    }

    // Track the first two moves (for swap rule)
    trackMove(row, col) {
        if (!this.firstMove) {
            this.firstMove = { row, col, player: this.currentPlayer };
        } else if (!this.secondMove) {
            this.secondMove = { row, col, player: this.currentPlayer };
        }
    }

    // Perform the swap rule
    performSwapRule() {
        const temp = this.board[this.firstMove.row][this.firstMove.col];
        this.board[this.firstMove.row][this.firstMove.col] = this.board[this.secondMove.row][this.secondMove.col];
        this.board[this.secondMove.row][this.secondMove.col] = temp;
    }

    // Get the next player
    switchPlayer() {
        return this.currentPlayer = getNextPlayer(this.currentPlayer);
    }

    // Check the winner by using union-find
    checkWinner() {
        if (this.dsuB.find(this.topNode) === this.dsuB.find(this.bottomNode)) {
            return "Player1";
        }
        if (this.dsuW.find(this.leftNode) === this.dsuW.find(this.rightNode)) {
            return "Player2";
        }        
        return null;
    }    
}

export default HexGameLogic;