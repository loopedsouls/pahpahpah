// Basic game setup
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 800;
canvas.height = 600;

// Game loop placeholder
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#fff';
  ctx.fillText('PÁ PÁ PÁ: THE MASK GAME', 300, 300);
  requestAnimationFrame(gameLoop);
}

gameLoop();