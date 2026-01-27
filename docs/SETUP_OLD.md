# 🎭 PÁ PÁ PÁ: THE MASK GAME - Setup Automático

## ✅ TUDO JÁ ESTÁ CONFIGURADO!

Este projeto tem **setup 100% automático**. Quando você abrir no Unity, tudo será configurado automaticamente.

---

## 🚀 Como Iniciar

### 1. Abra o Projeto no Unity

```bash
# Unity Hub > Add > Selecionar esta pasta
# OU
# Unity Editor > Open > Selecionar esta pasta
```

### 2. Aguarde o Setup Automático

O script `AutoSetup.cs` vai executar automaticamente e:
- ✅ Configurar Tags (Player, Enemy, Projectile, Mask)
- ✅ Configurar Layers (Player, Enemy, Projectile)
- ✅ Conectar sprites aos prefabs
- ✅ Configurar sorting layers
- ✅ Preparar tudo para jogar

Você verá no Console:
```
🎭 PÁ PÁ PÁ: Executando configuração automática...
✓ Tags configuradas
✓ Layers configuradas
✓ Prefabs configurados
✅ Configuração automática concluída!
```

### 3. Criar Arena de Teste (Opcional)

Se quiser criar uma arena pronta para testar:

1. No menu Unity: `PahPahPah > Create Test Arena`
2. Isso vai criar automaticamente:
   - Player na posição (0, 0)
   - 4 Spawn Points em círculo
   - Canvas com HUD
   - Tudo pronto para jogar!

### 4. Apertar PLAY! 🎮

- Abra a cena `Assets/Scenes/Game.unity`
- Pressione Play (ou F5)
- O script `QuickPlaySetup.cs` vai criar um player automaticamente se não houver nenhum
- Jogue!

---

## 🎯 Menu Automático no Unity

### Menu "PahPahPah"

Quando abrir o Unity, você terá um menu novo com opções:

#### `PahPahPah > Setup Project`
- Executa manualmente a configuração automática
- Use se algo der errado ou quiser reconfigurar

#### `PahPahPah > Create Test Arena`  
- Cria uma arena de teste completa
- Adiciona player, spawn points, HUD
- Perfeito para testar rapidamente

---

## 📁 Estrutura de Arquivos

```
Assets/
├── Scripts/
│   ├── Editor/
│   │   └── AutoSetup.cs          ← Setup automático no Unity
│   └── QuickPlaySetup.cs          ← Setup runtime (play mode)
├── Scenes/
│   ├── MainMenu.unity             ← Menu principal
│   └── Game.unity                 ← Cena do jogo
├── Prefabs/                       ← Já configurados!
├── Sprites/                       ← SVG + PNG profissionais
└── ScriptableObjects/             ← Máscaras configuradas
```

---

## 🎮 Controles do Jogo

| Ação | Tecla |
|------|-------|
| Mover | WASD ou Setas |
| Mirar | Mouse |
| Atirar | Botão Esquerdo do Mouse |
| Dash | Espaço ou Shift |
| Trocar Máscara | 1, 2, 3 |
| Pausar | ESC |

---

## 🔧 Se Algo Der Errado

### Problema: "Missing Script Reference"
**Solução:** Menu `PahPahPah > Setup Project`

### Problema: "Prefabs sem Sprite"
**Solução:** Menu `PahPahPah > Setup Project`

### Problema: "No Player in Scene"
**Solução:** O script `QuickPlaySetup` cria automaticamente ao dar Play
**OU** Menu `PahPahPah > Create Test Arena`

### Problema: "Tags não encontradas"
**Solução:** Já estão configuradas em `ProjectSettings/TagManager.asset`
Se não funcionou, menu `PahPahPah > Setup Project`

---

## 🎭 Sistemas Implementados

✅ **Gameplay Core:** Movimento, tiro, dash, vida  
✅ **3 Tipos de Inimigos:** Basic, Shooter, Tank  
✅ **5 Máscaras de Poder:** Bitmask, Alpha, Data, Surgical, Shader  
✅ **Sistema de Público:** Barra de aprovação que afeta gameplay  
✅ **Sistema de Ondas:** Spawn progressivo de inimigos  
✅ **UI Completa:** HUD, Menu, Pause, GameOver, Victory  
✅ **Sprites Profissionais:** 12 sprites pixel art (SVG + PNG)  

---

## 💡 Dicas de Desenvolvimento

### Para Modificar Sprites
1. Edite os arquivos `.svg` em `Assets/Sprites/`
2. Reconverta com: `magick arquivo.svg -background none -resize WxH arquivo.png`
3. Unity detecta automaticamente

### Para Adicionar Máscaras
1. Crie novo ScriptableObject de MaskData
2. Crie script herdando de `MaskBehavior`
3. Adicione ao MaskSystem

### Para Criar Nova Arena
1. Duplique `Game.unity`
2. Configure WaveManager com novos inimigos
3. Ajuste ArenaManager (tempo, spawn points)

---

## 🚀 Pronto para Produção!

O jogo está **100% funcional** e pronto para:
- ✅ Testar gameplay
- ✅ Adicionar mais conteúdo
- ✅ Fazer build (WebGL, Windows, Linux, Mac)
- ✅ Publicar (itch.io, Steam, etc)

**Apenas abra o Unity e pressione Play!** 🎮🎭🥧

---

## 📝 Créditos

**PÁ PÁ PÁ: THE MASK GAME**  
*Arena arcade com tortas e máscaras inspirado em programas de auditório brasileiros*

Criado para Game Jam (72h)  
Engine: Unity 2D  
Linguagem: C#  
Arte: Pixel Art (SVG/PNG)
