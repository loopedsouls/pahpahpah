using UnityEngine;
using UnityEditor;

public class QuickPlaySetup : MonoBehaviour
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
    static void OnSceneLoaded()
    {
        if (Application.isPlaying && UnityEngine.SceneManagement.SceneManager.GetActiveScene().name == "Game")
        {
            SetupQuickPlay();
        }
    }

    static void SetupQuickPlay()
    {
        // Verificar se já tem player na cena
        if (GameObject.FindGameObjectWithTag("Player") != null)
        {
            Debug.Log("✓ Player já existe na cena");
            return;
        }

        Debug.Log("🎮 Configurando Quick Play...");

        // Criar Player
        GameObject player = new GameObject("Player");
        player.tag = "Player";
        player.layer = LayerMask.NameToLayer("Player");
        player.transform.position = Vector3.zero;
        
        // Adicionar componentes do Player
        var sr = player.AddComponent<SpriteRenderer>();
        sr.sortingLayerName = "Game";
        sr.sortingOrder = 1;
        sr.color = new Color(0.2f, 0.6f, 1f); // Azul placeholder
        
        var rb = player.AddComponent<Rigidbody2D>();
        rb.gravityScale = 0;
        rb.constraints = RigidbodyConstraints2D.FreezeRotation;
        
        var col = player.AddComponent<BoxCollider2D>();
        col.size = new Vector2(0.24f, 0.24f);
        
        player.AddComponent<PlayerController>();
        player.AddComponent<HealthSystem>();
        player.AddComponent<MaskSystem>();
        
        Debug.Log("✓ Player criado em runtime");

        // Criar HUD básico
        CreateRuntimeHUD();
    }

    static void CreateRuntimeHUD()
    {
        GameObject canvasGO = new GameObject("HUD Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        
        var scaler = canvasGO.AddComponent<UnityEngine.UI.CanvasScaler>();
        scaler.uiScaleMode = UnityEngine.UI.CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(1920, 1080);
        
        canvasGO.AddComponent<UnityEngine.UI.GraphicRaycaster>();
        
        Debug.Log("✓ HUD Canvas criado em runtime");
    }
}
