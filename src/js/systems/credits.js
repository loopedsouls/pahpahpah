/**
 * Arcade Credits System
 */

import { SaveSystem } from './saveSystem.js';

class CreditsManager {
  constructor() {
    this.credits = 3;
    this.maxCredits = 9;
  }
  
  reset() {
    this.credits = 3;
  }
  
  getCredits() {
    return this.credits;
  }
  
  hasCredits() {
    return this.credits > 0;
  }
  
  useCredit() {
    if (this.credits > 0) {
      this.credits--;
      SaveSystem.addCreditsUsed(1);
      return true;
    }
    return false;
  }
  
  addCredit() {
    if (this.credits < this.maxCredits) {
      this.credits++;
      return true;
    }
    return false;
  }
  
  setCredits(amount) {
    this.credits = Math.min(Math.max(0, amount), this.maxCredits);
  }
}

export const Credits = new CreditsManager();
