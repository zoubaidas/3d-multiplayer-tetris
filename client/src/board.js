/**
 * 
 * 3D Tetris Board
 * Used to display a 3D Tetris board on the screen with Three.js - CreateBoard and UpdateBoard
 * 
 * @param {array} boardData - Board data of the game
 * @param {object} currentTetrominoPosition - Current tetromino position of the game
 * @param {array} currentTetromino - Current tetromino of the game
 * 
 * @example
 * CreateBoard(); // Create the board with the default values
 * UpdateBoard([[{ value: 1 }, { value: 1 }], [{ value: 1 }, { value: 1 }]], { row: 0, col: 0 }, [[{ value: 1 }, { value: 1 }], [{ value: 1 }, { value: 1 }]]); // Update the board with the new values
 */

import gsap from "gsap";
import * as THREE from 'three';
import { getColor } from "./utils.js";


// Constants - Tetris board
const BLOCK_SIZE = 1;
const BLOCK_GAP_X = 1.25;
const BLOCK_GAP_Y = 1.265;
const BOARD_SIZE = 20;

// Variables - Tetris board
let scene, camera, renderer;
let boardBlocks = [];
let currentTetrominoBlocks = [];

function CreateBoard() {
    // Get the canvas element
    const canvas = document.getElementById('canvas');

    // Set up the scene
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(
        75,
        1,
        0.1,
        1000
    );
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(400, 600);

    // Set up camera position
    camera.position.x = 11.85;
    camera.position.z = 17;
    camera.position.y = 12;
    camera.lookAt(11.85, 12, 0);

    // Set up lights
    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 0, 15);
    scene.add(directionalLight);

    // Set up board background blocks
    createBoardBackgroundBlocks();

    // Animation loop
    const animate = () => {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    };

    animate();
}

function createBlock(color) {
    const geometry = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE / 2);
    const material = new THREE.MeshStandardMaterial({ color });
    return new THREE.Mesh(geometry, material);
}

function createBoardBackgroundBlocks() {
    const bgBlocksGroup = new THREE.Group();

    for (let i = 0; i < BOARD_SIZE; i++) {
        for (let j = 0; j < BOARD_SIZE; j++) {
            const block = createBlock(0x2d2d2d);
            block.position.set(i * BLOCK_GAP_X, ((BOARD_SIZE - 1) * BLOCK_GAP_Y) - j * BLOCK_GAP_Y, -0.1);
            bgBlocksGroup.add(block);
        }
    }

    scene.add(bgBlocksGroup);
}

function UpdateBoard(boardData, currentTetrominoPosition, currentTetromino) {
    // Update board
    for (let row = 0; row < boardData.length; row++) {
        for (let col = 0; col < boardData[row].length; col++) {
            if (boardData[row][col] !== null) {
                const x = col * BLOCK_GAP_X;
                const y = ((BOARD_SIZE - 1) * BLOCK_GAP_Y) - row * BLOCK_GAP_Y;

                const boardBlock = boardBlocks.find(block => block.name === boardData[row][col].id);
                if (!boardBlock) {
                    const block = createBlock(getColor(boardData[row][col].value));
                    block.position.set(x, y, 0);
                    block.name = boardData[row][col].id;
                    boardBlocks.push(block);
                    scene.add(block);
                }
                else {
                    if (boardBlock.position.x === x && boardBlock.position.y === y) {
                        continue;
                    }

                    if (document.hidden) {
                        boardBlock.position.set(x, y, 0);
                    }
                    else {
                        gsap.to(boardBlock.position, {
                            x,
                            y,
                            duration: 0.1
                        });
                    }
                }
            }
        }
    }

    // Remove blocks that are no longer in the board
    for (let i = 0; i < boardBlocks.length; i++) {
        const block = boardBlocks[i];
        const blockExists = boardData.some(row => row.some(col => col !== null && col.id === block.name));
        if (!blockExists) {
            scene.remove(block);
            boardBlocks.splice(i, 1);
            i--;
        }
    }

    // Update current tetromino
    for (let row = 0; row < currentTetromino.length; row++) {
        for (let col = 0; col < currentTetromino[row].length; col++) {
            if (currentTetromino[row][col] !== null) {
                const x = (col + currentTetrominoPosition.col) * BLOCK_GAP_X;
                const y = ((BOARD_SIZE - 1) * BLOCK_GAP_Y) - ((row + currentTetrominoPosition.row) * BLOCK_GAP_Y);

                const currentTetrominoBlock = currentTetrominoBlocks.find(block => block.name === currentTetromino[row][col].id);
                if (!currentTetrominoBlock) {
                    const block = createBlock(getColor(currentTetromino[row][col].value));
                    block.position.set(x, y, 0);
                    block.name = currentTetromino[row][col].id;
                    currentTetrominoBlocks.push(block);
                    scene.add(block);
                }
                else {
                    if (currentTetrominoBlock.position.x === x && currentTetrominoBlock.position.y === y) {
                        continue;
                    }

                    if (document.hidden) {
                        currentTetrominoBlock.position.set(x, y, 0);
                    }
                    else {
                        gsap.to(currentTetrominoBlock.position, {
                            x,
                            y,
                            duration: 0.1
                        });
                    }
                }
            }
        }
    }

    // Remove blocks that are no longer in the current tetromino
    for (let i = 0; i < currentTetrominoBlocks.length; i++) {
        const block = currentTetrominoBlocks[i];
        const blockExists = currentTetromino.some(row => row.some(col => col !== null && col.id === block.name));
        if (!blockExists) {
            scene.remove(block);
            currentTetrominoBlocks.splice(i, 1);
            i--;
        }
    }
}

export { CreateBoard, UpdateBoard };

