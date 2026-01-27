/**
 * Canvas and Renderer
 */

import { CONFIG } from './config.js';

class RendererManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
  }
  
  init(canvasId = 'game-canvas') {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      this.canvas = document.getElementById('gameCanvas');
    }
    this.ctx = this.canvas.getContext('2d');
    
    this.canvas.width = CONFIG.BASE_WIDTH;
    this.canvas.height = CONFIG.BASE_HEIGHT;
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }
  
  resize() {
    const aspectRatio = CONFIG.BASE_WIDTH / CONFIG.BASE_HEIGHT;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    let newWidth = windowWidth * 0.95;
    let newHeight = newWidth / aspectRatio;
    
    if (newHeight > windowHeight * 0.95) {
      newHeight = windowHeight * 0.95;
      newWidth = newHeight * aspectRatio;
    }
    
    const container = document.getElementById('game-container');
    container.style.width = newWidth + 'px';
    container.style.height = newHeight + 'px';
    
    this.canvas.style.width = newWidth + 'px';
    this.canvas.style.height = newHeight + 'px';
  }
  
  clear(color = '#1a1a1a') {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }
  
  drawImage(img, x, y, width, height) {
    if (img && img.complete) {
      this.ctx.drawImage(img, x, y, width, height);
    }
  }
  
  drawCircle(x, y, radius, color) {
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    this.ctx.fill();
  }
  
  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }
  
  drawText(text, x, y, font, color, align = 'center') {
    this.ctx.fillStyle = color;
    this.ctx.font = font;
    this.ctx.textAlign = align;
    this.ctx.fillText(text, x, y);
  }
  
  setAlpha(alpha) {
    this.ctx.globalAlpha = alpha;
  }
  
  resetAlpha() {
    this.ctx.globalAlpha = 1;
  }
  
  save() {
    this.ctx.save();
  }
  
  restore() {
    this.ctx.restore();
  }
  
  translate(x, y) {
    this.ctx.translate(x, y);
  }
  
  rotate(angle) {
    this.ctx.rotate(angle);
  }
  
  get width() {
    return this.canvas.width;
  }
  
  get height() {
    return this.canvas.height;
  }
}

export const Renderer = new RendererManager();
