/**
 * Arena Data
 */

export const ARENAS = [
  { 
    id: 'arena-bitmask', 
    name: 'BITMASK DOMAIN', 
    boss: 'boss-bitmask', 
    bossType: 'aoe',
    mask: 'bitmask', 
    color: '#00ff00',
    description: 'Domínio digital de códigos e circuitos'
  },
  { 
    id: 'arena-alphamask', 
    name: 'PHANTOM REALM', 
    boss: 'boss-alphamask', 
    bossType: 'dash',
    mask: 'alphamask', 
    color: '#00ffff',
    description: 'Reino etéreo dos fantasmas'
  },
  { 
    id: 'arena-datamask', 
    name: 'CHAOS CORE', 
    boss: 'boss-datamask', 
    bossType: 'confusion',
    mask: 'datamask', 
    color: '#ff00ff',
    description: 'Núcleo caótico da confusão'
  },
  { 
    id: 'arena-surgical', 
    name: 'HEALING SANCTUM', 
    boss: 'boss-surgical', 
    bossType: 'heal',
    mask: 'surgical', 
    color: '#00ff88',
    description: 'Santuário sagrado da cura'
  },
  { 
    id: 'arena-shader', 
    name: 'TIME NEXUS', 
    boss: 'boss-shader', 
    bossType: 'slow',
    mask: 'shader', 
    color: '#ffaa00',
    description: 'Nexus temporal do controle do tempo'
  }
];

export function getArena(index) {
  return ARENAS[index] || ARENAS[0];
}

export function getArenaById(id) {
  return ARENAS.find(a => a.id === id);
}
