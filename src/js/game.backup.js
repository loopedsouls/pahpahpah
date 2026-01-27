// PÁ PÁ PÁ: THE MASK GAME - MVP Implementation
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Base resolution (internal game resolution)
const BASE_WIDTH = 1920;
const BASE_HEIGHT = 1080;

canvas.width = BASE_WIDTH;
canvas.height = BASE_HEIGHT;

// Resize canvas to fit screen while maintaining aspect ratio
function resizeCanvas() {
  const aspectRatio = BASE_WIDTH / BASE_HEIGHT;
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  
  let newWidth = windowWidth * 0.95; // Use 95% of window
  let newHeight = newWidth / aspectRatio;
  
  if (newHeight > windowHeight * 0.95) {
    newHeight = windowHeight * 0.95;
    newWidth = newHeight * aspectRatio;
  }
  
  // Update game container size
  const container = document.getElementById('game-container');
  container.style.width = newWidth + 'px';
  container.style.height = newHeight + 'px';
  
  canvas.style.width = newWidth + 'px';
  canvas.style.height = newHeight + 'px';
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Arena system - 5 arenas with bosses
const Arenas = [
  { id: 'bitmask', name: 'BITMASK DOMAIN', boss: 'boss-bitmask', mask: 'bitmask', color: '#00ff00' },
  { id: 'alphamask', name: 'PHANTOM REALM', boss: 'boss-alphamask', mask: 'alphamask', color: '#00ffff' },
  { id: 'datamask', name: 'CHAOS CORE', boss: 'boss-datamask', mask: 'datamask', color: '#ff00ff' },
  { id: 'surgical', name: 'HEALING SANCTUM', boss: 'boss-surgical', mask: 'surgical', color: '#00ff88' },
  { id: 'shader', name: 'TIME NEXUS', boss: 'boss-shader', mask: 'shader', color: '#ffaa00' }
];

// Game State
const Game = {
  state: 'menu', // menu, playing, paused, gameOver, victory, bossIntro, bossDefeated
  score: 0,
  wave: 1,
  maxWaves: 3, // waves before boss
  enemiesKilled: 0,
  arenaTimer: 0,
  maxArenaTime: 120 * 60, // 2 minutes in frames
  currentArena: 0, // 0-4
  bossActive: false,
  bossIntroTimer: 0,
  bossDefeatedTimer: 0
};

// Player
const Player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 48,
  speed: 7,
  hp: 5,
  maxHp: 5,
  angle: 0,
  color: '#4080ff',
  shootCooldown: 0,
  shootDelay: 15,
  dashCooldown: 0,
  dashDelay: 180,
  masks: [],
  activeMask: null
};

// Input
const Keys = {};
const Mouse = { x: 0, y: 0, pressed: false };

// Arrays
const pies = [];
const enemies = [];
const particles = [];
const maskDrops = [];

// Available mask types
const maskTypes = ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];

// Audience Meter
const Audience = {
  value: 50,
  max: 100
};

// Images cache
const images = {};

// Load SVG as image
function loadSVG(name, path) {
  const img = new Image();
  img.src = path;
  images[name] = img;
}

// Load all assets
function loadAssets() {
  loadSVG('player', 'assets/svg/player/player-idle.svg');
  loadSVG('enemy', 'assets/svg/enemies/basic.svg');
  loadSVG('shooter', 'assets/svg/enemies/shooter.svg');
  loadSVG('tank', 'assets/svg/enemies/tank.svg');
  loadSVG('pie', 'assets/svg/effects/pie.svg');
  loadSVG('splat', 'assets/svg/effects/pie-splat.svg');
  loadSVG('sparkle', 'assets/svg/effects/sparkle.svg');
  
  // Arenas
  loadSVG('arena-bitmask', 'assets/svg/arena/arena-bitmask.svg');
  loadSVG('arena-alphamask', 'assets/svg/arena/arena-alphamask.svg');
  loadSVG('arena-datamask', 'assets/svg/arena/arena-datamask.svg');
  loadSVG('arena-surgical', 'assets/svg/arena/arena-surgical.svg');
  loadSVG('arena-shader', 'assets/svg/arena/arena-shader.svg');
  
  // Bosses
  loadSVG('boss-bitmask', 'assets/svg/bosses/boss-bitmask.svg');
  loadSVG('boss-alphamask', 'assets/svg/bosses/boss-alphamask.svg');
  loadSVG('boss-datamask', 'assets/svg/bosses/boss-datamask.svg');
  loadSVG('boss-surgical', 'assets/svg/bosses/boss-surgical.svg');
  loadSVG('boss-shader', 'assets/svg/bosses/boss-shader.svg');
  
  // Masks
  loadSVG('bitmask', 'assets/svg/masks/bitmask.svg');
  loadSVG('alphamask', 'assets/svg/masks/alphamask.svg');
  loadSVG('datamask', 'assets/svg/masks/datamask.svg');
  loadSVG('surgical', 'assets/svg/masks/surgical.svg');
  loadSVG('shader', 'assets/svg/masks/shader.svg');
}

