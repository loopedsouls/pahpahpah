// PÁ PÁ PÁ: THE MASK GAME - MVP Implementation
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

canvas.width = 960;
canvas.height = 540;

// Game State
const Game = {
  state: 'menu', // menu, playing, paused, gameOver, victory
  score: 0,
  wave: 1,
  maxWaves: 4,
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
  // Movement
  const dx = (Keys['d'] || Keys['arrowright'] ? 1 : 0) - (Keys['a'] || Keys['arrowleft'] ? 1 : 0);
  const dy = (Keys['s'] || Keys['arrowdown'] ? 1 : 0) - (Keys['w'] || Keys['arrowup'] ? 1 : 0);
  
  if (dx !== 0 || dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    Player.x += (dx / length) * Player.speed;
    Player.y += (dy / length) * Player.speed;
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
    const dashDist = 80;
    Player.x += Math.cos(Player.angle) * dashDist;
    Player.y += Math.sin(Player.angle) * dashDist;
    Player.dashCooldown = Player.dashDelay;
    
    // Keep in bounds after dash
    Player.x = Math.max(Player.size, Math.min(canvas.width - Player.size, Player.x));
    Player.y = Math.max(Player.size, Math.min(canvas.height - Player.size, Player.y));
  }
}

function shootPie() {
  pies.push({
    x: Player.x,
    y: Player.y,
    vx: Math.cos(Player.angle) * 8,
    vy: Math.sin(Player.angle) * 8,
    size: 8,
    damage: 1
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
  
  // Determine enemy type based on wave
  const rand = Math.random();
  let type, hp, speed, size;
  
  if (Game.wave >= 3 && rand < 0.2) {
    // Tank - rare, tough
    type = 'tank';
    hp = 3;
    speed = 0.8;
    size = 16;
  } else if (Game.wave >= 2 && rand < 0.5) {
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
  enemies.forEach(enemy => {
    const dx = Player.x - enemy.x;
    const dy = Player.y - enemy.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    
    // Shooter behavior - keep distance and shoot
    if (enemy.type === 'shooter') {
      if (dist > 150) {
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      } else if (dist < 120) {
        enemy.x -= (dx / dist) * enemy.speed * 0.5;
        enemy.y -= (dy / dist) * enemy.speed * 0.5;
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
        enemy.x += (dx / dist) * enemy.speed;
        enemy.y += (dy / dist) * enemy.speed;
      }
    }
    
    // Check collision with player
    if (dist < Player.size + enemy.size) {
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
      const dx = enemy.x - pie.x;
      const dy = enemy.y - pie.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < enemy.size + pie.size) {
        enemy.hp -= pie.damage;
        pies.splice(j, 1);
        createSplat(enemy.x, enemy.y);
        updateAudience(5); // Hit
        
        if (enemy.hp <= 0) {
          Game.enemiesKilled++;
          Game.score += 100;
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

function drawEnemies() {
  enemies.forEach(enemy => {
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

function drawMaskDrops() {
  maskDrops.forEach(mask => {
    const bob = Math.sin(mask.bobOffset) * 3;
    
    if (images[mask.type] && images[mask.type].complete) {
      ctx.drawImage(images[mask.type], mask.x - 12, mask.y - 12 + bob, 24, 24);
    } else {
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(mask.x, mask.y + bob, 12, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Glow effect
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(mask.x, mask.y + bob, 14 + Math.sin(mask.bobOffset * 2) * 2, 0, Math.PI * 2);
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
  Player.hp--;
  updateAudience(-5);
  
  if (Player.hp <= 0) {
    gameOver();
  }
}

// Wave system
function spawnWave() {
  const enemyCount = 5 + Game.wave * 3;
  
  for (let i = 0; i < enemyCount; i++) {
    setTimeout(() => spawnEnemy(), i * 1000);
  }
}

// Game state functions
function startGame() {
  Game.state = 'playing';
  Game.score = 0;
  Game.wave = 1;
  Game.enemiesKilled = 0;
  Game.arenaTimer = 0;
  
  Player.x = canvas.width / 2;
  Player.y = canvas.height / 2;
  Player.hp = Player.maxHp;
  Player.masks = [];
  Player.activeMask = null;
  
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
      ${Array(Player.maxHp).fill('<img class="heart" src="assets/svg/ui/heart-full.svg">').join('')}
    </div>
    <div class="audience-bar">
      <div class="audience-label">PÚBLICO</div>
      <div class="bar-container">
        <div class="bar-fill" id="audience-fill" style="width: 50%"></div>
      </div>
    </div>
    <div class="hud-right">
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
  
  // Update wave and score
  const waveNum = document.getElementById('wave-num');
  const scoreNum = document.getElementById('score-num');
  if (waveNum) waveNum.textContent = Game.wave;
  if (scoreNum) scoreNum.textContent = Game.score;
  
  // Update masks
  const masksContainer = document.getElementById('masks-equipped');
  if (masksContainer) {
    masksContainer.innerHTML = Player.masks.map((mask, i) => `
      <div class="mask-slot ${i === Player.activeMask ? 'active' : ''}">
        <img src="assets/svg/masks/${mask}.svg">
        <div class="mask-number">${i + 1}</div>
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
    updateParticles();
    updateMaskDrops();
    updateHUD();
    
    Game.arenaTimer++;
    
    // Check wave completion
    if (enemies.length === 0 && Game.arenaTimer > 120) {
      Game.wave++;
      Game.arenaTimer = 0;
      
      if (Game.wave > Game.maxWaves) {
        victory();
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
}

function draw() {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  if (Game.state === 'playing' || Game.state === 'paused') {
    drawParticles();
    drawPies();
    drawEnemies();
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