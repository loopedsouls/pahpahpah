/**
 * Menu System - God of War Style
 */

import { GameState } from '../core/state.js';
import { Credits } from '../systems/credits.js';
import { SaveSystem } from '../systems/saveSystem.js';

const MENU_OPTIONS = [
  { id: 'start', text: 'COMEÇAR', sub: 'Modo História' },
  { id: 'options', text: 'OPÇÕES', sub: 'Configurações' },
  { id: 'extras', text: 'EXTRAS', sub: 'Galeria & Stats' },
  { id: 'quit', text: 'SAIR', sub: 'Fechar Jogo' }
];

class MenuSystem {
  constructor() {
    this.selectedIndex = 0;
    this.keyHandler = null;
    this.creditHandler = null;
  }
  
  showMain(onStart) {
    this.selectedIndex = 0;
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'gow-menu';
    menu.id = 'main-menu';
    
    const highScore = SaveSystem.getHighScore();
    const unlockedCount = SaveSystem.getUnlockedCount();
    
    menu.innerHTML = `
      <div class="gow-bg" style="background-image: url('assets/svg/ui/menu-gow-bg.svg');"></div>
      <div class="gow-content">
        <div class="gow-left">
          <div class="gow-title">
            <span class="gow-title-sub">THE MASK GAME</span>
            <h1>PÁ PÁ PÁ</h1>
          </div>
          
          <div class="gow-option-container">
            <div class="gow-option-main" id="option-text">${MENU_OPTIONS[0].text}</div>
            <div class="gow-option-sub" id="option-sub">${MENU_OPTIONS[0].sub}</div>
            <div class="gow-option-nav">
              <span class="gow-nav-arrow" id="nav-up">▲</span>
              <span class="gow-nav-indicator" id="nav-indicator">1 / ${MENU_OPTIONS.length}</span>
              <span class="gow-nav-arrow" id="nav-down">▼</span>
            </div>
          </div>
          
          <div class="gow-footer">
            <div class="gow-stats">
              <span>CRÉDITOS: <em id="menu-credits">${Credits.getCredits()}</em></span>
              ${highScore > 0 ? `<span>HIGH SCORE: <em>${highScore}</em></span>` : ''}
              <span>DESBLOQUEADOS: <em>${unlockedCount + 1}/6</em></span>
            </div>
            <div class="gow-controls">
              <span>↑↓ NAVEGAR</span>
              <span>ENTER SELECIONAR</span>
              <span>C INSERIR MOEDA</span>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.appendChild(menu);
    
    this.updateOptionDisplay();
    
    // Keyboard navigation
    this.keyHandler = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        this.selectedIndex = (this.selectedIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
        this.updateOptionDisplay();
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        this.selectedIndex = (this.selectedIndex + 1) % MENU_OPTIONS.length;
        this.updateOptionDisplay();
      } else if (e.key === 'Enter' || e.key === ' ') {
        this.selectOption(onStart);
      }
    };
    document.addEventListener('keydown', this.keyHandler);
    
    // Click handlers for arrows
    document.getElementById('nav-up')?.addEventListener('click', () => {
      this.selectedIndex = (this.selectedIndex - 1 + MENU_OPTIONS.length) % MENU_OPTIONS.length;
      this.updateOptionDisplay();
    });
    document.getElementById('nav-down')?.addEventListener('click', () => {
      this.selectedIndex = (this.selectedIndex + 1) % MENU_OPTIONS.length;
      this.updateOptionDisplay();
    });
    document.getElementById('option-text')?.addEventListener('click', () => {
      this.selectOption(onStart);
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
  
  updateOptionDisplay() {
    const option = MENU_OPTIONS[this.selectedIndex];
    const textEl = document.getElementById('option-text');
    const subEl = document.getElementById('option-sub');
    const indicatorEl = document.getElementById('nav-indicator');
    
    if (textEl) {
      textEl.style.opacity = '0';
      textEl.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        textEl.textContent = option.text;
        textEl.style.opacity = '1';
        textEl.style.transform = 'translateX(0)';
      }, 100);
    }
    if (subEl) {
      subEl.style.opacity = '0';
      setTimeout(() => {
        subEl.textContent = option.sub;
        subEl.style.opacity = '1';
      }, 150);
    }
    if (indicatorEl) {
      indicatorEl.textContent = `${this.selectedIndex + 1} / ${MENU_OPTIONS.length}`;
    }
  }
  
  selectOption(onStart) {
    const option = MENU_OPTIONS[this.selectedIndex];
    
    switch (option.id) {
      case 'start':
        this.hideAll();
        onStart();
        break;
      case 'options':
        this.showOptions(() => {
          this.hideAll();
          this.showMain(onStart);
        });
        break;
      case 'extras':
        this.showExtras(() => {
          this.hideAll();
          this.showMain(onStart);
        });
        break;
      case 'quit':
        if (confirm('Tem certeza que deseja sair?')) {
          window.close();
          document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#1a0a2e;color:#fff;font-family:sans-serif;"><h1>Obrigado por jogar!</h1></div>';
        }
        break;
    }
  }
  
  showOptions(onBack) {
    this.hideAll();
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'gow-menu gow-submenu';
    menu.id = 'options-menu';
    
    menu.innerHTML = `
      <div class="gow-bg" style="background-image: url('assets/svg/ui/menu-gow-bg.svg'); opacity: 0.5;"></div>
      <div class="gow-content">
        <div class="gow-left gow-left-wide">
          <div class="gow-title">
            <span class="gow-title-sub">CONFIGURAÇÕES</span>
            <h1>OPÇÕES</h1>
          </div>
          <div class="gow-options-list">
            <div class="gow-opt-item">
              <span>Volume SFX</span>
              <input type="range" min="0" max="100" value="80" disabled>
              <span class="gow-soon">Em breve</span>
            </div>
            <div class="gow-opt-item">
              <span>Volume Música</span>
              <input type="range" min="0" max="100" value="60" disabled>
              <span class="gow-soon">Em breve</span>
            </div>
            <div class="gow-opt-item">
              <span>Tela Cheia</span>
              <button class="gow-toggle" id="fullscreen-btn">ATIVAR</button>
            </div>
          </div>
          <button class="gow-back" id="back-btn">← VOLTAR</button>
        </div>
      </div>
    `;
    
    container.appendChild(menu);
    
    document.getElementById('back-btn').addEventListener('click', onBack);
    document.getElementById('fullscreen-btn').addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    });
    
    this.keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        onBack();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }
  
  showExtras(onBack) {
    this.hideAll();
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'gow-menu gow-submenu';
    menu.id = 'extras-menu';
    
    const stats = SaveSystem.getStats();
    const masks = ['BITMASK', 'ALPHAMASK', 'DATAMASK', 'SURGICAL', 'SHADER'];
    const maskIds = ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];
    
    let galleryHTML = masks.map((name, i) => {
      const unlocked = SaveSystem.isBossUnlocked(maskIds[i]);
      return `<div class="gow-gallery-item ${unlocked ? 'unlocked' : 'locked'}">
        <div class="gow-gallery-icon">${unlocked ? '★' : '?'}</div>
        <div class="gow-gallery-name">${unlocked ? name : '???'}</div>
      </div>`;
    }).join('');
    
    menu.innerHTML = `
      <div class="gow-bg" style="background-image: url('assets/svg/ui/menu-gow-bg.svg'); opacity: 0.5;"></div>
      <div class="gow-content">
        <div class="gow-left gow-left-wide">
          <div class="gow-title">
            <span class="gow-title-sub">GALERIA & ESTATÍSTICAS</span>
            <h1>EXTRAS</h1>
          </div>
          <div class="gow-extras-grid">
            <div class="gow-stats-box">
              <h3>ESTATÍSTICAS</h3>
              <div class="gow-stat">High Score: <span>${stats.highScore}</span></div>
              <div class="gow-stat">Partidas: <span>${stats.gamesPlayed}</span></div>
              <div class="gow-stat">Créditos Usados: <span>${stats.totalCreditsUsed}</span></div>
              <div class="gow-stat">Bosses Derrotados: <span>${stats.unlockedBosses.length}/5</span></div>
            </div>
            <div class="gow-gallery-box">
              <h3>MÁSCARAS</h3>
              <div class="gow-gallery-grid">${galleryHTML}</div>
            </div>
          </div>
          <button class="gow-back" id="back-btn">← VOLTAR</button>
        </div>
      </div>
    `;
    
    container.appendChild(menu);
    document.getElementById('back-btn').addEventListener('click', onBack);
    
    this.keyHandler = (e) => {
      if (e.key === 'Escape' || e.key === 'Backspace') {
        onBack();
      }
    };
    document.addEventListener('keydown', this.keyHandler);
  }
  
  showGameOver(onRestart, onMenu, onBossFight = null, lastBossArena = -1) {
    const container = document.getElementById('game-container');
    const menu = document.createElement('div');
    menu.className = 'game-end';
    menu.id = 'game-over';
    
    const hasCredits = Credits.hasCredits();
    SaveSystem.updateHighScore(GameState.score);
    
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
      <p>Você conquistou todas as máscaras!</p>
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
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
    if (this.creditHandler) {
      document.removeEventListener('keydown', this.creditHandler);
      this.creditHandler = null;
    }
    ['main-menu', 'game-over', 'victory', 'boss-intro', 'boss-defeated', 'character-select', 'options-menu', 'extras-menu'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
  }
}

export const Menu = new MenuSystem();
