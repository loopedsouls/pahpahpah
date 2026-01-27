/**
 * Boss Entity
 */

import { ENEMY_TYPES } from '../core/config.js';
import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';
import { getBossStats } from '../data/bosses.js';
import { getArenaById } from '../data/arenas.js';
import { clamp, distance } from '../utils/math.js';
import { Projectile } from './projectile.js';
import { Enemy } from './enemy.js';

export class Boss {
  constructor(x, y, bossType, stats, color) {
    this.x = x;
    this.y = y;
    this.hp = stats.hp;
    this.maxHp = stats.hp;
    this.speed = stats.speed;
    this.size = stats.size;
    this.bossType = bossType;
    this.attackPattern = stats.attack || bossType;
    this.color = color;
    this.active = true;
    
    this.patternTimer = 0;
    this.phaseTimer = 0;
    this.shootCooldown = 0;
    
    // Dash attack state
    this.dashing = false;
    this.dashTarget = null;
    this.dashFrames = 0;
  }
  
  update(player, projectiles, enemies) {
    if (!this.active) return;
    
    this.phaseTimer++;
    this.patternTimer++;
    
    const speedMult = 1;
    
    // Keep in bounds
    this.x = clamp(this.x, this.size, Renderer.width - this.size);
    this.y = clamp(this.y, this.size, Renderer.height - this.size);
    
    const playerX = player.x;
    const playerY = player.y;
    
    // Move towards center if too far
    const centerDist = distance(this.x, this.y, Renderer.width/2, Renderer.height/2);
    if (centerDist > 400) {
      const toCenterX = Renderer.width/2 - this.x;
      const toCenterY = Renderer.height/2 - this.y;
      const toCenterDist = Math.sqrt(toCenterX*toCenterX + toCenterY*toCenterY);
      this.x += (toCenterX / toCenterDist) * this.speed * 0.5 * speedMult;
      this.y += (toCenterY / toCenterDist) * this.speed * 0.5 * speedMult;
    }
    
    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = distance(this.x, this.y, playerX, playerY);
    
    // Execute attack pattern
    this.executePattern(playerX, playerY, dx, dy, dist, speedMult, projectiles, enemies);
    
    return false;
  }
  
  executePattern(playerX, playerY, dx, dy, dist, speedMult, projectiles, enemies) {
    switch(this.attackPattern) {
      case 'aoe':
        this.patternAOE(dx, dy, dist, speedMult, projectiles);
        break;
      case 'dash':
        this.patternDash(playerX, playerY, dx, dy, dist, speedMult);
        break;
      case 'confusion':
        this.patternConfusion(enemies);
        break;
      case 'heal':
        this.patternHeal(dx, dy, dist, speedMult, projectiles);
        break;
      case 'slow':
        this.patternSlow(projectiles);
        break;
    }
  }
  
  patternAOE(dx, dy, dist, speedMult, projectiles) {
    if (this.patternTimer % 90 === 0) {
      for (let i = 0; i < 8; i++) {
        const angle = (Math.PI * 2 / 8) * i;
        projectiles.add(new Projectile(
          this.x, this.y,
          Math.cos(angle) * 8,
          Math.sin(angle) * 8,
          false
        ));
      }
    }
    if (dist > 200) {
      this.x += (dx / dist) * this.speed * 0.5 * speedMult;
      this.y += (dy / dist) * this.speed * 0.5 * speedMult;
    }
  }
  
  patternDash(playerX, playerY, dx, dy, dist, speedMult) {
    if (this.patternTimer % 120 === 0) {
      this.dashTarget = { x: playerX, y: playerY };
      this.dashing = true;
      this.dashFrames = 30;
    }
    
    if (this.dashing && this.dashFrames > 0) {
      const dashDx = this.dashTarget.x - this.x;
      const dashDy = this.dashTarget.y - this.y;
      const dashDist = Math.sqrt(dashDx*dashDx + dashDy*dashDy);
      if (dashDist > 20) {
        this.x += (dashDx / dashDist) * 15 * speedMult;
        this.y += (dashDy / dashDist) * 15 * speedMult;
      }
      this.dashFrames--;
      if (this.dashFrames <= 0) this.dashing = false;
    } else {
      const angle = Math.atan2(dy, dx) + 0.02;
      this.x = playerX - Math.cos(angle) * 300;
      this.y = playerY - Math.sin(angle) * 300;
    }
  }
  
  patternConfusion(enemies) {
    if (this.patternTimer % 150 === 0) {
      for (let i = 0; i < 3; i++) {
        const angle = Math.random() * Math.PI * 2;
        const spawnDist = 150;
        enemies.add(new Enemy(
          this.x + Math.cos(angle) * spawnDist,
          this.y + Math.sin(angle) * spawnDist,
          this.color
        ));
      }
    }
    
    if (this.patternTimer % 180 === 0) {
      this.x = Math.random() * (Renderer.width - 200) + 100;
      this.y = Math.random() * (Renderer.height - 200) + 100;
    }
  }
  
  patternHeal(dx, dy, dist, speedMult, projectiles) {
    if (this.patternTimer % 60 === 0 && dist < 500) {
      const angle = Math.atan2(dy, dx);
      projectiles.add(new Projectile(
        this.x, this.y,
        Math.cos(angle) * 10,
        Math.sin(angle) * 10,
        false
      ));
    }
    
    if (this.patternTimer % 180 === 0 && this.hp < this.maxHp) {
      this.hp = Math.min(this.maxHp, this.hp + 1);
    }
    
    if (dist < 300) {
      this.x -= (dx / dist) * this.speed * speedMult;
      this.y -= (dy / dist) * this.speed * speedMult;
    } else if (dist > 400) {
      this.x += (dx / dist) * this.speed * 0.5 * speedMult;
      this.y += (dy / dist) * this.speed * 0.5 * speedMult;
    }
  }
  
  patternSlow(projectiles) {
    if (this.patternTimer % 120 === 0) {
      for (let i = 0; i < 12; i++) {
        const angle = (Math.PI * 2 / 12) * i + this.phaseTimer * 0.1;
        projectiles.add(new Projectile(
          this.x, this.y,
          Math.cos(angle) * 6,
          Math.sin(angle) * 6,
          false
        ));
      }
    }
    
    const t = this.phaseTimer * 0.02;
    this.x = Renderer.width/2 + Math.sin(t) * 300;
    this.y = Renderer.height/2 + Math.sin(t * 2) * 150;
  }
  
  takeDamage(amount) {
    this.hp -= amount;
    return this.hp <= 0;
  }
  
  draw(renderer) {
    const bossImg = Assets.get(this.bossType === 'aoe' ? 'boss-bitmask' : 
                               this.bossType === 'dash' ? 'boss-alphamask' :
                               this.bossType === 'confusion' ? 'boss-datamask' :
                               this.bossType === 'heal' ? 'boss-surgical' :
                               'boss-shader');
    
    if (bossImg && bossImg.complete) {
      renderer.save();
      renderer.ctx.shadowColor = this.color;
      renderer.ctx.shadowBlur = 20;
      renderer.drawImage(bossImg, this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
      renderer.restore();
    } else {
      renderer.drawCircle(this.x, this.y, this.size, this.color);
    }
    
    // Boss HP bar
    const barWidth = this.size * 3;
    const hpPercent = this.hp / this.maxHp;
    renderer.drawRect(this.x - barWidth/2, this.y - this.size - 20, barWidth, 12, '#000000');
    const hpColor = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
    renderer.drawRect(this.x - barWidth/2 + 2, this.y - this.size - 18, (barWidth - 4) * hpPercent, 8, hpColor);
  }
}
