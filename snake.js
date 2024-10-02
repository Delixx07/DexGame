let blockSize = 25;
let total_row = 17; 
let total_col = 17;
let board;
let context;

let snakeX = blockSize * 5;
let snakeY = blockSize * 5;

let speedX = 0; 
let speedY = 0;

let snakeBody = [];

let foodX;
let foodY;

let gameOver = false;
let speed = 5;

let score = 0;

let snakeHeadImages = {
    up: new Image(),
    down: new Image(),
    left: new Image(),
    right: new Image()
};

snakeHeadImages.up.src = 'snake-head-up.png';
snakeHeadImages.down.src = 'snake-head-down.png';
snakeHeadImages.left.src = 'snake-head-left.png';
snakeHeadImages.right.src = 'snake-head-right.png';

window.onload = function () {
    board = document.getElementById("board");
    board.height = total_row * blockSize;
    board.width = total_col * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    
    updateInterval = setInterval(update, 1000 / speed); 

    document.getElementById("play-again").addEventListener("click", resetGame);
}

function update() {
    if (gameOver) {
        return;
    }

    context.fillStyle = "#d0d0d0";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "#ff0000";
    context.beginPath();
    context.arc(foodX + blockSize / 2, foodY + blockSize / 2, blockSize / 2, 0, Math.PI * 2);
    context.fill();

    if (snakeX === foodX && snakeY === foodY) {
        snakeBody.push([foodX, foodY]);
        placeFood();
        speed += 2;
        score++;  
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }

    snakeX += speedX * blockSize;
    snakeY += speedY * blockSize;

    if (snakeX < 0) {
        snakeX = total_col * blockSize;
    } else if (snakeX >= total_col * blockSize) {
        snakeX = 0;
    }

    if (snakeY < 0) {
        snakeY = total_row * blockSize;
    } else if (snakeY >= total_row * blockSize) {
        snakeY = 0;
    }

    if (speedY === -1) {
        context.drawImage(snakeHeadImages.up, snakeX, snakeY, blockSize, blockSize);
    } else if (speedY === 1) {
        context.drawImage(snakeHeadImages.down, snakeX, snakeY, blockSize, blockSize);
    } else if (speedX === -1) {
        context.drawImage(snakeHeadImages.left, snakeX, snakeY, blockSize, blockSize);
    } else if (speedX === 1) {
        context.drawImage(snakeHeadImages.right, snakeX, snakeY, blockSize, blockSize);
    }

    context.fillStyle = "#a0c432";
    for (let i = 0; i < snakeBody.length; i++) {
        context.beginPath();
        context.arc(snakeBody[i][0] + blockSize / 2, snakeBody[i][1] + blockSize / 2, blockSize / 2, 0, Math.PI * 2); 
        context.fill();
    }

    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeX === snakeBody[i][0] && snakeY === snakeBody[i][1]) {
            gameOver = true;
            displayGameOver();
        }
    }

    context.fillStyle = "#000";
    context.font = "20px Poppins";
    context.fillText("Score: " + score, 10, 20); 
}

function changeDirection(e) {
    if (e.code == "ArrowUp" && speedY != 1) {
        speedX = 0;
        speedY = -1;
    } else if (e.code == "ArrowDown" && speedY != -1) {
        speedX = 0;
        speedY = 1;
    } else if (e.code == "ArrowLeft" && speedX != 1) {
        speedX = -1;
        speedY = 0;
    } else if (e.code == "ArrowRight" && speedX != -1) {
        speedX = 1;
        speedY = 0;
    }
}

function placeFood() {
    foodX = Math.floor(Math.random() * total_col) * blockSize;
    foodY = Math.floor(Math.random() * total_row) * blockSize;
}

function displayGameOver() {
    document.getElementById("popup").style.display = "flex";
    document.getElementById("popup-message").innerText = "Game Over!";
    document.getElementById("popup-score").innerText = "Your Score: " + score; 
}

function resetGame() {
    snakeX = blockSize * 5;
    snakeY = blockSize * 5;
    speedX = 0;
    speedY = 0;
    snakeBody = [];
    gameOver = false;
    speed = 5;
    score = 0; 
    placeFood();
    document.getElementById("popup").style.display = "none";
}
