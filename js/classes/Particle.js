export default class Particle {
    constructor(p, x, y, color) {
        this.p = p;
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: p.random(-5, 5),
            y: p.random(-5, 5)
        };
        this.alpha = 255;
        this.life = 1.0;
        this.decay = p.random(0.02, 0.05);
        this.size = p.random(5, 15);
    }

    update() {
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.life -= this.decay;
        this.alpha = 255 * this.life;
        this.size *= 0.95;
    }

    display() {
        this.p.push();
        this.p.noStroke();
        const c = this.p.color(this.color);
        c.setAlpha(this.alpha);
        this.p.fill(c);
        this.p.circle(this.x, this.y, this.size);
        this.p.pop();
    }

    isDead() {
        return this.life <= 0;
    }
} 