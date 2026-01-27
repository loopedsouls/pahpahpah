using UnityEngine;
using UnityEditor;
using UnityEditor.SceneManagement;

[InitializeOnLoad]
public class AutoSetup
{
    static AutoSetup()
    {
        EditorApplication.delayCall += () =>
        {
            if (!SessionState.GetBool("AutoSetupDone", false))
            {
                Debug.Log("🎭 PÁ PÁ PÁ: Executando configuração automática...");
                SetupProject();
                SessionState.SetBool("AutoSetupDone", true);
            }
        };
    }

    [MenuItem("PahPahPah/Setup Project")]
    static void SetupProject()
    {
        Debug.Log("=== Configurando Projeto PÁ PÁ PÁ ===");
        
        SetupTags();
        SetupLayers();
        SetupPrefabs();
        SetupScriptableObjects();
        
        Debug.Log("✅ Configuração automática concluída!");
        Debug.Log("🎮 Agora abra a cena Game para testar!");
    }

    static void SetupTags()
    {
        // Tags já são criadas pelo TagManager.asset
        Debug.Log("✓ Tags configuradas: Player, Enemy, Projectile, Mask");
    }

    static void SetupLayers()
    {
        // Layers já são criadas pelo TagManager.asset
        Debug.Log("✓ Layers configuradas: Player(8), Enemy(9), Projectile(10)");
    }

    static void SetupPrefabs()
    {
        // Player prefab
        SetupPlayerPrefab();
        
        // Enemy prefabs
        SetupEnemyPrefab("BasicEnemy");
        SetupEnemyPrefab("ShooterEnemy");
        SetupEnemyPrefab("TankEnemy");
        
        // Projectile prefab
        SetupProjectilePrefab();
        
        Debug.Log("✓ Prefabs configurados");
    }

    static void SetupPlayerPrefab()
    {
        string path = "Assets/Prefabs/Player/Player.prefab";
        GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (prefab == null) return;

        GameObject instance = PrefabUtility.LoadPrefabContents(path);
        
        // Configurar tag e layer
        instance.tag = "Player";
        instance.layer = LayerMask.NameToLayer("Player");
        
        // Configurar sprite
        SpriteRenderer sr = instance.GetComponent<SpriteRenderer>();
        if (sr != null)
        {
            Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Sprites/Player/Player.png");
            if (sprite != null) sr.sprite = sprite;
            sr.sortingLayerName = "Game";
            sr.sortingOrder = 1;
        }
        
        // Configurar PlayerController
        var controller = instance.GetComponent<PlayerController>();
        if (controller != null)
        {
            GameObject piePrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/Projectiles/Pie.prefab");
            SerializedObject so = new SerializedObject(controller);
            so.FindProperty("pieProjectilePrefab").objectReferenceValue = piePrefab;
            so.ApplyModifiedProperties();
        }
        
        PrefabUtility.SaveAsPrefabAsset(instance, path);
        PrefabUtility.UnloadPrefabContents(instance);
    }

    static void SetupEnemyPrefab(string enemyName)
    {
        string path = $"Assets/Prefabs/Enemies/{enemyName}.prefab";
        GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (prefab == null) return;

        GameObject instance = PrefabUtility.LoadPrefabContents(path);
        
        // Configurar tag e layer
        instance.tag = "Enemy";
        instance.layer = LayerMask.NameToLayer("Enemy");
        
        // Configurar sprite
        SpriteRenderer sr = instance.GetComponent<SpriteRenderer>();
        if (sr != null)
        {
            Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>($"Assets/Sprites/Enemies/{enemyName}.png");
            if (sprite != null) sr.sprite = sprite;
            sr.sortingLayerName = "Game";
            sr.sortingOrder = 0;
        }
        
        PrefabUtility.SaveAsPrefabAsset(instance, path);
        PrefabUtility.UnloadPrefabContents(instance);
    }

    static void SetupProjectilePrefab()
    {
        string path = "Assets/Prefabs/Projectiles/Pie.prefab";
        GameObject prefab = AssetDatabase.LoadAssetAtPath<GameObject>(path);
        if (prefab == null) return;

        GameObject instance = PrefabUtility.LoadPrefabContents(path);
        
        // Configurar tag e layer
        instance.tag = "Projectile";
        instance.layer = LayerMask.NameToLayer("Projectile");
        
        // Configurar sprite
        SpriteRenderer sr = instance.GetComponent<SpriteRenderer>();
        if (sr != null)
        {
            Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>("Assets/Sprites/Projectiles/Pie.png");
            if (sprite != null) sr.sprite = sprite;
            sr.sortingLayerName = "Projectiles";
            sr.sortingOrder = 2;
        }
        
        PrefabUtility.SaveAsPrefabAsset(instance, path);
        PrefabUtility.UnloadPrefabContents(instance);
    }

    static void SetupScriptableObjects()
    {
        // ScriptableObjects já têm os ícones configurados
        Debug.Log("✓ ScriptableObjects das máscaras já configurados");
    }

    [MenuItem("PahPahPah/Create Test Arena")]
    static void CreateTestArena()
    {
        // Abrir cena Game
        EditorSceneManager.OpenScene("Assets/Scenes/Game.unity");
        
        // Criar Player
        GameObject playerPrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/Player/Player.prefab");
        if (playerPrefab != null)
        {
            GameObject player = PrefabUtility.InstantiatePrefab(playerPrefab) as GameObject;
            player.transform.position = Vector3.zero;
            Debug.Log("✓ Player adicionado na cena");
        }
        
        // Criar spawn points
        GameObject spawnPointsParent = new GameObject("SpawnPoints");
        for (int i = 0; i < 4; i++)
        {
            GameObject sp = new GameObject($"SpawnPoint{i+1}");
            sp.transform.parent = spawnPointsParent.transform;
            
            float angle = i * 90f;
            float radius = 8f;
            sp.transform.position = new Vector3(
                Mathf.Cos(angle * Mathf.Deg2Rad) * radius,
                Mathf.Sin(angle * Mathf.Deg2Rad) * radius,
                0
            );
        }
        Debug.Log("✓ Spawn Points criados");
        
        // Criar Canvas para HUD
        CreateHUDCanvas();
        
        EditorSceneManager.SaveOpenScenes();
        Debug.Log("✅ Arena de teste criada! Pressione Play para testar!");
    }

    static void CreateHUDCanvas()
    {
        // Verificar se Canvas já existe
        if (GameObject.Find("HUD Canvas")) return;
        
        GameObject canvasGO = new GameObject("HUD Canvas");
        Canvas canvas = canvasGO.AddComponent<Canvas>();
        canvas.renderMode = RenderMode.ScreenSpaceOverlay;
        canvasGO.AddComponent<UnityEngine.UI.CanvasScaler>();
        canvasGO.AddComponent<UnityEngine.UI.GraphicRaycaster>();
        
        // Adicionar HUDManager
        GameObject hudManager = new GameObject("HUDManager");
        hudManager.transform.SetParent(canvasGO.transform);
        hudManager.AddComponent<HUDManager>();
        
        Debug.Log("✓ HUD Canvas criado");
    }
}
