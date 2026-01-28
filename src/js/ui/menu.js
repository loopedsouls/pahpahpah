/**
 * Menu System
 */

import { GameState } from '../core/state.js';
import { Credits } from '../systems/credits.js';
import { SaveSystem } from '../systems/saveSystem.js';

class MenuSystem {
  showMain(onStart) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'main-menu';
    
    const highScore = SaveSystem.getHighScore();
    const unlockedCount = SaveSystem.getUnlockedCount();
    
    menu.innerHTML = `
      <h1>PÁ PÁ PÁ</h1>
      <h2>THE MASK GAME</h2>
      <div class="menu-credits">CRÉDITOS: <span id="menu-credits">${Credits.getCredits()}</span></div>
      <button id="start-btn">COMEÇAR</button>
      <p style="margin-top: 20px; font-size: 14px;">
        CONTROLES:<br>
        WASD - Mover | Mouse - Mirar | Click - Atirar<br>
        ESPAÇO - Dash | Q - Confusão (após Datamask)
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #888;">
        5 ARENAS • 5 BOSSES • 5 MÁSCARAS<br>
        Derrote bosses para desbloqueá-los como jogáveis!<br>
        <span style="color: #ffd700;">PERSONAGENS DESBLOQUEADOS: ${unlockedCount + 1}/6</span>
      </p>
      ${highScore > 0 ? `<p style="margin-top: 10px; color: #0ff;">HIGH SCORE: ${highScore}</p>` : ''}
      <p style="margin-top: 15px; font-size: 12px; color: #ffd700; animation: blink 1s infinite;">
        PRESSIONE C PARA INSERIR MOEDA
      </p>
    `;
    
    container.appendChild(menu);
    
    document.getElementById('start-btn').addEventListener('click', () => {
      this.hideAll();
      onStart();
    });
    
    // Credit key handler
    this.creditHandler = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        Credits.addCredit();
        const creditsSpan = document.getElementById('menu-credits');
        if (creditsSpan) creditsSpan.textContent = Credits.getCredits();
      }
    };
    document.addEventListener('keydown', this.creditHandler);
  }
  
  showGameOver(onRestart, onMenu, onBossFight = null, lastBossArena = -1) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'game-end';
    menu.id = 'game-over';
    
    const hasCredits = Credits.hasCredits();
    SaveSystem.updateHighScore(GameState.score);
    
    // Check if player has unlocked any boss to retry boss fight
    const canRetryBoss = lastBossArena >= 0 && SaveSystem.isBossUnlocked(this.getBossMaskFromArena(lastBossArena));
    
    menu.innerHTML = `
      <h2>GAME OVER</h2>
      <p>O público desistiu!</p>
      <div class="score">SCORE: ${GameState.score}</div>
      <div class="credits-remaining">CRÉDITOS: ${Credits.getCredits()}</div>
      ${hasCredits ? 
        '<button id="continue-btn">CONTINUAR (1 CRÉDITO)</button>' : 
        '<p style="color: #f00; margin: 20px 0;">SEM CRÉDITOS!</p>'
      }
      ${canRetryBoss && hasCredits && onBossFight ? 
        '<button id="bossfight-btn" style="background: #ff4400;">BOSS FIGHT (1 CRÉDITO)</button>' : 
        ''
      }
      <button id="menu-btn">MENU</button>
      <p style="margin-top: 15px; font-size: 12px; color: #ffd700;">
        PRESSIONE C PARA INSERIR MOEDA
      </p>
    `;
    
    container.appendChild(menu);
    
    if (hasCredits) {
      document.getElementById('continue-btn').addEventListener('click', () => {
        if (Credits.useCredit()) {
          this.hideAll();
          onRestart();
        }
      });
    }
    
    const bossFightBtn = document.getElementById('bossfight-btn');
    if (bossFightBtn && onBossFight) {
      bossFightBtn.addEventListener('click', () => {
        if (Credits.useCredit()) {
          this.hideAll();
          onBossFight();
        }
      });
    }
    
    document.getElementById('menu-btn').addEventListener('click', () => {
      this.hideAll();
      onMenu();
    });
    
    // Credit key handler
    this.creditHandler = (e) => {
      if (e.key === 'c' || e.key === 'C') {
        Credits.addCredit();
        this.hideAll();
        this.showGameOver(onRestart, onMenu, onBossFight, lastBossArena);
      }
    };
    document.addEventListener('keydown', this.creditHandler);
  }
  
  getBossMaskFromArena(arenaIndex) {
    const masks = ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];
    return masks[arenaIndex] || null;
  }
  
  showVictory(onRestart, onMenu) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'game-end victory';
    menu.id = 'victory';
    
    const isNewHighScore = SaveSystem.updateHighScore(GameState.score);
    
    menu.innerHTML = `
      <h2>VITÓRIA!</h2>
      <p>Você conquistou o público!</p>
      ${isNewHighScore ? '<p style="color: #ffd700; font-size: 24px;">★ NOVO HIGH SCORE! ★</p>' : ''}
      <div class="score">SCORE: ${GameState.score}</div>
      <button id="restart-btn">JOGAR NOVAMENTE</button>
      <button id="menu-btn">MENU</button>
    `;
    
    container.appendChild(menu);
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.hideAll();
      onRestart();
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
      this.hideAll();
      onMenu();
    });
  }
  
  hideAll() {
    if (this.creditHandler) {
      document.removeEventListener('keydown', this.creditHandler);
      this.creditHandler = null;
    }
    ['main-menu', 'game-over', 'victory', 'boss-intro', 'boss-defeated', 'character-select'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }
}

export const Menu = new MenuSystem();
