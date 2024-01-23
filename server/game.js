import { v4 as uuidv4 } from 'uuid';

const MAX_PLAYER = 2;
const BOARD_SIZE = 20;

class Game {
    constructor(io) {
        this.io = io;
        this.board = [];
        this.players = [];
        this.currentPlayer = 0;
        this.currentTetromino = null;
        this.nextTetromino = null;
        this.currentTetrominoPosition = { x: 0, y: 0 };
        this.started = false;
        this.gameOver = false;
        this.winner = null;
        this.interval = null;
    }

    addPlayer(id) {
        if (this.isFull() || this.started || this.isUserInGame(id)) {
            return;
        }

        this.players.push({
            id,
            score: 0,
            presentBlocks: 0
        });
        if (this.isFull()) {
            this.startGame();
        }
    }

    isFull() {
        return this.players.length >= MAX_PLAYER;
    }

    isUserInGame(id) {
        return this.players.some(player => player.id === id);
    }

    removePlayer(id) {
        if (this.started && !this.gameOver) {
            this.gameEnded(true);
        }
        else {
            this.players = this.players.filter(player => player.id !== id);
        }
    }

    getPlayerIndex(id) {
        return this.players.findIndex(player => player.id === id);
    }

    startGame() {
        this.started = true;
        this.board = this.createEmptyBoard();
        this.currentPlayer = 1;
        this.setTetrominos(true);
        this.interval = setInterval(() => {
            this.gravity();
            this.updatePresentBlocks();
            this.checkGameOver();

            this.sendGameData();
        }, 1000); // 1 second

        this.sendMessageToPlayers("startGame");
    }

    createEmptyBoard() {
        const board = [];
        for (let row = 0; row < BOARD_SIZE; row++) {
            board.push([]);
            for (let col = 0; col < BOARD_SIZE; col++) {
                board[row].push(null);
            }
        }
        return board;
    }

