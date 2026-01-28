/**
 * Player Entity
 */

import { CONFIG } from '../core/config.js';
import { Input } from '../core/input.js';
import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';
import { MASK_EFFECTS } from '../data/masks.js';
import { angle, clamp } from '../utils/math.js';

class PlayerEntity {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.x = CONFIG.BASE_WIDTH / 2;
    this.y = CONFIG.BASE_HEIGHT / 2;
    this.size = CONFIG.PLAYER.SIZE;
    this.speed = CONFIG.PLAYER.SPEED;
    this.hp = CONFIG.PLAYER.HP;
    this.maxHp = CONFIG.PLAYER.HP;
    this.angle = 0;
    this.color = '#4080ff';
    this.characterId = 'player';
    
    this.shootCooldown = 0;
    this.shootDelay = CONFIG.PLAYER.SHOOT_DELAY;
    this.dashCooldown = 0;
    this.dashDelay = CONFIG.PLAYER.DASH_DELAY;
    this.dashDistance = CONFIG.PLAYER.DASH_DISTANCE;
    
    this.isDashing = false;
    this.dashTimer = 0;
    this.dashVelX = 0;
    this.dashVelY = 0;
    this.invincibleTimer = 0;
    
    this.masks = [];
    this.activeMask = null;
  }
  
  hasMask(maskType) {
    return this.masks.includes(maskType);
  }
  
  addMask(maskType) {
    if (!this.hasMask(maskType)) {
      this.masks.push(maskType);
      if (this.activeMask === null) {
        this.activeMask = 0;
      }
    }
  }
  
  applyMaskBonuses() {
    // Reset to base stats
    this.speed = CONFIG.PLAYER.SPEED;
    this.shootDelay = CONFIG.PLAYER.SHOOT_DELAY;
    this.dashDelay = CONFIG.PLAYER.DASH_DELAY;
    this.maxHp = CONFIG.PLAYER.HP;
    this.dashDistance = CONFIG.PLAYER.DASH_DISTANCE;
    
    // Apply stacking bonuses from all collected masks
    this.masks.forEach(maskType => {
      const effect = MASK_EFFECTS[maskType];
      if (effect && effect.bonuses) {
        if (effect.bonuses.speed) this.speed += effect.bonuses.speed;
        if (effect.bonuses.shootDelay) this.shootDelay += effect.bonuses.shootDelay;
        if (effect.bonuses.maxHp) this.maxHp += effect.bonuses.maxHp;
        if (effect.bonuses.dashDistance) this.dashDistance += effect.bonuses.dashDistance;
      }
    });
    
    // Ensure HP doesn't exceed maxHp
    this.hp = Math.min(this.hp, this.maxHp);
  }
  
  update(speedMultiplier = 1) {
    this.applyMaskBonuses();
    
    // Movement
    let dx = 0, dy = 0;
    if (Input.isMovingRight()) dx += 1;
    if (Input.isMovingLeft()) dx -= 1;
    if (Input.isMovingDown()) dy += 1;
    if (Input.isMovingUp()) dy -= 1;
    
    if (dx !== 0 || dy !== 0) {
      const length = Math.sqrt(dx * dx + dy * dy);
      this.x += (dx / length) * this.speed * speedMultiplier;
      this.y += (dy / length) * this.speed * speedMultiplier;
    }
    
    // Keep in bounds
    this.x = clamp(this.x, this.size, Renderer.width - this.size);
    this.y = clamp(this.y, this.size, Renderer.height - this.size);
    
    // Aim towards mouse
    const mouse = Input.getMousePosition();
    this.angle = angle(this.x, this.y, mouse.x, mouse.y);
    
    // Cooldowns
    if (this.shootCooldown > 0) this.shootCooldown--;
    if (this.dashCooldown > 0) this.dashCooldown--;
  }
  
  canShoot() {
    return Input.isShooting() && this.shootCooldown === 0;
  }
  
  canDash() {
    return Input.isDashing() && this.dashCooldown === 0;
  }
  
  dash() {
    this.x += Math.cos(this.angle) * this.dashDistance;
    this.y += Math.sin(this.angle) * this.dashDistance;
    this.dashCooldown = this.dashDelay;
    
    // Keep in bounds after dash
    this.x = clamp(this.x, this.size, Renderer.width - this.size);
    this.y = clamp(this.y, this.size, Renderer.height - this.size);
  }
  
  shoot() {
    this.shootCooldown = this.shootDelay;
  }
  
  takeDamage(amount = 1) {
    this.hp -= amount;
    return this.hp <= 0;
  }
  
  heal(amount = 1) {
    this.hp = Math.min(this.hp, this.maxHp, this.hp + amount);
  }
  
  fullHeal() {
    this.hp = this.maxHp;
  }
  
  getDamage() {
    // Bonus damage based on masks collected
    return 1 + Math.floor(this.masks.length / 2);
  }
  
  draw() {
    Renderer.save();
    Renderer.translate(this.x, this.y);
    Renderer.rotate(this.angle);
    
    // If playing as a boss, use boss sprite
    const isBossCharacter = this.characterId !== 'player';
    const spriteKey = isBossCharacter ? `boss-${this.characterId}` : 'player';
    const img = Assets.get(spriteKey);
    
    if (img && img.complete) {
      Renderer.drawImage(img, -this.size, -this.size, this.size * 2, this.size * 2);
    } else {
      Renderer.drawCircle(0, 0, this.size, this.color);
    }
    
    // Draw active mask on player's face (only for main character)
    if (!isBossCharacter && this.activeMask !== null && this.masks[this.activeMask]) {
      const maskImg = Assets.get(this.masks[this.activeMask]);
      if (maskImg && maskImg.complete) {
        const maskSize = this.size * 0.8; // Smaller mask for face only
        const maskOffsetY = -this.size * 0.15; // Slightly up towards head
        Renderer.drawImage(maskImg, -maskSize / 2, maskOffsetY - maskSize / 2, maskSize, maskSize);
      }
    }
    
    Renderer.restore();
  }
}

export const Player = new PlayerEntity();
