/**
 * Game State Management
 */

import { CONFIG, GAME_STATES } from './config.js';

class GameStateManager {
  constructor() {
    this.reset();
  }
  
  reset() {
    this.state = GAME_STATES.MENU;
    this.score = 0;
    this.wave = 1;
    this.maxWaves = CONFIG.MAX_WAVES_PER_ARENA;
    this.enemiesKilled = 0;
    this.arenaTimer = 0;
    this.currentArena = 0;
    this.bossActive = false;
    this.bossIntroTimer = 0;
    this.bossDefeatedTimer = 0;
    this.lastTime = 0;
  }
  
  setState(newState) {
    this.state = newState;
  }
  
  isPlaying() {
    return this.state === GAME_STATES.PLAYING;
  }
  
  isPaused() {
    return this.state === GAME_STATES.PAUSED;
  }
  
  togglePause() {
    if (this.state === GAME_STATES.PLAYING) {
      this.state = GAME_STATES.PAUSED;
    } else if (this.state === GAME_STATES.PAUSED) {
      this.state = GAME_STATES.PLAYING;
    }
  }
  
  nextWave() {
    this.wave++;
    this.arenaTimer = 0;
  }
  
  nextArena() {
    this.currentArena++;
    this.wave = 1;
    this.arenaTimer = 0;
  }
  
  addScore(points) {
    this.score += points;
  }
  
  addKill() {
    this.enemiesKilled++;
  }
}

export const GameState = new GameStateManager();
