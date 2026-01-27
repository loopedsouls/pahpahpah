/**
 * Boss Data and Stats
 */

export const BOSS_STATS = {
  aoe: { 
    hp: 15, 
    speed: 2.5, 
    size: 96, 
    attack: 'aoe',
    attackInterval: 90,
    description: 'Atira em 8 direções'
  },
  dash: { 
    hp: 12, 
    speed: 4, 
    size: 80, 
    attack: 'dash',
    attackInterval: 120,
    description: 'Avança rapidamente no jogador'
  },
  confusion: { 
    hp: 10, 
    speed: 3, 
    size: 88, 
    attack: 'confusion',
    attackInterval: 150,
    description: 'Teleporta e cria ilusões'
  },
  heal: { 
    hp: 20, 
    speed: 2, 
    size: 100, 
    attack: 'heal',
    attackInterval: 60,
    description: 'Se cura e mantém distância'
  },
  slow: { 
    hp: 18, 
    speed: 3, 
    size: 92, 
    attack: 'slow',
    attackInterval: 120,
    description: 'Ataca em padrão espiral'
  }
};

export function getBossStats(bossType) {
  return BOSS_STATS[bossType] || BOSS_STATS.aoe;
}
