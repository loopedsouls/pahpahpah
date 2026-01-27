using UnityEngine;
using UnityEngine.UI;
using TMPro;

/// <summary>
/// Aplica o tema Ren'Py aos componentes UI
/// </summary>
[ExecuteAlways]
public class RenpyStyler : MonoBehaviour
{
    [SerializeField] private RenpyTheme theme;
    [SerializeField] private bool autoApply = true;
    
    private void Start()
    {
        if (autoApply && theme != null)
        {
            ApplyTheme();
        }
    }
    
    private void OnValidate()
    {
        if (autoApply && theme != null && Application.isPlaying)
        {
            ApplyTheme();
        }
    }
    
    [ContextMenu("Apply Theme")]
    public void ApplyTheme()
    {
        if (theme == null)
        {
            Debug.LogWarning("RenpyTheme não atribuído!");
            return;
        }
        
        ApplyToButtons();
        ApplyToTexts();
        ApplyToImages();
        ApplyToPanels();
    }
    
    private void ApplyToButtons()
    {
        Button[] buttons = GetComponentsInChildren<Button>(true);
        
        foreach (Button btn in buttons)
        {
            ColorBlock colors = btn.colors;
            colors.normalColor = theme.idleColor;
            colors.highlightedColor = theme.hoverColor;
            colors.pressedColor = theme.accentColor;
            colors.selectedColor = theme.selectedColor;
            colors.disabledColor = theme.insensitiveColor;
            btn.colors = colors;
            
            // Aplicar sprite se disponível
            if (theme.button != null)
            {
                Image img = btn.GetComponent<Image>();
                if (img != null) img.sprite = theme.button;
            }
            
            // Estilizar texto do botão
            TextMeshProUGUI btnText = btn.GetComponentInChildren<TextMeshProUGUI>();
            if (btnText != null)
            {
                btnText.color = theme.interfaceTextColor;
                btnText.fontSize = theme.interfaceTextSize;
                if (theme.interfaceFont != null)
                {
                    // TMPro usa FontAsset, não Font regular
                    // Por enquanto apenas ajusta tamanho e cor
                }
            }
        }
    }
    
    private void ApplyToTexts()
    {
        TextMeshProUGUI[] texts = GetComponentsInChildren<TextMeshProUGUI>(true);
        
        foreach (TextMeshProUGUI text in texts)
        {
            // Não modificar textos que já são parte de botões (já tratados)
            if (text.GetComponentInParent<Button>() != null) continue;
            
            // Determinar tipo baseado no nome ou tag
            if (text.name.Contains("Title") || text.CompareTag("Title"))
            {
                text.color = theme.textColor;
                text.fontSize = theme.titleTextSize;
            }
            else if (text.name.Contains("Label"))
            {
                text.color = theme.textColor;
                text.fontSize = theme.labelTextSize;
            }
            else
            {
                text.color = theme.interfaceTextColor;
                text.fontSize = theme.interfaceTextSize;
            }
        }
    }
    
    private void ApplyToImages()
    {
        Image[] images = GetComponentsInChildren<Image>(true);
        
        foreach (Image img in images)
        {
            // Pular botões (já tratados)
            if (img.GetComponent<Button>() != null) continue;
            
            // Aplicar background se for um painel/fundo
            if (img.name.Contains("Background") && theme.menuBackground != null)
            {
                img.sprite = theme.menuBackground;
                img.type = Image.Type.Simple;
            }
            else if (img.name.Contains("Panel") && theme.panel != null)
            {
                img.sprite = theme.panel;
                img.type = Image.Type.Sliced;
            }
        }
    }
    
    private void ApplyToPanels()
    {
        // Aplicar cor de fundo aos painéis
        Image[] allImages = GetComponentsInChildren<Image>(true);
        
        foreach (Image img in allImages)
        {
            if (img.name.Contains("Panel") || img.name.Contains("Frame"))
            {
                if (theme.panel != null)
                {
                    img.sprite = theme.panel;
                    img.type = Image.Type.Sliced;
                }
            }
        }
    }
}
