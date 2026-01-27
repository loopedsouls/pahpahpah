/**
 * Particle Entity and System
 */

import { Renderer } from '../core/renderer.js';

export class Particle {
  constructor(x, y, vx, vy, size, life, color) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.life = life;
    this.maxLife = life;
    this.color = color;
    this.active = true;
  }
  
  update(dt = 1) {
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.life--;
    
    if (this.life <= 0) {
      this.active = false;
    }
  }
  
  draw(renderer) {
    const r = renderer || Renderer;
    r.setAlpha(this.life / this.maxLife);
    r.drawCircle(this.x, this.y, this.size, this.color);
    r.resetAlpha();
  }
}

export function createHitParticle(manager, x, y) {
  for (let i = 0; i < 8; i++) {
    manager.add(new Particle(
      x, y,
      (Math.random() - 0.5) * 8,
      (Math.random() - 0.5) * 8,
      4 + Math.random() * 4,
      20,
      '#fffacd'
    ));
  }
}

export function createDeathExplosion(manager, x, y, color = '#ff6060') {
  for (let i = 0; i < 15; i++) {
    manager.add(new Particle(
      x, y,
      (Math.random() - 0.5) * 12,
      (Math.random() - 0.5) * 12,
      6 + Math.random() * 6,
      30,
      color
    ));
  }
}

export function createDashTrail(manager, x, y) {
  manager.add(new Particle(
    x, y,
    0, 0,
    15,
    15,
    'rgba(64, 128, 255, 0.5)'
  ));
}

export function createBossDeathExplosion(manager, x, y, color) {
  for (let i = 0; i < 40; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 15 + 5;
    manager.add(new Particle(
      x, y,
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      10 + Math.random() * 10,
      50,
      color
    ));
  }
}
