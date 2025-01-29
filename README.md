# ![Hex Game Icon](./src/assets/icon.png) Hex Game

This project is a Hex game implemented using React. The game allows two players to compete on a hexagonal board, with the goal of forming a connected path of their color linking two opposite sides of the board. The game logic relies on disjoint-set data structures to determine the winner.

## How to Play

The game is played on a two-dimensional board by two players - `black` and `white`. Your goal is to form a connected path of your color, linking two opposite sides of the board: `black` connects top and bottom, while `white` connects left and right.
The player who completes such a connection wins the game!

## Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository.
    
2. Install dependencies:
    ```sh
    npm install
    # or
    yarn install
    ```

### Running the Game

1. Start the development server:
    ```sh
    npm run dev
    # or
    yarn dev
    ```

2. Open your browser and navigate to the localhost address to play the game.

### Building for Production

To create a production build, run:
```sh
npm run build
# or
yarn build
