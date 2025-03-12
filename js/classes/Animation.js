// Animation classes for the game

// Base Animation class for linear movement
export class Animation {
    constructor(object, start, end, duration, p) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.duration = duration;
        this.startTime = p.millis();
        this.p = p;
    }
    
    update() {
        const elapsed = this.p.millis() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Linear interpolation
        this.object.x = this.start.x + (this.end.x - this.start.x) * progress;
        this.object.y = this.start.y + (this.end.y - this.start.y) * progress;
    }
    
    isComplete() {
        return this.p.millis() - this.startTime >= this.duration;
    }
}

// Bezier animation for curved ball movement
export class BezierAnimation {
    constructor(object, start, end, control, duration, p, goal) {
        this.object = object;
        this.start = start;
        this.end = end;
        this.control = control;
        this.duration = duration;
        this.startTime = p.millis();
        this.p = p;
        this.goal = goal;
    }
    
    update() {
        const elapsed = this.p.millis() - this.startTime;
        const progress = Math.min(elapsed / this.duration, 1);
        
        // Quadratic Bezier curve
        this.object.x = Math.pow(1 - progress, 2) * this.start.x + 
                       2 * (1 - progress) * progress * this.control.x + 
                       Math.pow(progress, 2) * this.end.x;
                       
        this.object.y = Math.pow(1 - progress, 2) * this.start.y + 
                       2 * (1 - progress) * progress * this.control.y + 
                       Math.pow(progress, 2) * this.end.y;
                       
        // Scale ball based on height to create perspective
        const normalizedHeight = 1 - (this.object.y - this.goal.y) / (this.start.y - this.goal.y);
        this.object.radius = 15 * (0.8 + normalizedHeight * 0.2);
    }
    
    isComplete() {
        return this.p.millis() - this.startTime >= this.duration;
    }
} 