// Goalkeeper class for the game
import CONFIG from '../config.js';
import { Animation } from './Animation.js';

export default class Goalkeeper {
    constructor(p, goal) {
        this.p = p;
        this.goal = goal;
        this.width = CONFIG.GOALKEEPER_WIDTH;
        this.height = CONFIG.GOALKEEPER_HEIGHT;
        this.x = p.width/2 - this.width/2;
        this.y = p.height * CONFIG.GOALKEEPER_Y_POSITION_RATIO;
        this.targetX = this.x;
        this.targetY = this.y;
        this.color = p.color(255, 0, 0);
        
        // Goalkeeper state
        this.state = 'ready'; // ready, diving, celebrating, disappointed
        this.divingDirection = 'center'; // left, right, center
        this.divingHeight = 'middle'; // top, middle, bottom
        this.reactionTime = CONFIG.GOALKEEPER_REACTION_TIME; // milliseconds to react to shot
        this.divingTimer = 0;
        this.celebrationTimer = 0;
        
        // Difficulty level
        this.difficulty = CONFIG.GOALKEEPER_DIFFICULTY_MEDIUM; // Default to medium
        
        // Limb positions for animations
        this.leftArm = { x: 0, y: 0, angle: 0 };
        this.rightArm = { x: 0, y: 0, angle: 0 };
        this.leftLeg = { x: 0, y: 0, angle: 0 };
        this.rightLeg = { x: 0, y: 0, angle: 0 };
        
        // Initialize limbs
        this.resetLimbs();
    }
    
    resetLimbs() {
        // Default positions for limbs in ready stance
        this.leftArm = { 
            x: -this.width/3, 
            y: this.height/6, 
            angle: -15 
        };
        this.rightArm = { 
            x: this.width/3, 
            y: this.height/6, 
            angle: 15 
        };
        this.leftLeg = { 
            x: -this.width/4, 
            y: this.height/2, 
            angle: -5 
        };
        this.rightLeg = { 
            x: this.width/4, 
            y: this.height/2, 
            angle: 5 
        };
    }
    
    display() {
        this.p.push();
        this.p.translate(this.x + this.width/2, this.y);
        
        // Draw goalkeeper based on current state
        switch(this.state) {
            case 'diving':
                this.drawDiving();
                break;
            case 'celebrating':
                this.drawCelebrating();
                break;
            case 'disappointed':
                this.drawDisappointed();
                break;
            case 'ready':
            default:
                this.drawReady();
                break;
        }
        
        this.p.pop();
    }
    
    drawReady() {
        // Body
        this.p.fill(this.color);
        this.p.noStroke();
        this.p.ellipse(0, this.height/4, this.width * 0.8, this.height/2);
        
        // Head
        this.p.fill(255, 204, 153); // Skin tone
        this.p.ellipse(0, -this.height/10, this.width/3, this.width/3);
        
        // Eyes
        this.p.fill(255);
        this.p.ellipse(-this.width/10, -this.height/10, this.width/15, this.width/15);
        this.p.ellipse(this.width/10, -this.height/10, this.width/15, this.width/15);
        this.p.fill(0);
        this.p.ellipse(-this.width/10, -this.height/10, this.width/30, this.width/30);
        this.p.ellipse(this.width/10, -this.height/10, this.width/30, this.width/30);
        
        // Mouth
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        this.p.arc(0, -this.height/20, this.width/10, this.width/20, 0, this.p.PI);
        
        // Arms
        this.p.push();
        this.p.fill(this.color);
        this.p.noStroke();
        
        // Left arm
        this.p.push();
        this.p.translate(this.leftArm.x, this.leftArm.y);
        this.p.rotate(this.p.radians(this.leftArm.angle));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        // Right arm
        this.p.push();
        this.p.translate(this.rightArm.x, this.rightArm.y);
        this.p.rotate(this.p.radians(this.rightArm.angle));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        this.p.pop();
        
        // Legs
        this.p.push();
        this.p.fill(0); // Black shorts
        this.p.rect(-this.width/4, this.height/4, this.width/2, this.height/5, 5);
        
        // Left leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(this.leftLeg.x, this.leftLeg.y);
        this.p.rotate(this.p.radians(this.leftLeg.angle));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        // Right leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(this.rightLeg.x, this.rightLeg.y);
        this.p.rotate(this.p.radians(this.rightLeg.angle));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        this.p.pop();
    }
    
