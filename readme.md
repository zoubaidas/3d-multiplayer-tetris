# 3D Multiplayer Tetris Game


![screenshot](/screenshot.png)

## Features

- 3D Tetris Gameplay
- Multiplayer Support
- Turn-Based Player Interaction
- Real-Time Player Interaction

## How to Run

Follow these steps to run the game locally. Note that you need to have Node.js installed on your system and download from [here](https://nodejs.org/en/download/). You also need to have npm installed on your system and download from [here](https://www.npmjs.com/get-npm).

1. **Client**:
    - Navigate to the `client` directory.
    - Run `npm install` to install dependencies.
    - Run `npm start` to start the development server.
    - Run `npm run build` to build the project for production.
    - Run `npm run dev` to start the development server with hot reloading.

2. **Server**:
    - Navigate to the `server` directory.
    - Create a `.env` file with necessary environment variables.
    - Run `npm install` to install dependencies.
    - Run `npm start` to start the server.

## How to Play

- Use the arrow keys `left`, `right`, and `down` to move the tetrominoes.
- Use the up arrow `up` to rotate the tetrominoes.


## Code Overview

### Client

Client-side code is rendering the game in 3D using Three.js. The game logic is implemented in `src/board.js`. The game is rendered in `src/main.js`. The game uses Socket.IO to communicate with the server.

### Server

Server-side code is implemented in `index.js`. The game logic is implemented in `game.js`. The server uses Socket.IO to communicate with the client.

## Socket Events

The client and server communicate using Socket.IO. The following events are emitted by the client and received by the server, and vice versa.

![Client - Server](https://socket.io/images/bidirectional-communication2.png)

Two way Connection between client and server. When client emits then server receives and when server emits then client receives.

![Client - Server](https://socket.io/images/bidirectional-communication-socket.png)

Learn more about this working (Tutorials) [here](https://socket.io/docs/v4/tutorial/introduction).

1. ***Client - Server***

    These events are emitted by the client and received by the server.
    - `joinGame`: Join a game.
    - `moveLeft`: Move the tetromino left.
    - `moveRight`: Move the tetromino right.
    - `moveDown`: Move the tetromino down.
    - `rotate`: Rotate the tetromino.

2. ***Server - Client***

    These events are emitted by the server and received by the client.
    - `startGame`: Start the game.
    - `updateGame (game)`: Update the game state. `game` is the game state. JSON format with these fields:
        - `board`: The game board.
        - `currentTetrominoPosition`: The position of the current tetromino.
        - `currentTetromino`: The current tetromino.
        - `nextTetromino`: The next tetromino.
        - `players`: The players in the game.
        - `currentPlayer`: The current player.
    - `gameOver (winner)`: The game is over. `winner` is the winner of the game.
    - `gameOverByLeave (winner)`: The game is over because a player left. `winner` is the winner of the game.



## Project Structure

The project is organized into two main directories: `client` and `server`.

- `client`: Contains the frontend code for the 3D Tetris game.
  - `.gitignore`: Git ignore file for client-specific files.
  - `index.html`: Main HTML file for the game.
  - `package-lock.json`: NPM package lock file.
  - `package.json`: NPM package configuration file.
  - `postcss.config.js`: Configuration file for PostCSS.
  - `public`: Directory for public assets like images.
  - `src`: Source code directory.
  - `tailwind.config.js`: Configuration file for Tailwind CSS.
  - `src/board.js`: Board logic for the game.
  - `src/main.js`: Main entry point for the frontend.
  - `src/modal.js`: Code for modal dialogs.
  - `src/stats.js`: Statistics display logic.
  - `src/style.css`: Stylesheet for the game.
  - `src/utils.js`: Utility functions.

- `server`: Contains the backend code for the multiplayer aspect.
  - `.env`: Environment variables for the server.
  - `.gitignore`: Git ignore file for server-specific files.
  - `game.js`: Game logic for the server.
  - `index.js`: Main entry point for the server.
  - `package-lock.json`: NPM package lock file.
  - `package.json`: NPM package configuration file.

## Libraries Used

- [Tailwind CSS](https://tailwindcss.com/): CSS framework for styling.
- [Socket.IO](https://socket.io/): Library for real-time communication between the client and server.
- [Three.js](https://threejs.org/): Library for 3D rendering.
- [Vite JS](https://vitejs.dev/): Build tool for the frontend.
- [Express](https://expressjs.com/): Web framework for the backend.
- [dotenv](https://www.npmjs.com/package/dotenv): Library for loading environment variables from a file.
- [nodemon](https://www.npmjs.com/package/nodemon): Library for automatically restarting the server on file changes.
- [uuid](https://www.npmjs.com/package/uuid): Library for generating unique IDs.
- [gsap](https://www.npmjs.com/package/gsap): Library for animations.
- [postcss](https://www.npmjs.com/package/postcss): Library for CSS transformations.
- [autoprefixer](https://www.npmjs.com/package/autoprefixer): Library for automatically adding vendor prefixes to CSS.

## Conclusion

This project was a great learning experience for me. I learned a lot about 3D rendering, multiplayer games, and Socket io. I also learned a lot about CSS and animations. I hope you enjoy playing the game as much as I enjoyed making it.
