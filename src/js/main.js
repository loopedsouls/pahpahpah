/**
 * PÁ PÁ PÁ: THE MASK GAME
 * Main Game Loop
 */

import { CONFIG } from './core/config.js';
import { Assets } from './core/assets.js';
import { GameState } from './core/state.js';
import { Input } from './core/input.js';
import { Renderer } from './core/renderer.js';

import { ARENAS, getArena } from './data/arenas.js';
import { MASK_EFFECTS } from './data/masks.js';
import { getBossStats } from './data/bosses.js';

import { Player } from './entities/player.js';
import { Enemy } from './entities/enemy.js';
import { Boss } from './entities/boss.js';
import { Projectile } from './entities/projectile.js';
import { createHitParticle, createDeathExplosion, createDashTrail, createBossDeathExplosion } from './entities/particle.js';
import { EntityManager } from './entities/entityManager.js';

import { Audience } from './systems/audience.js';
import { MaskState } from './systems/maskState.js';
import { WaveManager } from './systems/waves.js';
import { checkProjectileEnemyCollision, checkProjectilePlayerCollision, checkEnemyPlayerCollision, getEnemiesInRadius } from './systems/collision.js';

import { HUD } from './ui/hud.js';
import { Menu } from './ui/menu.js';
import { drawBossIntro, drawBossDefeated, drawPauseScreen, drawSlowMotionOverlay, drawInvincibilityEffect } from './ui/overlays.js';

import { distance, angleToTarget, lerp } from './utils/math.js';

// Entity Managers
const enemies = new EntityManager();
const projectiles = new EntityManager();
const particles = new EntityManager();
let currentBoss = null;

// Game flow timers
let spawnTimer = 0;
let lastSpawnTime = 0;
let bossIntroTimer = 0;
let bossDefeatedTimer = 0;
let gameOverTimer = 0;
let victoryTimer = 0;

/**
 * Initialize Game
 */
async function init() {
  console.log('Initializing PÁ PÁ PÁ...');
  
  // Initialize canvas
  Renderer.init('game-canvas');
  
  // Load assets with timeout
  try {
    await Promise.race([
      Assets.loadAll(),
      new Promise((_, reject) => setTimeout(() => reject('timeout'), 5000))
    ]);
  } catch (e) {
    console.warn('Some assets may not have loaded:', e);
  }
  
  // Setup input
  Input.init();
  
  // Show main menu
  showMainMenu();
}

function showMainMenu() {
  Menu.showMain(() => {
    startGame();
  });
}

function startGame() {
  resetGame();
  HUD.create();
  GameState.state = 'playing';
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  GameState.reset();
  Audience.reset();
  MaskState.reset();
  
  Player.reset();
  Player.x = Renderer.width / 2;
  Player.y = Renderer.height / 2;
  
  enemies.clear();
  projectiles.clear();
  particles.clear();
  currentBoss = null;
  
  spawnTimer = 0;
  lastSpawnTime = 0;
  bossIntroTimer = 0;
  bossDefeatedTimer = 0;
  gameOverTimer = 0;
  victoryTimer = 0;
}

/**
 * Main Game Loop
 */
function gameLoop(timestamp) {
  // Calculate delta time
  const dt = Math.min((timestamp - (GameState.lastTime || timestamp)) / 16.67, 2);
  GameState.lastTime = timestamp;
  
  // Clear canvas
  Renderer.clear();
  
  // Draw arena background
  drawArena();
  
  // Handle state
  switch (GameState.state) {
    case 'playing':
      updatePlaying(dt);
      break;
    case 'boss_intro':
      updateBossIntro(dt);
      break;
    case 'boss_fight':
      updateBossFight(dt);
      break;
    case 'boss_defeated':
      updateBossDefeated(dt);
      break;
    case 'paused':
      drawPauseScreen();
      break;
    case 'game_over':
      updateGameOver(dt);
      break;
    case 'victory':
      updateVictory(dt);
      break;
  }
  
  // Continue loop unless at menu
  if (GameState.state !== 'menu') {
    requestAnimationFrame(gameLoop);
  }
}

