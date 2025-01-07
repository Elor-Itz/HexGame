// Disjoint Set Union
class DisjointSetUnion {
    constructor(size) {
        this.parent = Array.from({ length: size }, (_, i) => i);
        this.rank = Array(size).fill(0);
    }

    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]); // Path compression
        }
        return this.parent[x];
    }

    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        if (rootX !== rootY) {
            if (this.rank[rootX] > this.rank[rootY]) {
                this.parent[rootY] = rootX;
            } else if (this.rank[rootX] < this.rank[rootY]) {
                this.parent[rootX] = rootY;
            } else {
                this.parent[rootY] = rootX;
                this.rank[rootX]++;
            }
        }
    }
}

// Game logic
class HexGame {
    // Initialize the game board
    constructor(size) {
        this.size = size;
        this.board = Array.from({ length: size }, () => Array(size).fill(null));
        this.currentPlayer = "Black";

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
                if (this.currentPlayer === "Black") {
                    this.dsuB.union(index, neighborIndex);
                } else {
                    this.dsuW.union(index, neighborIndex);
                }
            }
        }
    }

    // Check the winner by using union-find
    checkWinner() {
        if (this.dsuB.find(this.topNode) === this.dsuB.find(this.bottomNode)) {
            return "Black";
        }
        if (this.dsuW.find(this.leftNode) === this.dsuW.find(this.rightNode)) {
            return "White";
        }        
        return null;
    }
}

// Function to create a new game
function createGame(size) {
    const game = new HexGame(size);
    createBoard(size, game);
    
    // Show the status once the game starts
    const status = document.getElementById("status");
    status.style.display = "block";
    document.getElementById("status-text").textContent = "Black's turn";
    document.getElementById("status-text").style.color = "Black";
    document.getElementById("status-hex").classList.add("hex", "Black");    
    
    // Set up the surrender handler
    setSurrenderHandler(game);       
}

// Function to create the game board
function createBoard(size, game){
    const container = document.getElementById("game-container");
    container.innerHTML = ""; // Clear the previous game board
    container.style.pointerEvents = "auto"
    
    const hexWidth = 60;
    const hexHeight = 60;

    // Set up container size based on board dimensions
    const boardWidth = (size - 1) * hexWidth * 0.75 + hexWidth;
    const boardHeight = size * hexHeight;

    container.style.width = `${boardWidth}px`;
    container.style.height = `${boardHeight}px`; 
    
    for (let row = 0; row < size; row++) {
        const startCol = Math.max(0, row - (size - 1));
        const endCol = Math.min(size - 1, row + size - 1);

        for (let col = startCol; col <= endCol; col++) {
            const hex = document.createElement("div");
            hex.classList.add("hex");
            hex.dataset.row = row;
            hex.dataset.col = col;

            // Adjust for staggered columns to create a rhombus shaped board
            hex.style.position = "absolute";
            hex.style.left = `${col * 59 + row * 29}px`;
            hex.style.top = `${row * 44}px`;

            // Add event listener for clicks
            hex.addEventListener("click", () => {
              // Check if the cell is already filled
              if (game.board[row][col] !== null) return;
              // Make the move and update the board
              game.makeMove(row, col);
              hex.classList.add(game.currentPlayer);              

              const winner = game.checkWinner();
              updateStatus(game, winner);            
            });

            // Append the hex to the container
            container.appendChild(hex);
        }
    }
}

// Function to update the current status of the game
function updateStatus(game, winner) {
    const status = document.getElementById("status-text");
    const statusHex = document.getElementById("status-hex");
    const container = document.getElementById("game-container");
    const surrenderButton = document.getElementById("surrender");

    if (winner) {        
        // Display the winner and disable further moves
        game.currentPlayer = winner;
        status.style.color = "#df4204";                    
        status.textContent = `${winner} wins!`;                    
        container.style.pointerEvents = "none";
        // Disable the surrender button to prevent further clicks
        surrenderButton.disabled = true;
        } else {            
            // Switch the player
            game.currentPlayer = game.currentPlayer === "Black" ? "White" : "Black";
            status.textContent = `${game.currentPlayer}'s turn`;
    }
    
    // Update the hexagon next to the status message
    statusHex.classList.remove("White", "Black");
    statusHex.classList.add(game.currentPlayer);
}

// Start game button handler
document.getElementById("start-game").addEventListener("click", () => {
    const size = parseInt(document.getElementById("board-size").value, 10);
    if (size >= 3 && size <= 19) {
        document.getElementById("lobby-container").style.display = "none";
        document.getElementById("new-game").style.display = "block";
        document.getElementById("surrender").disabled = false;                    
        createGame(size);
    } else {
        alert("Please enter a size between 3 and 19.");
    }
});

// Surrender button handler
function setSurrenderHandler(game) {   
    document.getElementById("surrender").addEventListener("click", () => {
        const winner = game.currentPlayer === "Black" ? "White" : "Black";
        updateStatus(game, winner);        
    });
}

// New game button handler
document.getElementById("new-game").addEventListener("click", () => {
    document.getElementById("lobby-container").style.display = "block";
    document.getElementById("new-game").style.display = "none";
    document.getElementById("status").style.display = "none"; 
    document.getElementById("game-container").innerHTML = "";    
    document.getElementById("status-text").textContent = "";    
});