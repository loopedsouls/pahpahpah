# pahpahpah
# 🎭 PÁ PÁ PÁ: THE MASK GAME
## Game Design Document (GDD) - Versão Game Jam

---

## 📋 INFORMAÇÕES DO PROJETO

**Gênero:** Arena Arcade / Top-Down Shooter  
**Plataforma:** PC / Web (itch.io)  
**Engine:** (A definir - recomendado: Godot, Unity ou GameMaker)  
**Estilo Visual:** Pixel Art 2D  
**Perspectiva:** Top-Down  
**Duração estimada:** 10-15 minutos (gameplay completo)  
**Escopo:** Game Jam (48-72h)  

---

## 🎯 CONCEITO CENTRAL

### Elevator Pitch
Um arena arcade top-down onde você derrota inimigos jogando tortas. Cada vitória libera uma máscara inspirada em tecnologia, arte e segurança, que muda seu estilo de jogo. Monte combinações, sobreviva às arenas e conquiste seu lugar no palco!

### High Concept
"Duck Game encontra Hotline Miami, mas com tortas e máscaras de tecnologia brasileira"

---

## 📖 NARRATIVA (LORE)

Um funcionário teve uma ideia brilhante para uma nova pegadinha e decidiu apresentá-la ao chefe do programa de auditório. Impressionado com a criatividade, o chefe deu uma chance: "Mostre na prática se isso vai funcionar com o público!".

Agora, o funcionário precisa testar sua ideia em arenas ao vivo, conquistando as risadas da plateia e provando que sua pegadinha merece ir ao ar nas noites de domingo. Cada arena é um teste. Cada máscara conquistada é uma evolução da ideia. O objetivo? Garantir que a pegadinha vire um quadro inesquecível do programa!

**Motivação:** Impressionar o público e o chefe  
**Conflito:** Precisa dar certo ou perde a oportunidade  
**Resolução:** Tornar-se uma pegadinha memorável da TV brasileira

---

## 🎮 GAMEPLAY CORE

### Game Loop Principal

```
🔁 ENTRAR NA ARENA
   ↓
👥 INIMIGOS APARECEM EM ONDAS
   ↓
🎯 MIRAR E ATIRAR TORTAS
   ↓
💥 ACERTAR INIMIGOS
   ↓
🎭 GANHAR MÁSCARA (a cada X acertos)
   ↓
⚡ ESCOLHER/ATIVAR PODER
   ↓
🔁 PRÓXIMA ONDA (mais difícil)
   ↓
👏 BARRA DE PÚBLICO SOBE
   ↓
🏆 DERROTAR TODOS = ARENA CONCLUÍDA
```

### Controles (Teclado + Mouse)

| Ação | Input |
|------|-------|
| Movimento | WASD ou Setas |
| Mirar | Mouse |
| Atirar Torta | Botão Esquerdo do Mouse |
| Dash/Esquiva | Espaço ou Shift |
| Trocar Máscara | 1, 2, 3, 4, 5 (números) |
| Pausar | ESC |

---

## 🎭 SISTEMA DE MÁSCARAS

### Conceito
Máscaras são power-ups permanentes que o jogador coleta durante as arenas. Cada máscara representa um conceito de tecnologia, arte ou segurança e oferece um poder único.

### 5 Máscaras Essenciais (MVP)

#### 1️⃣ BITMASK (Programação)
**Visual:** Máscara com padrão binário (0s e 1s)  
**Poder:** "Multi-Target"  
- Tortas atingem múltiplos inimigos em área
- Cooldown: nenhum (passivo)
- Uso: Ofensivo

#### 2️⃣ ALPHA MASK (Arte Digital)
**Visual:** Máscara translúcida com gradiente  
**Poder:** "Dash Fantasma"  
- Jogador dá um dash rápido ficando invencível por 0.5s
- Cooldown: 3 segundos
- Uso: Defensivo/Mobilidade

#### 3️⃣ DATA MASK (Segurança)
**Visual:** Máscara com padrão de criptografia/código  
**Poder:** "Confusão"  
- Inimigos próximos ficam desorientados (andam aleatoriamente)
- Duração: 5 segundos
- Cooldown: 8 segundos
- Uso: Controle de Crowd

#### 4️⃣ MÁSCARA CIRÚRGICA (Vida Real)
**Visual:** Máscara hospitalar simples  
**Poder:** "Regeneração"  
- Recupera 1 vida ao acertar inimigos
- A cada 5 acertos = +1 HP
- Uso: Sustentação

