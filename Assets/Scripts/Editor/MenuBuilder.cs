using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine.UI;
using TMPro;

public class MenuBuilder : EditorWindow
{
    [MenuItem("PahPahPah/Build MainMenu UI")]
    static void BuildMainMenu()
    {
        // Abrir cena MainMenu
        EditorSceneManager.OpenScene("Assets/Scenes/MainMenu.unity");
        
        // Limpar objetos antigos de UI
        GameObject oldCanvas = GameObject.Find("Canvas");
        if (oldCanvas != null) DestroyImmediate(oldCanvas);
        
        // Criar Canvas principal
        GameObject canvasGO = new GameObject("Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        
        CanvasScaler scaler = canvasGO.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        scaler.matchWidthOrHeight = 0.5f;
        
        canvasGO.AddComponent<GraphicRaycaster>();
        
        // Background
        GameObject bgGO = new GameObject("Background");
        bgGO.transform.SetParent(canvasGO.transform);
        RectTransform bgRect = bgGO.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        
        Image bgImage = bgGO.AddComponent<Image>();
        Sprite bgSprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Sprites/UI/MenuBackground.png");
        if (bgSprite != null)
        {
            bgImage.sprite = bgSprite;
            bgImage.color = new Color(0.8f, 0.8f, 0.8f);
        }
        else
        {
            bgImage.color = new Color(0.1f, 0.1f, 0.15f);
        }
        
        // Título
        GameObject titleGO = new GameObject("Title");
        titleGO.transform.SetParent(canvasGO.transform);
        RectTransform titleRect = titleGO.AddComponent<RectTransform>();
        titleRect.anchorMin = new Vector2(0.5f, 0.8f);
        titleRect.anchorMax = new Vector2(0.5f, 0.8f);
        titleRect.sizeDelta = new Vector2(800, 150);
        titleRect.anchoredPosition = Vector2.zero;
        
        TextMeshProUGUI titleText = titleGO.AddComponent<TextMeshProUGUI>();
        titleText.text = "PÁ PÁ PÁ\nTHE MASK GAME";
        titleText.fontSize = 72;
        titleText.color = Color.white;
        titleText.alignment = TextAlignmentOptions.Center;
        titleText.fontStyle = FontStyles.Bold;
        
        // Outline
        var outline = titleGO.AddComponent<Outline>();
        outline.effectColor = new Color(0.463f, 0.384f, 0.286f); // Accent color
        outline.effectDistance = new Vector2(3, -3);
        
        // Painel de botões
        GameObject panelGO = new GameObject("ButtonPanel");
        panelGO.transform.SetParent(canvasGO.transform);
        RectTransform panelRect = panelGO.AddComponent<RectTransform>();
        panelRect.anchorMin = new Vector2(0.5f, 0.4f);
        panelRect.anchorMax = new Vector2(0.5f, 0.4f);
        panelRect.sizeDelta = new Vector2(400, 300);
        panelRect.anchoredPosition = Vector2.zero;
        
        Image panelImage = panelGO.AddComponent<Image>();
        Sprite panelSprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Sprites/UI/Panel.png");
        if (panelSprite != null)
        {
            panelImage.sprite = panelSprite;
            panelImage.type = Image.Type.Sliced;
            panelImage.color = new Color(1f, 1f, 1f, 0.3f);
        }
        else
        {
            panelImage.color = new Color(0f, 0f, 0f, 0.5f);
        }
        
        VerticalLayoutGroup layout = panelGO.AddComponent<VerticalLayoutGroup>();
        layout.spacing = 20;
        layout.padding = new RectOffset(40, 40, 40, 40);
        layout.childAlignment = TextAnchor.MiddleCenter;
        layout.childControlWidth = true;
        layout.childControlHeight = false;
        layout.childForceExpandWidth = true;
        layout.childForceExpandHeight = false;
        
        // Botões
        CreateMenuButton(panelGO, "Jogar", "StartGame");
        CreateMenuButton(panelGO, "Opções", "OpenOptions");
        CreateMenuButton(panelGO, "Sair", "QuitGame");
        
        // Adicionar MainMenu script ao Canvas
        GameObject mainMenuGO = GameObject.Find("MainMenu");
        if (mainMenuGO == null)
        {
            mainMenuGO = new GameObject("MainMenu");
        }
        
        MainMenu mainMenuScript = mainMenuGO.GetComponent<MainMenu>();
        if (mainMenuScript == null)
        {
            mainMenuScript = mainMenuGO.AddComponent<MainMenu>();
        }
        
        // Versão
        GameObject versionGO = new GameObject("Version");
        versionGO.transform.SetParent(canvasGO.transform);
        RectTransform versionRect = versionGO.AddComponent<RectTransform>();
        versionRect.anchorMin = new Vector2(1, 0);
        versionRect.anchorMax = new Vector2(1, 0);
        versionRect.sizeDelta = new Vector2(200, 50);
        versionRect.anchoredPosition = new Vector2(-10, 10);
        versionRect.pivot = new Vector2(1, 0);
        
        TextMeshProUGUI versionText = versionGO.AddComponent<TextMeshProUGUI>();
        versionText.text = "v1.0 MVP";
        versionText.fontSize = 18;
        versionText.color = new Color(1, 1, 1, 0.5f);
        versionText.alignment = TextAlignmentOptions.BottomRight;
        
        // Salvar cena
        EditorSceneManager.SaveOpenScenes();
        
        Debug.Log("✅ Menu principal criado com sucesso!");
        Debug.Log("Botões: Jogar, Opções, Sair");
        Debug.Log("Background e painel do Ren'Py aplicados");
    }
    
    static void CreateMenuButton(GameObject parent, string text, string functionName)
    {
        GameObject btnGO = new GameObject($"Button_{functionName}");
        btnGO.transform.SetParent(parent.transform);
        
        RectTransform btnRect = btnGO.AddComponent<RectTransform>();
        btnRect.sizeDelta = new Vector2(320, 60);
        
        Image btnImage = btnGO.AddComponent<Image>();
        btnImage.color = new Color(0.533f, 0.533f, 0.533f); // idle color
        
        Button btn = btnGO.AddComponent<Button>();
        ColorBlock colors = btn.colors;
        colors.normalColor = new Color(0.533f, 0.533f, 0.533f); // idle
        colors.highlightedColor = new Color(0.655f, 0.545f, 0.404f); // hover
        colors.pressedColor = new Color(0.463f, 0.384f, 0.286f); // accent
        colors.selectedColor = Color.white;
        colors.disabledColor = new Color(0.533f, 0.533f, 0.533f, 0.5f);
        btn.colors = colors;
        
        // Texto do botão
        GameObject textGO = new GameObject("Text");
        textGO.transform.SetParent(btnGO.transform);
        
        RectTransform textRect = textGO.AddComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;
        
        TextMeshProUGUI btnText = textGO.AddComponent<TextMeshProUGUI>();
        btnText.text = text;
        btnText.fontSize = 36;
        btnText.color = Color.white;
        btnText.alignment = TextAlignmentOptions.Center;
        btnText.fontStyle = FontStyles.Bold;
        
        // Configurar evento
        MainMenu mainMenu = GameObject.FindObjectOfType<MainMenu>();
        if (mainMenu != null)
        {
            UnityEngine.Events.UnityAction action = null;
            
            switch (functionName)
            {
                case "StartGame":
                    action = () => mainMenu.StartGame();
                    break;
                case "OpenOptions":
                    action = () => mainMenu.OpenOptions();
                    break;
                case "QuitGame":
                    action = () => mainMenu.QuitGame();
                    break;
            }
            
            if (action != null)
            {
                btn.onClick.AddListener(action);
            }
        }
    }
}
