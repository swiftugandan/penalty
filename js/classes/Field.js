// Field class for the game
import CONFIG from '../config.js';

export default class Field {
    constructor(p) {
        this.p = p;
        this.grassColor = p.color(34, 139, 34); // Forest green
        this.lineColor = p.color(255, 255, 255, 50); // Semi-transparent white
    }
    
    display() {
        this.p.push();
        
        // Draw base grass color
        this.p.background(this.grassColor);
        
        // Draw perspective grid
        this.p.stroke(this.lineColor);
        this.p.strokeWeight(1);
        
        // Vertical lines with perspective
        const numVerticalLines = 20;
        for (let i = 0; i <= numVerticalLines; i++) {
            const x = (i / numVerticalLines) * this.p.width;
            // Start point at bottom
            const startX = x;
            const startY = this.p.height;
            // End point with perspective (converging towards center-top)
            const endX = this.p.width/2 + (x - this.p.width/2) * 0.3;
            const endY = 0;
            
            this.p.line(startX, startY, endX, endY);
        }
        
        // Horizontal lines with perspective
        const numHorizontalLines = 15;
        for (let i = 0; i <= numHorizontalLines; i++) {
            // Use exponential scale for more realistic perspective
            const t = i / numHorizontalLines;
            const y = this.p.height - (this.p.height * Math.pow(t, 1.5));
            
            // Calculate width reduction for perspective
            const widthReduction = t * 0.7; // Lines get narrower towards the top
            const startX = this.p.width/2 * widthReduction;
            const endX = this.p.width - (this.p.width/2 * widthReduction);
            
            this.p.line(startX, y, endX, y);
        }
        
        // Add subtle gradient overlay for depth
        this.p.push();
        this.p.noStroke();
        for (let y = 0; y < this.p.height; y++) {
            const alpha = this.p.map(y, 0, this.p.height, 60, 0);
            this.p.fill(0, 0, 0, alpha);
            this.p.rect(0, y, this.p.width, 1);
        }
        this.p.pop();
        
        // Add subtle grass texture
        this.p.stroke(255, 255, 255, 15);
        this.p.strokeWeight(1);
        for (let i = 0; i < 200; i++) {
            const x = this.p.random(this.p.width);
            const y = this.p.random(this.p.height);
            const len = this.p.random(5, 15);
            const angle = this.p.random(-0.2, 0.2); // Slight random angle for grass
            
            this.p.push();
            this.p.translate(x, y);
            this.p.rotate(angle);
            this.p.line(0, 0, 0, len);
            this.p.pop();
        }
        
        this.p.pop();
    }
} 