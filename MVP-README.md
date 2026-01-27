# PÁ PÁ PÁ: THE MASK GAME - MVP

## 🎮 MVP Implementado (Parte 1-3)

### ✅ O que está pronto:

#### **Parte 1: Assets SVG**
- ✅ 5 Máscaras (Bitmask, Alpha Mask, Data Mask, Cirúrgica, Shader)
- ✅ Sprite do jogador
- ✅ Sprite de inimigo básico
- ✅ Torta (projétil)
- ✅ Explosão de torta (splat)
- ✅ Corações (UI - cheio e vazio)

#### **Parte 2: Core Gameplay**
- ✅ Movimento do jogador (WASD / Setas)
- ✅ Mira com mouse
- ✅ Atirar tortas (Click do mouse)
- ✅ Sistema de dash (Espaço/Shift)
- ✅ Colisão de projéteis
- ✅ Sistema de vida do jogador

#### **Parte 3: Sistema de Máscaras**
- ✅ Drop de máscaras (a cada 3 inimigos)
- ✅ Coleta de máscaras
- ✅ Troca de máscaras (teclas 1-5)
- ✅ UI de máscaras equipadas

#### **Extras já implementados:**
- ✅ Sistema de ondas (waves)
- ✅ Sistema de público (Audience Meter)
- ✅ HUD completo
- ✅ Menu principal
- ✅ Tela de Game Over
- ✅ Tela de Vitória
- ✅ Sistema de pontuação
- ✅ Spawn de inimigos
- ✅ IA básica dos inimigos
- ✅ Partículas de explosão

## 🎯 Como jogar:

### Controles:
- **WASD** ou **Setas**: Mover
- **Mouse**: Mirar
- **Click Esquerdo**: Atirar torta
- **Espaço** ou **Shift**: Dash
- **1-5**: Trocar máscara ativa
- **ESC**: Pausar

### Objetivo:
- Sobreviva 4 ondas de inimigos
- Não deixe sua vida ou a barra de público chegar a zero
- Colete máscaras para ganhar poderes
- Atinja os inimigos com tortas

### Sistema de Público:
- **Sobe**: Acertando tortas, matando inimigos, coletando máscaras
- **Desce**: Errando tortas, levando dano, ficando parado
- **Game Over**: Quando chega a 0%

## 🚀 Como executar:

### Opção 1: Servidor local Python
```bash
python3 -m http.server 8080
```
Acesse: http://localhost:8080

### Opção 2: Servidor local Node.js
```bash
npx http-server -p 8080
```
Acesse: http://localhost:8080

### Opção 3: VS Code Live Server
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

## 📁 Estrutura de arquivos:

```
pahpahpah/
├── index.html              # Arquivo principal
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── assets/
│   └── svg/
│       ├── masks/          # 5 máscaras SVG
│       ├── player/         # Sprite do jogador
│       ├── enemies/        # Sprite dos inimigos
│       ├── effects/        # Torta e explosões
│       └── ui/             # Corações e UI
└── src/
    ├── css/
    │   └── styles.css      # Estilos completos
    └── js/
        └── game.js         # Lógica do jogo (completa)
```

## 🎭 As 5 Máscaras:

1. **BITMASK** (Verde) - Multi-target
2. **ALPHA MASK** (Azul/Transparente) - Dash Fantasma
3. **DATA MASK** (Laranja) - Confusão
4. **CIRÚRGICA** (Branca) - Regeneração
5. **SHADER MASK** (Psicodélica) - Slow-Motion Aim

## 🔄 Próximas melhorias:

### Parte 4 (Opcional):
- [ ] Implementar poderes específicos das máscaras
- [ ] Adicionar tipos variados de inimigos (Atirador, Tanque)
- [ ] Sistema de boss
- [ ] Mais arenas com obstáculos

### Parte 5 (Opcional):
- [ ] Som e música
- [ ] Animações de sprites
- [ ] Efeitos visuais avançados
- [ ] Tutorial interativo

## 🎨 Paleta de cores usada:

- **Amarelo primário**: #ffd700
- **Azul primário**: #00d4ff
- **Vermelho primário**: #ff2060
- **Background**: #1a1a1a
- **UI Border**: #4a4a4a

## 📝 Notas de desenvolvimento:

- Todos os gráficos são SVG (escaláveis e leves)
- Código modular e comentado
- Pronto para expansão
- Funciona offline (PWA ready)

## 🐛 Debug:

Se o jogo não carregar:
1. Verifique o console do navegador (F12)
2. Certifique-se de estar rodando em um servidor
3. Verifique se todos os arquivos SVG estão presentes

## 🎮 Status do MVP:

**JOGÁVEL E FUNCIONAL!** ✅

O jogo já está completo com:
- Gameplay funcional
- Sistema de ondas
- Coleta de máscaras
- Sistema de público
- Win/Lose conditions
- UI completa

Pronto para testes e expansão!
