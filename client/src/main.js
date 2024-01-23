import io from "socket.io-client";
import { CreateBoard, UpdateBoard } from './board.js';
import { HideModal, ShowModal } from "./modal.js";
import { ShowStats } from './stats.js';

const socket = io(import.meta.env.VITE_SERVER_URL, {
    transports: ['websocket']
});

socket.on('connect', () => {
    console.log('Connected to server');

    ShowModal("3D Tetris", "It is a Tetris game where you need to complete a row to get score. You can player with others, So you need to complete more rows and clear your blocks in the board to get higher score. Do you you want to Play?", "Start Now", () => {
        const loadingText = document.getElementById("loadingText");
        loadingText.style.display = "none";
        const gameDiv = document.getElementById("game");
        gameDiv.style.display = "flex";
        ShowModal("", "Looking for other players to join the game. And do not refresh the page. Please wait...", "", null);

        // clear all events of the socket
        socket.off('startGame');
        socket.off('updateGame');
        socket.off('gameOverByLeave');
        socket.off('gameOver');


        let game = null;
        socket.emit('joinGame');
        socket.on('startGame', () => {
            HideModal();
            CreateBoard();

            // clear all event listeners
            document.removeEventListener('keyup', null);

            // add event listeners
            document.addEventListener('keyup', (event) => {
                if (game === null || game.gameOver) return;

                if (event.code === 'ArrowLeft' && game.players[game.currentPlayer - 1].id === socket.id) {
                    socket.emit('moveLeft');
                }
                else if (event.code === 'ArrowRight' && game.players[game.currentPlayer - 1].id === socket.id) {
                    socket.emit('moveRight');
                }
                else if (event.code === 'ArrowUp' && game.players[game.currentPlayer - 1].id === socket.id) {
                    socket.emit('rotate');
                }
                else if (event.code === 'ArrowDown' && game.players[game.currentPlayer - 1].id === socket.id) {
                    socket.emit('moveDown');
                }
            });
        });
        socket.on('updateGame', (gameData) => {
            game = gameData;
            const playingPlayer = game.players.findIndex(player => player.id === socket.id) + 1;
            UpdateBoard(game.board, game.currentTetrominoPosition, game.currentTetromino);
            ShowStats(game.nextTetromino, game.players, game.currentPlayer, playingPlayer);
        });
        socket.on('gameOverByLeave', (winner) => {
            if (winner === socket.id) {
                ShowModal("Game Over", "You are the winner. Game over by other player left the game.", "Play Again", () => {
                    window.location.reload();
                });
            }
            else {
                ShowModal("Game Over", "You lost the game. Game over by other player left the game.", "Play Again", () => {
                    window.location.reload();
                });
            }
        });
        socket.on('gameOver', (winner) => {
            if (winner === socket.id) {
                ShowModal("Game Over", "You are the winner. Congratulations!", "Play Again", () => {
                    window.location.reload();
                });
            }
            else {
                ShowModal("Game Over", "You lost the game. Please try again later.", "Play Again", () => {
                    window.location.reload();
                });
            }
        });
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');

    ShowModal("Disconnected", "You are disconnected from the server. Please wait or try again later.", "Reload", () => {
        window.location.reload();
    });
});