// Input handlers
document.addEventListener('keydown', (e) => {
  Keys[e.key.toLowerCase()] = true;
  
  if (e.key === 'Escape') {
    if (Game.state === 'playing') Game.state = 'paused';
    else if (Game.state === 'paused') Game.state = 'playing';
  }
  
  // Mask selection
  if (Game.state === 'playing') {
    const num = parseInt(e.key);
    if (num >= 1 && num <= Player.masks.length) {
      Player.activeMask = num - 1;
    }
  }
});

document.addEventListener('keyup', (e) => {
  Keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  Mouse.x = (e.clientX - rect.left) * scaleX;
  Mouse.y = (e.clientY - rect.top) * scaleY;
});

canvas.addEventListener('mousedown', () => {
  Mouse.pressed = true;
});

canvas.addEventListener('mouseup', () => {
  Mouse.pressed = false;
});

// Player functions
function updatePlayer() {
  applyMaskEffects();
  
  // Apply slow motion factor if shader mask is active
  const speedMult = MaskState.slowMotionActive ? 0.5 : 1;
  
  // Movement
  const dx = (Keys['d'] || Keys['arrowright'] ? 1 : 0) - (Keys['a'] || Keys['arrowleft'] ? 1 : 0);
  const dy = (Keys['s'] || Keys['arrowdown'] ? 1 : 0) - (Keys['w'] || Keys['arrowup'] ? 1 : 0);
  
  if (dx !== 0 || dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    Player.x += (dx / length) * Player.speed * speedMult;
    Player.y += (dy / length) * Player.speed * speedMult;
  }
  
  // Keep in bounds
  Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
  Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
  
  // Aim
  Player.angle = Math.atan2(Mouse.y - Player.y, Mouse.x - Player.x);
  
  // Shoot
  if (Player.shootCooldown > 0) Player.shootCooldown--;
  
  if (Mouse.pressed && Player.shootCooldown === 0) {
    shootPie();
    Player.shootCooldown = Player.shootDelay;
  }
  
  // Dash
  if (Player.dashCooldown > 0) Player.dashCooldown--;
  
  if ((Keys[' '] || Keys['shift']) && Player.dashCooldown === 0) {
    const dashDist = Player.dashDist;
    Player.x += Math.cos(Player.angle) * dashDist;
    Player.y += Math.sin(Player.angle) * dashDist;
    Player.dashCooldown = Player.dashDelay;
    
    // Alpha Mask: Ghost Dash - become invincible during dash (stacks!)
    if (hasMask('alphamask')) {
      MaskState.isInvincible = true;
      MaskState.invincibleTimer = 30; // 0.5 seconds at 60fps
    }
    
    // Keep in bounds after dash
    Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
    Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
  }
  
  // Data Mask: Confusion ability (press Q to activate) - stacks!
  if (Keys['q'] && hasMask('datamask')) {
    if (MaskState.confusionCooldown <= 0) {
      activateConfusion();
      MaskState.confusionCooldown = 480; // 8 seconds cooldown
    }
  }
}

function shootPie() {
  let damage = 1;
  // Bonus damage with more masks collected
  damage += Math.floor(Player.masks.length / 2);
  
  pies.push({
    x: Player.x,
    y: Player.y,
    vx: Math.cos(Player.angle) * 16,
    vy: Math.sin(Player.angle) * 16,
    size: 16,
    damage: damage
  });
}

