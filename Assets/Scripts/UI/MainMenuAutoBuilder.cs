using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using TMPro;
using UnityEngine.EventSystems;

public class MainMenuAutoBuilder : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("🔵 MainMenuAutoBuilder INICIADO!");
    }

    private void Start()
    {
        Debug.Log("🔵 Start() chamado, construindo menu...");
        BuildMenu();
    }

    void BuildMenu()
    {
        // Verificar se já existe Canvas
        Canvas existingCanvas = FindObjectOfType<Canvas>();
        if (existingCanvas != null && existingCanvas.gameObject.name == "MenuCanvas")
        {
            Debug.Log("Menu já existe, pulando...");
            return;
        }

        Debug.Log("🎭 Construindo menu automaticamente...");

        // Garantir EventSystem
        if (FindObjectOfType<EventSystem>() == null)
        {
            GameObject eventSystemGO = new GameObject("EventSystem");
            eventSystemGO.AddComponent<EventSystem>();
            eventSystemGO.AddComponent<StandaloneInputModule>();
            Debug.Log("✓ EventSystem criado");
        }

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
        Debug.Log("✓ Canvas criado");

        // Background SIMPLES (apenas cor)
        GameObject bgGO = new GameObject("Background");
        bgGO.transform.SetParent(canvasGO.transform, false);
        
        RectTransform bgRect = bgGO.AddComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        
        Image bgImage = bgGO.AddComponent<Image>();
        bgImage.color = new Color(0.15f, 0.1f, 0.12f); // Marrom escuro
        Debug.Log("✓ Background criado");

        // Título GRANDE
        GameObject titleGO = new GameObject("Title");
        titleGO.transform.SetParent(canvasGO.transform, false);
        
        RectTransform titleRect = titleGO.AddComponent<RectTransform>();
        titleRect.anchorMin = new Vector2(0.5f, 0.7f);
        titleRect.anchorMax = new Vector2(0.5f, 0.7f);
        titleRect.sizeDelta = new Vector2(1200, 300);
        titleRect.anchoredPosition = Vector2.zero;
        
        TextMeshProUGUI titleText = titleGO.AddComponent<TextMeshProUGUI>();
        titleText.text = "PÁ PÁ PÁ\nTHE MASK GAME";
        titleText.fontSize = 100;
        titleText.color = Color.yellow;
        titleText.alignment = TextAlignmentOptions.Center;
        titleText.fontStyle = FontStyles.Bold;
        Debug.Log("✓ Título criado");

        // Criar BOTÕES SIMPLES
        CreateSimpleButton(canvasGO, "JOGAR", new Vector2(0, 50), () => {
            Debug.Log("🎮 Botão JOGAR clicado!");
            SceneManager.LoadScene("Game");
        });

        CreateSimpleButton(canvasGO, "OPÇÕES", new Vector2(0, -50), () => {
            Debug.Log("⚙️ Botão OPÇÕES clicado!");
        });

        CreateSimpleButton(canvasGO, "SAIR", new Vector2(0, -150), () => {
            Debug.Log("🚪 Botão SAIR clicado!");
            #if UNITY_EDITOR
            UnityEditor.EditorApplication.isPlaying = false;
            #else
            Application.Quit();
            #endif
        });

        Debug.Log("✅ MENU CRIADO COM SUCESSO!");
        Debug.Log("Se você está vendo essa mensagem mas não vê o menu, há um problema de renderização");
    }

    void CreateSimpleButton(GameObject parent, string text, Vector2 position, UnityEngine.Events.UnityAction onClick)
    {
        GameObject btnGO = new GameObject($"Btn_{text}");
        btnGO.transform.SetParent(parent.transform, false);

        RectTransform btnRect = btnGO.AddComponent<RectTransform>();
        btnRect.anchorMin = new Vector2(0.5f, 0.5f);
        btnRect.anchorMax = new Vector2(0.5f, 0.5f);
        btnRect.sizeDelta = new Vector2(400, 80);
        btnRect.anchoredPosition = position;

        Image btnImage = btnGO.AddComponent<Image>();
        btnImage.color = new Color(0.3f, 0.3f, 0.4f);

        Button btn = btnGO.AddComponent<Button>();
        ColorBlock colors = btn.colors;
        colors.normalColor = new Color(0.3f, 0.3f, 0.4f);
        colors.highlightedColor = new Color(0.5f, 0.4f, 0.3f);
        colors.pressedColor = new Color(0.6f, 0.5f, 0.3f);
        btn.colors = colors;
        btn.onClick.AddListener(onClick);

        // Texto
        GameObject textGO = new GameObject("Text");
        textGO.transform.SetParent(btnGO.transform, false);
        
        RectTransform textRect = textGO.AddComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;
        
        TextMeshProUGUI btnText = textGO.AddComponent<TextMeshProUGUI>();
        btnText.text = text;
        btnText.fontSize = 48;
        btnText.color = Color.white;
        btnText.alignment = TextAlignmentOptions.Center;
        btnText.fontStyle = FontStyles.Bold;

        Debug.Log($"✓ Botão '{text}' criado na posição {position}");
    }
}
