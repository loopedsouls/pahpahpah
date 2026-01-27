/**
 * Collision System
 */

import { circleCollision, distance } from '../utils/math.js';

export function checkProjectileEnemyCollision(projectile, enemy) {
  return circleCollision(
    projectile.x, projectile.y, projectile.size,
    enemy.x, enemy.y, enemy.size
  );
}

export function checkProjectilePlayerCollision(projectile, player) {
  return circleCollision(
    projectile.x, projectile.y, projectile.size,
    player.x, player.y, player.size
  );
}

export function checkEnemyPlayerCollision(enemy, player) {
  return circleCollision(
    enemy.x, enemy.y, enemy.size,
    player.x, player.y, player.size
  );
}

export function getEnemiesInRadius(x, y, radius, enemies) {
  return enemies.filter(enemy => {
    const dist = distance(x, y, enemy.x, enemy.y);
    return dist < radius;
  });
}