function drawPlayer() {
  ctx.save();
  ctx.translate(Player.x, Player.y);
  ctx.rotate(Player.angle);
  
  if (images.player && images.player.complete) {
    ctx.drawImage(images.player, -Player.size, -Player.size, Player.size * 2, Player.size * 2);
  } else {
    ctx.fillStyle = Player.color;
    ctx.beginPath();
    ctx.arc(0, 0, Player.size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  // Draw active mask covering player's head
  if (Player.activeMask !== null && Player.masks[Player.activeMask]) {
    const maskImg = images[Player.masks[Player.activeMask]];
    if (maskImg && maskImg.complete) {
      const maskSize = Player.size * 1.8;
      ctx.drawImage(maskImg, -maskSize / 2, -maskSize / 2, maskSize, maskSize);
    }
  }
  
  ctx.restore();
}

// Pie functions
function updatePies() {
  for (let i = pies.length - 1; i >= 0; i--) {
    const pie = pies[i];
    pie.x += pie.vx;
    pie.y += pie.vy;
    
    // Check if enemy pie hits player
    if (pie.isEnemy) {
      const dx = Player.x - pie.x;
      const dy = Player.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < Player.size + pie.size) {
        hitPlayer();
        pies.splice(i, 1);
        continue;
      }
    }
    
    // Remove if out of bounds
    if (pie.x < 0 || pie.x > canvas.width || pie.y < 0 || pie.y > canvas.height) {
      pies.splice(i, 1);
      if (!pie.isEnemy) {
        updateAudience(-2); // Miss only for player pies
      }
    }
  }
}

function drawPies() {
  pies.forEach(pie => {
    if (images.pie && images.pie.complete) {
      ctx.save();
      if (pie.isEnemy) {
        ctx.globalAlpha = 0.7;
      }
      ctx.drawImage(images.pie, pie.x - pie.size, pie.y - pie.size, pie.size * 2, pie.size * 2);
      ctx.restore();
    } else {
      ctx.fillStyle = pie.isEnemy ? '#ff6060' : '#fffacd';
      ctx.beginPath();
      ctx.arc(pie.x, pie.y, pie.size, 0, Math.PI * 2);
      ctx.fill();
    }
  });
}

// Enemy functions
function spawnEnemy() {
  const side = Math.floor(Math.random() * 4);
  let x, y;
  
  switch(side) {
    case 0: x = Math.random() * canvas.width; y = -20; break;
    case 1: x = canvas.width + 20; y = Math.random() * canvas.height; break;
    case 2: x = Math.random() * canvas.width; y = canvas.height + 20; break;
    case 3: x = -20; y = Math.random() * canvas.height; break;
  }
  
  // Determine enemy type based on wave and arena
  const rand = Math.random();
  let type, hp, speed, size;
  
  // Scale difficulty by arena
  const arenaBonus = Game.currentArena * 0.2;
  
  if (Game.wave >= 3 && rand < 0.2 + arenaBonus * 0.1) {
    type = 'tank';
    hp = 3 + Game.currentArena;
    speed = 2 + arenaBonus;
    size = 64;
  } else if (Game.wave >= 2 && rand < 0.5) {
    type = 'shooter';
    hp = 1 + Math.floor(Game.currentArena / 2);
    speed = 2.8 + arenaBonus;
    size = 48;
  } else {
    type = 'basic';
    hp = 1 + Math.floor(Game.currentArena / 3);
    speed = 2.5 + Math.random() * 1 + arenaBonus;
    size = 48;
  }
  
  enemies.push({ x, y, hp, maxHp: hp, speed, size, type, shootCooldown: 0, confused: false, confusedTimer: 0, confusedAngle: 0 });
}

// Spawn boss for current arena
function spawnBoss() {
  const arena = Arenas[Game.currentArena];
  const bossStats = {
    'bitmask': { hp: 15, speed: 2.5, size: 96, attack: 'aoe' },
    'alphamask': { hp: 12, speed: 4, size: 80, attack: 'dash' },
    'datamask': { hp: 10, speed: 3, size: 88, attack: 'confusion' },
    'surgical': { hp: 20, speed: 2, size: 100, attack: 'heal' },
    'shader': { hp: 18, speed: 3, size: 92, attack: 'slow' }
  };
  
  const stats = bossStats[arena.id];
  
  enemies.push({
    x: canvas.width / 2,
    y: -100,
    hp: stats.hp,
    maxHp: stats.hp,
    speed: stats.speed,
    size: stats.size,
    type: 'boss',
    bossType: arena.id,
    shootCooldown: 0,
    confused: false,
    confusedTimer: 0,
    confusedAngle: 0,
    attackPattern: stats.attack,
    patternTimer: 0,
    phaseTimer: 0
  });
  
  Game.bossActive = true;
}

// Activate confusion for Data Mask
function activateConfusion() {
  enemies.forEach(enemy => {
    const dx = Player.x - enemy.x;
    const dy = Player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Confuse enemies within range
    if (dist < 400) {
      enemy.confused = true;
      enemy.confusedTimer = 300; // 5 seconds
      enemy.confusedAngle = Math.random() * Math.PI * 2;
    }
  });
  
  // Visual feedback
  for (let i = 0; i < 20; i++) {
    particles.push({
      x: Player.x + (Math.random() - 0.5) * 200,
      y: Player.y + (Math.random() - 0.5) * 200,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 40,
      maxLife: 40,
      size: 8 + Math.random() * 8,
      color: '#ff00ff'
    });
  }
}

function updateEnemies() {
  // Apply slow motion to enemies if shader mask active
  const speedMult = MaskState.slowMotionActive ? 0.5 : 1;
  
  enemies.forEach(enemy => {
    // Update confusion timer
    if (enemy.confused) {
      enemy.confusedTimer--;
      if (enemy.confusedTimer <= 0) {
        enemy.confused = false;
      }
    }
    
    const dx = Player.x - enemy.x;
    const dy = Player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Boss behavior
    if (enemy.type === 'boss') {
      updateBoss(enemy, dx, dy, dist, speedMult);
    }
    // If confused, move randomly
    else if (enemy.confused) {
      enemy.confusedAngle += (Math.random() - 0.5) * 0.3;
      enemy.x += Math.cos(enemy.confusedAngle) * enemy.speed * 0.5 * speedMult;
      enemy.y += Math.sin(enemy.confusedAngle) * enemy.speed * 0.5 * speedMult;
      
      // Keep in bounds
      enemy.x = Math.max(enemy.size, Math.min(canvas.width - enemy.size, enemy.x));
      enemy.y = Math.max(enemy.size, Math.min(canvas.height - enemy.size, enemy.y));
    }
    // Shooter behavior - keep distance and shoot
    else if (enemy.type === 'shooter') {
      if (dist > 300) {
        enemy.x += (dx / dist) * enemy.speed * speedMult;
        enemy.y += (dy / dist) * enemy.speed * speedMult;
      } else if (dist < 240) {
        enemy.x -= (dx / dist) * enemy.speed * 0.5 * speedMult;
        enemy.y -= (dy / dist) * enemy.speed * 0.5 * speedMult;
      }
      
      // Shoot at player
      if (enemy.shootCooldown <= 0 && dist < 600) {
        enemyShoot(enemy);
        enemy.shootCooldown = 120; // 2 seconds
      }
      enemy.shootCooldown--;
    } else {
      // Basic and tank - chase player
      if (dist > 0) {
        enemy.x += (dx / dist) * enemy.speed * speedMult;
        enemy.y += (dy / dist) * enemy.speed * speedMult;
      }
    }
    
    // Check collision with player (skip if invincible)
    if (dist < Player.size + enemy.size && !MaskState.isInvincible && enemy.type !== 'boss') {
      hitPlayer();
      if (enemy.type !== 'tank') {
        enemy.hp = 0;
      }
    }
  });
  
  // Check pie collisions
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    
    for (let j = pies.length - 1; j >= 0; j--) {
      const pie = pies[j];
      if (pie.isEnemy) continue; // Skip enemy pies
      
      const dx = enemy.x - pie.x;
      const dy = enemy.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < enemy.size + pie.size) {
        enemy.hp -= pie.damage;
        
        // Bitmask: Multi-target AOE damage (stacks!)
        if (hasMask('bitmask')) {
          // Damage nearby enemies too
          enemies.forEach((otherEnemy, k) => {
            if (k !== i) {
              const odx = otherEnemy.x - pie.x;
              const ody = otherEnemy.y - pie.y;
              const odist = Math.sqrt(odx * odx + ody * ody);
              if (odist < 80) { // AOE radius
                otherEnemy.hp -= pie.damage;
                createSplat(otherEnemy.x, otherEnemy.y);
              }
            }
          });
        }
        
        pies.splice(j, 1);
        createSplat(enemy.x, enemy.y);
        updateAudience(5); // Hit
        
        // Surgical Mask: Heal on hit (stacks!)
        if (hasMask('surgical')) {
          MaskState.hitCounter++;
          if (MaskState.hitCounter >= 5) {
            MaskState.hitCounter = 0;
            if (Player.hp < Player.maxHp) {
              Player.hp++;
            }
          }
        }
        
        if (enemy.hp <= 0) {
          Game.enemiesKilled++;
          Game.score += enemy.type === 'boss' ? 1000 : 100;
          updateAudience(enemy.type === 'boss' ? 30 : 8);
          
          // Boss defeated - award mask
          if (enemy.type === 'boss') {
            onBossDefeated(enemy.bossType);
          }
        }
        break;
      }
    }
    
    if (enemy.hp <= 0) {
      enemies.splice(i, 1);
    }
  }
}

