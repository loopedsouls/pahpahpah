using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;
using System.Collections;

public class MainMenuManager : MonoBehaviour
{
    private void Awake()
    {
        Debug.Log("🚨🚨🚨 MainMenuManager.Awake() CHAMADO! 🚨🚨🚨");
        Debug.LogWarning("=== INICIANDO CRIAÇÃO DO MENU ===");
    }

    private void Start()
    {
        Debug.Log("🎭 MainMenuManager.Start() CHAMADO!");
        Debug.LogWarning("🔨 Chamando CreatePahPahPahMainMenu()...");
        CreatePahPahPahMainMenu();
    }

    private void CreatePahPahPahMainMenu()
    {
        Debug.Log("🔨 Criando menu PÁ PÁ PÁ...");

        // Create Camera if not exists (IGUAL AO INVISIBLESCARS)
        if (Camera.main == null)
        {
            Debug.Log("📷 Criando câmera...");
            GameObject camObj = new GameObject("Main Camera");
            Camera cam = camObj.AddComponent<Camera>();
            cam.backgroundColor = new Color(0.15f, 0.1f, 0.12f); // Marrom escuro
            cam.clearFlags = CameraClearFlags.SolidColor;
            cam.transform.position = new Vector3(0, 0, -10);
            cam.orthographic = true;
            cam.orthographicSize = 5;
            camObj.tag = "MainCamera";
            camObj.AddComponent<AudioListener>();
            Debug.Log("✓ Câmera criada!");
        }

        // Create Canvas (IGUAL AO INVISIBLESCARS)
        Debug.Log("🖼️ Criando Canvas...");
        GameObject canvasObj = new GameObject("Canvas");
        Canvas canvas = canvasObj.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        CanvasScaler scaler = canvasObj.AddComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        scaler.matchWidthOrHeight = 0.5f;
        canvasObj.AddComponent<GraphicRaycaster>();
        Debug.Log("✓ Canvas criado!");

        // Create EventSystem if not exists (IGUAL AO INVISIBLESCARS)
        if (FindObjectOfType<UnityEngine.EventSystems.EventSystem>() == null)
        {
            Debug.Log("🎮 Criando EventSystem...");
            GameObject eventSystem = new GameObject("EventSystem");
            eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
            eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
            Debug.Log("✓ EventSystem criado!");
        }

        // Background
        Debug.Log("🎨 Criando Background...");
        GameObject bgFrame = new GameObject("Background");
        bgFrame.transform.SetParent(canvasObj.transform, false);
        Image bgFrameImg = bgFrame.AddComponent<Image>();
        bgFrameImg.color = new Color(0.15f, 0.1f, 0.12f, 1f); // Marrom escuro
        RectTransform bgRect = bgFrame.GetComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;
        Debug.Log("✓ Background criado!");

        // Game Title
        Debug.Log("📝 Criando Título...");
        GameObject titleObj = new GameObject("GameTitle");
        titleObj.transform.SetParent(canvasObj.transform, false);
        Text titleText = titleObj.AddComponent<Text>();
        titleText.text = "PÁ PÁ PÁ\nTHE MASK GAME";
        titleText.fontSize = 80;
        titleText.color = Color.yellow; // Amarelo berrante
        titleText.alignment = TextAnchor.MiddleCenter;
        titleText.fontStyle = FontStyle.Bold;
        Font titleFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (titleFont == null) titleFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
        if (titleFont != null) titleText.font = titleFont;
        RectTransform titleRect = titleObj.GetComponent<RectTransform>();
        titleRect.anchoredPosition = new Vector2(0, 300);
        titleRect.sizeDelta = new Vector2(800, 200);
        Debug.Log("✓ Título criado!");

        // Button Container
        Debug.Log("🔘 Criando container de botões...");
        GameObject buttonContainer = new GameObject("ButtonContainer");
        buttonContainer.transform.SetParent(canvasObj.transform, false);
        RectTransform containerRect = buttonContainer.AddComponent<RectTransform>();
        containerRect.anchoredPosition = new Vector2(0, 0);
        containerRect.sizeDelta = new Vector2(400, 500);
        
        VerticalLayoutGroup layout = buttonContainer.AddComponent<VerticalLayoutGroup>();
        layout.spacing = 20;
        layout.childAlignment = TextAnchor.MiddleCenter;
        layout.childControlHeight = false;
        layout.childControlWidth = false;
        layout.childForceExpandHeight = false;
        layout.childForceExpandWidth = false;
        layout.padding = new RectOffset(0, 0, 0, 0);
        Debug.Log("✓ Container criado!");

        // Create buttons
        Debug.Log("🔘 Criando botões...");
        CreateMenuButton(buttonContainer, "JOGAR", "Start", 0f);
        CreateMenuButton(buttonContainer, "OPÇÕES", "Options", 0.2f);
        CreateMenuButton(buttonContainer, "SAIR", "Quit", 0.4f);
        
        Debug.Log("✅ MENU CRIADO COM SUCESSO!");
    }

