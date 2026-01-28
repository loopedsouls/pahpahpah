/**
 * Save System - Cookie/LocalStorage persistence
 */

const SAVE_KEY = 'papapapa_save';

class SaveSystemManager {
  constructor() {
    this.data = {
      unlockedBosses: [],
      highScore: 0,
      totalCreditsUsed: 0,
      gamesPlayed: 0
    };
    this.load();
  }
  
  load() {
    try {
      const saved = localStorage.getItem(SAVE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.data = { ...this.data, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load save:', e);
    }
    return this.data;
  }
  
  save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(this.data));
    } catch (e) {
      console.warn('Failed to save:', e);
    }
  }
  
  unlockBoss(bossId) {
    if (!this.data.unlockedBosses.includes(bossId)) {
      this.data.unlockedBosses.push(bossId);
      this.save();
    }
  }
  
  isBossUnlocked(bossId) {
    return this.data.unlockedBosses.includes(bossId);
  }
  
  getUnlockedBosses() {
    return [...this.data.unlockedBosses];
  }
  
  getUnlockedCount() {
    return this.data.unlockedBosses.length;
  }
  
  updateHighScore(score) {
    if (score > this.data.highScore) {
      this.data.highScore = score;
      this.save();
      return true;
    }
    return false;
  }
  
  getHighScore() {
    return this.data.highScore;
  }
  
  incrementGamesPlayed() {
    this.data.gamesPlayed++;
    this.save();
  }
  
  addCreditsUsed(amount) {
    this.data.totalCreditsUsed += amount;
    this.save();
  }
  
  resetProgress() {
    this.data = {
      unlockedBosses: [],
      highScore: 0,
      totalCreditsUsed: 0,
      gamesPlayed: 0
    };
    this.save();
  }
  
  getStats() {
    return { ...this.data };
  }
}

export const SaveSystem = new SaveSystemManager();
