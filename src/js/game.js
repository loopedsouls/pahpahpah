// PÁ PÁ PÁ: THE MASK GAME - MVP Implementation
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

// Game State
const Game = {
  state: 'menu', // menu, playing, paused, gameOver, victory
  score: 0,
  arena: 1,
  maxArenas: 4,
  enemiesKilled: 0,
  arenaTimer: 0,
  maxArenaTime: 120 * 60 // 2 minutes in frames
};

// Player
const Player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 16,
  speed: 3,
  hp: 5,
  maxHp: 5,
  angle: 0,
  color: '#4080ff',
  shootCooldown: 0,
  shootDelay: 15,
  dashCooldown: 0,
  dashDelay: 180,
  masks: [],
  activeMask: null,
  maskCooldowns: {},
  invulnerable: 0,
  slowMotionActive: 0,
  hitCombo: 0,
  lastHitTime: 0
};

// Input
const Keys = {};
const Mouse = { x: 0, y: 0, pressed: false };

// Arrays
const pies = [];
const enemies = [];
const particles = [];
const maskDrops = [];
const obstacles = [];
let boss = null;

// Audience Meter
const Audience = {
  value: 50,
  max: 100
};

// Arenas
const Arenas = [
  {
    name: 'Teste',
    enemyCount: (arena) => 5 + arena * 3,
    obstacles: [],
    backgroundColor: '#2a2a2a',
    size: {w: canvas.width, h: canvas.height}
  },
  {
    name: 'Ao Vivo',
    enemyCount: (arena) => 5 + arena * 3,
    obstacles: [
      {x: 200, y: 200, w: 50, h: 50, type: 'box'},
      {x: 600, y: 300, w: 50, h: 50, type: 'box'}
    ],
    backgroundColor: '#3a3a3a',
    size: {w: canvas.width, h: canvas.height}
  },
  {
    name: 'Prime Time',
    enemyCount: (arena) => 5 + arena * 3,
    obstacles: [
      {x: 150, y: 150, w: 40, h: 40, type: 'speaker'},
      {x: 400, y: 250, w: 40, h: 40, type: 'speaker'},
      {x: 700, y: 350, w: 40, h: 40, type: 'speaker'}
    ],
    backgroundColor: '#4a4a4a',
    size: {w: canvas.width, h: canvas.height}
  },
  {
    name: 'Showdown',
    enemyCount: (arena) => 0,
    obstacles: [],
    backgroundColor: '#5a5a5a',
    size: {w: canvas.width, h: canvas.height}
  }
];

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
  
  // Mask selection and activation
  if (Game.state === 'playing') {
    const num = parseInt(e.key);
    if (num >= 1 && num <= Player.masks.length) {
      const maskIndex = num - 1;
      Player.activeMask = maskIndex;
      
      // Activate mask power
      const maskType = Player.masks[maskIndex];
      const power = MaskPowers[maskType];
      
      if (!power.passive && (!Player.maskCooldowns[maskType] || Player.maskCooldowns[maskType] <= 0)) {
        power.activate();
      }
    }
  }
});

document.addEventListener('keyup', (e) => {
  Keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  Mouse.x = e.clientX - rect.left;
  Mouse.y = e.clientY - rect.top;
});

canvas.addEventListener('mousedown', () => {
  Mouse.pressed = true;
});

canvas.addEventListener('mouseup', () => {
  Mouse.pressed = false;
});