/**
 * Draw Current Arena
 */
function drawArena() {
  const arena = getArena(GameState.currentArena);
  const arenaImg = Assets.get(arena.id);
  
  if (arenaImg && arenaImg.complete) {
    Renderer.drawImage(arenaImg, 0, 0, Renderer.width, Renderer.height);
  } else {
    Renderer.drawRect(0, 0, Renderer.width, Renderer.height, '#1a0a2e');
  }
}

/**
 * Playing State Updates
 */
function updatePlaying(dt) {
  const speedMult = MaskState.getSpeedMultiplier();
  
  // Update systems
  MaskState.update();
  
  // Audience decay
  GameState.arenaTimer++;
  if (GameState.arenaTimer % 60 === 0) {
    Audience.onTimeDecay();
  }
  
  // Update player
  updatePlayer(dt, speedMult);
  
  // Spawn enemies
  spawnEnemies();
  
  // Update enemies
  updateEnemies(dt, speedMult);
  
  // Update projectiles
  updateProjectiles(dt, speedMult);
  
  // Update particles
  updateParticles(dt);
  
  // Draw entities
  drawEntities();
  
  // Check collisions
  checkCollisions();
  
  // Check wave completion
  if (enemies.count() === 0 && GameState.arenaTimer > 120 && !GameState.bossActive) {
    if (GameState.wave >= GameState.maxWaves) {
      // Start boss fight
      GameState.state = 'boss_intro';
      bossIntroTimer = 180; // 3 seconds
    } else {
      // Next wave
      GameState.wave++;
      Audience.onWaveComplete();
      spawnTimer = 0;
    }
  }
  
  // Check audience empty
  if (Audience.isEmpty()) {
    GameState.state = 'game_over';
    gameOverTimer = 120;
  }
  
  // Update HUD
  HUD.update();
  
  // Slow motion overlay
  if (MaskState.slowMotionActive) {
    drawSlowMotionOverlay();
  }
}

/**
 * Boss Intro State
 */
function updateBossIntro(dt) {
  drawBossIntro(GameState.currentArena);
  
  bossIntroTimer--;
  if (bossIntroTimer <= 0) {
    spawnBoss();
    GameState.state = 'boss_fight';
  }
}

/**
 * Boss Fight State
 */
function updateBossFight(dt) {
  const speedMult = MaskState.getSpeedMultiplier();
  
  MaskState.update();
  
  // Update player
  updatePlayer(dt, speedMult);
  
  // Update other entities first
  updateEnemies(dt, speedMult);
  updateProjectiles(dt, speedMult);
  updateParticles(dt);
  
  // Update boss
  if (currentBoss && currentBoss.active) {
    currentBoss.update(Player, projectiles, enemies);
    
    // Check player projectiles vs boss collision
    let bossJustDied = false;
    projectiles.forEach(proj => {
      if (bossJustDied || !currentBoss.active) return; // Boss already dead, skip
      if (proj.active && proj.isPlayerOwned) {
        const dist = distance(proj.x, proj.y, currentBoss.x, currentBoss.y);
        if (dist < currentBoss.size + proj.size) {
          proj.active = false;
          currentBoss.hp--;
          createHitParticle(particles, currentBoss.x, currentBoss.y);
          Audience.onHit();
          GameState.score += 50;
          
          // AOE damage from bitmask
          if (Player.hasMask('bitmask')) {
            const nearby = enemies.getAll().filter(e => 
              distance(currentBoss.x, currentBoss.y, e.x, e.y) < 100
            );
            nearby.forEach(e => {
              e.hp--;
              createHitParticle(particles, e.x, e.y);
            });
          }
          
          // Heal from surgical mask
          if (MaskState.registerHit()) {
            Player.hp = Math.min(Player.hp + 1, Player.maxHp);
          }
          
          if (currentBoss.hp <= 0 && currentBoss.active) {
            createBossDeathExplosion(particles, currentBoss.x, currentBoss.y, currentBoss.color);
            currentBoss.active = false;
            bossJustDied = true;
            Audience.onBossKill();
            GameState.score += 1000;
            
            // Award mask
            const arena = getArena(GameState.currentArena);
            Player.addMask(arena.mask);
            
            GameState.state = 'boss_defeated';
            bossDefeatedTimer = 240; // 4 seconds
            return; // Exit forEach
          }
        }
      }
    });
    
    // Exit function if boss just died
    if (bossJustDied) {
      return;
    }
  }
  
  // Draw entities
  drawEntities();
  
  // Draw boss on top
  if (currentBoss && currentBoss.active) {
    currentBoss.draw(Renderer);
  }
  
  // Check player collision
  checkPlayerCollisions();
  
  // Check audience empty
  if (Audience.isEmpty()) {
    GameState.state = 'game_over';
    gameOverTimer = 120;
  }
  
  HUD.update();
  
  if (MaskState.slowMotionActive) {
    drawSlowMotionOverlay();
  }
}

