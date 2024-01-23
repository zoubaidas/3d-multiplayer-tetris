// Import necessary modules
import cors from 'cors';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import Game from './game.js';

// Set the port for the server
const PORT = process.env.PORT || 3000;

// Initialize the express app
const app = express();

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Create a HTTP server
const server = http.createServer(app);

// Initialize socket.io server
const io = new Server(server);

// Array to store active games
const activeGames = [];

// Define a route handler for the default home page
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Listen for a new connection
io.on('connection', (socket) => {
    console.log('a user connected');

    // Listen for a 'joinGame' event
    socket.on('joinGame', () => {
        console.log('joined game');

        // Function to create a new game
        const createNewGame = () => {
            const game = new Game(io);
            activeGames.push(game);
            game.addPlayer(socket.id);
        };

        // If there are no active games, create one
        if (activeGames.length === 0) {
            createNewGame();
        }
        else {
            // Check if there are any games with less than 2 players
            const game = activeGames.find(game => game.isFull() === false && game.started === false);
            if (game) {
                game.addPlayer(socket.id);
            }
            else {
                createNewGame();
            }
        }
    });

    // Listen for movement events and handle them
    socket.on('moveLeft', () => {
        const game = activeGames.find(game => game.isUserInGame(socket.id));
        if (game) {
            game.moveLeft(socket.id);
        }
    });
    socket.on('moveRight', () => {
        const game = activeGames.find(game => game.isUserInGame(socket.id));
        if (game) {
            game.moveRight(socket.id);
        }
    });
    socket.on('rotate', () => {
        const game = activeGames.find(game => game.isUserInGame(socket.id));
        if (game) {
            game.rotate(socket.id);
        }
    });
    socket.on('moveDown', () => {
        const game = activeGames.find(game => game.isUserInGame(socket.id));
        if (game) {
            game.moveDown(socket.id);
        }
    });

    // Listen for a disconnect event and handle it
    socket.on('disconnect', () => {
        console.log('user disconnected');
        const game = activeGames.find(game => game.isUserInGame(socket.id));
        if (game) {
            game.removePlayer(socket.id);

            // remove game from the list
            const index = activeGames.findIndex(activeGame => activeGame === game);
            activeGames.splice(index, 1);
        }
    });
});

// Start the server
server.listen(PORT, () => {
    console.log('Server is running on port: ' + PORT);
});