/**
 * Asset Loader
 */

class AssetLoader {
  constructor() {
    this.images = {};
    this.loaded = false;
    this.loadingPromises = [];
  }
  
  loadSVG(name, path) {
    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ name, img });
      img.onerror = () => {
        console.warn(`Failed to load: ${path}`);
        resolve({ name, img: null });
      };
      img.src = path;
      this.images[name] = img;
    });
    this.loadingPromises.push(promise);
    return promise;
  }
  
  async loadAll() {
    // Player
    this.loadSVG('player', 'assets/svg/player/player-idle.svg');
    
    // Enemies
    this.loadSVG('enemy', 'assets/svg/enemies/basic.svg');
    this.loadSVG('shooter', 'assets/svg/enemies/shooter.svg');
    this.loadSVG('tank', 'assets/svg/enemies/tank.svg');
    
    // Effects
    this.loadSVG('pie', 'assets/svg/effects/pie.svg');
    this.loadSVG('splat', 'assets/svg/effects/pie-splat.svg');
    this.loadSVG('sparkle', 'assets/svg/effects/sparkle.svg');
    
    // Arenas
    this.loadSVG('arena-bitmask', 'assets/svg/arena/arena-bitmask.svg');
    this.loadSVG('arena-alphamask', 'assets/svg/arena/arena-alphamask.svg');
    this.loadSVG('arena-datamask', 'assets/svg/arena/arena-datamask.svg');
    this.loadSVG('arena-surgical', 'assets/svg/arena/arena-surgical.svg');
    this.loadSVG('arena-shader', 'assets/svg/arena/arena-shader.svg');
    
    // Bosses
    this.loadSVG('boss-bitmask', 'assets/svg/bosses/boss-bitmask.svg');
    this.loadSVG('boss-alphamask', 'assets/svg/bosses/boss-alphamask.svg');
    this.loadSVG('boss-datamask', 'assets/svg/bosses/boss-datamask.svg');
    this.loadSVG('boss-surgical', 'assets/svg/bosses/boss-surgical.svg');
    this.loadSVG('boss-shader', 'assets/svg/bosses/boss-shader.svg');
    
    // Masks
    this.loadSVG('bitmask', 'assets/svg/masks/bitmask.svg');
    this.loadSVG('alphamask', 'assets/svg/masks/alphamask.svg');
    this.loadSVG('datamask', 'assets/svg/masks/datamask.svg');
    this.loadSVG('surgical', 'assets/svg/masks/surgical.svg');
    this.loadSVG('shader', 'assets/svg/masks/shader.svg');
    
    // UI backgrounds
    this.loadSVG('menu-bg', 'assets/svg/ui/menu-bg.svg');
    this.loadSVG('menu-vn-bg', 'assets/svg/ui/menu-vn-bg.svg');
    this.loadSVG('select-bg', 'assets/svg/ui/select-bg.svg');
    
    // Character portraits
    this.loadSVG('portrait-player', 'assets/svg/portraits/player.svg');
    this.loadSVG('portrait-bitmask', 'assets/svg/portraits/boss-bitmask.svg');
    this.loadSVG('portrait-alphamask', 'assets/svg/portraits/boss-alphamask.svg');
    this.loadSVG('portrait-datamask', 'assets/svg/portraits/boss-datamask.svg');
    this.loadSVG('portrait-surgical', 'assets/svg/portraits/boss-surgical.svg');
    this.loadSVG('portrait-shader', 'assets/svg/portraits/boss-shader.svg');
    
    await Promise.all(this.loadingPromises);
    this.loaded = true;
  }
  
  get(name) {
    return this.images[name];
  }
  
  isReady(name) {
    const img = this.images[name];
    return img && img.complete;
  }
}

export const Assets = new AssetLoader();
