/**
 * 
 * Stats Component - 
 * Used to display score of each players and next tetrominoes (All Player 1-4) - ShowStats
 * 
 * @param {array} nextTetromino - Next tetrominoes of the current player
 * @param {array} players - Players of the game
 * @param {number} currentPlayer - Current player
 * @param {number} playingPlayer - Player who is playing
 * 
 * @example
 * ShowStats([[{ value: 1 }, { value: 1 }], [{ value: 1 }, { value: 1 }]], [{ id: 1, score: 10, presentBlocks: 30], [{ id: 2, score: 20, presentBlocks: 20]], 1, 1);
*/

import { getColor, lightenHexColor } from "./utils.js";

function ShowStats(nextTetromino, players, currentPlayer, playingPlayer) {
    const stats = document.getElementById("stats");
    stats.style.display = "flex";

    const nextTextDiv = document.getElementById("nextText");
    const nextTetrominoWrapperDiv = document.getElementById("nextTetrominoWrapper");
    const nextTetrominoDiv = document.getElementById("nextTetromino");
    nextTetrominoDiv.innerHTML = "";
    nextTetrominoDiv.classList.remove("grid-cols-2", "grid-cols-3")
    if (nextTetromino.length === 2) {
        nextTetrominoDiv.classList.add("grid-cols-2")
    }
    else {
        nextTetrominoDiv.classList.add("grid-cols-3")
    }
    for (let i = 0; i < nextTetromino.length; i++) {
        let isFullRowEmpty = true;
        for (let j = 0; j < nextTetromino[i].length; j++) {
            if (nextTetromino[i][j] !== null) {
                isFullRowEmpty = false;
                break;
            }
        }
        if (isFullRowEmpty) {
            continue;
        }

        for (let j = 0; j < nextTetromino[i].length; j++) {
            if (nextTetromino[i][j] === null) {
                nextTetrominoDiv.innerHTML += `<div class="w-7 h-7 rounded-md"></div>`
            }
            else {
                nextTetrominoDiv.innerHTML += `<div class="w-7 h-7 rounded-md" style="background-color: ${getColor(nextTetromino[i][j].value, true)}"></div>`
                nextTetrominoWrapperDiv.style.borderColor = getColor(nextTetromino[i][j].value, true);
                nextTetrominoWrapperDiv.style.boxShadow = `0 2px 4px -1px ${lightenHexColor(getColor(nextTetromino[i][j].value, true), 0)}`;
                nextTextDiv.style.color = lightenHexColor(getColor(nextTetromino[i][j].value, true), 0.6);
            }
        }
    }

    const player1Div = document.getElementById("player1");
    const player2Div = document.getElementById("player2");
    const player3Div = document.getElementById("player3");
    const player4Div = document.getElementById("player4");
    const score1Div = document.getElementById("score1");
    const score2Div = document.getElementById("score2");
    const score3Div = document.getElementById("score3");
    const score4Div = document.getElementById("score4");
    const yourTurnDiv = document.getElementById("yourTurn");

    player1Div.innerText = "Player 1";
    player2Div.innerText = "Player 2";
    player3Div.innerText = "Player 3";
    player4Div.innerText = "Player 4";

    player1Div.style.display = "none";
    player2Div.style.display = "none";
    player3Div.style.display = "none";
    player4Div.style.display = "none";
    score1Div.style.display = "none";
    score2Div.style.display = "none";
    score3Div.style.display = "none";
    score4Div.style.display = "none";
    yourTurnDiv.style.display = "none";

    if (players.length >= 2) {
        player1Div.style.display = "block";
        score1Div.style.display = "block";
        score1Div.innerText = players[0].score + " - " + players[0].presentBlocks;
        if (playingPlayer === 1) {
            player1Div.innerText += " (You)";

            if (currentPlayer === 1) {
                yourTurnDiv.style.display = "block";
            }
        }

        player2Div.style.display = "block";
        score2Div.style.display = "block";
        score2Div.innerText = players[1].score + " - " + players[1].presentBlocks;
        if (playingPlayer === 2) {
            player2Div.innerText += " (You)";

            if (currentPlayer === 2) {
                yourTurnDiv.style.display = "block";
            }
        }
    }
    if (players.length >= 3) {
        player3Div.style.display = "block";
        score3Div.style.display = "block";
        score3Div.innerText = players[2].score + " - " + players[2].presentBlocks;
        if (playingPlayer === 3) {
            player3Div.innerText += " (You)";

            if (currentPlayer === 3) {
                yourTurnDiv.style.display = "block";
            }
        }
    }
    if (players.length >= 4) {
        player4Div.style.display = "block";
        score4Div.style.display = "block";
        score4Div.innerText = players[3].score + " - " + players[3].presentBlocks;
        if (playingPlayer === 4) {
            player4Div.innerText += " (You)";

            if (currentPlayer === 4) {
                yourTurnDiv.style.display = "block";
            }
        }
    }
}


export { ShowStats };

