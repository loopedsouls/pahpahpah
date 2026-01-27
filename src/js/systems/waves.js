/**
 * Wave System
 */

import { GameState } from '../core/state.js';

class WaveSystem {
  getEnemyCount() {
    return 5 + GameState.wave * 3 + GameState.currentArena * 2;
  }
  
  getSpawnDelay() {
    return 800; // ms between enemy spawns
  }
  
  shouldSpawnBoss() {
    return GameState.wave > GameState.maxWaves;
  }
  
  isWaveComplete(enemyCount) {
    return enemyCount === 0 && GameState.arenaTimer > 120;
  }
}

export const WaveManager = new WaveSystem();
