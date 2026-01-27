/**
 * Menu System
 */

import { GameState } from '../core/state.js';

class MenuSystem {
  showMain(onStart) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'menu';
    menu.id = 'main-menu';
    
    menu.innerHTML = `
      <h1>PÁ PÁ PÁ</h1>
      <h2>THE MASK GAME</h2>
      <button id="start-btn">COMEÇAR</button>
      <p style="margin-top: 20px; font-size: 14px;">
        CONTROLES:<br>
        WASD - Mover | Mouse - Mirar | Click - Atirar<br>
        ESPAÇO - Dash | Q - Confusão (após Datamask)
      </p>
      <p style="margin-top: 10px; font-size: 12px; color: #888;">
        5 ARENAS • 5 BOSSES • 5 MÁSCARAS<br>
        Derrote bosses para ganhar máscaras!<br>
        Os poderes das máscaras SE ACUMULAM!
      </p>
    `;
    
    container.appendChild(menu);
    
    document.getElementById('start-btn').addEventListener('click', () => {
      this.hideAll();
      onStart();
    });
  }
  
  showGameOver(onRestart, onMenu) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'game-end';
    menu.id = 'game-over';
    
    menu.innerHTML = `
      <h2>GAME OVER</h2>
      <p>O público desistiu!</p>
      <div class="score">SCORE: ${GameState.score}</div>
      <button id="restart-btn">TENTAR NOVAMENTE</button>
      <button id="menu-btn">MENU</button>
    `;
    
    container.appendChild(menu);
    
    document.getElementById('restart-btn').addEventListener('click', () => {
      this.hideAll();
      onRestart();
    });
    
    document.getElementById('menu-btn').addEventListener('click', () => {
      onMenu();
    });
  }
  
  showVictory(onRestart, onMenu) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'game-end victory';
    menu.id = 'victory';
    
    menu.innerHTML = `
      <h2>VITÓRIA!</h2>
      <p>Você conquistou o público!</p>
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
      onMenu();
    });
  }
  
  hideAll() {
    ['main-menu', 'game-over', 'victory', 'boss-intro', 'boss-defeated'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }
}

export const Menu = new MenuSystem();