    getRandomTetromino(value) {
        let tetromino = null;
        switch (Math.floor(Math.random() * 7) + 1) {
            case 1:
                //   *
                // * * *
                tetromino = [
                    [null, { id: uuidv4(), value }, null],
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }, { id: uuidv4(), value }],
                    [null, null, null],
                ];
                break;
            case 2:
                // * * *
                // * 
                tetromino = [
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }, { id: uuidv4(), value }],
                    [{ id: uuidv4(), value }, null, null],
                    [null, null, null],
                ];
                break;
            case 3:
                // * * *
                //     *
                tetromino = [
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }, { id: uuidv4(), value }],
                    [null, null, { id: uuidv4(), value }],
                    [null, null, null],
                ];
                break;
            case 4:
                // * *
                // * *
                tetromino = [
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }],
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }],
                ];
                break;
            case 5:
                // * * 
                //   * *
                tetromino = [
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }, null],
                    [null, { id: uuidv4(), value }, { id: uuidv4(), value }],
                    [null, null, null],
                ];
                break;
            case 6:
                //   * *
                // * *
                tetromino = [
                    [null, { id: uuidv4(), value }, { id: uuidv4(), value }],
                    [{ id: uuidv4(), value }, { id: uuidv4(), value }, null],
                    [null, null, null],
                ];
                break;
            case 7:
                //   *
                //   *
                //   *
                tetromino = [
                    [null, { id: uuidv4(), value }, null],
                    [null, { id: uuidv4(), value }, null],
                    [null, { id: uuidv4(), value }, null],
                ];
                break;
            default:
                break;
        }
        return tetromino;
    }

    getMinCurrentTetrominoCol() {
        let x = 0;
        let isEmptyLeft = true;
        for (let i = 0; i < this.currentTetromino.length; i++) {
            if (this.currentTetromino[i][0] !== null) {
                isEmptyLeft = false;
                break;
            }
        }
        if (isEmptyLeft) {
            x--;
        }
        return x;
    }

    getMaxCurrentTetrominoCol() {
        let x = BOARD_SIZE - this.currentTetromino.length;
        let isEmptyRight = true;
        for (let i = 0; i < this.currentTetromino.length; i++) {
            if (this.currentTetromino[i][this.currentTetromino.length - 1] !== null) {
                isEmptyRight = false;
                break;
            }
        }
        if (isEmptyRight) {
            x++;
        }
        return x;
    }

    canMoveLeft() {
        const nextTetrominoPosition = { ...this.currentTetrominoPosition };
        nextTetrominoPosition.col--;

        return this.isValidTetromino(this.currentTetromino, nextTetrominoPosition);
    }

    moveLeft(id) {
        if (this.currentPlayer !== this.getPlayerIndex(id) + 1) {
            return;
        }

        if (this.currentTetrominoPosition.col > this.getMinCurrentTetrominoCol()) {
            if (this.canMoveLeft()) {
                this.currentTetrominoPosition.col--;
                this.sendGameData();
            }
        }
    }

    canMoveRight() {
        const nextTetrominoPosition = { ...this.currentTetrominoPosition };
        nextTetrominoPosition.col++;

        return this.isValidTetromino(this.currentTetromino, nextTetrominoPosition);
    }

    moveRight(id) {
        if (this.currentPlayer !== this.getPlayerIndex(id) + 1) {
            return;
        }

        if (this.currentTetrominoPosition.col < this.getMaxCurrentTetrominoCol()) {
            if (this.canMoveRight()) {
                this.currentTetrominoPosition.col++;
                this.sendGameData();
            }
        }
    }

    moveDown(id) {
        if (this.currentPlayer !== this.getPlayerIndex(id) + 1) {
            return;
        }

        this.gravity();
        this.sendGameData();
    }

    rotate(id) {
        if ((this.currentPlayer !== this.getPlayerIndex(id) + 1) || (this.currentTetromino.length === 2) || !this.canMoveDown()) {
            return;
        }

        const rotatedTetromino = [];
        for (let row = 0; row < this.currentTetromino.length; row++) {
            rotatedTetromino.push([]);
            for (let col = 0; col < this.currentTetromino[row].length; col++) {
                rotatedTetromino[row].push(null);
            }
        }

        for (let col = this.currentTetromino.length - 1; col >= 0; col--) {
            for (let row = 0; row < this.currentTetromino.length; row++) {
                rotatedTetromino[col][this.currentTetromino.length - row - 1] = this.currentTetromino[row][col];
            }
        }

        if (this.isValidTetromino(rotatedTetromino, this.currentTetrominoPosition)) {
            this.currentTetromino = rotatedTetromino;
            this.sendGameData();
        }
    }

    isValidTetromino(tetromino, tetrominoPosition) {
        for (let row = 0; row < tetromino.length; row++) {
            for (let col = 0; col < tetromino[row].length; col++) {
                let currentCol = tetrominoPosition.col + col;
                let currentRow = tetrominoPosition.row + row;
                if (currentRow >= BOARD_SIZE && tetromino[row][col] !== null) {
                    return false;
                }
                if (currentCol < 0 && tetromino[row][col] !== null) {
                    return false;
                }
                if (currentCol >= BOARD_SIZE && tetromino[row][col] !== null) {
                    return false;
                }
                if (currentCol < 0 || currentCol >= BOARD_SIZE || currentRow < 0 || currentRow >= BOARD_SIZE) {
                    continue;
                }
                if (tetromino[row][col] !== null && this.board[currentRow][currentCol] !== null) {
                    return false;
                }
            }
        }
        return true;
    }

    canMoveDown() {
        const nextTetrominoPosition = { ...this.currentTetrominoPosition };
        nextTetrominoPosition.row++;

        return this.isValidTetromino(this.currentTetromino, nextTetrominoPosition);
    }

    gravity() {
        if (this.canMoveDown()) {
            this.currentTetrominoPosition.row++;
        }
        else {
            this.lockTetromino();
        }
    }

    lockTetromino() {
        for (let row = 0; row < this.currentTetromino.length; row++) {
            for (let col = 0; col < this.currentTetromino[row].length; col++) {
                if (this.currentTetromino[row][col] !== null) {
                    const currentRow = this.currentTetrominoPosition.row + row;
                    const currentCol = this.currentTetrominoPosition.col + col;
                    if (currentRow < 0 || currentRow >= BOARD_SIZE || currentCol < 0 || currentCol >= BOARD_SIZE) {
                        continue;
                    }
                    this.board[currentRow][currentCol] = this.currentTetromino[row][col];
                }
            }
        }

        this.checkRowCompletion();
        this.sendGameData();

        // next player turn
        this.currentPlayer++;
        if (this.currentPlayer > this.players.length) {
            this.currentPlayer = 1;
        }
        this.setTetrominos();
    }

    setTetrominos(isFirstTime = false) {
        if (isFirstTime) {
            this.currentTetromino = this.getRandomTetromino(this.currentPlayer);
            this.nextTetromino = this.getRandomTetromino(this.currentPlayer + 1);
        }
        else {
            this.currentTetromino = this.nextTetromino;
            let nextPlayer = this.currentPlayer + 1;
            if (nextPlayer > this.players.length) {
                nextPlayer = 1;
            }
            this.nextTetromino = this.getRandomTetromino(nextPlayer);
        }
        this.currentTetrominoPosition = { col: Math.floor(BOARD_SIZE / 2 - this.currentTetromino.length / 2), row: -this.currentTetromino.length };
    }

    checkRowCompletion() {
        for (let i = 0; i < this.board.length; i++) {
            let isRowCompleted = true;
            for (let j = 0; j < this.board[i].length; j++) {
                if (this.board[i][j] === null) {
                    isRowCompleted = false;
                    break;
                }
            }
            if (isRowCompleted) {
                this.removeRow(i);
                this.updateScore();
                i--;
            }
        }
    }

    removeRow(row) {
        for (let i = 0; i < this.board[row].length; i++) {
            this.board[row][i] = null;
        }
        for (let i = row; i > 0; i--) {
            for (let j = 0; j < this.board[i].length; j++) {
                this.board[i][j] = this.board[i - 1][j];
            }
        }
    }

    updateScore() {
        this.players[this.currentPlayer - 1].score += 100;
    }

    checkGameOver() {
        for (let i = 0; i < this.board[0].length; i++) {
            if (this.board[0][i] !== null) {
                this.gameEnded();
                return;
            }
        }
    }

    getPlayerPresentBlocks(id) {
        const value = this.getPlayerIndex(id) + 1;
        let presentBlocks = 0;
        for (let row = 0; row < this.board.length; row++) {
            for (let col = 0; col < this.board[row].length; col++) {
                if (this.board[row][col] !== null && this.board[row][col].value === value) {
                    presentBlocks++;
                }
            }
        }
        return presentBlocks;
    }

    updatePresentBlocks() {
        this.players.forEach(player => {
            player.presentBlocks = this.getPlayerPresentBlocks(player.id);
        });
    }

    findWinner() {
        let winner = this.players[0];
        for (let i = 1; i < this.players.length; i++) {
            if ((this.players[i].score - this.players[i].presentBlocks) > (winner.score - winner.presentBlocks)) {
                winner = this.players[i];
            }
        }
        return winner;
    }

    gameEnded(isEndedByLeave = false) {
        this.gameOver = true;
        clearInterval(this.interval);
        this.sendGameData();

        this.winner = this.findWinner();
        if (isEndedByLeave) {
            this.sendMessageToPlayers("gameOverByLeave", this.winner.id);
        }
        else {
            this.sendMessageToPlayers("gameOver", this.winner.id);
        }
    }

    getGameData() {
        return {
            board: this.board,
            currentTetrominoPosition: this.currentTetrominoPosition,
            currentTetromino: this.currentTetromino,
            nextTetromino: this.nextTetromino,
            players: this.players,
            currentPlayer: this.currentPlayer,
        };
    }

    sendGameData() {
        this.sendMessageToPlayers("updateGame", this.getGameData());
    }

    sendMessageToPlayers(name, message) {
        this.players.forEach(player => {
            this.io.to(player.id).emit(name, message);
        });
    }
}

export default Game;