import Particle from './Particle.js';

export default class Explosion {
    constructor(p, x, y) {
        this.p = p;
        this.particles = [];
        this.colors = ['#FFD700', '#FFA500', '#FF4500', '#FF6347']; // Gold, Orange, Red-Orange, Tomato
        this.createParticles(x, y);
    }

    createParticles(x, y) {
        const numParticles = 50;
        for (let i = 0; i < numParticles; i++) {
            const color = this.colors[Math.floor(this.p.random(this.colors.length))];
            this.particles.push(new Particle(this.p, x, y, color));
        }
    }

    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    display() {
        this.particles.forEach(particle => particle.display());
    }

    isComplete() {
        return this.particles.length === 0;
    }
} 