    private void CreateMenuButton(GameObject parent, string buttonText, string action, float animDelay)
    {
        GameObject btnObj = new GameObject("Button_" + buttonText);
        btnObj.transform.SetParent(parent.transform, false);

        RectTransform btnRect = btnObj.AddComponent<RectTransform>();
        btnRect.sizeDelta = new Vector2(400, 80);
        
        LayoutElement layoutElement = btnObj.AddComponent<LayoutElement>();
        layoutElement.minHeight = 80;
        layoutElement.preferredHeight = 80;

        // Button visual
        Image btnImg = btnObj.AddComponent<Image>();
        btnImg.color = new Color(0.3f, 0.3f, 0.4f, 1f); // Visível!
        btnImg.raycastTarget = true;
        
        Button btn = btnObj.AddComponent<Button>();
        btn.targetGraphic = btnImg;
        btn.interactable = true;

        // Button text
        GameObject textObj = new GameObject("Text");
        textObj.transform.SetParent(btnObj.transform, false);
        Text text = textObj.AddComponent<Text>();
        text.text = buttonText;
        text.fontSize = 40;
        text.alignment = TextAnchor.MiddleCenter;
        text.fontStyle = FontStyle.Bold;
        Font btnFont = Resources.GetBuiltinResource<Font>("LegacyRuntime.ttf");
        if (btnFont == null) btnFont = Resources.GetBuiltinResource<Font>("Arial.ttf");
        if (btnFont != null) text.font = btnFont;
        text.raycastTarget = false;
        text.color = Color.white;

        RectTransform textRect = textObj.GetComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;

        // Button colors
        ColorBlock colors = btn.colors;
        colors.normalColor = new Color(0.3f, 0.3f, 0.4f, 1f);
        colors.highlightedColor = new Color(0.463f, 0.384f, 0.286f, 1f); // Marrom
        colors.pressedColor = new Color(0.6f, 0.5f, 0.3f, 1f);
        colors.colorMultiplier = 1f;
        colors.fadeDuration = 0.1f;
        btn.colors = colors;

        // Button actions - IGUAL AO INVISIBLESCARS
        switch (action)
        {
            case "Start":
                btn.onClick.AddListener(() => {
                    Debug.Log("🎮 Botão JOGAR clicado!");
                    
                    // Se existe GameManager, usa ele (mantém estado entre cenas)
                    if (GameManager.Instance != null)
                    {
                        Debug.Log("✓ GameManager encontrado - usando StartGame()");
                        GameManager.Instance.StartGame();
                    }
                    else
                    {
                        // Fallback: carrega direto
                        Debug.LogWarning("⚠️ GameManager não encontrado - carregando cena direto");
                        SceneManager.LoadScene("Game");
                    }
                });
                break;
            case "Options":
                btn.onClick.AddListener(() => {
                    Debug.Log("⚙️ Botão OPÇÕES clicado!");
                });
                break;
            case "Quit":
                btn.onClick.AddListener(() => {
                    Debug.Log("🚪 Botão SAIR clicado!");
                    QuitGame();
                });
                break;
        }
        
        Debug.Log($"✓ Botão '{buttonText}' criado");

        // Hover effect
        UnityEngine.EventSystems.EventTrigger trigger = btnObj.AddComponent<UnityEngine.EventSystems.EventTrigger>();
        
        var pointerEnter = new UnityEngine.EventSystems.EventTrigger.Entry();
        pointerEnter.eventID = UnityEngine.EventSystems.EventTriggerType.PointerEnter;
        pointerEnter.callback.AddListener((data) => { 
            text.color = new Color(1f, 1f, 0.5f, 1f); // Amarelo hover
        });
        trigger.triggers.Add(pointerEnter);
        
        var pointerExit = new UnityEngine.EventSystems.EventTrigger.Entry();
        pointerExit.eventID = UnityEngine.EventSystems.EventTriggerType.PointerExit;
        pointerExit.callback.AddListener((data) => { 
            text.color = Color.white;
        });
        trigger.triggers.Add(pointerExit);

        // Fade-in
        if (animDelay > 0)
        {
            StartCoroutine(FadeInButton(btnObj, animDelay));
        }
    }

    private System.Collections.IEnumerator FadeInButton(GameObject button, float delay)
    {
        CanvasGroup canvasGroup = button.AddComponent<CanvasGroup>();
        canvasGroup.alpha = 0f;
        yield return new WaitForSeconds(delay);

        float elapsed = 0f;
        float duration = 0.3f;
        while (elapsed < duration)
        {
            elapsed += Time.deltaTime;
            canvasGroup.alpha = Mathf.Lerp(0f, 1f, elapsed / duration);
            yield return null;
        }
        canvasGroup.alpha = 1f;
    }

    private void QuitGame()
    {
        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #else
        Application.Quit();
        #endif
    }
}
