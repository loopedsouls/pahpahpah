# 🎮 GUIA DE SETUP - PÁ PÁ PÁ NO UNITY EDITOR

**Data:** 27/01/2026  
**Tempo estimado:** 30 minutos  
**Status:** Scripts 100% prontos - Falta apenas integrar no Unity

---

## ✅ PRÉ-REQUISITOS

- [x] Unity 2022.3 LTS instalado
- [x] Projeto aberto
- [x] Todos os scripts compilando sem erros
- [x] Menu funcionando (teste: Play → Menu aparece)
- [x] Botão JOGAR funcionando (teste: JOGAR → Tela verde)

---

## 📋 PASSO A PASSO RÁPIDO

### 1. CONFIGURAR TAGS & LAYERS (5 min)

**Edit > Project Settings > Tags and Layers**

**Tags:**
```
Player
Enemy  
Projectile
MaskPickup
```

**Layers (usar 6-9):**
```
Layer 6: Player
Layer 7: Enemy
Layer 8: Projectile
Layer 9: MaskPickup
```

### 2. CONFIGURAR PHYSICS 2D (5 min)

**Edit > Project Settings > Physics 2D > Layer Collision Matrix**

Desmarcar (não colide):
- Player com Player
- Player com Projectile
- Enemy com Enemy
- Projectile com tudo exceto Enemy

### 3. SETUP RÁPIDO DA SCENE GAME (20 min)

1. **Abrir Game.unity**
2. **Deletar GameSceneDebug** (objeto temporário)
3. **Arrastar Player.prefab** para cena (0,0,0)
4. **Criar 4 spawn points** vazios em quadrado
5. **Criar WaveManager** e conectar prefabs
6. **Criar HUD Canvas** com HUDManager
7. **Play e testar!**

---

## 📝 CONFIGURAÇÃO DETALHADA

### PLAYER PREFAB

**PlayerController:**
- Move Speed: 5
- Dash Speed: 15  
- Pie Prefab: [Pie.prefab]
- Fire Rate: 0.5

**HealthSystem:**
- Max Health: 5

### ENEMY PREFABS

**BasicEnemy:**
- Health: 1
- Move Speed: 3
- Damage: 1

**ShooterEnemy:**
- Health: 1
- Move Speed: 2
- Attack Range: 8
- Pie Prefab: [Pie.prefab]

**TankEnemy:**
- Health: 3
- Move Speed: 1.5
- Knockback: 10

### WAVE MANAGER

No Inspector do WaveManager:
- Enemy Prefabs: [BasicEnemy, ShooterEnemy, TankEnemy]
- Spawn Points: [4 transforms]
- Waves To Win: 3
- Initial Delay: 3s

---

## ✅ CHECKLIST DE TESTE

Após setup, Play e verificar:

- [ ] Player move com WASD
- [ ] Mouse mira
- [ ] Click atira torta amarela
- [ ] Inimigos spawnam após 3s
- [ ] Inimigos perseguem/atacam
- [ ] Torta mata inimigo
- [ ] Player toma dano
- [ ] HUD mostra vidas
- [ ] ESC pausa

Se tudo OK: **MVP FUNCIONAL!** 🎉

---

**Ver arquivo completo:** SETUP_OLD.md tem guia detalhado passo a passo
