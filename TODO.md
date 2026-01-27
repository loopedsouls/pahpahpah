# 🎭 PÁ PÁ PÁ: THE MASK GAME - TODO

## 📅 DIA 1 - FUNDAÇÃO (24h)

### Setup (Horas 1-4)
- [ ] Criar projeto Unity 2D
- [ ] Configurar resolução (320x180 base, upscaled 3x)
- [ ] Configurar Input System (WASD + Mouse)
- [ ] Criar cena principal (Game)

### Core Gameplay (Horas 5-12)
- [x] **PlayerController.cs** - Movimento (WASD)
- [x] **PlayerController.cs** - Mira (Mouse)
- [x] **PlayerController.cs** - Dash (Space/Shift)
- [x] **PieProjectile.cs** - Sistema de tiro
- [x] **HealthSystem.cs** - Sistema de vida (5 vidas)
- [x] **BasicEnemy.cs** - Inimigo básico (persegue jogador)
- [x] Colisão e dano funcionando
- [x] HUD básico (corações)

### Sistema de Máscaras (Horas 13-18)
- [x] **MaskData.cs** (ScriptableObject) - Dados da máscara
- [x] **MaskSystem.cs** - Equipar/trocar máscaras (1-3)
- [x] **Bitmask.cs** - Poder: tortas em área
- [x] **AlphaMask.cs** - Poder: dash invencível
- [x] **MaskPickup.cs** - Coleta de máscaras no chão
- [x] UI de máscaras equipadas

### Arena e Ondas (Horas 19-24)
- [x] **WaveManager.cs** - Sistema de ondas
- [ ] **ArenaManager.cs** - Gerenciador da arena
- [ ] Arena 1 (Teste) completa
- [x] Spawn de inimigos em ondas
- [x] Condição de vitória (todos inimigos derrotados)

---

## 📅 DIA 2 - CONTEÚDO (24h)

### Arenas 2 e 3 (Horas 25-30)
- [ ] Arena 2 (Ao Vivo) - 20x20 tiles
- [ ] Arena 3 (Prime Time) - 25x25 tiles
- [ ] Obstáculos (caixas de som, câmeras)
- [ ] Balancear ondas

### Inimigos e Boss (Horas 31-36)
- [x] **ShooterEnemy.cs** - Atirador (mantém distância, atira)
- [x] **TankEnemy.cs** - Tanque (HP: 3, lento, knockback)
- [ ] **BossController.cs** - O Apresentador Mascarado
- [ ] Boss Fase 1: teleporte + 3 tortas em leque
- [ ] Arena 4 (Showdown Final)

### Sistema de Público (Horas 37-42)
- [x] **AudienceMeter.cs** - Barra de público
- [x] Sobe: +5% acerto, +8% kill, +10% combo
- [x] Desce: -2% miss, -5% dano, -15% inimigo escapa
- [x] Feedback visual (emojis/cores)
- [x] Game Over se < 20%
- [x] Bônus dano se > 80%

### Máscaras Restantes (Horas 43-48)
- [x] **DataMask.cs** - Confusão (inimigos desorientados 5s)
- [x] **SurgicalMask.cs** - Regeneração (+1 HP a cada 5 acertos)
- [x] **ShaderMask.cs** - Slow-motion ao mirar
- [ ] Balancear cooldowns

---

## 📅 DIA 3 - POLISH (24h)

### Arte (Horas 49-54)
- [ ] Sprite jogador (32x32, idle/walk/attack/dash/hit/death)
- [ ] Sprite Competidor Básico (24x24)
- [ ] Sprite Atirador (24x24)
- [ ] Sprite Tanque (24x24)
- [ ] Sprite Boss (32x32)
- [ ] Sprites máscaras (24x24 cada)
- [ ] Sprite torta (16x16)
- [ ] Efeito explosão torta (32x32)
- [ ] Tileset de chão + bordas
- [ ] Background plateia

### Áudio (Horas 55-60)
- [ ] Música menu (loop, 140-160 BPM)
- [ ] Música arena (loop, 150 BPM)
- [ ] Música boss (loop, 170 BPM)
- [ ] SFX: torta lançada (whoosh)
- [ ] SFX: torta acerta (splat + risada)
- [ ] SFX: dash (zoom)
- [ ] SFX: pegar máscara (power-up)
- [ ] SFX: público (risada/aplauso/vaia)

### UI/UX (Horas 61-66)
- [ ] **MainMenu.cs** - Menu principal
- [ ] **PauseMenu.cs** - Tela de pause (ESC)
- [ ] **GameOverScreen.cs** - Tela de derrota
- [ ] **VictoryScreen.cs** - Tela de vitória
- [ ] Transições entre cenas
- [ ] Timer da arena (2 min)

### Teste e Ajustes (Horas 67-72)
- [ ] Playtest completo
- [ ] Ajustar dificuldade inimigos
- [ ] Ajustar velocidade/dano
- [ ] Fix bugs críticos
- [ ] Build WebGL
- [ ] Upload itch.io

---

## 🏗️ ESTRUTURA DE PASTAS

```
Assets/
├── Scripts/
│   ├── Player/         # PlayerController, HealthSystem
│   ├── Enemies/        # BasicEnemy, ShooterEnemy, TankEnemy, BossController
│   ├── Masks/          # MaskSystem, máscaras individuais
│   ├── Managers/       # GameManager, WaveManager, ArenaManager
│   ├── UI/             # HUD, Menus
│   └── Systems/        # AudienceMeter, PieProjectile
├── Sprites/
│   ├── Player/
│   ├── Enemies/
│   ├── Masks/
│   ├── Projectiles/
│   ├── Effects/
│   ├── UI/
│   └── Arenas/
├── Audio/
│   ├── Music/
│   └── SFX/
├── Prefabs/
│   ├── Player/
│   ├── Enemies/
│   ├── Projectiles/
│   ├── Effects/
│   ├── Masks/
│   └── UI/
├── Scenes/
├── ScriptableObjects/
│   ├── Masks/
│   ├── Enemies/
│   └── Arenas/
└── Animations/
    ├── Player/
    ├── Enemies/
    └── Effects/
```

---

## 🎯 MVP CRÍTICO (SE APERTAR O TEMPO)

### MANTER:
- [x] Movimento + tiro de tortas
- [x] 2 máscaras (Bitmask + Alpha)
- [x] 2 arenas + boss simples
- [x] Menu e game over

### CORTAR (nesta ordem):
1. Arena 3
2. 2 máscaras extras
3. Inimigo Tanque
4. Boss fase 2
5. Sistema de público (simplificar pra vidas)

---

## 📝 PROGRESSO

| Dia | Seção | Tarefas | Completo |
|-----|-------|---------|----------|
| 1 | Setup | 4 | 0/4 |
| 1 | Core | 8 | **8/8** ✅ |
| 1 | Máscaras | 6 | **6/6** ✅ |
| 1 | Arena | 5 | 3/5 |
| 2 | Arenas 2-3 | 4 | 0/4 |
| 2 | Inimigos | 5 | 2/5 |
| 2 | Público | 6 | **6/6** ✅ |
| 2 | Máscaras+ | 4 | 3/4 |
| 3 | Arte | 10 | 0/10 |
| 3 | Áudio | 8 | 0/8 |
| 3 | UI/UX | 6 | 0/6 |
| 3 | Teste | 6 | 0/6 |

**TOTAL: 28/72 tarefas (~39%)**

---

🎮 **BOA JAM!** 🎮
