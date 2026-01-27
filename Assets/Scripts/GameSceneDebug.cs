using UnityEngine;
using UnityEngine.UI;
using UnityEngine.SceneManagement;

/// <summary>
/// Script temporário para testar se a cena Game carrega
/// Mostra um texto simples indicando que o jogo iniciou
/// </summary>
public class GameSceneDebug : MonoBehaviour
{
    private void Start()
    {
        Debug.Log("🎮 GameSceneDebug: Cena Game carregada!");
        CreateDebugUI();
    }

    private void CreateDebugUI()
    {
        // Criar Canvas
        GameObject canvasObj = new GameObject("DebugCanvas");
        Canvas canvas = canvasObj.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasObj.AddComponent<CanvasScaler>();
        canvasObj.AddComponent<GraphicRaycaster>();

        // Background verde para mostrar que funcionou
        GameObject bg = new GameObject("Background");
        bg.transform.SetParent(canvasObj.transform, false);
        Image bgImg = bg.AddComponent<Image>();
        bgImg.color = new Color(0.1f, 0.3f, 0.1f, 1f); // Verde escuro
        RectTransform bgRect = bg.GetComponent<RectTransform>();
        bgRect.anchorMin = Vector2.zero;
        bgRect.anchorMax = Vector2.one;
        bgRect.sizeDelta = Vector2.zero;

        // Texto de sucesso
        GameObject textObj = new GameObject("SuccessText");
        textObj.transform.SetParent(canvasObj.transform, false);
        Text text = textObj.AddComponent<Text>();
        text.text = "✅ JOGO INICIADO COM SUCESSO!\n\n" +
                   "Cena: Game\n" +
                   "MVP: Arena + Inimigos + Máscaras\n\n" +
                   "Pressione ESC para voltar ao menu";
        text.fontSize = 30;
        text.alignment = TextAnchor.MiddleCenter;
        text.color = Color.white;
        Font font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        if (font != null) text.font = font;
        
        RectTransform textRect = textObj.GetComponent<RectTransform>();
        textRect.sizeDelta = new Vector2(800, 400);

        // Botão voltar
        CreateBackButton(canvasObj);

        Debug.Log("✅ Debug UI criada - jogo carregou corretamente!");
    }

    private void CreateBackButton(GameObject parent)
    {
        GameObject btnObj = new GameObject("BackButton");
        btnObj.transform.SetParent(parent.transform, false);
        
        RectTransform btnRect = btnObj.AddComponent<RectTransform>();
        btnRect.sizeDelta = new Vector2(300, 60);
        btnRect.anchoredPosition = new Vector2(0, -200);
        
        Image btnImg = btnObj.AddComponent<Image>();
        btnImg.color = new Color(0.3f, 0.3f, 0.4f, 1f);
        
        Button btn = btnObj.AddComponent<Button>();
        btn.onClick.AddListener(() => {
            Debug.Log("🔙 Voltando ao menu...");
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ReturnToMenu();
            }
            else
            {
                SceneManager.LoadScene("MainMenu");
            }
        });
        
        // Texto do botão
        GameObject textObj = new GameObject("Text");
        textObj.transform.SetParent(btnObj.transform, false);
        Text text = textObj.AddComponent<Text>();
        text.text = "VOLTAR AO MENU";
        text.fontSize = 24;
        text.alignment = TextAnchor.MiddleCenter;
        text.color = Color.white;
        Font font = Resources.GetBuiltinResource<Font>("Arial.ttf");
        if (font != null) text.font = font;
        
        RectTransform textRect = textObj.GetComponent<RectTransform>();
        textRect.anchorMin = Vector2.zero;
        textRect.anchorMax = Vector2.one;
        textRect.sizeDelta = Vector2.zero;
    }

    private void Update()
    {
        // ESC volta ao menu
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (GameManager.Instance != null)
            {
                GameManager.Instance.ReturnToMenu();
            }
            else
            {
                SceneManager.LoadScene("MainMenu");
            }
        }
    }
}