    drawDiving() {
        // Update diving animation
        if (this.divingTimer < this.reactionTime) {
            // Anticipation phase - slight lean
            const progress = this.divingTimer / this.reactionTime;
            
            if (this.divingDirection === 'left') {
                this.leftArm.angle = this.p.lerp(-15, -45, progress);
                this.rightArm.angle = this.p.lerp(15, 30, progress);
                this.leftLeg.angle = this.p.lerp(-5, -15, progress);
                this.rightLeg.angle = this.p.lerp(5, 15, progress);
            } else if (this.divingDirection === 'right') {
                this.leftArm.angle = this.p.lerp(-15, -30, progress);
                this.rightArm.angle = this.p.lerp(15, 45, progress);
                this.leftLeg.angle = this.p.lerp(-5, -15, progress);
                this.rightLeg.angle = this.p.lerp(5, 15, progress);
            }
            
            this.drawReady();
        } else {
            // Full diving phase
            this.p.push();
            
            // Rotate the entire goalkeeper based on diving direction
            let rotationAngle = 0;
            if (this.divingDirection === 'left') {
                rotationAngle = -90;
                this.leftArm.angle = -120;
                this.rightArm.angle = -60;
                this.leftLeg.angle = -30;
                this.rightLeg.angle = 30;
            } else if (this.divingDirection === 'right') {
                rotationAngle = 90;
                this.leftArm.angle = 60;
                this.rightArm.angle = 120;
                this.leftLeg.angle = -30;
                this.rightLeg.angle = 30;
            }
            
            // Adjust height based on diving height
            let heightOffset = 0;
            if (this.divingHeight === 'top') {
                heightOffset = -this.height/3;
            } else if (this.divingHeight === 'bottom') {
                heightOffset = this.height/3;
            }
            
            this.p.translate(0, heightOffset);
            this.p.rotate(this.p.radians(rotationAngle));
            
            // Body
            this.p.fill(this.color);
            this.p.noStroke();
            this.p.ellipse(0, this.height/4, this.width, this.height/2);
            
            // Head
            this.p.fill(255, 204, 153); // Skin tone
            this.p.ellipse(0, -this.height/10, this.width/3, this.width/3);
            
            // Eyes
            this.p.fill(255);
            this.p.ellipse(-this.width/10, -this.height/10, this.width/15, this.width/15);
            this.p.ellipse(this.width/10, -this.height/10, this.width/15, this.width/15);
            this.p.fill(0);
            this.p.ellipse(-this.width/10, -this.height/10, this.width/30, this.width/30);
            this.p.ellipse(this.width/10, -this.height/10, this.width/30, this.width/30);
            
            // Mouth - determined expression
            this.p.stroke(0);
            this.p.strokeWeight(1);
            this.p.line(-this.width/15, 0, this.width/15, 0);
            
            // Arms stretched out for diving
            this.p.push();
            this.p.fill(this.color);
            this.p.noStroke();
            
            // Left arm
            this.p.push();
            this.p.translate(this.leftArm.x, this.leftArm.y);
            this.p.rotate(this.p.radians(this.leftArm.angle));
            this.p.rect(-this.width/20, 0, this.width/10, this.height/2.5, 5);
            this.p.fill(255, 204, 153); // Skin tone for hand
            this.p.ellipse(-this.width/20, this.height/2.5, this.width/6, this.width/6);
            this.p.pop();
            
            // Right arm
            this.p.push();
            this.p.translate(this.rightArm.x, this.rightArm.y);
            this.p.rotate(this.p.radians(this.rightArm.angle));
            this.p.rect(-this.width/20, 0, this.width/10, this.height/2.5, 5);
            this.p.fill(255, 204, 153); // Skin tone for hand
            this.p.ellipse(-this.width/20, this.height/2.5, this.width/6, this.width/6);
            this.p.pop();
            
            this.p.pop();
            
            // Legs
            this.p.push();
            this.p.fill(0); // Black shorts
            this.p.rect(-this.width/4, this.height/4, this.width/2, this.height/5, 5);
            
            // Left leg
            this.p.fill(this.color);
            this.p.push();
            this.p.translate(this.leftLeg.x, this.leftLeg.y);
            this.p.rotate(this.p.radians(this.leftLeg.angle));
            this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
            this.p.fill(0); // Black boot
            this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
            this.p.pop();
            
            // Right leg
            this.p.fill(this.color);
            this.p.push();
            this.p.translate(this.rightLeg.x, this.rightLeg.y);
            this.p.rotate(this.p.radians(this.rightLeg.angle));
            this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
            this.p.fill(0); // Black boot
            this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
            this.p.pop();
            
            this.p.pop();
            
            this.p.pop();
        }
        
        // Update diving timer
        this.divingTimer += this.p.deltaTime;
    }
    
