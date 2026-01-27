# 📋 PRÓXIMAS IMPLEMENTAÇÕES - GUIA RÁPIDO

## Prioridade: CRÍTICA ⚠️

### 1. BOSS FINAL (Arena 4) 🎭👑
**Arquivo**: `src/js/game.js` - Adicionar classe `Boss`

```javascript
const Boss = {
  name: "Apresentador Mascarado",
  hp: 10,
  maxHp: 10,
  phase: 1,
  attacks: ['teleport', 'fanShot', 'clones'],
  // Teleporta a cada 5s
  // Fase 2: <50% HP cria 2 clones
  // Ataque em leque: 7 tortas
}
```

**Mecânicas**:
- Teleporte a cada 300 frames
- Leque de 7 projéteis
- Fase 2: Spawn 2 clones (3 HP cada)
- Vitória final após derrotar boss

---

### 2. ARENAS ESPECÍFICAS 🏟️
**Arquivo**: `src/js/arenas.js` (novo)

```javascript
const Arenas = {
  arena1: {
    size: { width: 15, height: 15 },
    obstacles: [
      { type: 'speaker', x: 200, y: 200, blocks: true },
      { type: 'camera', x: 400, y: 300, blocks: true }
    ],
    background: 'stage-crowd',
    music: 'arena1-2.mp3'
  },
  // ... arena2, arena3, boss
}
```

**Necessário**:
- Sistema de colisão com obstáculos
- Tilesets para chão/paredes
- Backgrounds diferentes
- Transições entre arenas

---

### 3. SISTEMA DE ÁUDIO 🎵
**Arquivos**: `assets/audio/music/`, `assets/audio/sfx/`

**Músicas Necessárias**:
- `menu.mp3` - Menu principal
- `arena1-2.mp3` - Arenas 1-2 (upbeat)
- `arena3.mp3` - Arena 3 (intense)
- `boss.mp3` - Boss fight (epic)

**SFX Necessários**:
- `pie-throw.mp3` - Torta lançada
- `pie-hit.mp3` - Torta acerta
- `pie-miss.mp3` - Torta erra
- `dash.mp3` - Dash ativado
- `laugh.mp3` - Público ri (acerto bom)
- `applause.mp3` - Público aplaude (combo)
- `boo.mp3` - Público vaia (erro)
- `enemy-hit.mp3` - Inimigo levou hit
- `enemy-die.mp3` - Inimigo morre
- `mask-pickup.mp3` - Máscara coletada
- `boss-appear.mp3` - Boss aparece
- `ui-click.mp3` - Click UI

**Implementação**:
```javascript
const AudioManager = {
  music: new Audio(),
  sfx: {},
  playMusic: (track) => {},
  playSFX: (name) => {},
  stopMusic: () => {}
}
```

---

## Prioridade: ALTA 🔴

### 4. ASSETS VISUAIS REAIS 🎨
**Necessário**:
- Sprites animados (4-8 frames):
  - Player: idle, walk, attack, dash, hit, death
  - Inimigos: idle, walk, attack para cada tipo
  - Boss: idle, attack, teleport, phase2
- Efeitos:
  - Explosão de torta (6 frames)
  - Dash trail (partículas)
  - Sparkle/brilho (4 frames)
- Tilesets:
  - Chão de palco
  - Obstáculos (caixas, câmeras, refletores)
  - Background de plateia

**Ferramentas Sugeridas**:
- Aseprite (pixel art)
- Piskel (online, grátis)
- GIMP (vetorial → pixel)

---

### 5. UI/UX POLIMENTO ✨
**Melhorias**:
1. **Menu com Arte**: Logo animado, botões estilizados
2. **Tela de Pausa**: Semi-transparente, opções
3. **Game Over**: Animação, replay highlight
4. **Victory**: Confetes, estatísticas detalhadas
5. **Transições**: Fade in/out entre telas
6. **Feedback Visual**:
   - Flash branco ao hit
   - Screen shake ao dash
   - Slow-motion ao acerto crítico
7. **Responsividade Mobile**: Touch controls, PWA

---

## Prioridade: MÉDIA 🟡

### 6. SISTEMA DE CONTINUE ♻️
```javascript
Game.continues = 2;
Game.continuesUsed = 0;

function gameOver() {
  if (Game.continuesUsed < Game.continues) {
    // Mostrar opção de continue
    showContinueScreen();
  } else {
    showGameOverScreen();
  }
}

function useContinue() {
  Game.continuesUsed++;
  Player.hp = Player.maxHp;
  Audience.value = 50;
  // Volta à arena atual
}
```

---

### 7. OBSTÁCULOS INTERATIVOS 🧱
```javascript
const Obstacles = [
  {
    x: 200, y: 200,
    width: 64, height: 64,
    type: 'speaker',
    blocksMovement: true,
    blocksVision: false,
    blocksShots: true
  }
];

function checkObstacleCollision(entity, obstacles) {
  // AABB collision detection
}
```

---

### 8. BALANCEAMENTO FINAL ⚖️
**Ajustar**:
- HP dos inimigos por wave
- Velocidade de spawn
- Cooldowns das máscaras
- Dano dos projéteis
- Velocidade do jogador
- Timer das arenas
- Pontuação/combo

**Testes**:
- Playtest com 5+ pessoas
- Coleta de feedback
- Iteração rápida

---

## Prioridade: BAIXA 🔵

### 9. BUILD PWA 📱
**Arquivos**: `manifest.json`, `sw.js`

**Configurar**:
```json
{
  "name": "Pá Pá Pá: The Mask Game",
  "short_name": "PáPáPá",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "landscape",
  "icons": [...]
}
```

**Service Worker**:
```javascript
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('papapa-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/src/css/styles.css',
        '/src/js/game.js',
        // ... todos os assets
      ]);
    })
  );
});
```

---

## 📅 CRONOGRAMA SUGERIDO

| Semana | Tarefa | Horas Est. |
|--------|--------|-----------|
| 1 | Boss Final | 8h |
| 2 | Arenas + Obstáculos | 10h |
| 3 | Áudio (música + SFX) | 6h |
| 4 | Assets Visuais | 15h |
| 5 | UI/UX Polimento | 8h |
| 6 | Continue + Balanceamento | 5h |
| 7 | PWA Build + Testes | 4h |
| **TOTAL** | | **56h** |

---

## 🛠️ FERRAMENTAS RECOMENDADAS

- **Pixel Art**: Aseprite, Piskel, GraphicsGale
- **Áudio**: Audacity, LMMS, Beepbox
- **Testes**: BrowserStack, Chrome DevTools
- **Deploy**: GitHub Pages, Itch.io, Netlify

---

## 📞 RECURSOS

- **GDD Original**: `README.md`
- **MVP Completo**: `docs/MVP-COMPLETO.md`
- **Mask Powers**: `MASK-POWERS-IMPLEMENTED.md`
- **Quick Start**: `QUICKSTART.md`

---

**Status**: Ready for next phase! 🚀
**Última Atualização**: 2026-01-27
