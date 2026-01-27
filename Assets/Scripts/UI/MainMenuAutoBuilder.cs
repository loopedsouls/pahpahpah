using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;

/// <summary>
/// Cria o menu automaticamente ao carregar a cena MainMenu
/// </summary>
public class MainMenuAutoBuilder : MonoBehaviour
{
    private void Start()
    {
        BuildMenu();
    }

    void BuildMenu()
    {
        // Verificar se já existe Canvas
        if (GameObject.Find("MenuCanvas") != null)
        {
            Debug.Log("Menu já existe");
            return;
        }

        Debug.Log("🎭 Construindo menu automaticamente...");

        // Criar Canvas
        GameObject canvasGO = new GameObject("MenuCanvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.sortingOrder = 100;

        CanvasScaler scaler = canvasGO.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        scaler.matchWidthOrHeight = 0.5f;

        canvasGO.AddComponent<GraphicRaycaster>();

        // Background
        CreateBackground(canvasGO);

        // Título
        CreateTitle(canvasGO);

        // Botões
        CreateButtonPanel(canvasGO);

        // Versão
        CreateVersionLabel(canvasGO);

        Debug.Log("✅ Menu criado com sucesso!");
    }

    void CreateBackground(GameObject parent)
    {
        GameObject bgGO = new GameObject("Background");
        bgGO.transform.SetParent(parent.transform, false);

        RectTransform bgRect = bgGO.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;

        Image bgImage = bgGO.AddComponent<Image>();
        
        // Tentar carregar sprite do Ren'Py
        Sprite bgSprite = Resources.Load<Sprite>("UI/MenuBackground");
        if (bgSprite != null)
        {
            bgImage.sprite = bgSprite;
            bgImage.color = new Color(0.8f, 0.8f, 0.8f);
        }
        else
        {
            // Fallback: cor escura
            bgImage.color = new Color(0.15f, 0.1f, 0.12f);
        }
    }

    void CreateTitle(GameObject parent)
    {
        GameObject titleGO = new GameObject("Title");
        titleGO.transform.SetParent(parent.transform, false);

        RectTransform titleRect = titleGO.AddComponent<RectTransform>();
        titleRect.anchorMin = new Vector2(0.5f, 0.75f);
        titleRect.anchorMax = new Vector2(0.5f, 0.75f);
        titleRect.sizeDelta = new Vector2(1000, 200);
        titleRect.anchoredPosition = Vector2.zero;

        TextMeshProUGUI titleText = titleGO.AddComponent<TextMeshProUGUI>();
        titleText.text = "PÁ PÁ PÁ\n<size=60>THE MASK GAME</size>";
        titleText.fontSize = 80;
        titleText.color = Color.white;
        titleText.alignment = TextAlignmentOptions.Center;
        titleText.fontStyle = FontStyles.Bold;

        // Shadow
        var shadow = titleGO.AddComponent<Shadow>();
        shadow.effectColor = new Color(0, 0, 0, 0.8f);
        shadow.effectDistance = new Vector2(4, -4);

        // Outline
        var outline = titleGO.AddComponent<Outline>();
        outline.effectColor = new Color(0.463f, 0.384f, 0.286f);
        outline.effectDistance = new Vector2(2, -2);
    }

    void CreateButtonPanel(GameObject parent)
    {
        GameObject panelGO = new GameObject("ButtonPanel");
        panelGO.transform.SetParent(parent.transform, false);

        RectTransform panelRect = panelGO.AddComponent<RectTransform>();
        panelRect.anchorMin = new Vector2(0.5f, 0.4f);
        panelRect.anchorMax = new Vector2(0.5f, 0.4f);
        panelRect.sizeDelta = new Vector2(450, 350);
        panelRect.anchoredPosition = Vector2.zero;

        // Background do painel
        Image panelImage = panelGO.AddComponent<Image>();
        panelImage.color = new Color(0, 0, 0, 0.6f);

        // Layout vertical
        VerticalLayoutGroup layout = panelGO.AddComponent<VerticalLayoutGroup>();
        layout.spacing = 25;
        layout.padding = new RectOffset(50, 50, 50, 50);
        layout.childAlignment = TextAnchor.MiddleCenter;
        layout.childControlWidth = true;
        layout.childControlHeight = false;
        layout.childForceExpandWidth = true;

        // Criar botões
        CreateButton(panelGO, "JOGAR", () => {
            Debug.Log("🎮 Iniciando jogo...");
            SceneManager.LoadScene("Game");
        });

        CreateButton(panelGO, "OPÇÕES", () => {
            Debug.Log("⚙️ Opções não implementadas ainda");
        });

        CreateButton(panelGO, "SAIR", () => {
            Debug.Log("🚪 Saindo do jogo...");
            #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
            #else
            Application.Quit();
            #endif
        });
    }

    void CreateButton(GameObject parent, string text, UnityEngine.Events.UnityAction onClick)
    {
        GameObject btnGO = new GameObject($"Button_{text}");
        btnGO.transform.SetParent(parent.transform, false);

        RectTransform btnRect = btnGO.AddComponent<RectTransform>();
        btnRect.sizeDelta = new Vector2(350, 70);

        Image btnImage = btnGO.AddComponent<Image>();
        btnImage.color = new Color(0.533f, 0.533f, 0.533f);

        Button btn = btnGO.AddComponent<Button>();
        
        // Cores do tema Ren'Py
        ColorBlock colors = btn.colors;
        colors.normalColor = new Color(0.533f, 0.533f, 0.533f);
        colors.highlightedColor = new Color(0.655f, 0.545f, 0.404f);
        colors.pressedColor = new Color(0.463f, 0.384f, 0.286f);
        colors.selectedColor = Color.white;
        colors.disabledColor = new Color(0.533f, 0.533f, 0.533f, 0.5f);
        colors.colorMultiplier = 1f;
        colors.fadeDuration = 0.1f;
        btn.colors = colors;

        btn.onClick.AddListener(onClick);

        // Texto do botão
        GameObject textGO = new GameObject("Text");
        textGO.transform.SetParent(btnGO.transform, false);

        RectTransform textRect = textGO.AddComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;

        TextMeshProUGUI btnText = textGO.AddComponent<TextMeshProUGUI>();
        btnText.text = text;
        btnText.fontSize = 40;
        btnText.color = Color.white;
        btnText.alignment = TextAlignmentOptions.Center;
        btnText.fontStyle = FontStyles.Bold;

        // Shadow no texto
        var shadow = textGO.AddComponent<Shadow>();
        shadow.effectColor = new Color(0, 0, 0, 0.5f);
        shadow.effectDistance = new Vector2(2, -2);
    }

    void CreateVersionLabel(GameObject parent)
    {
        GameObject versionGO = new GameObject("Version");
        versionGO.transform.SetParent(parent.transform, false);

        RectTransform versionRect = versionGO.AddComponent<RectTransform>();
        versionRect.anchorMin = new Vector2(1, 0);
        versionRect.anchorMax = new Vector2(1, 0);
        versionRect.sizeDelta = new Vector2(200, 50);
        versionRect.anchoredPosition = new Vector2(-20, 20);
        versionRect.pivot = new Vector2(1, 0);

        TextMeshProUGUI versionText = versionGO.AddComponent<TextMeshProUGUI>();
        versionText.text = "v1.0 MVP";
        versionText.fontSize = 20;
        versionText.color = new Color(1, 1, 1, 0.5f);
        versionText.alignment = TextAlignmentOptions.BottomRight;
    }
}