#### 5️⃣ SHADER MASK (Arte/Efeitos)
**Visual:** Máscara psicodélica com cores vibrantes  
**Poder:** "Slow-Motion Aim"  
- Ao mirar, o tempo fica 50% mais lento
- Duração: enquanto segura o botão de mira
- Cooldown: nenhum
- Uso: Precisão

### Progressão de Máscaras

| Arena | Máscaras Disponíveis |
|-------|---------------------|
| Arena 1 - Teste | 2 máscaras (Bitmask + Alpha) |
| Arena 2 - Ao Vivo | +1 máscara (Data Mask) |
| Arena 3 - Prime Time | +2 máscaras (Cirúrgica + Shader) |
| Final - Showdown | Todas as 5 máscaras |

**Sistema de Coleta:**
- A cada 3 inimigos derrotados → ganha 1 máscara aleatória
- Máscaras aparecem no chão da arena
- Jogador caminha sobre elas para coletar
- Pode equipar até 3 máscaras simultaneamente (slots 1, 2, 3)

---

## 🏟️ ESTRUTURA DE ARENAS

### Arena 1: TESTE (Tutorial)
**Tema:** Palco pequeno de ensaio  
**Tamanho:** Pequeno (15x15 tiles)  
**Inimigos:** 8 (2 ondas de 4)  
**Obstáculos:** Nenhum  
**Objetivo:** Ensinar mecânicas básicas  
**Público:** Poucos espectadores (baixa pressão)

### Arena 2: AO VIVO
**Tema:** Estúdio com plateia  
**Tamanho:** Médio (20x20 tiles)  
**Inimigos:** 15 (3 ondas de 5)  
**Obstáculos:** Caixas de som, câmeras  
**Objetivo:** Aumentar dificuldade e caos  
**Público:** Plateia reagindo ativamente

### Arena 3: PRIME TIME
**Tema:** Palco principal do programa  
**Tamanho:** Grande (25x25 tiles)  
**Inimigos:** 24 (4 ondas de 6)  
**Obstáculos:** Refletores, bancada, escadas  
**Objetivo:** Máxima dificuldade antes do chefe  
**Público:** Lotado, alta pressão

### Arena 4: SHOWDOWN FINAL
**Tema:** Palco especial + Boss  
**Tamanho:** Grande (25x25 tiles)  
**Inimigos:** 1 Chefe + 12 lacaios  
**Boss:** "O Apresentador Mascarado"  
- HP: 10 tortas
- Ataque: Joga 3 tortas ao mesmo tempo
- Padrão: Teleporta entre cantos do palco
- Fase 2 (50% HP): Invoca clones
**Objetivo:** Derrotar o chefe e conquistar o público final

---

## 👾 INIMIGOS

### Tipo 1: COMPETIDOR BÁSICO
**Visual:** Pessoa comum com avental  
**HP:** 1 torta  
**Comportamento:** Anda em direção ao jogador  
**Velocidade:** Lenta  
**Ataque:** Corpo a corpo (toque causa dano)

### Tipo 2: ATIRADOR
**Visual:** Competidor com chapéu de chef  
**HP:** 1 torta  
**Comportamento:** Mantém distância e atira tortas  
**Velocidade:** Média  
**Ataque:** Torta a distância (1 dano)

### Tipo 3: TANQUE
**Visual:** Competidor grande com avental reforçado  
**HP:** 3 tortas  
**Comportamento:** Avança lentamente  
**Velocidade:** Muito lenta  
**Ataque:** Empurrão (knockback + 1 dano)

### Boss: O APRESENTADOR MASCARADO
**Visual:** Figura carismática com terno e máscara dourada  
**HP:** 10 tortas  
**Fases:**
- **Fase 1 (100-50% HP):** Teleporta, atira 3 tortas em leque
- **Fase 2 (50-0% HP):** Invoca 2 clones, tortas explodem em área

---

## 📊 SISTEMA DE PÚBLICO (AUDIENCE METER)

### Mecânica Central
Barra de público no topo da tela (0-100%)

**Como sobe:**
- Acertar torta: +5%
- Combo (3+ acertos seguidos): +10%
- Derrotar inimigo: +8%
- Usar máscara com estilo: +3%
- Finalizar onda rápido: +15%