// Player functions
function updatePlayer() {
  // Update mask cooldowns
  Object.keys(Player.maskCooldowns).forEach(mask => {
    if (Player.maskCooldowns[mask] > 0) {
      Player.maskCooldowns[mask]--;
    }
  });
  
  // Update invulnerability
  if (Player.invulnerable > 0) Player.invulnerable--;
  
  // Update slow motion
  if (Player.slowMotionActive > 0) Player.slowMotionActive--;
  
  // Movement (slower during slow-mo)
  const speedMult = Player.slowMotionActive > 0 ? 1.5 : 1;
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
  
  // Check obstacle collision
  obstacles.forEach(obs => {
    const dx = Player.x - obs.x;
    const dy = Player.y - obs.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < Player.size + Math.max(obs.w, obs.h) / 2) {
      const angle = Math.atan2(dy, dx);
      Player.x = obs.x + Math.cos(angle) * (Player.size + Math.max(obs.w, obs.h) / 2 + 1);
      Player.y = obs.y + Math.sin(angle) * (Player.size + Math.max(obs.w, obs.h) / 2 + 1);
    }
  });
  
  // Keep in bounds again after obstacle push
  Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
  Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
  
  // Aim
  Player.angle = Math.atan2(Mouse.y - Player.y, Mouse.x - Player.x);
  
  // Shoot (faster during slow-mo for player advantage)
  if (Player.shootCooldown > 0) Player.shootCooldown--;
  
  const shootDelayMult = Player.slowMotionActive > 0 ? 0.7 : 1;
  if (Mouse.pressed && Player.shootCooldown === 0) {
    shootPie();
    Player.shootCooldown = Math.floor(Player.shootDelay * shootDelayMult);
  }
  
  // Dash
  if (Player.dashCooldown > 0) Player.dashCooldown--;
  
  if ((Keys[' '] || Keys['shift']) && Player.dashCooldown === 0) {
    const dashDist = 80;
    Player.x += Math.cos(Player.angle) * dashDist;
    Player.y += Math.sin(Player.angle) * dashDist;
    Player.dashCooldown = Player.dashDelay;
    
    // Keep in bounds after dash
    Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
    Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
  }
  
  // Check for combo timeout
  if (Date.now() - Player.lastHitTime > 3000) {
    Player.hitCombo = 0;
  }
}

function shootPie() {
  const speed = Player.slowMotionActive > 0 ? 10 : 8;
  pies.push({
    x: Player.x,
    y: Player.y,
    vx: Math.cos(Player.angle) * speed,
    vy: Math.sin(Player.angle) * speed,
    size: 8,
    damage: 1
  });
}

