/**
 * Character Data
 */

export const CHARACTERS = {
  player: {
    id: 'player',
    name: 'PALHAÇO',
    description: 'O mestre das tortas',
    color: '#4080ff',
    arena: null, // Uses current arena
    locked: false,
    speed: 7,
    hp: 5,
    shootDelay: 15,
    dashDistance: 180,
    portrait: 'player'
  },
  bitmask: {
    id: 'bitmask',
    name: 'BITMASK',
    description: 'Senhor do código digital',
    color: '#00ff00',
    arena: 'arena-bitmask',
    locked: true,
    speed: 6,
    hp: 6,
    shootDelay: 12,
    dashDistance: 150,
    portrait: 'boss-bitmask',
    specialAbility: 'aoe',
    powersUpTo: 1
  },
  alphamask: {
    id: 'alphamask',
    name: 'ALPHAMASK',
    description: 'Fantasma etéreo',
    color: '#00ffff',
    arena: 'arena-alphamask',
    locked: true,
    speed: 9,
    hp: 4,
    shootDelay: 15,
    dashDistance: 250,
    portrait: 'boss-alphamask',
    specialAbility: 'dash',
    powersUpTo: 2
  },
  datamask: {
    id: 'datamask',
    name: 'DATAMASK',
    description: 'Mestre da confusão',
    color: '#ff00ff',
    arena: 'arena-datamask',
    locked: true,
    speed: 7,
    hp: 5,
    shootDelay: 18,
    dashDistance: 180,
    portrait: 'boss-datamask',
    specialAbility: 'confusion',
    powersUpTo: 3
  },
  surgical: {
    id: 'surgical',
    name: 'SURGICAL',
    description: 'Curandeiro sombrio',
    color: '#00ff88',
    arena: 'arena-surgical',
    locked: true,
    speed: 5,
    hp: 8,
    shootDelay: 20,
    dashDistance: 140,
    portrait: 'boss-surgical',
    specialAbility: 'heal',
    powersUpTo: 4
  },
  shader: {
    id: 'shader',
    name: 'SHADER',
    description: 'Controlador do tempo',
    color: '#ffaa00',
    arena: 'arena-shader',
    locked: true,
    speed: 7,
    hp: 6,
    shootDelay: 10,
    dashDistance: 200,
    portrait: 'boss-shader',
    specialAbility: 'slow',
    powersUpTo: 5
  }
};

export const CHARACTER_ORDER = ['player', 'bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];

export function getCharacter(id) {
  return CHARACTERS[id] || CHARACTERS.player;
}

export function getCharacterByIndex(index) {
  return CHARACTERS[CHARACTER_ORDER[index]] || CHARACTERS.player;
}

// Powers unlocked based on bosses defeated
export const POWER_UNLOCKS = {
  0: [], // No bosses defeated - no extra powers
  1: ['bitmask'], // Beat bitmask - AOE damage
  2: ['bitmask', 'alphamask'], // Beat alphamask - ghost dash
  3: ['bitmask', 'alphamask', 'datamask'], // Beat datamask - confusion
  4: ['bitmask', 'alphamask', 'datamask', 'surgical'], // Beat surgical - heal
  5: ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'] // All powers
};

export function getPowersForLevel(level) {
  return POWER_UNLOCKS[Math.min(level, 5)] || [];
}