// Boss AI patterns
function updateBoss(boss, dx, dy, dist, speedMult) {
  boss.phaseTimer++;
  boss.patternTimer++;
  
  // Keep boss in arena
  boss.x = Math.max(boss.size, Math.min(canvas.width - boss.size, boss.x));
  boss.y = Math.max(boss.size, Math.min(canvas.height - boss.size, boss.y));
  
  // Move towards center if too far
  const centerDist = Math.sqrt((boss.x - canvas.width/2)**2 + (boss.y - canvas.height/2)**2);
  if (centerDist > 400) {
    const toCenterX = canvas.width/2 - boss.x;
    const toCenterY = canvas.height/2 - boss.y;
    const toCenterDist = Math.sqrt(toCenterX*toCenterX + toCenterY*toCenterY);
    boss.x += (toCenterX / toCenterDist) * boss.speed * 0.5 * speedMult;
    boss.y += (toCenterY / toCenterDist) * boss.speed * 0.5 * speedMult;
  }
  
  // Boss patterns based on type
  switch(boss.attackPattern) {
    case 'aoe': // Bitmask boss - shoots in multiple directions
      if (boss.patternTimer % 90 === 0) {
        for (let i = 0; i < 8; i++) {
          const angle = (Math.PI * 2 / 8) * i;
          pies.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(angle) * 8, vy: Math.sin(angle) * 8,
            size: 14, damage: 1, isEnemy: true
          });
        }
      }
      // Move towards player slowly
      if (dist > 200) {
        boss.x += (dx / dist) * boss.speed * 0.5 * speedMult;
        boss.y += (dy / dist) * boss.speed * 0.5 * speedMult;
      }
      break;
      
    case 'dash': // Alphamask boss - dashes at player
      if (boss.patternTimer % 120 === 0) {
        boss.dashTarget = { x: Player.x, y: Player.y };
        boss.dashing = true;
        boss.dashFrames = 30;
      }
      if (boss.dashing && boss.dashFrames > 0) {
        const dashDx = boss.dashTarget.x - boss.x;
        const dashDy = boss.dashTarget.y - boss.y;
        const dashDist = Math.sqrt(dashDx*dashDx + dashDy*dashDy);
        if (dashDist > 20) {
          boss.x += (dashDx / dashDist) * 15 * speedMult;
          boss.y += (dashDy / dashDist) * 15 * speedMult;
        }
        boss.dashFrames--;
        if (boss.dashFrames <= 0) boss.dashing = false;
        // Damage player on collision during dash
        if (dist < Player.size + boss.size && !MaskState.isInvincible) {
          hitPlayer();
        }
      } else {
        // Circle player
        const angle = Math.atan2(dy, dx) + 0.02;
        boss.x = Player.x - Math.cos(angle) * 300;
        boss.y = Player.y - Math.sin(angle) * 300;
      }
      break;
      
    case 'confusion': // Datamask boss - creates illusions
      if (boss.patternTimer % 150 === 0) {
        // Spawn mini illusions
        for (let i = 0; i < 3; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spawnDist = 150;
          enemies.push({
            x: boss.x + Math.cos(angle) * spawnDist,
            y: boss.y + Math.sin(angle) * spawnDist,
            hp: 1, maxHp: 1, speed: 4, size: 32,
            type: 'basic', shootCooldown: 0, confused: false, confusedTimer: 0, confusedAngle: 0
          });
        }
      }
      // Teleport occasionally
      if (boss.patternTimer % 180 === 0) {
        boss.x = Math.random() * (canvas.width - 200) + 100;
        boss.y = Math.random() * (canvas.height - 200) + 100;
        // Create particles on teleport
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: boss.x, y: boss.y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30, maxLife: 30, size: 8, color: '#ff00ff'
          });
        }
      }
      break;
      
    case 'heal': // Surgical boss - heals and shoots healing orbs that damage player
      if (boss.patternTimer % 60 === 0 && dist < 500) {
        enemyShoot(boss);
      }
      // Heal self slowly
      if (boss.patternTimer % 180 === 0 && boss.hp < boss.maxHp) {
        boss.hp = Math.min(boss.maxHp, boss.hp + 1);
        // Visual feedback
        for (let i = 0; i < 8; i++) {
          particles.push({
            x: boss.x, y: boss.y,
            vx: (Math.random() - 0.5) * 4,
            vy: -Math.random() * 3,
            life: 40, maxLife: 40, size: 6, color: '#00ff88'
          });
        }
      }
      // Keep distance
      if (dist < 300) {
        boss.x -= (dx / dist) * boss.speed * speedMult;
        boss.y -= (dy / dist) * boss.speed * speedMult;
      } else if (dist > 400) {
        boss.x += (dx / dist) * boss.speed * 0.5 * speedMult;
        boss.y += (dy / dist) * boss.speed * 0.5 * speedMult;
      }
      break;
      
    case 'slow': // Shader boss - creates slow zones
      if (boss.patternTimer % 120 === 0) {
        // Shoot spiral pattern
        for (let i = 0; i < 12; i++) {
          const angle = (Math.PI * 2 / 12) * i + boss.phaseTimer * 0.1;
          pies.push({
            x: boss.x, y: boss.y,
            vx: Math.cos(angle) * 6, vy: Math.sin(angle) * 6,
            size: 12, damage: 1, isEnemy: true
          });
        }
      }
      // Move in figure-8 pattern
      const t = boss.phaseTimer * 0.02;
      boss.x = canvas.width/2 + Math.sin(t) * 300;
      boss.y = canvas.height/2 + Math.sin(t * 2) * 150;
      break;
  }
}