/**
 * Boss Defeated State
 */
function updateBossDefeated(dt) {
  updateParticles(dt);
  
  drawBossDefeated(GameState.currentArena, 
    () => particles.forEach(p => p.draw(Renderer)),
    () => Player.draw()
  );
  
  bossDefeatedTimer--;
  if (bossDefeatedTimer <= 0) {
    if (GameState.currentArena >= 4) {
      // Victory!
      GameState.state = 'victory';
      victoryTimer = 180;
    } else {
      // Next arena
      GameState.currentArena++;
      GameState.wave = 1;
      GameState.arenaTimer = 0;
      GameState.bossActive = false;
      spawnTimer = 0;
      lastSpawnTime = 0;
      
      enemies.clear();
      projectiles.clear();
      particles.clear();
      currentBoss = null;
      
      Player.applyMaskBonuses();
      
      GameState.state = 'playing';
    }
  }
}

/**
 * Game Over State
 */
function updateGameOver(dt) {
  gameOverTimer--;
  if (gameOverTimer <= 0 && gameOverTimer > -999) {
    gameOverTimer = -1000;
    document.getElementById('hud')?.remove();
    document.getElementById('masks-equipped')?.remove();
    Menu.showGameOver(
      () => startGame(),
      () => {
        GameState.state = 'menu';
        showMainMenu();
      }
    );
  }
}

/**
 * Victory State
 */
function updateVictory(dt) {
  victoryTimer--;
  if (victoryTimer <= 0 && victoryTimer > -999) {
    victoryTimer = -1000;
    document.getElementById('hud')?.remove();
    document.getElementById('masks-equipped')?.remove();
    Menu.showVictory(
      () => startGame(),
      () => {
        GameState.state = 'menu';
        showMainMenu();
      }
    );
  }
}

/**
 * Spawn Boss
 */
function spawnBoss() {
  const arena = getArena(GameState.currentArena);
  const stats = getBossStats(arena.bossType);
  
  currentBoss = new Boss(
    Renderer.width / 2,
    150,
    arena.bossType,
    stats,
    arena.color
  );
  
  GameState.bossActive = true;
}

/**
 * Spawn Enemies
 */
function spawnEnemies() {
  const now = Date.now();
  const enemyCount = WaveManager.getEnemyCount();
  
  if (enemies.count() < enemyCount && now - lastSpawnTime > WaveManager.getSpawnDelay()) {
    const side = Math.floor(Math.random() * 4);
    let x, y;
    
    switch (side) {
      case 0: x = Math.random() * Renderer.width; y = -30; break;
      case 1: x = Renderer.width + 30; y = Math.random() * Renderer.height; break;
      case 2: x = Math.random() * Renderer.width; y = Renderer.height + 30; break;
      case 3: x = -30; y = Math.random() * Renderer.height; break;
    }
    
    const arena = getArena(GameState.currentArena);
    enemies.add(new Enemy(x, y, arena.color));
    lastSpawnTime = now;
  }
}

