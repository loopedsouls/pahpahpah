using UnityEngine;

/// <summary>
/// Theme baseado no Ren'Py "Invisible Scars"
/// Cores e estilo adaptados do gui.rpy
/// </summary>
[CreateAssetMenu(fileName = "RenpyTheme", menuName = "PahPahPah/Renpy Theme")]
public class RenpyTheme : ScriptableObject
{
    [Header("Cores do GUI Ren'Py")]
    
    [Tooltip("Cor de destaque - #766249")]
    public Color accentColor = new Color(0.463f, 0.384f, 0.286f); // #766249
    
    [Tooltip("Cor idle - #888888")]
    public Color idleColor = new Color(0.533f, 0.533f, 0.533f); // #888888
    
    [Tooltip("Cor hover - #a78b67")]
    public Color hoverColor = new Color(0.655f, 0.545f, 0.404f); // #a78b67
    
    [Tooltip("Cor selecionado - #ffffff")]
    public Color selectedColor = Color.white; // #ffffff
    
    [Tooltip("Cor desabilitado - #8888887f")]
    public Color insensitiveColor = new Color(0.533f, 0.533f, 0.533f, 0.5f); // #8888887f
    
    [Tooltip("Cor muted - #510000")]
    public Color mutedColor = new Color(0.318f, 0f, 0f); // #510000
    
    [Tooltip("Cor hover muted - #7a0000")]
    public Color hoverMutedColor = new Color(0.478f, 0f, 0f); // #7a0000
    
    [Tooltip("Cor do texto - #ffffff")]
    public Color textColor = Color.white; // #ffffff
    
    [Tooltip("Cor do texto de interface - #ffffff")]
    public Color interfaceTextColor = Color.white; // #ffffff
    
    [Header("Tamanhos de Fonte")]
    public int textSize = 33;
    public int nameTextSize = 45;
    public int interfaceTextSize = 33;
    public int labelTextSize = 36;
    public int notifyTextSize = 24;
    public int titleTextSize = 50;
    
    [Header("Sprites do GUI")]
    public Sprite menuBackground;
    public Sprite panel;
    public Sprite button;
    public Sprite buttonHover;
    public Sprite buttonPressed;
    
    [Header("Fontes")]
    public Font textFont; // Jost-Light
    public Font titleFont; // Redressed
    public Font interfaceFont; // Jost-Light
}
