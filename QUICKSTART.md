# 🚀 Guia Rápido de Desenvolvimento

## Para começar AGORA:

```bash
cd /media/luann/MyLife/GitHub/pahpahpah
python3 -m http.server 8080
```

Abra: http://localhost:8080

---

## 📁 Arquivos Principais

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Jogo principal |
| `assets-preview.html` | Ver todos os SVGs |
| `src/js/game.js` | Toda a lógica |
| `src/css/styles.css` | Estilos completos |
| `docs/MVP-COMPLETO.md` | Documentação completa |

---

## 🎯 Sistema de Assets

**Todos em SVG vetorial!**

```
assets/svg/
├── masks/      (5 máscaras)
├── player/     (1 jogador)
├── enemies/    (3 inimigos)
├── effects/    (4 efeitos)
└── ui/         (3 elementos)
```

---

## 🔧 Modificar o Jogo

### Adicionar novo inimigo:
1. Criar SVG em `assets/svg/enemies/`
2. Carregar em `loadAssets()`
3. Adicionar tipo em `spawnEnemy()`
4. Definir comportamento em `updateEnemies()`

### Adicionar nova máscara:
1. Criar SVG em `assets/svg/masks/`
2. Adicionar ao array `maskTypes`
3. Implementar poder específico (opcional)

### Ajustar dificuldade:
```javascript
// Em spawnWave()
const enemyCount = 5 + Game.wave * 3; // Mude o multiplicador

// Em Player
speed: 3,      // Velocidade do jogador
shootDelay: 15, // Cooldown de tiro

// Em Audience
updateAudience(5); // Ajuste os valores
```

---

## 🎨 Customizar Visual

### Cores principais (CSS):
```css
--primary-yellow: #ffd700;
--primary-blue: #00d4ff;
--primary-red: #ff2060;
```

### Tamanhos:
```javascript
Player.size: 16,
Enemy.size: 12,
Pie.size: 8,
```

---

## 🐛 Debug Mode

Adicione no console do navegador:
```javascript
// Ver todos os estados
console.log(Game, Player, enemies, pies);

// God mode
Player.hp = 999;

// Spawn inimigo
spawnEnemy();

// Ganhar máscara
Player.masks.push('bitmask');
```

---

## 📊 Balanceamento Atual

| Item | Valor |
|------|-------|
| HP Jogador | 5 |
| Velocidade Jogador | 3 |
| Dano Torta | 1 |
| Cooldown Tiro | 15 frames |
| Cooldown Dash | 180 frames |
| Público Inicial | 50% |
| Ondas | 4 |
| Drop Máscara | A cada 3 kills |

---

## 🎮 Features Implementadas

✅ Movimento 360° com mouse  
✅ 3 tipos de inimigos diferentes  
✅ Sistema de ondas progressivo  
✅ Sistema de público dinâmico  
✅ Coleta de máscaras  
✅ HUD completo  
✅ Partículas e efeitos  
✅ Menus e telas de resultado  

---

## 🔜 Fácil de Adicionar

- Som/Música (Web Audio API)
- Animações (sprite sheets)
- Mais tipos de inimigo
- Boss fights
- Power-ups temporários
- Modo endless
- Leaderboard (localStorage)

---

## 📱 PWA Ready

Já tem:
- ✅ manifest.json
- ✅ Service Worker
- ✅ Ícones preparados

Para ativar: Configure os ícones!

---

## 🎯 Publicar no itch.io

1. Zipar pasta do projeto
2. Upload no itch.io
3. Configurar como HTML5 game
4. Definir resolução: 960x540
5. Publicar!

---

## 💡 Dicas de Performance

- SVGs carregam rápido
- Canvas otimizado
- Sem libraries externas
- < 1MB total
- Funciona offline

---

## 🎨 Editar SVGs

Use qualquer editor:
- Inkscape (free)
- Illustrator
- Figma
- Até notepad!

SVGs são apenas XML!

---

## 🧪 Testar Multiplataforma

- ✅ Chrome/Edge
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers
- ✅ Tablets

---

## 📖 Estrutura do Código

```javascript
// game.js organização:

1. Setup (canvas, estados)
2. Objetos (Player, Game, etc)
3. Input handlers
4. Player functions
5. Projectile functions
6. Enemy functions
7. Particle system
8. Mask system
9. Audience system
10. Wave system
11. UI functions
12. Game loop
```

---

## 🚀 Deploy Rápido

### GitHub Pages:
```bash
git add .
git commit -m "MVP completo"
git push
```
Ative Pages nas configurações!

### Netlify:
Arraste a pasta no site!

### itch.io:
Zipar e upload!

---

## 🎭 Easter Eggs para Adicionar

```javascript
// Konami Code
// Boss secreto
// Máscara dourada rara
// Skin alternativa
// Modo hard
```

---

## 📝 Checklist Final

Antes de publicar:
- [ ] Testar todas as ondas
- [ ] Verificar game over
- [ ] Testar victory
- [ ] Checar colisões
- [ ] Validar HUD
- [ ] Testar em mobile
- [ ] Screenshots/GIFs
- [ ] Escrever descrição

---

## 🎉 Está PRONTO!

O jogo está funcional e completo!

**Próximo passo:** JOGAR e se divertir! 🎮

---

**Dúvidas?** Leia o GDD completo em `README.md`  
**Ver assets?** Abra `assets-preview.html`  
**Documentação?** Veja `docs/MVP-COMPLETO.md`
