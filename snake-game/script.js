const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const restartButton = document.getElementById('restartButton');

const gridSize = 20; // Size of each grid cell
const canvasSize = canvas.width; // Assuming square canvas
const tileCount = canvasSize / gridSize; // Number of tiles in each row/column

let snake = [{ x: 10, y: 10 }]; // Initial snake position (grid coordinates)
let food = getRandomFoodPosition();
let dx = 0; // Initial horizontal velocity
let dy = 0; // Initial vertical velocity
let score = 0;
let changingDirection = false; // Prevent rapid direction changes
let gameLoopTimeout;
let gameSpeed = 150; // Milliseconds between updates (lower is faster)
let gameOver = false;

// --- Game Initialization ---
document.addEventListener('keydown', changeDirection);
restartButton.addEventListener('click', restartGame);

function startGame() {
    gameOver = false;
    snake = [{ x: 10, y: 10 }];
    food = getRandomFoodPosition();
    dx = 0;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    changingDirection = false;
    restartButton.style.display = 'none';
    clearTimeout(gameLoopTimeout); // Clear any existing loop
    main(); // Start the game loop
}

// --- Main Game Loop ---
function main() {
    if (gameOver) {
        displayGameOver();
        return;
    }

    changingDirection = false; // Allow direction change for the next frame
    gameLoopTimeout = setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        main(); // Repeat the loop
    }, gameSpeed);
}

// --- Drawing Functions ---
function clearCanvas() {
    // Fill background
    ctx.fillStyle = '#0a0a0a'; // Dark background
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    // Optional: Draw grid lines for a retro feel (subtle)
    // ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    // for (let i = 0; i < tileCount; i++) {
    //     ctx.beginPath();
    //     ctx.moveTo(i * gridSize, 0);
    //     ctx.lineTo(i * gridSize, canvasSize);
    //     ctx.stroke();
    //     ctx.beginPath();
    //     ctx.moveTo(0, i * gridSize);
    //     ctx.lineTo(canvasSize, i * gridSize);
    //     ctx.stroke();
    // }
}

function drawSnakePart(snakePart, index) {
    // Gradient effect for snake body
    const gradient = ctx.createLinearGradient(
        snakePart.x * gridSize, snakePart.y * gridSize,
        (snakePart.x + 1) * gridSize, (snakePart.y + 1) * gridSize
    );

    if (index === 0) { // Head
        gradient.addColorStop(0, '#00ffcc'); // Brighter teal
        gradient.addColorStop(1, '#00b38f'); // Darker teal
        ctx.fillStyle = gradient;
        // Slightly larger head or different shape? Maybe eyes?
        ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
        // Simple eyes
        ctx.fillStyle = '#0a0a0a'; // Background color for eyes
        const eyeSize = gridSize / 5;
        const eyeOffset = gridSize / 4;
        // Adjust eye position based on direction (basic example)
        if (dx === 1) { // Right
             ctx.fillRect((snakePart.x + 0.6) * gridSize, (snakePart.y + 0.2) * gridSize, eyeSize, eyeSize);
             ctx.fillRect((snakePart.x + 0.6) * gridSize, (snakePart.y + 0.6) * gridSize, eyeSize, eyeSize);
        } else if (dx === -1) { // Left
             ctx.fillRect((snakePart.x + 0.2) * gridSize, (snakePart.y + 0.2) * gridSize, eyeSize, eyeSize);
             ctx.fillRect((snakePart.x + 0.2) * gridSize, (snakePart.y + 0.6) * gridSize, eyeSize, eyeSize);
        } else if (dy === 1) { // Down
             ctx.fillRect((snakePart.x + 0.2) * gridSize, (snakePart.y + 0.6) * gridSize, eyeSize, eyeSize);
             ctx.fillRect((snakePart.x + 0.6) * gridSize, (snakePart.y + 0.6) * gridSize, eyeSize, eyeSize);
        } else if (dy === -1) { // Up
             ctx.fillRect((snakePart.x + 0.2) * gridSize, (snakePart.y + 0.2) * gridSize, eyeSize, eyeSize);
             ctx.fillRect((snakePart.x + 0.6) * gridSize, (snakePart.y + 0.2) * gridSize, eyeSize, eyeSize);
        }


    } else { // Body
        gradient.addColorStop(0, '#00b38f'); // Darker teal
        gradient.addColorStop(1, '#008066'); // Even darker teal
        ctx.fillStyle = gradient;
        ctx.fillRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
        // Add a subtle border to segment the body
        ctx.strokeStyle = '#00ffcc';
        ctx.lineWidth = 1;
        ctx.strokeRect(snakePart.x * gridSize, snakePart.y * gridSize, gridSize, gridSize);
    }


}

