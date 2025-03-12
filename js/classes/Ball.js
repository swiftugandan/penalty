// Ball class for the game
import CONFIG from '../config.js';
import { BezierAnimation } from './Animation.js';

export default class Ball {
    constructor(p) {
        this.p = p;
        this.radius = CONFIG.BALL_RADIUS;
        this.x = p.width/2;
        this.y = p.height * CONFIG.BALL_Y_POSITION_RATIO;
        this.originalX = this.x;
        this.originalY = this.y;
        this.ballColor = p.color(255, 255, 255);
        this.outlineColor = p.color(0, 0, 0);
    }
    
    display() {
        // Draw ball shadow
        this.p.fill(0, 0, 0, 30);
        this.p.noStroke();
        this.p.ellipse(this.x, this.y + 5, this.radius * 2, this.radius * 0.5);
        
        // Draw ball
        this.p.fill(this.ballColor);
        this.p.stroke(this.outlineColor);
        this.p.strokeWeight(1);
        this.p.ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
        
        // Draw ball details
        this.p.stroke(this.outlineColor);
        this.p.strokeWeight(1);
        this.p.line(this.x - this.radius, this.y, this.x + this.radius, this.y);
        this.p.line(this.x, this.y - this.radius, this.x, this.y + this.radius);
        this.p.arc(this.x, this.y, this.radius * 1.5, this.radius * 1.5, this.p.PI/4, this.p.PI/4*3);
        this.p.arc(this.x, this.y, this.radius * 1.5, this.radius * 1.5, this.p.PI/4*5, this.p.PI/4*7);
    }
    
    reset() {
        this.x = this.originalX;
        this.y = this.originalY;
    }
    
    kick(gameState, goal) {
        // Calculate end point based on angle and power
        const angle = this.p.radians(gameState.angle);
        const distance = gameState.power * 4;
        const endX = this.originalX + Math.cos(angle) * distance;
        const endY = this.originalY + Math.sin(angle) * distance;
        
        // Calculate control point for the curve based on angle and power
        const controlX = this.originalX + Math.cos(angle) * 100;
        const controlY = this.originalY + Math.sin(angle) * 100 - 100 * (gameState.power / 100);
        
        return new BezierAnimation(
            this,
            { x: this.originalX, y: this.originalY },
            { x: endX, y: endY },
            { x: controlX, y: controlY },
            CONFIG.BALL_ANIMATION_BASE_DURATION - gameState.power * 5, // Faster with more power
            this.p,
            goal
        );
    }
    
    updatePosition(gameState) {
        // If dragging, update ball position with a spring effect
        if (gameState.isDragging && gameState.canShoot) {
            this.x = this.p.lerp(this.x, gameState.dragCurrentX, 0.5);
            this.y = this.p.lerp(this.y, gameState.dragCurrentY, 0.5);
        }
    }
} 