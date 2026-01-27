/**
 * Audience System
 */

import { CONFIG } from '../core/config.js';

class AudienceSystem {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.value = CONFIG.AUDIENCE.INITIAL;
    this.max = CONFIG.AUDIENCE.MAX;
  }
  
  update(change) {
    this.value = Math.max(0, Math.min(this.max, this.value + change));
  }
  
  onHit() {
    this.update(CONFIG.AUDIENCE.HIT_BONUS);
  }
  
  onKill() {
    this.update(CONFIG.AUDIENCE.KILL_BONUS);
  }
  
  onBossKill() {
    this.update(CONFIG.AUDIENCE.BOSS_KILL_BONUS);
  }
  
  onWaveComplete() {
    this.update(CONFIG.AUDIENCE.WAVE_COMPLETE_BONUS);
  }
  
  onMiss() {
    this.update(CONFIG.AUDIENCE.MISS_PENALTY);
  }
  
  onPlayerHit() {
    this.update(CONFIG.AUDIENCE.HIT_PENALTY);
  }
  
  onTimeDecay() {
    this.update(CONFIG.AUDIENCE.TIME_DECAY);
  }
  
  isEmpty() {
    return this.value <= 0;
  }
  
  getPercentage() {
    return (this.value / this.max) * 100;
  }
}

export const Audience = new AudienceSystem();