/**
 * Update Player
 */
function updatePlayer(dt, speedMult) {
  // Movement
  const moveX = (Input.keys['d'] || Input.keys['arrowright'] ? 1 : 0) - 
                (Input.keys['a'] || Input.keys['arrowleft'] ? 1 : 0);
  const moveY = (Input.keys['s'] || Input.keys['arrowdown'] ? 1 : 0) - 
                (Input.keys['w'] || Input.keys['arrowup'] ? 1 : 0);
  
  if (moveX !== 0 || moveY !== 0) {
    const len = Math.sqrt(moveX * moveX + moveY * moveY);
    Player.x += (moveX / len) * Player.speed * dt * speedMult;
    Player.y += (moveY / len) * Player.speed * dt * speedMult;
  }
  
  // Dash
  if (Player.dashCooldown > 0) {
    Player.dashCooldown--;
  }
  
  if (Player.isDashing) {
    Player.x += Player.dashVelX * dt * speedMult;
    Player.y += Player.dashVelY * dt * speedMult;
    Player.dashTimer--;
    
    createDashTrail(particles, Player.x, Player.y);
    
    if (Player.dashTimer <= 0) {
      Player.isDashing = false;
      // End alphamask invincibility
      if (Player.hasMask('alphamask')) {
        MaskState.isInvincible = false;
      }
    }
  } else if (Input.keys[' '] && Player.dashCooldown <= 0 && (moveX !== 0 || moveY !== 0)) {
    Player.isDashing = true;
    Player.dashTimer = 10;
    Player.dashCooldown = CONFIG.PLAYER.DASH_COOLDOWN;
    
    const len = Math.sqrt(moveX * moveX + moveY * moveY);
    Player.dashVelX = (moveX / len) * Player.dashDistance / 10;
    Player.dashVelY = (moveY / len) * Player.dashDistance / 10;
    
    // Alphamask invincibility
    if (Player.hasMask('alphamask')) {
      MaskState.isInvincible = true;
    }
  }
  
  // Confusion ability (Q key with datamask)
  if (Input.keys['q'] && MaskState.canUseConfusion()) {
    MaskState.useConfusion();
    enemies.forEach(e => {
      e.confused = true;
      e.confusionTimer = 180;
    });
  }
  
  // Shooting
  if (Player.shootCooldown > 0) {
    Player.shootCooldown--;
  }
  
  if (Input.mouseDown && Player.shootCooldown <= 0) {
    const angle = angleToTarget(Player.x, Player.y, Input.mouseX, Input.mouseY);
    projectiles.add(new Projectile(
      Player.x, Player.y,
      Math.cos(angle) * 15,
      Math.sin(angle) * 15,
      true
    ));
    Player.shootCooldown = Player.shootDelay;
    Audience.onMiss();
  }
  
  // Boundaries
  Player.x = Math.max(Player.size, Math.min(Renderer.width - Player.size, Player.x));
  Player.y = Math.max(Player.size, Math.min(Renderer.height - Player.size, Player.y));
  
  // Invincibility timer
  if (Player.invincibleTimer > 0) {
    Player.invincibleTimer--;
  }
}

/**
 * Update Enemies
 */
function updateEnemies(dt, speedMult) {
  enemies.forEach(enemy => {
    enemy.update(Player, dt, speedMult);
    
    // Shoot at player
    enemy.shootTimer++;
    if (enemy.shootTimer >= enemy.shootDelay) {
      enemy.shootTimer = 0;
      const angle = angleToTarget(enemy.x, enemy.y, Player.x, Player.y);
      projectiles.add(new Projectile(
        enemy.x, enemy.y,
        Math.cos(angle) * 8,
        Math.sin(angle) * 8,
        false
      ));
    }
  });
  
  enemies.removeInactive();
}