**Como desce:**
- Errar torta: -2%
- Levar dano: -5%
- Ficar parado (sem ação por 5s): -10%
- Inimigo escapa da arena: -15%

### Feedback Visual
- 0-30%: 😐 Público entediado (vaia ocasional)
- 30-70%: 🙂 Público interessado (aplausos leves)
- 70-100%: 🤩 Público animado (risadas, aplausos)

### Impacto no Jogo
- Abaixo de 20%: GAME OVER (perdeu o público)
- Acima de 80%: Tortas causam +50% dano (público energiza)

---

## 🎯 CONDIÇÕES DE VITÓRIA/DERROTA

### ✅ VITÓRIA
- Completar todas as 4 arenas
- Derrotar o boss final
- Manter público acima de 20% em todas as fases
- **Recompensa:** Tela de sucesso + Score final

### ❌ DERROTA
- Vida chega a 0 (máximo 5 vidas)
- Barra de público zera (público desiste)
- Tempo esgota na arena (2 minutos por arena)

### 🔄 CONTINUE
- Pode recomeçar da última arena (máximo 2 continues)

---

## 🎨 DIREÇÃO DE ARTE

### Estilo Visual: Pixel Art
**Resolução base:** 320x180 pixels (upscaled 3x ou 4x)  
**Paleta de cores:** Vibrante, inspirada em programas de TV brasileiros  
**Referências:** Hotline Miami, Nuclear Throne, Enter the Gungeon

### Paleta de Cores Sugerida
- **Primária:** Amarelo vibrante, Azul elétrico, Vermelho show
- **Secundária:** Rosa neon, Verde lime, Roxo profundo
- **UI:** Branco, Preto, Cinza claro

### Animações Necessárias

**Jogador:**
- Idle (4 frames)
- Walk (4 frames, 4 direções = 16 sprites)
- Atirando (2 frames)
- Dash (3 frames)
- Hit (1 frame, flash branco)
- Morte (4 frames)

**Inimigos:**
- Idle (2 frames)
- Walk (4 frames)
- Ataque (2 frames)
- Hit (1 frame)
- Morte (3 frames)

**Efeitos:**
- Torta voando (2 frames, rotação)
- Explosão de torta (4 frames)
- Dash trail (3 frames)
- Pegar máscara (sparkle, 3 frames)

### UI/HUD

```
┌─────────────────────────────────────────┐
│ ❤️❤️❤️🖤🖤  [PÚBLICO: ████████░░ 80%]   │
├─────────────────────────────────────────┤
│                                         │
│           [ARENA - GAMEPLAY]            │
│                                         │
├─────────────────────────────────────────┤
│ [🎭1] [🎭2] [🎭3]    WAVE 2/4    10:45  │
└─────────────────────────────────────────┘
```

**Elementos:**
- Vidas (corações no canto superior esquerdo)
- Barra de público (centro superior)
- Máscaras equipadas (inferior esquerdo)
- Onda atual (inferior centro)
- Timer (inferior direito)

---

## 🔊 DIREÇÃO DE ÁUDIO

### Música

**Menu Principal:**
- Música animada estilo game show (8-bit brasileiro)
- BPM: 140-160

**Arena 1-2:**
- Música arcade energética
- BPM: 150

**Arena 3:**
- Intensifica, adiciona percussão
- BPM: 160

**Boss Fight:**
- Música épica com elementos de programa de TV
- BPM: 170

### Sound Effects (SFX)

**Gameplay:**
- Torta lançada (whoosh)
- Torta acerta (splat + risada curta)
- Torta erra (whoosh vazio)
- Dash (zoom)
- Pegar máscara (power-up jingle)

**Público:**
- Risada curta (acerto)
- Aplauso (combo)
- Vaia (erro)
- Animação (público sobe muito)

**UI:**
- Seleção de menu (beep)
- Confirmação (ding)
- Erro (buzz)

**Inimigo:**
- Inimigo hit (oof)
- Inimigo morre (splat + risada forte)
- Boss aparece (dramatic sting)

---

## 🛠️ TECNOLOGIA E FERRAMENTAS

### Engine Recomendadas (escolha 1)
- **Unity:** Mais recursos, asset store

### Ferramentas de Arte
- **Aseprite:** Pixel art e animação
- **Piskel:** Alternativa web gratuita
- **Photoshop/GIMP:** Edição de sprites