function drawSnake() {
    snake.forEach(drawSnakePart);
}

function drawFood() {
    // Glowing effect for food
    ctx.fillStyle = '#ffcc00'; // Gold
    ctx.shadowColor = '#ffcc00';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2,
        food.y * gridSize + gridSize / 2,
        gridSize / 2.5, // Slightly smaller than the grid cell
        0, 2 * Math.PI
    );
    ctx.fill();
    ctx.shadowBlur = 0; // Reset shadow blur
}

// --- Game Logic ---
function moveSnake() {
    // Create the new snake head position
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    // Add the new head to the beginning of the snake array
    snake.unshift(head);

    // Check if snake ate food
    const didEatFood = snake[0].x === food.x && snake[0].y === food.y;
    if (didEatFood) {
        score += 10;
        scoreElement.textContent = score;
        food = getRandomFoodPosition(); // Generate new food
        // Increase speed slightly (optional)
        // if (gameSpeed > 50) gameSpeed -= 5;
    } else {
        // Remove the last part of the snake's tail if no food was eaten
        snake.pop();
    }

    // Check for collisions
    checkCollisions();
}

function changeDirection(event) {
    if (changingDirection) return; // Prevent changing direction twice in one frame
    changingDirection = true;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    const keyPressed = event.keyCode;

    const goingUp = dy === -1;
    const goingDown = dy === 1;
    const goingRight = dx === 1;
    const goingLeft = dx === -1;

    // Prevent moving in the opposite direction
    if (keyPressed === LEFT_KEY && !goingRight) { dx = -1; dy = 0; }
    if (keyPressed === UP_KEY && !goingDown) { dx = 0; dy = -1; }
    if (keyPressed === RIGHT_KEY && !goingLeft) { dx = 1; dy = 0; }
    if (keyPressed === DOWN_KEY && !goingUp) { dx = 0; dy = 1; }
}

function getRandomFoodPosition() {
    let newFoodPosition;
    while (true) {
        newFoodPosition = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Ensure food doesn't spawn on the snake
        let collision = false;
        for (let part of snake) {
            if (part.x === newFoodPosition.x && part.y === newFoodPosition.y) {
                collision = true;
                break;
            }
        }
        if (!collision) break;
    }
    return newFoodPosition;
}

function checkCollisions() {
    const head = snake[0];

    // Wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        gameOver = true;
        return;
    }

    // Self collision (check if head collides with any part of the body)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver = true;
            return;
        }
    }
}

function displayGameOver() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    ctx.font = "40px 'Press Start 2P'";
    ctx.fillStyle = '#ff0000'; // Red
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('GAME OVER', canvasSize / 2, canvasSize / 2 - 30);

    ctx.font = "20px 'Press Start 2P'";
    ctx.fillStyle = '#ffcc00'; // Gold
    ctx.fillText(`Final Score: ${score}`, canvasSize / 2, canvasSize / 2 + 20);

    restartButton.style.display = 'block'; // Show restart button
}

function restartGame() {
    startGame();
}

// --- Start the game ---
startGame();
