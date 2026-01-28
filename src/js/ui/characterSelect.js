/**
 * Character Selection Screen
 */

import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';
import { Input } from '../core/input.js';
import { CHARACTERS, CHARACTER_ORDER, getCharacter } from '../data/characters.js';
import { SaveSystem } from '../systems/saveSystem.js';
import { Credits } from '../systems/credits.js';

class CharacterSelectSystem {
  constructor() {
    this.selectedIndex = 0;
    this.onSelect = null;
    this.onBack = null;
    this.element = null;
    this.keyHandler = null;
  }
  
  show(onSelect, onBack) {
    this.onSelect = onSelect;
    this.onBack = onBack;
    this.selectedIndex = 0;
    
    this.createUI();
    this.bindKeys();
  }
  
  hide() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
    if (this.keyHandler) {
      document.removeEventListener('keydown', this.keyHandler);
      this.keyHandler = null;
    }
  }
  
  createUI() {
    const container = document.getElementById('game-container');
    
    this.element = document.createElement('div');
    this.element.className = 'character-select';
    this.element.id = 'character-select';
    
    this.element.innerHTML = `
      <div class="select-bg"></div>
      <div class="select-header">
        <h1>SELECIONE SEU PERSONAGEM</h1>
        <div class="credits-display">CRÉDITOS: <span id="credits-num">${Credits.getCredits()}</span></div>
      </div>
      <div class="characters-row" id="characters-row"></div>
      <div class="character-info" id="character-info"></div>
      <div class="select-footer">
        <span>← → SELECIONAR</span>
        <span>ENTER CONFIRMAR</span>
        <span>ESC VOLTAR</span>
        <span class="insert-coin">PRESSIONE C PARA INSERIR MOEDA</span>
      </div>
    `;
    
    container.appendChild(this.element);
    this.renderCharacters();
    this.updateSelection();
  }
  
  renderCharacters() {
    const row = document.getElementById('characters-row');
    if (!row) return;
    
    row.innerHTML = CHARACTER_ORDER.map((id, index) => {
      const char = getCharacter(id);
      const isLocked = char.locked && !SaveSystem.isBossUnlocked(id);
      const isSelected = index === this.selectedIndex;
      
      return `
        <div class="char-slot ${isSelected ? 'selected' : ''} ${isLocked ? 'locked' : ''}" 
             data-index="${index}" data-id="${id}">
          <div class="char-portrait">
            ${isLocked ? 
              '<div class="lock-icon">🔒</div>' : 
              `<img src="assets/svg/portraits/${char.portrait}.svg" alt="${char.name}">`
            }
          </div>
          <div class="char-name">${isLocked ? '???' : char.name}</div>
        </div>
      `;
    }).join('');
    
    // Add click handlers
    row.querySelectorAll('.char-slot').forEach(slot => {
      slot.addEventListener('click', () => {
        const index = parseInt(slot.dataset.index);
        this.selectedIndex = index;
        this.updateSelection();
      });
      
      slot.addEventListener('dblclick', () => {
        this.confirmSelection();
      });
    });
  }
  
  updateSelection() {
    const row = document.getElementById('characters-row');
    const info = document.getElementById('character-info');
    if (!row || !info) return;
    
    // Update visual selection
    row.querySelectorAll('.char-slot').forEach((slot, index) => {
      slot.classList.toggle('selected', index === this.selectedIndex);
    });
    
    // Update info panel
    const id = CHARACTER_ORDER[this.selectedIndex];
    const char = getCharacter(id);
    const isLocked = char.locked && !SaveSystem.isBossUnlocked(id);
    
    if (isLocked) {
      info.innerHTML = `
        <div class="info-locked">
          <h2>??? BLOQUEADO ???</h2>
          <p>Derrote este boss para desbloquear!</p>
        </div>
      `;
    } else {
      const powersText = char.powersUpTo ? 
        `Poderes até nível ${char.powersUpTo}` : 
        `Poderes: ${SaveSystem.getUnlockedCount()} desbloqueados`;
      
      info.innerHTML = `
        <div class="info-unlocked">
          <h2 style="color: ${char.color}">${char.name}</h2>
          <p class="char-desc">${char.description}</p>
          <div class="char-stats">
            <div class="stat"><span>HP:</span> ${'❤️'.repeat(Math.min(char.hp, 8))}</div>
            <div class="stat"><span>VEL:</span> ${'⚡'.repeat(Math.ceil(char.speed / 2))}</div>
            <div class="stat"><span>ATK:</span> ${'🎯'.repeat(Math.ceil((20 - char.shootDelay) / 4))}</div>
          </div>
          <p class="powers-info">${powersText}</p>
          ${char.arena ? `<p class="arena-info">Arena: ${char.arena.replace('arena-', '').toUpperCase()}</p>` : ''}
        </div>
      `;
    }
    
    // Update credits
    const creditsNum = document.getElementById('credits-num');
    if (creditsNum) creditsNum.textContent = Credits.getCredits();
  }
  
  bindKeys() {
    this.keyHandler = (e) => {
      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          this.selectedIndex = (this.selectedIndex - 1 + CHARACTER_ORDER.length) % CHARACTER_ORDER.length;
          this.updateSelection();
          break;
        case 'ArrowRight':
        case 'd':
          this.selectedIndex = (this.selectedIndex + 1) % CHARACTER_ORDER.length;
          this.updateSelection();
          break;
        case 'Enter':
        case ' ':
          this.confirmSelection();
          break;
        case 'Escape':
          if (this.onBack) {
            this.hide();
            this.onBack();
          }
          break;
        case 'c':
        case 'C':
          Credits.addCredit();
          this.updateSelection();
          break;
      }
    };
    
    document.addEventListener('keydown', this.keyHandler);
  }
  
  confirmSelection() {
    const id = CHARACTER_ORDER[this.selectedIndex];
    const char = getCharacter(id);
    const isLocked = char.locked && !SaveSystem.isBossUnlocked(id);
    
    if (isLocked) {
      // Flash locked message
      const info = document.getElementById('character-info');
      if (info) {
        info.classList.add('shake');
        setTimeout(() => info.classList.remove('shake'), 300);
      }
      return;
    }
    
    if (!Credits.hasCredits()) {
      // Flash insert coin message
      const insertCoin = this.element?.querySelector('.insert-coin');
      if (insertCoin) {
        insertCoin.classList.add('flash');
        setTimeout(() => insertCoin.classList.remove('flash'), 500);
      }
      return;
    }
    
    Credits.useCredit();
    SaveSystem.incrementGamesPlayed();
    
    if (this.onSelect) {
      this.hide();
      this.onSelect(id);
    }
  }
}

export const CharacterSelect = new CharacterSelectSystem();