### Ferramentas de Áudio
- **BFXR:** Gerador de SFX retrô
- **Audacity:** Edição de áudio
- **Bosca Ceoil:** Música 8-bit simples

### Controle de Versão
- **Git + GitHub:** Backup e colaboração

---

## 📦 LISTA DE ASSETS (CHECKLIST)

### Sprites

**Jogador:**
- [ ] Sprite sheet completo (idle, walk 4dir, ataque, dash, hit, morte)
- [ ] 32x32 pixels por frame

**Inimigos:**
- [ ] Competidor Básico (idle, walk, ataque, hit, morte)
- [ ] Atirador (idle, walk, ataque, hit, morte)
- [ ] Tanque (idle, walk, ataque, hit, morte)
- [ ] Boss (idle, walk, ataque fase 1, ataque fase 2, hit, morte)

**Objetos:**
- [ ] Torta (projetil, 16x16px)
- [ ] Explosão de torta (32x32px, 4 frames)
- [ ] 5 ícones de máscaras (24x24px cada)
- [ ] Máscara no chão (item, 24x24px, animação sutil)

**Arenas:**
- [ ] Tileset de chão (4 variações)
- [ ] Bordas de palco
- [ ] Obstáculos (caixas de som, câmeras, bancada, refletores)
- [ ] Background de plateia (3 variações)

**Efeitos:**
- [ ] Dash trail (3 frames)
- [ ] Sparkle de coleta (3 frames)
- [ ] Slow-motion overlay (shader ou sprite)

### UI

- [ ] Coração (vida, cheio e vazio)
- [ ] Barra de público (fundo + preenchimento)
- [ ] Painel de máscaras (slots)
- [ ] Tela de título
- [ ] Tela de pause
- [ ] Tela de vitória
- [ ] Tela de game over
- [ ] Fonte pixel art (números e texto)

### Áudio

**Música:**
- [ ] Menu principal (loop)
- [ ] Arena 1-2 (loop)
- [ ] Arena 3 (loop)
- [ ] Boss fight (loop)
- [ ] Vitória (jingle)
- [ ] Game over (jingle)

**SFX:**
- [ ] Torta lançada
- [ ] Torta acerta
- [ ] Torta erra
- [ ] Dash
- [ ] Pegar máscara
- [ ] Risada curta
- [ ] Aplauso
- [ ] Vaia
- [ ] Inimigo hit
- [ ] Inimigo morre
- [ ] Boss aparece
- [ ] Seleção menu
- [ ] Confirmação
- [ ] Erro

### Código/Scripts

- [ ] Movimento do jogador
- [ ] Sistema de tiro (tortas)
- [ ] Sistema de máscaras (equip, poderes)
- [ ] IA de inimigos (3 tipos)
- [ ] Boss (fases, padrões)
- [ ] Sistema de ondas
- [ ] Barra de público
- [ ] HUD
- [ ] Sistema de arena
- [ ] Game manager (vitória/derrota, transições)
- [ ] Menu principal
- [ ] Sistema de pause

---

## 📅 CRONOGRAMA DE PRODUÇÃO (JAM 72H)

### DIA 1 (Fundação - 24h)

**Horas 1-4: Setup**
- [ ] Criar projeto na engine
- [ ] Configurar resolução e controles
- [ ] Protótipo de movimento do jogador

**Horas 5-12: Core Gameplay**
- [ ] Sistema de tiro (tortas)
- [ ] Inimigo básico com IA simples
- [ ] Sistema de colisão e dano
- [ ] HUD básico (vida)

**Horas 13-18: Sistema de Máscaras**
- [ ] Implementar 2 máscaras (Bitmask + Alpha)
- [ ] Sistema de coleta
- [ ] UI de máscaras

**Horas 19-24: Arena e Ondas**
- [ ] Arena 1 completa
- [ ] Sistema de ondas funcionando
- [ ] Condição de vitória básica

### DIA 2 (Conteúdo - 24h)

**Horas 25-30: Arenas 2 e 3**
- [ ] Criar Arena 2 e 3
- [ ] Adicionar obstáculos
- [ ] Balancear ondas

**Horas 31-36: Inimigos e Boss**
- [ ] Implementar Atirador e Tanque
- [ ] Boss básico (fase 1)
- [ ] Arena final

