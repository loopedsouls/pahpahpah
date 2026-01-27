/**
 * Input Handler
 */

class InputHandler {
  constructor() {
    this.keys = {};
    this.mouse = { x: 0, y: 0, pressed: false };
    this.mouseDown = false;
    this.mouseX = 0;
    this.mouseY = 0;
    this.canvas = null;
    this.onPause = null;
    this.onMaskSelect = null;
  }
  
  init(canvasOrElement) {
    if (typeof canvasOrElement === 'string') {
      this.canvas = document.getElementById(canvasOrElement);
    } else if (canvasOrElement) {
      this.canvas = canvasOrElement;
    } else {
      this.canvas = document.getElementById('game-canvas') || document.getElementById('gameCanvas');
    }
    this.bindEvents();
  }
  
  bindEvents() {
    document.addEventListener('keydown', (e) => this.handleKeyDown(e));
    document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    document.addEventListener('mousedown', () => {
      this.mouse.pressed = true;
      this.mouseDown = true;
    });
    document.addEventListener('mouseup', () => {
      this.mouse.pressed = false;
      this.mouseDown = false;
    });
  }
  
  handleKeyDown(e) {
    this.keys[e.key.toLowerCase()] = true;
    
    if (e.key === 'Escape' && this.onPause) {
      this.onPause();
    }
    
    const num = parseInt(e.key);
    if (num >= 1 && num <= 5 && this.onMaskSelect) {
      this.onMaskSelect(num - 1);
    }
  }
  
  handleKeyUp(e) {
    this.keys[e.key.toLowerCase()] = false;
  }
  
  handleMouseMove(e) {
    const canvas = this.canvas || document.getElementById('game-canvas') || document.getElementById('gameCanvas');
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    this.mouse.x = (e.clientX - rect.left) * scaleX;
    this.mouse.y = (e.clientY - rect.top) * scaleY;
    this.mouseX = this.mouse.x;
    this.mouseY = this.mouse.y;
  }
  
  isKeyPressed(key) {
    return this.keys[key.toLowerCase()] === true;
  }
  
  isMovingLeft() {
    return this.isKeyPressed('a') || this.isKeyPressed('arrowleft');
  }
  
  isMovingRight() {
    return this.isKeyPressed('d') || this.isKeyPressed('arrowright');
  }
  
  isMovingUp() {
    return this.isKeyPressed('w') || this.isKeyPressed('arrowup');
  }
  
  isMovingDown() {
    return this.isKeyPressed('s') || this.isKeyPressed('arrowdown');
  }
  
  isDashing() {
    return this.isKeyPressed(' ') || this.isKeyPressed('shift');
  }
  
  isUsingAbility() {
    return this.isKeyPressed('q');
  }
  
  isShooting() {
    return this.mouse.pressed;
  }
  
  getMousePosition() {
    return { x: this.mouse.x, y: this.mouse.y };
  }
}

export const Input = new InputHandler();
