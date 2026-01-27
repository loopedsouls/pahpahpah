/**
 * PÁ PÁ PÁ: THE MASK GAME
 * Configuration and Constants
 */

export const CONFIG = {
  // Canvas
  BASE_WIDTH: 1920,
  BASE_HEIGHT: 1080,
  
  // Game settings
  MAX_WAVES_PER_ARENA: 3,
  TOTAL_ARENAS: 5,
  MAX_ARENA_TIME: 120 * 60, // 2 minutes in frames
  FPS: 60,
  
  // Player defaults
  PLAYER: {
    SIZE: 48,
    SPEED: 7,
    HP: 5,
    SHOOT_DELAY: 15,
    DASH_DELAY: 180,
    DASH_DISTANCE: 180
  },
  
  // Enemy settings
  ENEMY: {
    BASIC: { HP: 1, SPEED: 2.5, SIZE: 48 },
    SHOOTER: { HP: 1, SPEED: 2.8, SIZE: 48, SHOOT_COOLDOWN: 120, RANGE: 600 },
    TANK: { HP: 3, SPEED: 2, SIZE: 64 }
  },
  
  // Audience
  AUDIENCE: {
    INITIAL: 50,
    MAX: 100,
    HIT_BONUS: 5,
    KILL_BONUS: 8,
    BOSS_KILL_BONUS: 30,
    WAVE_COMPLETE_BONUS: 15,
    MISS_PENALTY: -2,
    HIT_PENALTY: -5,
    TIME_DECAY: -1,
    DECAY_INTERVAL: 180
  },
  
  // Projectiles
  PROJECTILE: {
    PLAYER_SPEED: 16,
    PLAYER_SIZE: 16,
    ENEMY_SPEED: 10,
    ENEMY_SIZE: 12
  },
  
  // Timers
  TIMERS: {
    BOSS_INTRO: 120,
    BOSS_DEFEATED: 180,
    INVINCIBLE: 30,
    CONFUSION_DURATION: 300,
    CONFUSION_COOLDOWN: 480
  }
};

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  VICTORY: 'victory',
  BOSS_INTRO: 'bossIntro',
  BOSS_DEFEATED: 'bossDefeated'
};

export const ENEMY_TYPES = {
  BASIC: 'basic',
  SHOOTER: 'shooter',
  TANK: 'tank',
  BOSS: 'boss'
};