    drawCelebrating() {
        // Body
        this.p.fill(this.color);
        this.p.noStroke();
        this.p.ellipse(0, this.height/4, this.width * 0.8, this.height/2);
        
        // Head
        this.p.fill(255, 204, 153); // Skin tone
        this.p.ellipse(0, -this.height/10, this.width/3, this.width/3);
        
        // Eyes
        this.p.fill(255);
        this.p.ellipse(-this.width/10, -this.height/10, this.width/15, this.width/15);
        this.p.ellipse(this.width/10, -this.height/10, this.width/15, this.width/15);
        this.p.fill(0);
        this.p.ellipse(-this.width/10, -this.height/10, this.width/30, this.width/30);
        this.p.ellipse(this.width/10, -this.height/10, this.width/30, this.width/30);
        
        // Mouth - big smile
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        this.p.arc(0, -this.height/20, this.width/6, this.width/10, 0, this.p.PI);
        
        // Arms raised in celebration
        this.p.push();
        this.p.fill(this.color);
        this.p.noStroke();
        
        // Animate arms waving
        const waveSpeed = 5;
        const waveAmount = 20;
        const leftWave = Math.sin(this.celebrationTimer * waveSpeed) * waveAmount;
        const rightWave = Math.sin(this.celebrationTimer * waveSpeed + Math.PI) * waveAmount;
        
        // Left arm
        this.p.push();
        this.p.translate(-this.width/3, this.height/6);
        this.p.rotate(this.p.radians(-135 + leftWave));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        // Right arm
        this.p.push();
        this.p.translate(this.width/3, this.height/6);
        this.p.rotate(this.p.radians(135 + rightWave));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        this.p.pop();
        
        // Legs
        this.p.push();
        this.p.fill(0); // Black shorts
        this.p.rect(-this.width/4, this.height/4, this.width/2, this.height/5, 5);
        
        // Left leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(-this.width/4, this.height/2);
        this.p.rotate(this.p.radians(-5));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        // Right leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(this.width/4, this.height/2);
        this.p.rotate(this.p.radians(5));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        this.p.pop();
        
        // Update celebration timer
        this.celebrationTimer += this.p.deltaTime / 1000;
    }
    
    drawDisappointed() {
        // Body - slightly hunched
        this.p.fill(this.color);
        this.p.noStroke();
        this.p.ellipse(0, this.height/4 + 5, this.width * 0.8, this.height/2);
        
        // Head - slightly down
        this.p.fill(255, 204, 153); // Skin tone
        this.p.ellipse(0, -this.height/10 + 5, this.width/3, this.width/3);
        
        // Eyes - looking down
        this.p.fill(255);
        this.p.ellipse(-this.width/10, -this.height/10 + 5, this.width/15, this.width/15);
        this.p.ellipse(this.width/10, -this.height/10 + 5, this.width/15, this.width/15);
        this.p.fill(0);
        this.p.ellipse(-this.width/10, -this.height/10 + 7, this.width/30, this.width/30);
        this.p.ellipse(this.width/10, -this.height/10 + 7, this.width/30, this.width/30);
        
        // Mouth - frown
        this.p.stroke(0);
        this.p.strokeWeight(1);
        this.p.noFill();
        this.p.arc(0, 0, this.width/10, this.width/20, this.p.PI, this.p.TWO_PI);
        
        // Arms hanging down
        this.p.push();
        this.p.fill(this.color);
        this.p.noStroke();
        
        // Left arm
        this.p.push();
        this.p.translate(-this.width/3, this.height/6);
        this.p.rotate(this.p.radians(20));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        // Right arm
        this.p.push();
        this.p.translate(this.width/3, this.height/6);
        this.p.rotate(this.p.radians(-20));
        this.p.rect(-this.width/20, 0, this.width/10, this.height/3, 5);
        this.p.fill(255, 204, 153); // Skin tone for hand
        this.p.ellipse(-this.width/20, this.height/3, this.width/8, this.width/8);
        this.p.pop();
        
        this.p.pop();
        
        // Legs
        this.p.push();
        this.p.fill(0); // Black shorts
        this.p.rect(-this.width/4, this.height/4, this.width/2, this.height/5, 5);
        
        // Left leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(-this.width/4, this.height/2);
        this.p.rotate(this.p.radians(-5));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        // Right leg
        this.p.fill(this.color);
        this.p.push();
        this.p.translate(this.width/4, this.height/2);
        this.p.rotate(this.p.radians(5));
        this.p.rect(-this.width/15, 0, this.width/8, this.height/3, 5);
        this.p.fill(0); // Black boot
        this.p.rect(-this.width/12, this.height/3, this.width/6, this.height/10, 2);
        this.p.pop();
        
        this.p.pop();
    }
    
