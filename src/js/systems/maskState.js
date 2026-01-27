/**
 * Mask State System
 */

import { CONFIG } from '../core/config.js';
import { Player } from '../entities/player.js';
import { Input } from '../core/input.js';

class MaskStateSystem {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.hitCounter = 0;
    this.confusionCooldown = 0;
    this.isInvincible = false;
    this.invincibleTimer = 0;
    this.slowMotionActive = false;
  }
  
  update() {
    // Update invincibility timer
    if (this.invincibleTimer > 0) {
      this.invincibleTimer--;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
      }
    }
    
    // Update confusion cooldown
    if (this.confusionCooldown > 0) {
      this.confusionCooldown--;
    }
    
    // Slow motion when has shader mask and shooting
    if (Player.hasMask('shader') && Input.isShooting()) {
      this.slowMotionActive = true;
    } else {
      this.slowMotionActive = false;
    }
  }
  
  activateInvincibility() {
    this.isInvincible = true;
    this.invincibleTimer = CONFIG.TIMERS.INVINCIBLE;
  }
  
  canUseConfusion() {
    return Player.hasMask('datamask') && this.confusionCooldown <= 0;
  }
  
  useConfusion() {
    this.confusionCooldown = CONFIG.TIMERS.CONFUSION_COOLDOWN;
  }
  
  registerHit() {
    if (Player.hasMask('surgical')) {
      this.hitCounter++;
      if (this.hitCounter >= 5) {
        this.hitCounter = 0;
        return true; // Should heal
      }
    }
    return false;
  }
  
  getSpeedMultiplier() {
    return this.slowMotionActive ? 0.5 : 1;
  }
}

export const MaskState = new MaskStateSystem();
