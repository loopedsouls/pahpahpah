/**
 * Mask Data and Effects
 */

export const MASK_TYPES = ['bitmask', 'alphamask', 'datamask', 'surgical', 'shader'];

export const MASK_EFFECTS = {
  bitmask: { 
    multiTarget: true, 
    aoeRadius: 80, 
    description: 'Multi-Target: Tortas atingem área',
    bonuses: {}
  },
  alphamask: { 
    ghostDash: true, 
    invincibleTime: 30, 
    description: 'Dash Fantasma: Invencível no dash',
    bonuses: { speed: 1, dashDistance: 40 }
  },
  datamask: { 
    confusion: true, 
    confusionDuration: 300, 
    confusionCooldown: 480, 
    description: 'Confusão: Desorienta inimigos',
    bonuses: {}
  },
  surgical: { 
    healOnHit: true, 
    hitsToHeal: 5, 
    description: 'Regeneração: +1 HP a cada 5 acertos',
    bonuses: { maxHp: 2 }
  },
  shader: { 
    slowMotion: true, 
    slowFactor: 0.5, 
    description: 'Slow-Motion: Tempo lento ao mirar',
    bonuses: { shootDelay: -3 }
  }
};

export function getMaskEffect(maskType) {
  return MASK_EFFECTS[maskType] || null;
}
