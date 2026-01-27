/**
 * HUD System
 */

import { GameState } from '../core/state.js';
import { Player } from '../entities/player.js';
import { Audience } from '../systems/audience.js';
import { MASK_EFFECTS } from '../data/masks.js';

class HUDSystem {
  create() {
    const container = document.getElementById('game-container');
    
    const hud = document.createElement('div');
    hud.className = 'hud';
    hud.id = 'hud';
    
    hud.innerHTML = `
      <div class="hud-left">
        ${Array(7).fill('<img class="heart" src="assets/svg/ui/heart-full.svg">').join('')}
      </div>
      <div class="audience-bar">
        <div class="audience-label">PÚBLICO</div>
        <div class="bar-container">
          <div class="bar-fill" id="audience-fill" style="width: 50%"></div>
        </div>
      </div>
      <div class="hud-right">
        <div>ARENA: <span id="arena-num">1</span>/5</div>
        <div>WAVE: <span id="wave-num">1</span>/${GameState.maxWaves}</div>
        <div>SCORE: <span id="score-num">0</span></div>
      </div>
    `;
    
    container.appendChild(hud);
    
    const masksContainer = document.createElement('div');
    masksContainer.className = 'masks-equipped';
    masksContainer.id = 'masks-equipped';
    container.appendChild(masksContainer);
  }
  
  update() {
    // Update hearts
    const hearts = document.querySelectorAll('.heart');
    hearts.forEach((heart, i) => {
      if (i < Player.maxHp) {
        heart.style.display = 'block';
        heart.src = i < Player.hp ? 'assets/svg/ui/heart-full.svg' : 'assets/svg/ui/heart-empty.svg';
      } else {
        heart.style.display = 'none';
      }
    });
    
    // Update audience
    const audienceFill = document.getElementById('audience-fill');
    if (audienceFill) {
      audienceFill.style.width = `${Audience.getPercentage()}%`;
    }
    
    // Update stats
    const arenaNum = document.getElementById('arena-num');
    const waveNum = document.getElementById('wave-num');
    const scoreNum = document.getElementById('score-num');
    
    if (arenaNum) arenaNum.textContent = GameState.currentArena + 1;
    if (waveNum) waveNum.textContent = GameState.bossActive ? 'BOSS' : GameState.wave;
    if (scoreNum) scoreNum.textContent = GameState.score;
    
    // Update masks
    const masksContainer = document.getElementById('masks-equipped');
    if (masksContainer) {
      masksContainer.innerHTML = Player.masks.map((mask) => `
        <div class="mask-slot active" title="${MASK_EFFECTS[mask]?.description || mask}">
          <img src="assets/svg/masks/${mask}.svg">
          <div class="mask-number">✓</div>
        </div>
      `).join('');
    }
  }
}

export const HUD = new HUDSystem();
