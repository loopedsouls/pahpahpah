# 🎭 PÁ PÁ PÁ: THE MASK GAME - TODO

## 📅 DIA 1 - FUNDAÇÃO (24h)

### Setup (Horas 1-4)
- [ ] Criar projeto Unity 2D
- [ ] Configurar resolução (320x180 base, upscaled 3x)
- [ ] Configurar Input System (WASD + Mouse)
- [ ] Criar cena principal (Game)

### Core Gameplay (Horas 5-12)
- [ ] **PlayerController.cs** - Movimento (WASD)
- [ ] **PlayerController.cs** - Mira (Mouse)
- [ ] **PlayerController.cs** - Dash (Space/Shift)
- [ ] **PieProjectile.cs** - Sistema de tiro
- [ ] **HealthSystem.cs** - Sistema de vida (5 vidas)
- [ ] **BasicEnemy.cs** - Inimigo básico (persegue jogador)
- [ ] Colisão e dano funcionando
- [ ] HUD básico (corações)

### Sistema de Máscaras (Horas 13-18)
- [ ] **MaskData.cs** (ScriptableObject) - Dados da máscara
- [ ] **MaskSystem.cs** - Equipar/trocar máscaras (1-3)
- [ ] **Bitmask.cs** - Poder: tortas em área
- [ ] **AlphaMask.cs** - Poder: dash invencível
- [ ] **MaskPickup.cs** - Coleta de máscaras no chão
- [ ] UI de máscaras equipadas

### Arena e Ondas (Horas 19-24)
- [ ] **WaveManager.cs** - Sistema de ondas
- [ ] **ArenaManager.cs** - Gerenciador da arena
- [ ] Arena 1 (Teste) completa
- [ ] Spawn de inimigos em ondas
- [ ] Condição de vitória (todos inimigos derrotados)

---

## 📅 DIA 2 - CONTEÚDO (24h)

### Arenas 2 e 3 (Horas 25-30)
- [ ] Arena 2 (Ao Vivo) - 20x20 tiles
- [ ] Arena 3 (Prime Time) - 25x25 tiles
- [ ] Obstáculos (caixas de som, câmeras)
- [ ] Balancear ondas

### Inimigos e Boss (Horas 31-36)
- [ ] **ShooterEnemy.cs** - Atirador (mantém distância, atira)
- [ ] **TankEnemy.cs** - Tanque (HP: 3, lento, knockback)
- [ ] **BossController.cs** - O Apresentador Mascarado
- [ ] Boss Fase 1: teleporte + 3 tortas em leque
- [ ] Arena 4 (Showdown Final)

### Sistema de Público (Horas 37-42)
- [ ] **AudienceMeter.cs** - Barra de público
- [ ] Sobe: +5% acerto, +8% kill, +10% combo
- [ ] Desce: -2% miss, -5% dano, -15% inimigo escapa
- [ ] Feedback visual (emojis/cores)
- [ ] Game Over se < 20%
- [ ] Bônus dano se > 80%

### Máscaras Restantes (Horas 43-48)
- [ ] **DataMask.cs** - Confusão (inimigos desorientados 5s)
- [ ] **SurgicalMask.cs** - Regeneração (+1 HP a cada 5 acertos)
- [ ] **ShaderMask.cs** - Slow-motion ao mirar
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
| 1 | Core | 8 | 0/8 |
| 1 | Máscaras | 6 | 0/6 |
| 1 | Arena | 5 | 0/5 |
| 2 | Arenas 2-3 | 4 | 0/4 |
| 2 | Inimigos | 5 | 0/5 |
| 2 | Público | 6 | 0/6 |
| 2 | Máscaras+ | 4 | 0/4 |
| 3 | Arte | 10 | 0/10 |
| 3 | Áudio | 8 | 0/8 |
| 3 | UI/UX | 6 | 0/6 |
| 3 | Teste | 6 | 0/6 |

**TOTAL: 0/72 tarefas**

---

🎮 **BOA JAM!** 🎮
