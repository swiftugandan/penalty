// Utility functions for the game
import { sound } from './main.js';

// Helper function to set line dash in p5.js
export function setLineDash(p, list) {
    p.drawingContext.setLineDash(list);
}

// Draw slingshot line
export function drawSlingshotLine(p, gameState, color) {
    p.push();
    p.stroke(color);
    p.strokeWeight(3);
    setLineDash(p, [5, 5]);
    p.line(gameState.dragStartX, gameState.dragStartY, gameState.dragCurrentX, gameState.dragCurrentY);
    p.pop();
}

// Draw trajectory preview
export function drawTrajectoryPreview(p, gameState) {
    if (gameState.power < 5) return;
    
    p.push();
    p.stroke(0, 0, 0, 200);
    p.strokeWeight(3);
    setLineDash(p, [8, 8]);
    p.noFill();
    
    // Calculate trajectory preview points
    // Use the opposite direction of the drag for the shot direction
    const dx = gameState.dragStartX - gameState.dragCurrentX;
    const dy = gameState.dragStartY - gameState.dragCurrentY;
    const power = gameState.power / 100;
    const angle = p.radians(gameState.angle);
    
    // Calculate control point for the curve based on angle and power
    const controlX = gameState.dragStartX + Math.cos(angle) * 100;
    const controlY = gameState.dragStartY + Math.sin(angle) * 100 - 100 * power;
    
    // Calculate end point based on angle and power
    const distance = gameState.power * 4; // Scale for visual effect
    const endX = gameState.dragStartX + Math.cos(angle) * distance;
    const endY = gameState.dragStartY + Math.sin(angle) * distance;
    
    // Draw a bezier curve to preview trajectory
    p.beginShape();
    p.vertex(gameState.dragStartX, gameState.dragStartY);
    
    // Draw curve with points
    for (let t = 0; t <= 1; t += 0.05) {
        const x = p.bezierPoint(gameState.dragStartX, controlX, controlX, endX, t);
        const y = p.bezierPoint(gameState.dragStartY, controlY, controlY, endY, t);
        p.vertex(x, y);
    }
    
    p.endShape();
    p.pop();
}

// Check if the ball scored a goal
export function checkGoal(p, ball, goalkeeper, goal, gameState, callbacks) {
    // Find the zone where the ball ended up
    const targetZone = goal.zones.find(zone => 
        ball.x >= zone.x && 
        ball.x <= zone.x + zone.width && 
        ball.y >= zone.y && 
        ball.y <= zone.y + zone.height
    );
    
    // Check if goalkeeper saved the shot
    const goalkeeperSaved = 
        ball.x >= goalkeeper.x && 
        ball.x <= goalkeeper.x + goalkeeper.width && 
        ball.y >= goalkeeper.y && 
        ball.y <= goalkeeper.y + goalkeeper.height;
    
    gameState.attempts++;
    
    if (goalkeeperSaved) {
        // Goalkeeper saved
        gameState.goalkeeperScore++;
        goalkeeper.celebrate(); // Show celebration animation
        callbacks.displayMessage("Saved by the goalkeeper!");
        sound?.playSaveSound();
    } else if (targetZone) {
        // Goal scored
        gameState.playerScore++;
        goalkeeper.showDisappointment(); // Show disappointment animation
        callbacks.displayMessage("GOAL!");
        // Create explosion effect at the ball's position
        callbacks.createExplosion(ball.x, ball.y);
        sound?.playGoalSound();
    } else {
        // Shot missed
        gameState.goalkeeperScore++;
        goalkeeper.celebrate(); // Show celebration animation
        callbacks.displayMessage("Shot missed!");
        sound?.playMissSound();
    }
    
    callbacks.updateGameDisplay();
    
    // Check if game is over
    if (gameState.attempts >= gameState.maxAttempts) {
        callbacks.endGame();
    } else {
        // Reset for next shot
        setTimeout(() => {
            callbacks.resetShot();
        }, 2000);
    }
}

// Helper function to get target zone based on angle
export function getTargetZoneFromAngle(p, angle, goal) {
    if (!goal || !goal.zones || goal.zones.length === 0) {
        return null; // Safety check
    }
    
    // Normalize angle to 0-360
    while (angle < 0) angle += 360;
    angle = angle % 360;
    
    // Map angle ranges to zones
    // Top row
    if (angle >= 30 && angle < 60) return goal.zones[0]; // top-left
    if (angle >= 60 && angle < 120) return goal.zones[1]; // top-center
    if (angle >= 120 && angle < 150) return goal.zones[2]; // top-right
    
    // Middle row
    if (angle >= 0 && angle < 30) return goal.zones[3]; // middle-left
    if (angle >= 330 && angle < 360) return goal.zones[5]; // middle-right
    
    // Bottom row
    if (angle >= 210 && angle < 240) return goal.zones[6]; // bottom-left
    if (angle >= 180 && angle < 210) return goal.zones[7]; // bottom-center
    if (angle >= 240 && angle < 270) return goal.zones[8]; // bottom-right
    
    // Default to middle-center for any other angle
    return goal.zones[4]; // middle-center
} 