/**
 * Update Projectiles
 */
function updateProjectiles(dt, speedMult) {
  projectiles.forEach(proj => {
    proj.update(dt, speedMult);
    
    // Remove if out of bounds
    if (proj.x < -50 || proj.x > Renderer.width + 50 ||
        proj.y < -50 || proj.y > Renderer.height + 50) {
      proj.active = false;
    }
  });
  
  projectiles.removeInactive();
}

/**
 * Update Particles
 */
function updateParticles(dt) {
  particles.forEach(p => p.update(dt));
  particles.removeInactive();
}

/**
 * Draw All Entities
 */
function drawEntities() {
  // Draw particles
  particles.forEach(p => p.draw(Renderer));
  
  // Draw enemies
  enemies.forEach(e => e.draw(Renderer));
  
  // Draw projectiles
  projectiles.forEach(p => p.draw(Renderer));
  
  // Draw player
  Player.draw(Renderer);
  
  // Draw invincibility effect
  if (MaskState.isInvincible || Player.invincibleTimer > 0) {
    drawInvincibilityEffect(Player.x, Player.y, Player.size);
  }
}

/**
 * Check Collisions
 */
function checkCollisions() {
  // Player projectiles vs enemies
  projectiles.forEach(proj => {
    if (!proj.active || !proj.isPlayerOwned) return;
    
    enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      if (checkProjectileEnemyCollision(proj, enemy)) {
        proj.active = false;
        enemy.hp--;
        createHitParticle(particles, enemy.x, enemy.y);
        Audience.onHit();
        GameState.score += 10;
        
        // AOE damage from bitmask
        if (Player.hasMask('bitmask')) {
          const nearby = getEnemiesInRadius(enemy.x, enemy.y, 100, enemies.getAll());
          nearby.forEach(e => {
            if (e !== enemy) {
              e.hp--;
              createHitParticle(particles, e.x, e.y);
            }
          });
        }
        
        // Heal from surgical mask
        if (MaskState.registerHit()) {
          Player.hp = Math.min(Player.hp + 1, Player.maxHp);
        }
        
        if (enemy.hp <= 0) {
          enemy.active = false;
          createDeathExplosion(particles, enemy.x, enemy.y, enemy.color);
          Audience.onKill();
          GameState.score += 50;
        }
      }
    });
  });
  
  checkPlayerCollisions();
}

/**
 * Check Player Collisions
 */
function checkPlayerCollisions() {
  if (MaskState.isInvincible || Player.invincibleTimer > 0) return;
  
  // Enemy projectiles vs player
  projectiles.forEach(proj => {
    if (!proj.active || proj.isPlayerOwned) return;
    
    if (checkProjectilePlayerCollision(proj, Player)) {
      proj.active = false;
      Player.hp--;
      Player.invincibleTimer = CONFIG.TIMERS.INVINCIBLE;
      Audience.onPlayerHit();
      createHitParticle(particles, Player.x, Player.y);
    }
  });
  
  // Enemies vs player
  enemies.forEach(enemy => {
    if (!enemy.active) return;
    
    if (checkEnemyPlayerCollision(enemy, Player)) {
      Player.hp--;
      Player.invincibleTimer = CONFIG.TIMERS.INVINCIBLE;
      Audience.onPlayerHit();
      createHitParticle(particles, Player.x, Player.y);
    }
  });
  
  // Boss vs player
  if (currentBoss && currentBoss.active) {
    if (distance(Player.x, Player.y, currentBoss.x, currentBoss.y) < Player.size + currentBoss.size) {
      Player.hp--;
      Player.invincibleTimer = CONFIG.TIMERS.INVINCIBLE;
      Audience.onPlayerHit();
    }
  }
  
  // Check player death
  if (Player.hp <= 0) {
    GameState.state = 'game_over';
    gameOverTimer = 120;
  }
}

// Start the game when DOM is ready
document.addEventListener('DOMContentLoaded', init);
