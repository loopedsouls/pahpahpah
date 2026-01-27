# 🎨 TEMA REN'PY INTEGRADO - Invisible Scars

## ✅ O QUE FOI FEITO

Roubei a estrutura visual e o GUI do projeto Ren'Py "Invisible Scars" e adaptei para Unity!

---

## 📁 ARQUIVOS COPIADOS

### Do Ren'Py → Unity:

```
/renpy/invisiblescars/game/gui/
  ├── main_menu.png    → Assets/Sprites/UI/MenuBackground.png (8MB)
  ├── textbox.png      → Assets/Sprites/UI/Panel.png (2.6MB)
  └── gui.rpy         → Assets/Scripts/UI/RenpyTheme.cs (cores e config)
```

---

## 🎨 ESQUEMA DE CORES (do gui.rpy)

| Elemento | Cor | Hex | RGB |
|----------|-----|-----|-----|
| **Accent** | Tom marrom vintage | `#766249` | (118, 98, 73) |
| **Idle** | Cinza médio | `#888888` | (136, 136, 136) |
| **Hover** | Marrom claro | `#a78b67` | (167, 139, 103) |
| **Selected** | Branco puro | `#ffffff` | (255, 255, 255) |
| **Muted** | Vermelho escuro | `#510000` | (81, 0, 0) |
| **Text** | Branco | `#ffffff` | (255, 255, 255) |

> **Estilo:** Elegante, nostálgico, com tons quentes de marrom e vermelho

---

## 🔧 SCRIPTS CRIADOS

### 1. `RenpyTheme.cs` - ScriptableObject
Define o tema visual completo:
- Todas as cores do Ren'Py
- Tamanhos de fonte (33px texto, 50px título)
- Referências de sprites (background, painel, botões)
- Referências de fontes

### 2. `RenpyStyler.cs` - Componente
Aplica o tema automaticamente:
- Botões (idle, hover, pressed, disabled)
- Textos (título, label, interface)
- Imagens (background, panels)
- Painéis e frames

---

## 🎮 COMO USAR

### Automático (Recomendado):

1. Abra o Unity
2. O script `AutoSetup.cs` aplica automaticamente
3. Tema "Invisible Scars" é configurado

### Manual:

1. Crie um Canvas no Unity
2. Adicione componente `RenpyStyler`
3. Atribua o tema: `Assets/UI/Themes/InvisibleScarsTheme.asset`
4. Pressione botão "Apply Theme" no Inspector
5. Todos os UI dentro do Canvas são estilizados!

---

## 📋 ESTRUTURA DO TEMA

```
Assets/
├── UI/
│   └── Themes/
│       └── InvisibleScarsTheme.asset  ← ScriptableObject do tema
├── Sprites/
│   └── UI/
│       ├── MenuBackground.png         ← Fundo do menu (arte original)
│       └── Panel.png                  ← Textura de painel
├── Fonts/
│   ├── Jost-Light.ttf                ← Fonte de texto (baixar)
│   └── Redressed.ttf                 ← Fonte de título (baixar)
└── Scripts/
    └── UI/
        ├── RenpyTheme.cs             ← Define o tema
        └── RenpyStyler.cs            ← Aplica o tema
```

---

## 🎨 FONTES

As fontes originais precisam ser baixadas:

1. **Jost Light** (texto/interface)
   - Google Fonts: https://fonts.google.com/specimen/Jost
   - Download: Jost-Light.ttf
   - Coloque em: `Assets/Fonts/`

2. **Redressed** (títulos/nomes)
   - Google Fonts: https://fonts.google.com/specimen/Redressed
   - Download: Redressed.ttf
   - Coloque em: `Assets/Fonts/`

> TextMeshPro detecta automaticamente fontes TrueType (.ttf)

---

## 💡 VANTAGENS DO SISTEMA

✅ **Consistência Visual:** Mesmo estilo do Ren'Py
✅ **Fácil Manutenção:** Mude cores em 1 lugar
✅ **Reutilizável:** Aplique em qualquer Canvas
✅ **Automático:** Setup detecta e aplica sozinho
✅ **Flexível:** Crie novos temas facilmente

---

## 🔄 DIFERENÇAS REN'PY → UNITY

| Ren'Py | Unity | Nota |
|--------|-------|------|
| `gui.accent_color` | `theme.accentColor` | Mesmo valor |
| `gui.text_font` | `theme.textFont` | TMPro FontAsset |
| `Frame("gui/frame.png")` | `Image.sprite = panel` | Sliced sprite |
| `textbutton` | `Button + TextMeshProUGUI` | Componente UI |
| `screen` | `Canvas` | UI Container |

---

## 🎯 EXEMPLO DE USO

```csharp
// No seu script de Menu
public class MyMenu : MonoBehaviour
{
    [SerializeField] private RenpyTheme theme;
    
    private void Start()
    {
        // Aplicar tema manualmente se necessário
        GetComponent<RenpyStyler>()?.ApplyTheme();
    }
}
```

---

## 🚀 RESULTADO FINAL

O menu do Unity agora tem:
- ✅ Mesmo esquema de cores do "Invisible Scars"
- ✅ Background artístico do Ren'Py
- ✅ Painéis com textura vintage
- ✅ Botões estilizados (hover/pressed)
- ✅ Tipografia elegante

**Visual nostálgico e elegante, perfeito para um jogo de narrativa!**

---

## 📝 CRÉDITOS

**Arte Original:** Projeto Ren'Py "Invisible Scars"  
**Adaptação Unity:** Sistema automatizado  
**Tema:** Vintage/Nostálgico com tons marrom e vermelho

🎭 Agora **PÁ PÁ PÁ** tem um menu profissional estilo visual novel! 🥧
