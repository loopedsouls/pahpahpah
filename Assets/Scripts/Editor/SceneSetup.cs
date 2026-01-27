using UnityEngine;
using UnityEditor;
using UnityEngine.UI;

public class SceneSetup
{
    [MenuItem("PÁ PÁ PÁ/Setup Game Scene")]
    public static void SetupGameScene()
    {
        CreateCamera();
        CreatePlayer();
        CreateArena();
        CreateGameManager();
        CreateCanvas();
        CreateEventSystem();
        
        UnityEditor.SceneManagement.EditorSceneManager.MarkSceneDirty(
            UnityEngine.SceneManagement.SceneManager.GetActiveScene()
        );
        
        Debug.Log("✓ Game scene setup complete! Save the scene as 'Game.unity'");
    }

    static void CreateCamera()
    {
        GameObject cam = GameObject.Find("Main Camera");
        if (cam == null)
        {
            cam = new GameObject("Main Camera");
            cam.AddComponent<Camera>();
            cam.tag = "MainCamera";
        }
        
        Camera camera = cam.GetComponent<Camera>();
        camera.orthographic = true;
        camera.orthographicSize = 5.4f;
        camera.backgroundColor = new Color(0.1f, 0.05f, 0.15f);
        camera.transform.position = new Vector3(0, 0, -10);
        
        Debug.Log("✓ Camera configured");
    }

    static void CreatePlayer()
    {
        if (GameObject.Find("Player") != null)
        {
            Debug.Log("✓ Player already exists");
            return;
        }
        
        GameObject player = new GameObject("Player");
        player.tag = "Player";
        player.layer = LayerMask.NameToLayer("Player");
        
        SpriteRenderer sr = player.AddComponent<SpriteRenderer>();
        sr.sortingOrder = 10;
        sr.color = Color.yellow;
        
        Rigidbody2D rb = player.AddComponent<Rigidbody2D>();
        rb.gravityScale = 0;
        rb.constraints = RigidbodyConstraints2D.FreezeRotation;
        rb.collisionDetectionMode = CollisionDetectionMode2D.Continuous;
        
        CircleCollider2D col = player.AddComponent<CircleCollider2D>();
        col.radius = 0.4f;
        
        player.transform.position = Vector3.zero;
        Debug.Log("✓ Player GameObject created");
    }

    static void CreateArena()
    {
        if (GameObject.Find("Arena") != null)
        {
            Debug.Log("✓ Arena already exists");
            return;
        }
        
        GameObject arena = new GameObject("Arena");
        arena.tag = "Arena";
        
        CreateWall(arena.transform, "WallTop", new Vector3(0, 4, 0), new Vector2(12, 0.5f));
        CreateWall(arena.transform, "WallBottom", new Vector3(0, -4, 0), new Vector2(12, 0.5f));
        CreateWall(arena.transform, "WallLeft", new Vector3(-6, 0, 0), new Vector2(0.5f, 8));
        CreateWall(arena.transform, "WallRight", new Vector3(6, 0, 0), new Vector2(0.5f, 8));
        
        GameObject spawns = new GameObject("SpawnPoints");
        spawns.transform.parent = arena.transform;
        
        Vector3[] spawnPositions = {
            new Vector3(-4, 3, 0), new Vector3(4, 3, 0),
            new Vector3(-4, -3, 0), new Vector3(4, -3, 0),
            new Vector3(-5, 0, 0), new Vector3(5, 0, 0)
        };
        
        for (int i = 0; i < spawnPositions.Length; i++)
        {
            GameObject spawn = new GameObject($"Spawn{i + 1}");
            spawn.transform.parent = spawns.transform;
            spawn.transform.position = spawnPositions[i];
        }
        
        Debug.Log("✓ Arena created (12x8 units with 6 spawn points)");
    }

    static void CreateWall(Transform parent, string name, Vector3 position, Vector2 size)
    {
        GameObject wall = new GameObject(name);
        wall.transform.parent = parent;
        wall.transform.position = position;
        wall.layer = LayerMask.NameToLayer("Arena");
        
        SpriteRenderer sr = wall.AddComponent<SpriteRenderer>();
        sr.color = new Color(0.3f, 0.2f, 0.4f);
        sr.sortingOrder = -1;
        
        BoxCollider2D col = wall.AddComponent<BoxCollider2D>();
        col.size = size;
    }

    static void CreateGameManager()
    {
        if (GameObject.Find("GameManager") != null)
        {
            Debug.Log("✓ GameManager already exists");
            return;
        }
        
        GameObject gm = new GameObject("GameManager");
        Debug.Log("✓ GameManager created");
    }

    static void CreateCanvas()
    {
        if (GameObject.Find("Canvas") != null)
        {
            Debug.Log("✓ Canvas already exists");
            return;
        }
        
        GameObject canvas = new GameObject("Canvas");
        Canvas c = canvas.AddComponent<Canvas>();
        c.renderMode = RenderMode.ScreenSpaceOverlay;
        canvas.AddComponent<CanvasScaler>();
        canvas.AddComponent<GraphicRaycaster>();
        
        CanvasScaler scaler = canvas.GetComponent<CanvasScaler>();
        scaler.uiScaleMode = CanvasScaler.ScaleMode.ScaleWithScreenSize;
        scaler.referenceResolution = new Vector2(960, 540);
        
        GameObject hud = new GameObject("HUD");
        hud.transform.SetParent(canvas.transform, false);
        
        CreateHUDElement(hud.transform, "Hearts", new Vector2(0, 1), new Vector2(20, -20), new Vector2(150, 40));
        CreateHUDElement(hud.transform, "AudienceBar", new Vector2(0.5f, 1), new Vector2(0, -20), new Vector2(300, 30));
        CreateHUDElement(hud.transform, "MaskSlots", new Vector2(1, 1), new Vector2(-20, -20), new Vector2(200, 40));
        CreateHUDElement(hud.transform, "WaveInfo", new Vector2(1, 0), new Vector2(-20, 20), new Vector2(150, 40));
        
        Debug.Log("✓ Canvas and HUD structure created");
    }

    static void CreateHUDElement(Transform parent, string name, Vector2 anchor, Vector2 position, Vector2 size)
    {
        GameObject obj = new GameObject(name);
        obj.transform.SetParent(parent, false);
        RectTransform rect = obj.AddComponent<RectTransform>();
        rect.anchorMin = anchor;
        rect.anchorMax = anchor;
        rect.pivot = anchor;
        rect.anchoredPosition = position;
        rect.sizeDelta = size;
    }

    static void CreateEventSystem()
    {
        if (GameObject.Find("EventSystem") != null)
        {
            Debug.Log("✓ EventSystem already exists");
            return;
        }
        
        GameObject eventSystem = new GameObject("EventSystem");
        eventSystem.AddComponent<UnityEngine.EventSystems.EventSystem>();
        eventSystem.AddComponent<UnityEngine.EventSystems.StandaloneInputModule>();
        Debug.Log("✓ EventSystem created");
    }
}
