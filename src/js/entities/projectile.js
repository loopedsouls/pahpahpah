/**
 * Projectile Entity
 */

import { CONFIG } from '../core/config.js';
import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';

export class Projectile {
  constructor(x, y, vx, vy, isPlayerOwned = true) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.isPlayerOwned = isPlayerOwned;
    this.size = isPlayerOwned ? 10 : 8;
    this.damage = 1;
    this.active = true;
  }
  
  update(dt = 1, speedMult = 1) {
    this.x += this.vx * dt * speedMult;
    this.y += this.vy * dt * speedMult;
  }
  
  draw(renderer) {
    const r = renderer || Renderer;
    
    if (Assets.isReady('pie') && this.isPlayerOwned) {
      r.save();
      r.drawImage(
        Assets.get('pie'), 
        this.x - this.size, 
        this.y - this.size, 
        this.size * 2, 
        this.size * 2
      );
      r.restore();
    } else {
      r.drawCircle(
        this.x, 
        this.y, 
        this.size, 
        this.isPlayerOwned ? '#fffacd' : '#ff6060'
      );
    }
  }
}