// Boss defeated - award mask
function onBossDefeated(bossType) {
  Game.bossActive = false;
  Game.state = 'bossDefeated';
  Game.bossDefeatedTimer = 180; // 3 seconds
  
  // Award the mask (powers stack!)
  if (!Player.masks.includes(bossType)) {
    Player.masks.push(bossType);
    if (Player.activeMask === null) Player.activeMask = 0;
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    // Boss drawing
    if (enemy.type === 'boss') {
      const bossImg = images[`boss-${enemy.bossType}`];
      if (bossImg && bossImg.complete) {
        ctx.save();
        // Glow effect for boss
        ctx.shadowColor = Arenas.find(a => a.id === enemy.bossType)?.color || '#ff0000';
        ctx.shadowBlur = 20;
        ctx.drawImage(bossImg, enemy.x - enemy.size, enemy.y - enemy.size, enemy.size * 2, enemy.size * 2);
        ctx.restore();
      } else {
        ctx.fillStyle = Arenas.find(a => a.id === enemy.bossType)?.color || '#ff0000';
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Boss HP bar (larger)
      const barWidth = enemy.size * 3;
      const hpPercent = enemy.hp / enemy.maxHp;
      ctx.fillStyle = '#000000';
      ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 20, barWidth, 12);
      ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(enemy.x - barWidth/2 + 2, enemy.y - enemy.size - 18, (barWidth - 4) * hpPercent, 8);
      return;
    }
    
    const imgKey = enemy.type === 'basic' ? 'enemy' : enemy.type;
    
    if (images[imgKey] && images[imgKey].complete) {
      ctx.drawImage(images[imgKey], enemy.x - enemy.size, enemy.y - enemy.size, enemy.size * 2, enemy.size * 2);
    } else {
      const color = enemy.type === 'tank' ? '#8a2020' : enemy.type === 'shooter' ? '#ff8040' : '#ff6060';
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // HP bar for damaged enemies
    if (enemy.hp < enemy.maxHp) {
      const barWidth = enemy.size * 2;
      const hpPercent = enemy.hp / enemy.maxHp;
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 8, barWidth, 4);
      ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
      ctx.fillRect(enemy.x - barWidth/2, enemy.y - enemy.size - 8, barWidth * hpPercent, 4);
    }
  });
}

