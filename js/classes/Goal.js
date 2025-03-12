// Goal class for the game
import CONFIG from '../config.js';

export default class Goal {
    constructor(p) {
        this.p = p;
        this.width = p.width * CONFIG.GOAL_WIDTH_RATIO;
        this.height = p.height * CONFIG.GOAL_HEIGHT_RATIO;
        this.x = p.width/2 - this.width/2;
        this.y = p.height * CONFIG.GOAL_Y_POSITION_RATIO;
        this.postWidth = CONFIG.GOAL_POST_WIDTH;
        this.goalColor = p.color(255, 255, 255);
        this.goalPostColor = p.color(200, 200, 200);
        
        // Define goal zones (9 zones in a 3x3 grid)
        this.zones = [];
        const zoneWidth = this.width / 3;
        const zoneHeight = this.height / 3;
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                this.zones.push({
                    x: this.x + col * zoneWidth,
                    y: this.y + row * zoneHeight,
                    width: zoneWidth,
                    height: zoneHeight,
                    direction: this.getDirectionFromPosition(row, col)
                });
            }
        }
    }
    
    display() {
        // Draw goal net
        this.p.fill(this.goalColor);
        this.p.stroke(150);
        this.p.strokeWeight(1);
        this.p.rect(this.x, this.y, this.width, this.height);
        
        // Draw goal posts
        this.p.fill(this.goalPostColor);
        this.p.noStroke();
        // Left post
        this.p.rect(this.x - this.postWidth/2, this.y - this.postWidth/2, this.postWidth, this.height + this.postWidth);
        // Right post
        this.p.rect(this.x + this.width - this.postWidth/2, this.y - this.postWidth/2, this.postWidth, this.height + this.postWidth);
        // Crossbar
        this.p.rect(this.x - this.postWidth/2, this.y - this.postWidth/2, this.width + this.postWidth, this.postWidth);
        
        // Draw net lines
        this.p.stroke(200);
        this.p.strokeWeight(1);
        
        // Vertical lines
        for (let i = 1; i < 3; i++) {
            const x = this.x + (this.width / 3) * i;
            this.p.line(x, this.y, x, this.y + this.height);
        }
        
        // Horizontal lines
        for (let i = 1; i < 3; i++) {
            const y = this.y + (this.height / 3) * i;
            this.p.line(this.x, y, this.x + this.width, y);
        }
    }
    
    // Helper function to get direction name from position
    getDirectionFromPosition(row, col) {
        const rowNames = ['top', 'middle', 'bottom'];
        const colNames = ['left', 'center', 'right'];
        return `${rowNames[row]}-${colNames[col]}`;
    }
} 