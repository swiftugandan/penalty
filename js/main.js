// Main game initialization and p5.js setup
import CONFIG from './config.js';
import Field from './classes/Field.js';
import Goal from './classes/Goal.js';
import Goalkeeper from './classes/Goalkeeper.js';
import Ball from './classes/Ball.js';
import { gameState, domElements, startGame, takeShot, resetShot, endGame, resetGame, updateGameDisplay, displayMessage } from './gameState.js';
import { drawSlingshotLine, drawTrajectoryPreview, checkGoal } from './utils.js';
import Explosion from './classes/Explosion.js';
import Sound from './classes/Sound.js';

let explosions = [];
let sound;

// Initialize event listeners
domElements.startBtn.addEventListener('click', async () => {
    if (!sound) {
        sound = new Sound();
        await sound.init();
    }
    startGame(gameState, {
        displayMessage,
        resetShot: () => window.resetShot()
    });
});

// p5.js sketch
let sketch = function(p) {
    // Game elements
    let field;
    let goal;
    let goalkeeper;
    let ball;
    
    // Animation variables
    let ballAnimation = null;
    let goalkeeperAnimation = null;
    
    // Constants for the game
    const SLINGSHOT_COLOR = p.color(255, 0, 0, 180);
    
    p.setup = function() {
        // Create canvas inside the game-canvas div
        let canvas = p.createCanvas(CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        canvas.parent('game-canvas');
        
        // Initialize game objects
        field = new Field(p);
        goal = new Goal(p);
        goalkeeper = new Goalkeeper(p, goal);
        ball = new Ball(p);
        
        // Set initial text properties
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(24);
        
        // Display initial game state
        updateGameDisplay();
        
        // Display initial message
        displayMessage("Click Start Game to begin!");
    };
    
    p.draw = function() {
        // Draw the game scene
        field.display();
        goal.display();
        
        // Update and display animations if active
        if (ballAnimation) {
            ballAnimation.update();
            if (ballAnimation.isComplete()) {
                ballAnimation = null;
                checkGoal(p, ball, goalkeeper, goal, gameState, {
                    displayMessage,
                    updateGameDisplay,
                    endGame: () => {
                        const message = endGame(gameState);
                        displayMessage(message);
                    },
                    resetShot: () => window.resetShot(),
                    createExplosion: (x, y) => {
                        explosions.push(new Explosion(p, x, y));
                    }
                });
            }
        }
        
        // Update and display explosions
        for (let i = explosions.length - 1; i >= 0; i--) {
            explosions[i].update();
            explosions[i].display();
            if (explosions[i].isComplete()) {
                explosions.splice(i, 1);
            }
        }
        
        if (goalkeeperAnimation) {
            goalkeeperAnimation.update();
            if (goalkeeperAnimation.isComplete()) {
                goalkeeperAnimation = null;
            }
        }
        
        // Update goalkeeper animations
        goalkeeper.update();
        
        // Display game objects
        goalkeeper.display();
        
        // Draw slingshot line if dragging
        if (gameState.isDragging && gameState.canShoot) {
            drawSlingshotLine(p, gameState, SLINGSHOT_COLOR);
            drawTrajectoryPreview(p, gameState);
        }
        
        // Always draw the ball last so it appears on top
        ball.updatePosition(gameState);
        ball.display();
    };
    
    // p5.js built-in mouse event handlers
    p.mousePressed = function() {
        if (gameState.isGameStarted && !gameState.gameOver && gameState.canShoot && !ballAnimation) {
            // Check if mouse is over the canvas
            if (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height) {
                // Check if mouse is over the ball
                const d = p.dist(p.mouseX, p.mouseY, ball.x, ball.y);
                if (d < ball.radius * 1.5) {
                    gameState.isDragging = true;
                    gameState.dragStartX = ball.x;
                    gameState.dragStartY = ball.y;
                    gameState.dragCurrentX = ball.x;
                    gameState.dragCurrentY = ball.y;
                    
                    // Add dragging class to canvas for cursor change
                    document.getElementById('game-canvas').classList.add('dragging');
                }
            }
        }
    };
    
    p.mouseDragged = function() {
        if (gameState.isDragging && gameState.canShoot) {
            gameState.dragCurrentX = p.mouseX;
            gameState.dragCurrentY = p.mouseY;
            
            // Calculate distance and limit it
            const dx = gameState.dragStartX - gameState.dragCurrentX;
            const dy = gameState.dragStartY - gameState.dragCurrentY;
            const distance = p.sqrt(dx * dx + dy * dy);
            
            if (distance > gameState.maxDragDistance) {
                // Limit the drag distance
                const angle = p.atan2(dy, dx);
                gameState.dragCurrentX = gameState.dragStartX - p.cos(angle) * gameState.maxDragDistance;
                gameState.dragCurrentY = gameState.dragStartY - p.sin(angle) * gameState.maxDragDistance;
            }
            
            // Calculate power based on distance (0-100%)
            const maxDistance = gameState.maxDragDistance;
            const currentDistance = p.dist(gameState.dragStartX, gameState.dragStartY, 
                                          gameState.dragCurrentX, gameState.dragCurrentY);
            gameState.power = p.map(currentDistance, 0, maxDistance, 0, 100);
            
            // Calculate angle in degrees (0 is right, 90 is up)
            // Use the opposite direction of the drag for the shot direction
            const dx2 = gameState.dragStartX - gameState.dragCurrentX;
            const dy2 = gameState.dragStartY - gameState.dragCurrentY;
            gameState.angle = p.degrees(p.atan2(dy2, dx2));
            
            // Update UI
            domElements.powerValueEl.textContent = `${Math.round(gameState.power)}%`;
            domElements.angleValueEl.textContent = `${Math.round(gameState.angle)}°`;
        }
    };
    
    p.mouseReleased = function() {
        if (gameState.isDragging && gameState.canShoot) {
            // Remove dragging class
            document.getElementById('game-canvas').classList.remove('dragging');
            
            // Take the shot if power is above threshold
            if (gameState.power > 5) {
                window.takeShot();
            }
            
            gameState.isDragging = false;
        }
    };
    
    // Game functions inside the p5 sketch
    window.takeShot = function() {
        // Play kick sound when taking a shot
        sound.playKickSound();
        
        const animations = takeShot(gameState, ball, goalkeeper, {
            getGoal: () => goal
        });
        
        ballAnimation = animations.ballAnimation;
        goalkeeperAnimation = animations.goalkeeperAnimation;
    };
    
    window.resetShot = function() {
        resetShot(gameState, ball, goalkeeper, goal, {
            displayMessage
        });
        explosions = [];
    };
};

// Create the p5 instance
new p5(sketch);

// Export sound for use in other modules
export { sound }; 