    moveToZone(zone) {
        this.targetX = zone.x + zone.width/2 - this.width/2;
        this.targetY = zone.y + zone.height/2 - this.height/4;
        
        // Determine diving direction and height
        const centerX = this.goal.x + this.goal.width/2;
        if (this.targetX + this.width/2 < centerX - this.goal.width/6) {
            this.divingDirection = 'left';
        } else if (this.targetX + this.width/2 > centerX + this.goal.width/6) {
            this.divingDirection = 'right';
        } else {
            this.divingDirection = 'center';
        }
        
        // Determine diving height
        const zoneIndex = this.goal.zones.indexOf(zone);
        if (zoneIndex < 3) { // Top row
            this.divingHeight = 'top';
        } else if (zoneIndex >= 6) { // Bottom row
            this.divingHeight = 'bottom';
        } else {
            this.divingHeight = 'middle';
        }
        
        // Reset diving timer
        this.divingTimer = 0;
        
        // Set state to diving
        this.state = 'diving';
        
        return new Animation(
            this, 
            { x: this.x, y: this.y }, 
            { x: this.targetX, y: this.targetY }, 
            CONFIG.GOALKEEPER_ANIMATION_DURATION,
            this.p
        );
    }
    
    predictShot(gameState, ball) {
        // Goalkeeper AI - decides where to move based on player's shot
        // Higher power shots are harder to save
        const difficultyFactor = gameState.power / 100;
        const randomFactor = this.p.random();
        
        // Calculate where the ball will likely end up based on angle
        const angle = this.p.radians(gameState.angle);
        const distance = gameState.power * 4;
        const targetX = ball.originalX + Math.cos(angle) * distance;
        const targetY = ball.originalY + Math.sin(angle) * distance;
        
        // Find the closest zone to the predicted landing spot
        let closestZone = this.goal.zones[4]; // Default to middle-center
        let closestDistance = Number.MAX_VALUE;
        
        this.goal.zones.forEach(zone => {
            const zoneX = zone.x + zone.width/2;
            const zoneY = zone.y + zone.height/2;
            const dist = this.p.dist(targetX, targetY, zoneX, zoneY);
            
            if (dist < closestDistance) {
                closestDistance = dist;
                closestZone = zone;
            }
        });
        
        // Adjust difficulty based on power and goalkeeper skill
        const adjustedDifficulty = this.difficulty * (1 - difficultyFactor * 0.5);
        
        // If random factor is less than difficulty, goalkeeper moves to a different zone
        if (randomFactor < adjustedDifficulty) {
            // Goalkeeper guesses correctly
            return closestZone;
        } else {
            // Goalkeeper guesses wrong - pick a different zone
            // For more realism, pick a zone that's close to the correct one
            const zones = this.goal.zones.filter(z => z !== closestZone);
            
            // Sort zones by distance to the correct zone
            zones.sort((a, b) => {
                const aX = a.x + a.width/2;
                const aY = a.y + a.height/2;
                const bX = b.x + b.width/2;
                const bY = b.y + b.height/2;
                const closestX = closestZone.x + closestZone.width/2;
                const closestY = closestZone.y + closestZone.height/2;
                
                const distA = this.p.dist(aX, aY, closestX, closestY);
                const distB = this.p.dist(bX, bY, closestX, closestY);
                
                return distA - distB;
            });
            
            // Pick one of the closest zones (more realistic than completely random)
            return zones[Math.floor(this.p.random(Math.min(3, zones.length)))];
        }
    }
    
    setDifficulty(level) {
        switch(level) {
            case 'easy':
                this.difficulty = CONFIG.GOALKEEPER_DIFFICULTY_EASY;
                break;
            case 'medium':
                this.difficulty = CONFIG.GOALKEEPER_DIFFICULTY_MEDIUM;
                break;
            case 'hard':
                this.difficulty = CONFIG.GOALKEEPER_DIFFICULTY_HARD;
                break;
            default:
                this.difficulty = CONFIG.GOALKEEPER_DIFFICULTY_MEDIUM;
        }
    }
    
    reset(goal) {
        this.x = this.targetX = (goal.x + goal.width/2) - this.width/2;
        this.y = this.targetY = goal.y + goal.height/2 - this.height/4;
        this.state = 'ready';
        this.resetLimbs();
    }
    
    celebrate() {
        this.state = 'celebrating';
        this.celebrationTimer = 0;
    }
    
    showDisappointment() {
        this.state = 'disappointed';
    }
    
    update() {
        // Update animations based on state
        if (this.state === 'diving') {
            // Already handled in drawDiving
        } else if (this.state === 'celebrating') {
            // Already handled in drawCelebrating
        }
    }
} 