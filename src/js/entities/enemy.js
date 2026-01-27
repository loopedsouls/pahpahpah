/**
 * Enemy Entity
 */

import { CONFIG, ENEMY_TYPES } from '../core/config.js';
import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';
import { clamp, distance, angle } from '../utils/math.js';

export class Enemy {
  constructor(x, y, color = '#ff6060') {
    this.x = x;
    this.y = y;
    this.hp = CONFIG.ENEMY.BASIC.HP;
    this.maxHp = this.hp;
    this.speed = CONFIG.ENEMY.BASIC.SPEED + Math.random();
    this.size = CONFIG.ENEMY.BASIC.SIZE;
    this.color = color;
    this.active = true;
    
    this.shootTimer = 0;
    this.shootDelay = 120 + Math.random() * 60;
    this.confused = false;
    this.confusionTimer = 0;
    this.confusedAngle = 0;
  }
  
  update(player, dt = 1, speedMultiplier = 1) {
    if (!this.active) return;
    
    // Update confusion
    if (this.confused) {
      this.confusionTimer--;
      if (this.confusionTimer <= 0) {
        this.confused = false;
      }
    }
    
    const playerX = player.x;
    const playerY = player.y;
    const dist = distance(this.x, this.y, playerX, playerY);
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    
    if (this.confused) {
      this.moveConfused(speedMultiplier * dt);
    } else {
      this.moveChase(dx, dy, dist, speedMultiplier * dt);
    }
    
    this.keepInBounds();
  }
  
  moveConfused(speedMult) {
    this.confusedAngle += (Math.random() - 0.5) * 0.3;
    this.x += Math.cos(this.confusedAngle) * this.speed * 0.5 * speedMult;
    this.y += Math.sin(this.confusedAngle) * this.speed * 0.5 * speedMult;
  }
  
  moveChase(dx, dy, dist, speedMult) {
    if (dist > 0) {
      this.x += (dx / dist) * this.speed * speedMult;
      this.y += (dy / dist) * this.speed * speedMult;
    }
  }
  
  keepInBounds() {
    this.x = clamp(this.x, this.size, Renderer.width - this.size);
    this.y = clamp(this.y, this.size, Renderer.height - this.size);
  }
  
  takeDamage(amount) {
    this.hp -= amount;
    return this.hp <= 0;
  }
  
  confuse(duration) {
    this.confused = true;
    this.confusionTimer = duration;
    this.confusedAngle = Math.random() * Math.PI * 2;
  }
  
  draw(renderer) {
    const r = renderer || Renderer;
    
    if (Assets.isReady('enemy')) {
      r.drawImage(
        Assets.get('enemy'),
        this.x - this.size,
        this.y - this.size,
        this.size * 2,
        this.size * 2
      );
    } else {
      r.drawCircle(this.x, this.y, this.size, this.color);
    }
    
    // HP bar
    if (this.hp < this.maxHp) {
      this.drawHPBar(r);
    }
    
    // Confusion indicator
    if (this.confused) {
      r.drawCircle(this.x, this.y - this.size - 15, 5, '#ff00ff');
    }
  }
  
  drawHPBar(renderer) {
    const barWidth = this.size * 2;
    const hpPercent = this.hp / this.maxHp;
    
    renderer.drawRect(this.x - barWidth/2, this.y - this.size - 8, barWidth, 4, '#000000');
    const color = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    renderer.drawRect(this.x - barWidth/2, this.y - this.size - 8, barWidth * hpPercent, 4, color);
  }
}