**Horas 37-42: Sistema de Público**
- [ ] Barra de público funcionando
- [ ] Feedback visual/audio
- [ ] Condição de derrota (público zerado)

**Horas 43-48: Máscaras Restantes**
- [ ] Implementar Data Mask, Cirúrgica, Shader
- [ ] Testar e balancear poderes

### DIA 3 (Polish - 24h)

**Horas 49-54: Arte**
- [ ] Finalizar sprites do jogador
- [ ] Sprites dos 3 inimigos
- [ ] Boss sprites
- [ ] Tilesets e obstáculos

**Horas 55-60: Áudio**
- [ ] Música (4 tracks)
- [ ] SFX essenciais
- [ ] Mixagem básica

**Horas 61-66: UI/UX**
- [ ] Menu principal
- [ ] Telas de vitória/derrota
- [ ] Pause funcionando
- [ ] Transições

**Horas 67-72: Teste e Ajustes Finais**
- [ ] Playtest completo
- [ ] Ajustar dificuldade
- [ ] Fix de bugs críticos
- [ ] Build final
- [ ] Upload pra itch.io

---

## 🎯 ESCOPO MVP (MÍNIMO VIÁVEL)

Se o tempo apertar, **CORTAR NESTA ORDEM:**

1. ❌ Arena 3 (manter só 1, 2 e Boss)
2. ❌ 2 máscaras (manter só 3 essenciais)
3. ❌ Tipo de inimigo Tanque (manter só Básico e Atirador)
4. ❌ Boss fase 2 (boss mais simples)
5. ❌ Sistema de público (simplificar pra tempo ou vidas)

**NUNCA CORTAR:**
- ✅ Core gameplay (andar + atirar tortas)
- ✅ Pelo menos 2 máscaras
- ✅ 2 arenas + boss
- ✅ Menu principal e game over

---

## 🔄 POSSÍVEIS EXPANSÕES (PÓS-JAM)

### Features Adicionais
- **Modo Endless:** Sobreviva ondas infinitas
- **Multiplayer Local:** 2-4 jogadores competindo
- **Mais 10 máscaras:** Expandir sistema
- **Sistema de Combo:** Multiplicador de pontos
- **Leaderboard:** Ranking de high scores
- **Desafios Diários:** Arenas especiais
- **Customização:** Skins do personagem

### Conteúdo Extra
- **Arenas Temáticas:** Backstage, Camarim, Rua
- **Chefes Únicos:** 5 bosses diferentes
- **História Expandida:** Cutscenes animadas
- **Conquistas:** Sistema de achievements

---

## 📊 MÉTRICAS DE SUCESSO

### Durante a Jam
- [ ] Jogo jogável do início ao fim
- [ ] 0 bugs que impeçam progressão
- [ ] Feedback positivo nos testes
- [ ] Build funcional publicado

### Pós-Jam
- **Meta Básica:** 100 downloads
- **Meta Média:** 500 downloads + 50 ratings
- **Meta Alta:** 1000+ downloads + rating 4.5+

---

## 🤝 CRÉDITOS E REFERÊNCIAS

### Inspirações de Gameplay
- **Hotline Miami:** Ritmo, violência estilizada
- **Duck Game:** Combate com projeteis, caos multiplayer
- **Nuclear Throne:** Arena top-down, mutações/poderes
- **Enter the Gungeon:** Variedade de itens, bullet hell leve

### Inspirações Visuais
- **Pixel art brasileira:** Jogos de SNES/Mega Drive
- **Programas de auditório:** Estética colorida, energética
- **Anos 90-2000 TV:** Nostalgia visual

### Referências Culturais
- Pegadinhas clássicas da TV brasileira
- Game shows e programas de auditório
- Cultura pop brasileira dos anos 2000

---

## 📝 NOTAS FINAIS

### Filosofia de Design
- **Simples de aprender, difícil de masterizar**
- **Feedback imediato:** Cada ação tem reação visual/sonora
- **Risco vs Recompensa:** Máscaras incentivam jogo agressivo
- **Humor brasileiro:** Leve, divertido, sem ser bobo

### Diferencial
O que torna este jogo único é a **fusão genuína de conceitos técnicos (máscaras de programação/design) com humor e cultura pop brasileira**, criando uma experiência arcade moderna com identidade própria.

---

**Versão:** 1.0  
**Data:** Janeiro 2026  
**Status:** Pronto para Produção  

🎮 **BOA JAM!** 🎮