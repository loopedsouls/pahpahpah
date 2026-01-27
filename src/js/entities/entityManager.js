/**
 * Entity Manager - Manages all game entities
 */

export class EntityManager {
  constructor() {
    this.entities = [];
  }
  
  add(entity) {
    this.entities.push(entity);
    return entity;
  }
  
  remove(entity) {
    const index = this.entities.indexOf(entity);
    if (index > -1) {
      this.entities.splice(index, 1);
    }
  }
  
  removeAt(index) {
    if (index >= 0 && index < this.entities.length) {
      this.entities.splice(index, 1);
    }
  }
  
  removeInactive() {
    this.entities = this.entities.filter(e => e.active !== false);
  }
  
  clear() {
    this.entities.length = 0;
  }
  
  count() {
    return this.entities.length;
  }
  
  getAll() {
    return this.entities;
  }
  
  update(...args) {
    for (let i = this.entities.length - 1; i >= 0; i--) {
      const entity = this.entities[i];
      if (entity.update) {
        const shouldRemove = entity.update(...args);
        if (shouldRemove) {
          this.entities.splice(i, 1);
        }
      }
    }
  }
  
  draw(...args) {
    this.entities.forEach(entity => {
      if (entity.draw) {
        entity.draw(...args);
      }
    });
  }
  
  forEach(callback) {
    this.entities.forEach(callback);
  }
  
  filter(predicate) {
    return this.entities.filter(predicate);
  }
  
  find(predicate) {
    return this.entities.find(predicate);
  }
  
  get length() {
    return this.entities.length;
  }
  
  get all() {
    return this.entities;
  }
}
