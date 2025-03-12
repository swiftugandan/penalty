// Game state management
import CONFIG from './config.js';

// Initial game state
export const gameState = {
    isGameStarted: false,
    isDragging: false,
    canShoot: false,
    playerScore: 0,
    goalkeeperScore: 0,
    attempts: 0,
    maxAttempts: CONFIG.MAX_ATTEMPTS,
    gameOver: false,
    dragStartX: 0,
    dragStartY: 0,
    dragCurrentX: 0,
    dragCurrentY: 0,
    power: 0,
    angle: 0,
    maxDragDistance: CONFIG.MAX_DRAG_DISTANCE
};

// DOM elements
export const domElements = {
    startBtn: document.getElementById('start-btn'),
    playerScoreEl: document.getElementById('player-score'),
    goalkeeperScoreEl: document.getElementById('goalkeeper-score'),
    attemptsEl: document.getElementById('attempts'),
    gameMessageEl: document.getElementById('game-message'),
    powerValueEl: document.getElementById('power-value'),
    angleValueEl: document.getElementById('angle-value')
};

// Game functions
export function startGame(gameState, callbacks) {
    if (gameState.gameOver) {
        // Reset game if it's over
        resetGame(gameState, callbacks);
    }
    
    if (!gameState.isGameStarted) {
        gameState.isGameStarted = true;
        gameState.canShoot = true;
        domElements.startBtn.textContent = "Reset Shot";
        callbacks.displayMessage("Drag the ball and release to shoot!");
    } else if (gameState.canShoot && !gameState.isDragging) {
        // Reset the current shot
        callbacks.resetShot();
    }
}

export function takeShot(gameState, ball, goalkeeper, callbacks) {
    // Disable shooting
    gameState.canShoot = false;
    
    // Goalkeeper predicts and moves
    const goalkeeperTargetZone = goalkeeper.predictShot(gameState, ball);
    const goalkeeperAnimation = goalkeeper.moveToZone(goalkeeperTargetZone);
    
    // Reset ball position before animation
    ball.x = ball.originalX;
    ball.y = ball.originalY;
    
    // Kick the ball using angle and power
    const ballAnimation = ball.kick(gameState, callbacks.getGoal());
    
    // Disable controls during animation
    domElements.startBtn.disabled = true;
    
    // Reset power and angle display
    domElements.powerValueEl.textContent = "0%";
    domElements.angleValueEl.textContent = "0°";
    
    return { ballAnimation, goalkeeperAnimation };
}

export function resetShot(gameState, ball, goalkeeper, goal, callbacks) {
    // Reset ball position
    ball.reset();
    
    // Reset goalkeeper position
    goalkeeper.reset(goal);
    
    // Reset controls
    gameState.canShoot = true;
    gameState.isDragging = false;
    gameState.power = 0;
    gameState.angle = 0;
    
    // Reset UI
    domElements.powerValueEl.textContent = "0%";
    domElements.angleValueEl.textContent = "0°";
    domElements.startBtn.textContent = "Reset Shot";
    domElements.startBtn.disabled = false;
    
    callbacks.displayMessage(`Attempt ${gameState.attempts + 1}/${gameState.maxAttempts}`);
}

export function endGame(gameState) {
    gameState.gameOver = true;
    gameState.canShoot = false;
    domElements.startBtn.textContent = "Play Again";
    domElements.startBtn.disabled = false;
    
    if (gameState.playerScore > gameState.goalkeeperScore) {
        return "Game Over! You win!";
    } else if (gameState.playerScore < gameState.goalkeeperScore) {
        return "Game Over! Goalkeeper wins!";
    } else {
        return "Game Over! It's a draw!";
    }
}

export function resetGame(gameState, callbacks) {
    gameState.isGameStarted = false;
    gameState.isDragging = false;
    gameState.canShoot = false;
    gameState.playerScore = 0;
    gameState.goalkeeperScore = 0;
    gameState.attempts = 0;
    gameState.gameOver = false;
    gameState.power = 0;
    gameState.angle = 0;
    
    // Reset UI
    domElements.powerValueEl.textContent = "0%";
    domElements.angleValueEl.textContent = "0°";
    domElements.startBtn.textContent = "Start Game";
    
    // Reset game display
    callbacks.updateGameDisplay();
    callbacks.displayMessage("Click Start Game to begin!");
}

export function updateGameDisplay() {
    domElements.playerScoreEl.textContent = gameState.playerScore;
    domElements.goalkeeperScoreEl.textContent = gameState.goalkeeperScore;
    domElements.attemptsEl.textContent = `${gameState.attempts}/${gameState.maxAttempts}`;
}

export function displayMessage(message) {
    domElements.gameMessageEl.textContent = message;
} 