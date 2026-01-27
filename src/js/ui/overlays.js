/**
 * Screen Overlays (Boss Intro, Boss Defeated, Pause)
 */

import { Renderer } from '../core/renderer.js';
import { Assets } from '../core/assets.js';
import { getArena } from '../data/arenas.js';
import { MASK_EFFECTS } from '../data/masks.js';

export function drawBossIntro(arenaIndex) {
  const arena = getArena(arenaIndex);
  const ctx = Renderer.ctx;
  
  Renderer.drawRect(0, 0, Renderer.width, Renderer.height, 'rgba(0, 0, 0, 0.8)');
  
  Renderer.drawText('BOSS FIGHT!', Renderer.width / 2, Renderer.height / 2 - 50, 
    'bold 72px "Courier New"', arena.color);
  
  Renderer.drawText(arena.name, Renderer.width / 2, Renderer.height / 2 + 20, 
    '36px "Courier New"', arena.color);
  
  Renderer.drawText(`Derrote para ganhar: ${arena.mask.toUpperCase()}`, 
    Renderer.width / 2, Renderer.height / 2 + 80, '24px "Courier New"', '#fff');
  
  // Draw boss preview
  const bossImg = Assets.get(arena.boss);
  if (bossImg && bossImg.complete) {
    Renderer.drawImage(bossImg, Renderer.width / 2 - 64, Renderer.height / 2 + 100, 128, 128);
  }
}

export function drawBossDefeated(arenaIndex, drawParticles, drawPlayer) {
  const arena = getArena(arenaIndex);
  
  if (drawParticles) drawParticles();
  if (drawPlayer) drawPlayer();
  
  Renderer.drawRect(0, 0, Renderer.width, Renderer.height, 'rgba(0, 0, 0, 0.7)');
  
  Renderer.drawText('BOSS DERROTADO!', Renderer.width / 2, Renderer.height / 2 - 80, 
    'bold 72px "Courier New"', '#ffd700');
  
  Renderer.drawText(`+ ${arena.mask.toUpperCase()}`, Renderer.width / 2, Renderer.height / 2, 
    '48px "Courier New"', arena.color);
  
  // Draw mask obtained
  const maskImg = Assets.get(arena.mask);
  if (maskImg && maskImg.complete) {
    Renderer.drawImage(maskImg, Renderer.width / 2 - 48, Renderer.height / 2 + 30, 96, 96);
  }
  
  const powerDesc = MASK_EFFECTS[arena.mask]?.description || '';
  Renderer.drawText(powerDesc, Renderer.width / 2, Renderer.height / 2 + 160, 
    '24px "Courier New"', '#fff');
  
  if (arenaIndex < 4) {
    const nextArena = getArena(arenaIndex + 1);
    Renderer.drawText(`Próxima arena: ${nextArena.name}`, 
      Renderer.width / 2, Renderer.height / 2 + 200, '24px "Courier New"', '#fff');
  }
}

export function drawPauseScreen() {
  Renderer.drawRect(0, 0, Renderer.width, Renderer.height, 'rgba(0, 0, 0, 0.7)');
  Renderer.drawText('PAUSADO', Renderer.width / 2, Renderer.height / 2, 
    '48px "Courier New"', '#fff');
  Renderer.drawText('Pressione ESC para continuar', Renderer.width / 2, Renderer.height / 2 + 40, 
    '18px "Courier New"', '#fff');
}

export function drawSlowMotionOverlay() {
  Renderer.drawRect(0, 0, Renderer.width, Renderer.height, 'rgba(0, 50, 100, 0.2)');
}

export function drawInvincibilityEffect(x, y, size) {
  const ctx = Renderer.ctx;
  ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(x, y, size + 10, 0, Math.PI * 2);
  ctx.stroke();
}