function drawPlayer() {
  ctx.save();
  ctx.translate(Player.x, Player.y);
  ctx.rotate(Player.angle);
  
  // Flash when invulnerable
  if (Player.invulnerable > 0 && Math.floor(Player.invulnerable / 5) % 2 === 0) {
    ctx.globalAlpha = 0.5;
  }
  
  if (images.player && images.player.complete) {
    ctx.drawImage(images.player, -Player.size, -Player.size, Player.size * 2, Player.size * 2);
  } else {
    ctx.fillStyle = Player.color;
    ctx.beginPath();
    ctx.arc(0, 0, Player.size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.globalAlpha = 1;
  ctx.restore();
  
  // Draw slow-motion indicator
  if (Player.slowMotionActive > 0) {
    ctx.strokeStyle = '#ff00ff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(Player.x, Player.y, Player.size + 5, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// Pie functions
function updatePies() {
  for (let i = pies.length - 1; i >= 0; i--) {
    const pie = pies[i];
    pie.x += pie.vx;
    pie.y += pie.vy;
    
    // Check obstacle collision
    let hitObstacle = false;
    for (const obs of obstacles) {
      const dx = pie.x - obs.x;
      const dy = pie.y - obs.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < pie.size + Math.max(obs.w, obs.h) / 2) {
        hitObstacle = true;
        break;
      }
    }
    if (hitObstacle) {
      pies.splice(i, 1);
      if (!pie.isEnemy) updateAudience(-2);
      continue;
    }
    
    // Check if enemy pie hits player (skip if invulnerable)
    if (pie.isEnemy && Player.invulnerable <= 0) {
      const dx = Player.x - pie.x;
      const dy = Player.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < Player.size + pie.size) {
        hitPlayer();
        pies.splice(i, 1);
        continue;
      }
    }
    
    // Check if player pie hits boss
    if (!pie.isEnemy && boss) {
      const dx = boss.x - pie.x;
      const dy = boss.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < boss.size + pie.size) {
        boss.hp -= pie.damage;
        pies.splice(i, 1);
        createSplat(boss.x, boss.y);
        
        // Update hit combo
        Player.hitCombo++;
        Player.lastHitTime = Date.now();
        
        // Check surgical mask passive
        if (Player.masks.includes('surgical')) {
          MaskPowers.surgical.check();
        }
        
        // Audience bonus for combos
        let audienceBonus = 5;
        if (Player.hitCombo >= 3) audienceBonus += 10;
        if (Player.hitCombo >= 5) audienceBonus += 5;
        updateAudience(audienceBonus);
        
        if (boss.hp <= 0) {
          Game.enemiesKilled += 10;
          Game.score += 1000;
          updateAudience(20);
          boss = null;
        }
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
  
  // Determine enemy type based on arena
  const rand = Math.random();
  let type, hp, speed, size;
  
  if (Game.arena >= 3 && rand < 0.2) {
    // Tank - rare, tough
    type = 'tank';
    hp = 3;
    speed = 0.8;
    size = 16;
  } else if (Game.arena >= 2 && rand < 0.5) {
    // Shooter - medium
    type = 'shooter';
    hp = 1;
    speed = 1.2;
    size = 12;
  } else {
    // Basic - common
    type = 'basic';
    hp = 1;
    speed = 1 + Math.random() * 0.5;
    size = 12;
  }
  
  enemies.push({ x, y, hp, maxHp: hp, speed, size, type, shootCooldown: 0 });
}

function updateEnemies() {
  const slowMult = Player.slowMotionActive > 0 ? 0.5 : 1;
  
  enemies.forEach(enemy => {
    // Update confusion
    if (enemy.confused && enemy.confused > 0) {
      enemy.confused--;
    }
    
    const dx = Player.x - enemy.x;
    const dy = Player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Confused enemies move randomly
    if (enemy.confused && enemy.confused > 0) {
      if (!enemy.confusedAngle || Math.random() < 0.05) {
        enemy.confusedAngle = Math.random() * Math.PI * 2;
      }
      enemy.x += Math.cos(enemy.confusedAngle) * enemy.speed * slowMult * 0.5;
      enemy.y += Math.sin(enemy.confusedAngle) * enemy.speed * slowMult * 0.5;
    } else {
      // Normal behavior
      // Shooter behavior - keep distance and shoot
      if (enemy.type === 'shooter') {
        if (dist > 150) {
          enemy.x += (dx / dist) * enemy.speed * slowMult;
          enemy.y += (dy / dist) * enemy.speed * slowMult;
        } else if (dist < 120) {
          enemy.x -= (dx / dist) * enemy.speed * slowMult * 0.5;
          enemy.y -= (dy / dist) * enemy.speed * slowMult * 0.5;
        }
        
        // Shoot at player
        if (enemy.shootCooldown <= 0 && dist < 300) {
          enemyShoot(enemy);
          enemy.shootCooldown = 120; // 2 seconds
        }
        enemy.shootCooldown--;
      } else {
        // Basic and tank - chase player
        if (dist > 0) {
          enemy.x += (dx / dist) * enemy.speed * slowMult;
          enemy.y += (dy / dist) * enemy.speed * slowMult;
        }
      }
    }
    
    // Check obstacle collision
    obstacles.forEach(obs => {
      const dx = enemy.x - obs.x;
      const dy = enemy.y - obs.y;
      const distObs = Math.sqrt(dx * dx + dy * dy);
      if (distObs < enemy.size + Math.max(obs.w, obs.h) / 2) {
        const angle = Math.atan2(dy, dx);
        enemy.x = obs.x + Math.cos(angle) * (enemy.size + Math.max(obs.w, obs.h) / 2 + 1);
        enemy.y = obs.y + Math.sin(angle) * (enemy.size + Math.max(obs.w, obs.h) / 2 + 1);
      }
    });
    
    // Keep in bounds
    enemy.x = Math.max(enemy.size, Math.min(canvas.width - enemy.size, enemy.x));
    enemy.y = Math.max(enemy.size, Math.min(canvas.height - enemy.size, enemy.y));
    
    // Check collision with player (not when invulnerable)
    if (dist < Player.size + enemy.size && Player.invulnerable <= 0) {
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
      if (pie.isEnemy) continue;
      
      const dx = enemy.x - pie.x;
      const dy = enemy.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < enemy.size + pie.size) {
        enemy.hp -= pie.damage;
        pies.splice(j, 1);
        createSplat(enemy.x, enemy.y);
        
        // Update hit combo
        Player.hitCombo++;
        Player.lastHitTime = Date.now();
        
        // Check surgical mask passive
        if (Player.masks.includes('surgical')) {
          MaskPowers.surgical.check();
        }
        
        // Audience bonus for combos
        let audienceBonus = 5;
        if (Player.hitCombo >= 3) audienceBonus += 10;
        if (Player.hitCombo >= 5) audienceBonus += 5;
        updateAudience(audienceBonus);
        
        if (enemy.hp <= 0) {
          Game.enemiesKilled++;
          Game.score += 100 * Math.max(1, Math.floor(Player.hitCombo / 2));
          updateAudience(8); // Kill
          
          // Drop mask every 3 kills
          if (Game.enemiesKilled % 3 === 0) {
            dropMask(enemy.x, enemy.y);
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

function updateBoss() {
  if (!boss) return;
  
  boss.teleportCooldown--;
  boss.attackCooldown--;
  
  // Phase transition
  if (boss.hp <= 5 && boss.phase === 1) {
    boss.phase = 2;
    // Spawn clones
    for (let i = 0; i < 3; i++) {
      const clone = {
        x: boss.x + (Math.random() - 0.5) * 100,
        y: boss.y + (Math.random() - 0.5) * 100,
        hp: 1,
        maxHp: 1,
        speed: 1.2,
        size: 16,
        type: 'clone',
        shootCooldown: 0
      };
      enemies.push(clone);
    }
  }
  
  // Teleport
  if (boss.teleportCooldown <= 0) {
    boss.x = Math.random() * (canvas.width - 100) + 50;
    boss.y = Math.random() * (canvas.height - 100) + 50;
    boss.teleportCooldown = 180;
  }
  
  // Attack
  if (boss.attackCooldown <= 0) {
    // Fan attack
    const baseAngle = Math.atan2(Player.y - boss.y, Player.x - boss.x);
    for (let i = -2; i <= 2; i++) {
      const angle = baseAngle + (Math.PI / 6) * i;
      pies.push({
        x: boss.x,
        y: boss.y,
        vx: Math.cos(angle) * 6,
        vy: Math.sin(angle) * 6,
        size: 8,
        damage: 1,
        isEnemy: true
      });
    }
    boss.attackCooldown = 120;
  }
  
  // Move towards player
  const dx = Player.x - boss.x;
  const dy = Player.y - boss.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 0) {
    boss.x += (dx / dist) * boss.speed;
    boss.y += (dy / dist) * boss.speed;
  }
  
  // Keep in bounds
  boss.x = Math.max(boss.size, Math.min(canvas.width - boss.size, boss.x));
  boss.y = Math.max(boss.size, Math.min(canvas.height - boss.size, boss.y));
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.save();
    
    // Tint confused enemies
    if (enemy.confused && enemy.confused > 0) {
      ctx.globalAlpha = 0.7;
      ctx.filter = 'hue-rotate(90deg)';
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
    
    ctx.restore();
    
    // Confusion indicator
    if (enemy.confused && enemy.confused > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('?', enemy.x, enemy.y - enemy.size - 12);
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

function drawBoss() {
  if (!boss) return;
  
  ctx.save();
  
  // Boss appearance
  if (images['boss'] && images['boss'].complete) {
    ctx.drawImage(images['boss'], boss.x - boss.size, boss.y - boss.size, boss.size * 2, boss.size * 2);
  } else {
    ctx.fillStyle = '#800080';
    ctx.beginPath();
    ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
    ctx.fill();
  }
  
  ctx.restore();
  
  // HP bar
  const barWidth = boss.size * 2;
  const hpPercent = boss.hp / boss.maxHp;
  
  ctx.fillStyle = '#000000';
  ctx.fillRect(boss.x - barWidth/2, boss.y - boss.size - 8, barWidth, 4);
  ctx.fillStyle = hpPercent > 0.5 ? '#00ff00' : hpPercent > 0.25 ? '#ffff00' : '#ff0000';
  ctx.fillRect(boss.x - barWidth/2, boss.y - boss.size - 8, barWidth * hpPercent, 4);
  
  // Phase indicator
  ctx.fillStyle = '#ffffff';
  ctx.font = '16px Arial';
  ctx.textAlign = 'center';
  ctx.fillText(`Phase ${boss.phase}`, boss.x, boss.y - boss.size - 20);
}

function enemyShoot(enemy) {
  const angle = Math.atan2(Player.y - enemy.y, Player.x - enemy.x);
  pies.push({
    x: enemy.x,
    y: enemy.y,
    vx: Math.cos(angle) * 5,
    vy: Math.sin(angle) * 5,
    size: 6,
    damage: 1,
    isEnemy: true
  });
}

// Particle effects
function createSplat(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 30,
      maxLife: 30,
      size: 3 + Math.random() * 3,
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

// Mask system
const maskTypes = ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];

const MaskPowers = {
  bitmask: {
    name: 'Bitmask',
    cooldown: 180, // 3 seconds
    description: 'Multi-target shot',
    activate: () => {
      // Shoots 5 pies in a cone
      const baseAngle = Player.angle;
      const spread = Math.PI / 6; // 30 degrees
      for (let i = -2; i <= 2; i++) {
        const angle = baseAngle + (spread * i / 2);
        pies.push({
          x: Player.x,
          y: Player.y,
          vx: Math.cos(angle) * 8,
          vy: Math.sin(angle) * 8,
          size: 8,
          damage: 1,
          isBitmask: true
        });
      }
      Player.maskCooldowns.bitmask = MaskPowers.bitmask.cooldown;
    }
  },
  alphamask: {
    name: 'Alpha Mask',
    cooldown: 240, // 4 seconds
    description: 'Ghost dash',
    activate: () => {
      const dashDist = 100;
      Player.x += Math.cos(Player.angle) * dashDist;
      Player.y += Math.sin(Player.angle) * dashDist;
      Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
      Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
      Player.invulnerable = 30; // 0.5s invincibility
      Player.maskCooldowns.alphamask = MaskPowers.alphamask.cooldown;
      
      // Create dash trail
      for (let i = 0; i < 10; i++) {
        particles.push({
          x: Player.x - Math.cos(Player.angle) * i * 10,
          y: Player.y - Math.sin(Player.angle) * i * 10,
          vx: 0, vy: 0,
          life: 20, maxLife: 20,
          size: Player.size,
          color: '#4080ff'
        });
      }
    }
  },
  datamask: {
    name: 'Data Mask',
    cooldown: 360, // 6 seconds
    description: 'Confuse enemies',
    activate: () => {
      enemies.forEach(enemy => {
        enemy.confused = 300; // 5 seconds
      });
      Player.maskCooldowns.datamask = MaskPowers.datamask.cooldown;
    }
  },
  surgical: {
    name: 'Surgical Mask',
    passive: true,
    description: '+1 HP per 5 hits',
    check: () => {
      if (Player.hitCombo >= 5 && Player.hp < Player.maxHp) {
        Player.hp++;
        Player.hitCombo = 0;
        updateAudience(5);
        
        // Heal effect
        for (let i = 0; i < 15; i++) {
          particles.push({
            x: Player.x,
            y: Player.y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3,
            life: 40,
            maxLife: 40,
            size: 4,
            color: '#00ff00'
          });
        }
      }
    }
  },
  shader: {
    name: 'Shader Mask',
    cooldown: 300, // 5 seconds
    description: 'Slow-motion aim',
    activate: () => {
      Player.slowMotionActive = 180; // 3 seconds
      Player.maskCooldowns.shader = MaskPowers.shader.cooldown;
    }
  }
};

function dropMask(x, y) {
  const availableMasks = maskTypes.filter(m => !Player.masks.includes(m));
  if (availableMasks.length === 0) return;
  
  const maskType = availableMasks[Math.floor(Math.random() * availableMasks.length)];
  
  maskDrops.push({
    x, y,
    type: maskType,
    bobOffset: Math.random() * Math.PI * 2
  });
}

function updateMaskDrops() {
  for (let i = maskDrops.length - 1; i >= 0; i--) {
    const mask = maskDrops[i];
    mask.bobOffset += 0.1;
    
    const dx = Player.x - mask.x;
    const dy = Player.y - mask.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    if (dist < Player.size + 15) {
      Player.masks.push(mask.type);
      if (Player.activeMask === null) Player.activeMask = 0;
      maskDrops.splice(i, 1);
      updateAudience(10); // Collected mask
    }
  }
}

function drawObstacles() {
  obstacles.forEach(obstacle => {
    ctx.fillStyle = '#666';
    ctx.fillRect(obstacle.x - obstacle.w/2, obstacle.y - obstacle.h/2, obstacle.w, obstacle.h);
    ctx.strokeStyle = '#999';
    ctx.lineWidth = 2;
    ctx.strokeRect(obstacle.x - obstacle.w/2, obstacle.y - obstacle.h/2, obstacle.w, obstacle.h);
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
  Player.hp--;
  updateAudience(-5);
  
  if (Player.hp <= 0) {
    gameOver();
  }
}

// Arena system
function spawnArena() {
  const arenaData = Arenas[Game.arena - 1];
  const enemyCount = arenaData.enemyCount(Game.arena);
  
  obstacles.length = 0; // clear
  obstacles.push(...arenaData.obstacles.map(o => ({...o}))); // copy
  
  if (Game.arena === 4) {
    spawnBoss();
  } else {
    for (let i = 0; i < enemyCount; i++) {
      setTimeout(() => spawnEnemy(), i * 1000);
    }
  }
}

function spawnBoss() {
  boss = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    hp: 10,
    maxHp: 10,
    size: 24,
    speed: 1,
    phase: 1,
    teleportCooldown: 0,
    attackCooldown: 0,
    clones: []
  };
}

// Game state functions
function startGame() {
  Game.state = 'playing';
  Game.score = 0;
  Game.arena = 1;
  Game.enemiesKilled = 0;
  Game.arenaTimer = 0;
  
  Player.x = canvas.width / 2;
  Player.y = canvas.height / 2;
  Player.hp = Player.maxHp;
  Player.masks = [];
  Player.activeMask = null;
  Player.maskCooldowns = {};
  Player.invulnerable = 0;
  Player.slowMotionActive = 0;
  Player.hitCombo = 0;
  Player.lastHitTime = 0;
  
  Audience.value = 50;
  
  pies.length = 0;
  enemies.length = 0;
  particles.length = 0;
  maskDrops.length = 0;
  boss = null;
  
  spawnArena();
  
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
      ${Array(Player.maxHp).fill('<img class="heart" src="assets/svg/ui/heart-full.svg">').join('')}
      <div id="combo-display" style="display: none; color: #ffd700; font-weight: bold; margin-top: 8px;">
        COMBO: <span id="combo-num">0</span>x
      </div>
    </div>
    <div class="audience-bar">
      <div class="audience-label">PÚBLICO</div>
      <div class="bar-container">
        <div class="bar-fill" id="audience-fill" style="width: 50%"></div>
      </div>
    </div>
    <div class="hud-right">
      <div>ARENA: <span id="wave-num">1</span>/${Game.maxArenas}</div>
      <div>SCORE: <span id="score-num">0</span></div>
      <div id="timer-display">TEMPO: <span id="timer-num">2:00</span></div>
    </div>
  `;
  
  container.appendChild(hud);
  
  const masksContainer = document.createElement('div');
  masksContainer.className = 'masks-equipped';
  masksContainer.id = 'masks-equipped';
  container.appendChild(masksContainer);
}

function updateHUD() {
  // Update hearts
  const hearts = document.querySelectorAll('.heart');
  hearts.forEach((heart, i) => {
    heart.src = i < Player.hp ? 'assets/svg/ui/heart-full.svg' : 'assets/svg/ui/heart-empty.svg';
  });
  
  // Update audience
  const audienceFill = document.getElementById('audience-fill');
  if (audienceFill) {
    audienceFill.style.width = `${(Audience.value / Audience.max) * 100}%`;
  }
  
  // Update arena and score
  const waveNum = document.getElementById('wave-num');
  const scoreNum = document.getElementById('score-num');
  if (waveNum) waveNum.textContent = Game.arena;
  if (scoreNum) scoreNum.textContent = Game.score;
  
  // Update combo
  const comboDisplay = document.getElementById('combo-display');
  const comboNum = document.getElementById('combo-num');
  if (comboDisplay && comboNum) {
    if (Player.hitCombo >= 3) {
      comboDisplay.style.display = 'block';
      comboNum.textContent = Player.hitCombo;
    } else {
      comboDisplay.style.display = 'none';
    }
  }
  
  // Update timer
  const timerNum = document.getElementById('timer-num');
  if (timerNum && Game.state === 'playing') {
    const timeLeft = Math.max(0, Game.maxArenaTime - Game.arenaTimer);
    const minutes = Math.floor(timeLeft / 3600);
    const seconds = Math.floor((timeLeft % 3600) / 60);
    timerNum.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Update masks
  const masksContainer = document.getElementById('masks-equipped');
  if (masksContainer) {
    masksContainer.innerHTML = Player.masks.map((mask, i) => {
      const cooldown = Player.maskCooldowns[mask] || 0;
      const maxCooldown = MaskPowers[mask].cooldown || 0;
      const cdPercent = maxCooldown > 0 ? (cooldown / maxCooldown) * 100 : 0;
      const isPassive = MaskPowers[mask].passive;
      
      return `
        <div class="mask-slot ${i === Player.activeMask ? 'active' : ''} ${cooldown > 0 && !isPassive ? 'on-cooldown' : ''}">
          <img src="assets/svg/masks/${mask}.svg">
          <div class="mask-number">${i + 1}</div>
          ${cooldown > 0 && !isPassive ? `<div class="mask-cooldown" style="height: ${cdPercent}%"></div>` : ''}
          ${isPassive ? '<div class="mask-passive-indicator">P</div>' : ''}
        </div>
      `;
    }).join('');
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
      ESPAÇO - Dash | 1-5 - Trocar Máscara
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
  ['main-menu', 'game-over', 'victory'].forEach(id => {
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
    updateBoss();
    updateParticles();
    updateMaskDrops();
    updateHUD();
    
    Game.arenaTimer++;
    
    // Check arena time limit
    if (Game.arenaTimer >= Game.maxArenaTime) {
      gameOver();
      return;
    }
    
    // Check arena completion
    if ((enemies.length === 0 && (!boss || boss.hp <= 0)) && Game.arenaTimer > 120) {
      Game.arena++;
      Game.arenaTimer = 0;
      
      if (Game.arena > Game.maxArenas) {
        victory();
      } else {
        spawnArena();
        updateAudience(15); // Completed arena
      }
    }
    
    // Slowly decrease audience over time
    if (Game.arenaTimer % 180 === 0) {
      updateAudience(-1);
    }
  }
}

function draw() {
  ctx.fillStyle = Game.state === 'playing' ? Arenas[Game.arena - 1].backgroundColor : '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (Game.state === 'playing' || Game.state === 'paused') {
    drawParticles();
    drawPies();
    drawEnemies();
    drawBoss();
    drawObstacles();
    drawMaskDrops();
    drawPlayer();
    
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