function enemyShoot(enemy) {
  const angle = Math.atan2(Player.y - enemy.y, Player.x - enemy.x);
  pies.push({
    x: enemy.x,
    y: enemy.y,
    vx: Math.cos(angle) * 10,
    vy: Math.sin(angle) * 10,
    size: 12,
    damage: 1,
    isEnemy: true
  });
}

// Particle effects
function createSplat(x, y) {
  for (let i = 0; i < 12; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 8,
      vy: (Math.random() - 0.5) * 8,
      life: 30,
      maxLife: 30,
      size: 6 + Math.random() * 6,
      color: '#fffacd'
    });
  }
}

function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vx *= 0.95;
    p.vy *= 0.95;
    p.life--;
    
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function drawParticles() {
  particles.forEach(p => {
    ctx.globalAlpha = p.life / p.maxLife;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.globalAlpha = 1;
}

// Mask effects - conforme README
// BITMASK: Multi-Target - tortas atingem múltiplos inimigos em área
// ALPHAMASK: Dash Fantasma - dash com invencibilidade
// DATAMASK: Confusão - inimigos ficam desorientados
// SURGICAL: Regeneração - recupera vida ao acertar inimigos
// SHADER: Slow-Motion - tempo mais lento ao mirar
const maskEffects = {
  bitmask: { multiTarget: true, aoeRadius: 80, description: 'Multi-Target: Tortas atingem área' },
  alphamask: { ghostDash: true, invincibleTime: 30, description: 'Dash Fantasma: Invencível no dash' },
  datamask: { confusion: true, confusionDuration: 300, confusionCooldown: 480, description: 'Confusão: Desorienta inimigos' },
  surgical: { healOnHit: true, hitsToHeal: 5, description: 'Regeneração: +1 HP a cada 5 acertos' },
  shader: { slowMotion: true, slowFactor: 0.5, description: 'Slow-Motion: Tempo lento ao mirar' }
};

// Track mask-specific states
const MaskState = {
  hitCounter: 0,
  confusionCooldown: 0,
  confusedEnemies: [],
  isInvincible: false,
  invincibleTimer: 0,
  slowMotionActive: false
};

// Check if player has a specific mask (powers stack!)
function hasMask(maskType) {
  return Player.masks.includes(maskType);
}

function applyMaskEffects() {
  // Reset to base stats
  Player.speed = 7;
  Player.shootDelay = 15;
  Player.dashDelay = 180;
  Player.maxHp = 5;
  Player.dashDist = 180;
  
  // STACKING BONUSES - each mask adds permanent bonuses
  if (hasMask('bitmask')) {
    // AOE damage is always active when you have bitmask
  }
  if (hasMask('alphamask')) {
    Player.speed += 1; // +1 speed
    Player.dashDist += 40; // longer dash
  }
  if (hasMask('datamask')) {
    // Confusion always available
  }
  if (hasMask('surgical')) {
    Player.maxHp += 2; // +2 max HP
  }
  if (hasMask('shader')) {
    Player.shootDelay -= 3; // faster shooting
  }
  
  // Update mask state timers
  if (MaskState.invincibleTimer > 0) {
    MaskState.invincibleTimer--;
    if (MaskState.invincibleTimer <= 0) {
      MaskState.isInvincible = false;
    }
  }
  
  if (MaskState.confusionCooldown > 0) {
    MaskState.confusionCooldown--;
  }
  
  // Slow motion effect when holding mouse (if has Shader mask)
  if (hasMask('shader') && Mouse.pressed) {
    MaskState.slowMotionActive = true;
  } else {
    MaskState.slowMotionActive = false;
  }
  
  // Ensure hp doesn't exceed maxHp
  Player.hp = Math.min(Player.hp, Player.maxHp);
}

function dropMask(x, y) {
  // Masks only come from bosses now
}

function updateMaskDrops() {
  for (let i = maskDrops.length - 1; i >= 0; i--) {
    const mask = maskDrops[i];
    mask.bobOffset += 0.1;
    
    const dx = Player.x - mask.x;
    const dy = Player.y - mask.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < Player.size + 30) {
      Player.masks.push(mask.type);
      if (Player.activeMask === null) Player.activeMask = 0;
      maskDrops.splice(i, 1);
      updateAudience(10); // Collected mask
    }
  }
}

function drawMaskDrops() {
  maskDrops.forEach(mask => {
    const bob = Math.sin(mask.bobOffset) * 6;
    
    if (images[mask.type] && images[mask.type].complete) {
      ctx.drawImage(images[mask.type], mask.x - 24, mask.y - 24 + bob, 48, 48);
    } else {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(mask.x, mask.y + bob, 24, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Glow effect
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(mask.x, mask.y + bob, 28 + Math.sin(mask.bobOffset * 2) * 4, 0, Math.PI * 2);
    ctx.stroke();
  });
}

// Audience system
function updateAudience(change) {
  Audience.value = Math.max(0, Math.min(Audience.max, Audience.value + change));
  
  if (Audience.value <= 0) {
    gameOver();
  }
}

function hitPlayer() {
  // Skip if invincible (Alpha Mask ghost dash)
  if (MaskState.isInvincible) return;
  
  Player.hp--;
  updateAudience(-5);
  
  if (Player.hp <= 0) {
    gameOver();
  }
}

// Wave system
function spawnWave() {
  const enemyCount = 5 + Game.wave * 3 + Game.currentArena * 2;
  
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => spawnEnemy(), i * 800);
  }
}

// Start boss fight
function startBossFight() {
  Game.state = 'bossIntro';
  Game.bossIntroTimer = 120; // 2 seconds intro
  enemies.length = 0; // Clear regular enemies
  pies.length = 0;
}

// Game state functions
function startGame() {
  Game.state = 'playing';
  Game.score = 0;
  Game.wave = 1;
  Game.enemiesKilled = 0;
  Game.arenaTimer = 0;
  Game.currentArena = 0;
  Game.bossActive = false;
  Game.bossIntroTimer = 0;
  Game.bossDefeatedTimer = 0;
  
  Player.x = canvas.width / 2;
  Player.y = canvas.height / 2;
  Player.hp = 5;
  Player.maxHp = 5;
  Player.masks = [];
  Player.activeMask = null;
  
  // Reset mask state
  MaskState.hitCounter = 0;
  MaskState.confusionCooldown = 0;
  MaskState.isInvincible = false;
  MaskState.invincibleTimer = 0;
  MaskState.slowMotionActive = false;
  
  Audience.value = 50;
  
  pies.length = 0;
  enemies.length = 0;
  particles.length = 0;
  maskDrops.length = 0;
  
  spawnWave();
  
  hideAllMenus();
}

function gameOver() {
  Game.state = 'gameOver';
  showGameOver();
}

function victory() {
  Game.state = 'victory';
  showVictory();
}

// UI functions
function createHUD() {
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
      <div>WAVE: <span id="wave-num">1</span>/${Game.maxWaves}</div>
      <div>SCORE: <span id="score-num">0</span></div>
    </div>
  `;
  
  container.appendChild(hud);
  
  const masksContainer = document.createElement('div');
  masksContainer.className = 'masks-equipped';
  masksContainer.id = 'masks-equipped';
  container.appendChild(masksContainer);
}

function updateHUD() {
  // Update hearts - show/hide based on maxHp
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
    audienceFill.style.width = `${(Audience.value / Audience.max) * 100}%`;
  }
  
  // Update arena, wave and score
  const arenaNum = document.getElementById('arena-num');
  const waveNum = document.getElementById('wave-num');
  const scoreNum = document.getElementById('score-num');
  if (arenaNum) arenaNum.textContent = Game.currentArena + 1;
  if (waveNum) waveNum.textContent = Game.bossActive ? 'BOSS' : Game.wave;
  if (scoreNum) scoreNum.textContent = Game.score;
  
  // Update masks - show all collected masks (powers stack)
  const masksContainer = document.getElementById('masks-equipped');
  if (masksContainer) {
    masksContainer.innerHTML = Player.masks.map((mask, i) => `
      <div class="mask-slot active" title="${maskEffects[mask]?.description || mask}">
        <img src="assets/svg/masks/${mask}.svg">
        <div class="mask-number">✓</div>
      </div>
    `).join('');
  }
}

function showMenu() {
  const container = document.getElementById('game-container');
  const menu = document.createElement('div');
  menu.className = 'menu';
  menu.id = 'main-menu';
  
  menu.innerHTML = `
    <h1>PÁ PÁ PÁ</h1>
    <h2>THE MASK GAME</h2>
    <button onclick="startGame()">COMEÇAR</button>
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
}

function showGameOver() {
  const container = document.getElementById('game-container');
  const menu = document.createElement('div');
  menu.className = 'game-end';
  menu.id = 'game-over';
  
  menu.innerHTML = `
    <h2>GAME OVER</h2>
    <p>O público desistiu!</p>
    <div class="score">SCORE: ${Game.score}</div>
    <button onclick="startGame()">TENTAR NOVAMENTE</button>
    <button onclick="location.reload()">MENU</button>
  `;
  
  container.appendChild(menu);
}

function showVictory() {
  const container = document.getElementById('game-container');
  const menu = document.createElement('div');
  menu.className = 'game-end victory';
  menu.id = 'victory';
  
  menu.innerHTML = `
    <h2>VITÓRIA!</h2>
    <p>Você conquistou o público!</p>
    <div class="score">SCORE: ${Game.score}</div>
    <button onclick="startGame()">JOGAR NOVAMENTE</button>
    <button onclick="location.reload()">MENU</button>
  `;
  
  container.appendChild(menu);
}

function hideAllMenus() {
  ['main-menu', 'game-over', 'victory', 'boss-intro', 'boss-defeated'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}

// Main game loop
function update() {
  if (Game.state === 'playing') {
    updatePlayer();
    updatePies();
    updateEnemies();
    updateParticles();
    updateMaskDrops();
    updateHUD();
    
    Game.arenaTimer++;
    
    // Check wave completion
    if (enemies.length === 0 && Game.arenaTimer > 120) {
      Game.wave++;
      Game.arenaTimer = 0;
      
      if (Game.wave > Game.maxWaves) {
        // All waves done - start boss fight!
        startBossFight();
      } else {
        spawnWave();
        updateAudience(15); // Completed wave
      }
    }
    
    // Slowly decrease audience over time
    if (Game.arenaTimer % 180 === 0) {
      updateAudience(-1);
    }
  }
  
  // Boss intro state
  if (Game.state === 'bossIntro') {
    Game.bossIntroTimer--;
    if (Game.bossIntroTimer <= 0) {
      Game.state = 'playing';
      spawnBoss();
    }
  }
  
  // Boss defeated state
  if (Game.state === 'bossDefeated') {
    Game.bossDefeatedTimer--;
    updateHUD();
    if (Game.bossDefeatedTimer <= 0) {
      // Move to next arena
      Game.currentArena++;
      if (Game.currentArena >= 5) {
        // All bosses defeated - victory!
        victory();
      } else {
        // Next arena
        Game.wave = 1;
        Game.arenaTimer = 0;
        Game.state = 'playing';
        Player.hp = Player.maxHp; // Full heal between arenas
        spawnWave();
      }
    }
  }
}

function draw() {
  // Draw current arena background
  const arenaId = Arenas[Game.currentArena]?.id || 'bitmask';
  const arenaImg = images[`arena-${arenaId}`];
  
  if (arenaImg && arenaImg.complete) {
    ctx.drawImage(arenaImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  if (Game.state === 'playing' || Game.state === 'paused') {
    // Slow motion visual effect (tint screen blue)
    if (MaskState.slowMotionActive) {
      ctx.fillStyle = 'rgba(0, 50, 100, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    drawParticles();
    drawPies();
    drawEnemies();
    drawMaskDrops();
    drawPlayer();
    
    // Draw invincibility effect around player
    if (MaskState.isInvincible) {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.7)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(Player.x, Player.y, Player.size + 10, 0, Math.PI * 2);
      ctx.stroke();
    }
    
    if (Game.state === 'paused') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = '48px "Courier New"';
      ctx.textAlign = 'center';
      ctx.fillText('PAUSADO', canvas.width / 2, canvas.height / 2);
      ctx.font = '18px "Courier New"';
      ctx.fillText('Pressione ESC para continuar', canvas.width / 2, canvas.height / 2 + 40);
    }
  }
  
  // Boss intro screen
  if (Game.state === 'bossIntro') {
    const arena = Arenas[Game.currentArena];
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = arena.color;
    ctx.font = 'bold 72px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS FIGHT!', canvas.width / 2, canvas.height / 2 - 50);
    
    ctx.font = '36px "Courier New"';
    ctx.fillText(arena.name, canvas.width / 2, canvas.height / 2 + 20);
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Courier New"';
    ctx.fillText(`Derrote para ganhar: ${arena.mask.toUpperCase()}`, canvas.width / 2, canvas.height / 2 + 80);
    
    // Draw boss preview
    const bossImg = images[arena.boss];
    if (bossImg && bossImg.complete) {
      ctx.drawImage(bossImg, canvas.width / 2 - 64, canvas.height / 2 + 100, 128, 128);
    }
  }
  
  // Boss defeated screen
  if (Game.state === 'bossDefeated') {
    const arena = Arenas[Game.currentArena];
    
    drawParticles();
    drawPlayer();
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 72px "Courier New"';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS DERROTADO!', canvas.width / 2, canvas.height / 2 - 80);
    
    ctx.fillStyle = arena.color;
    ctx.font = '48px "Courier New"';
    ctx.fillText(`+ ${arena.mask.toUpperCase()}`, canvas.width / 2, canvas.height / 2);
    
    // Draw mask obtained
    const maskImg = images[arena.mask];
    if (maskImg && maskImg.complete) {
      ctx.drawImage(maskImg, canvas.width / 2 - 48, canvas.height / 2 + 30, 96, 96);
    }
    
    ctx.fillStyle = '#fff';
    ctx.font = '24px "Courier New"';
    const powerDesc = maskEffects[arena.mask]?.description || '';
    ctx.fillText(powerDesc, canvas.width / 2, canvas.height / 2 + 160);
    
    if (Game.currentArena < 4) {
      ctx.fillText(`Próxima arena: ${Arenas[Game.currentArena + 1].name}`, canvas.width / 2, canvas.height / 2 + 200);
    }
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Initialize
loadAssets();
createHUD();
showMenu();
gameLoop();