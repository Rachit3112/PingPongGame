const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 12;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 16;
const PLAYER_X = 20;
const AI_X = canvas.width - PADDLE_WIDTH - 20;
const PADDLE_SPEED = 5;
const BALL_SPEED = 5;

// Game state
let playerY = (canvas.height - PADDLE_HEIGHT) / 2;
let aiY = (canvas.height - PADDLE_HEIGHT) / 2;
let ballX = (canvas.width - BALL_SIZE) / 2;
let ballY = (canvas.height - BALL_SIZE) / 2;
let ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
let playerScore = 0;
let aiScore = 0;

// Utility functions
function clamp(val, min, max) {
    return Math.max(min, Math.min(val, max));
}

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Middle line
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);

    // Paddles
    ctx.fillStyle = '#fff';
    ctx.fillRect(PLAYER_X, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(AI_X, aiY, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ballX + BALL_SIZE / 2, ballY + BALL_SIZE / 2, BALL_SIZE / 2, 0, 2 * Math.PI);
    ctx.fill();

    // Score
    ctx.font = "32px Arial";
    ctx.fillText(playerScore, canvas.width / 4, 40);
    ctx.fillText(aiScore, 3 * canvas.width / 4, 40);
}

// Paddle collision check
function isColliding(px, py) {
    return (
        ballX < px + PADDLE_WIDTH &&
        ballX + BALL_SIZE > px &&
        ballY < py + PADDLE_HEIGHT &&
        ballY + BALL_SIZE > py
    );
}

// Game update
function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Ball collision with top/bottom
    if (ballY <= 0) {
        ballY = 0;
        ballSpeedY *= -1;
    } else if (ballY + BALL_SIZE >= canvas.height) {
        ballY = canvas.height - BALL_SIZE;
        ballSpeedY *= -1;
    }

    // Ball collision with player paddle
    if (isColliding(PLAYER_X, playerY)) {
        ballX = PLAYER_X + PADDLE_WIDTH;
        ballSpeedX *= -1;
        // Add some spin
        let impact = (ballY + BALL_SIZE/2) - (playerY + PADDLE_HEIGHT/2);
        ballSpeedY = impact * 0.25;
    }

    // Ball collision with AI paddle
    if (isColliding(AI_X, aiY)) {
        ballX = AI_X - BALL_SIZE;
        ballSpeedX *= -1;
        // Add some spin
        let impact = (ballY + BALL_SIZE/2) - (aiY + PADDLE_HEIGHT/2);
        ballSpeedY = impact * 0.25;
    }

    // Score check
    if (ballX < 0) {
        aiScore++;
        resetBall();
    } else if (ballX > canvas.width) {
        playerScore++;
        resetBall();
    }

    // AI movement (simple: follow ball, with some delay)
    let aiCenter = aiY + PADDLE_HEIGHT / 2;
    if (aiCenter < ballY + BALL_SIZE / 2 - 10) {
        aiY += PADDLE_SPEED * 0.85;
    } else if (aiCenter > ballY + BALL_SIZE / 2 + 10) {
        aiY -= PADDLE_SPEED * 0.85;
    }
    aiY = clamp(aiY, 0, canvas.height - PADDLE_HEIGHT);
}

// Reset ball to center
function resetBall() {
    ballX = (canvas.width - BALL_SIZE) / 2;
    ballY = (canvas.height - BALL_SIZE) / 2;
    ballSpeedX = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ballSpeedY = BALL_SPEED * (Math.random() * 2 - 1);
}

// Mouse movement for player paddle
canvas.addEventListener('mousemove', function(e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    playerY = clamp(mouseY - PADDLE_HEIGHT / 2, 0, canvas.height - PADDLE_HEIGHT);
});

// Main game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
draw();
gameLoop();