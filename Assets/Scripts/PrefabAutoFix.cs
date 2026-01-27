using UnityEngine;

#if UNITY_EDITOR
using UnityEditor;
#endif

/// <summary>
/// Este componente garante que os prefabs tenham referências corretas mesmo sem configuração manual
/// </summary>
public class PrefabAutoFix : MonoBehaviour
{
    private void Awake()
    {
        FixPlayerReferences();
        FixSpriteReferences();
    }

    private void FixPlayerReferences()
    {
        if (CompareTag("Player"))
        {
            var controller = GetComponent<PlayerController>();
            if (controller != null)
            {
                // Se não tem pie prefab, tentar encontrar
                if (controller.GetType().GetField("pieProjectilePrefab", 
                    System.Reflection.BindingFlags.NonPublic | 
                    System.Reflection.BindingFlags.Instance)?.GetValue(controller) == null)
                {
                    #if UNITY_EDITOR
                    var piePrefab = AssetDatabase.LoadAssetAtPath<GameObject>("Assets/Prefabs/Projectiles/Pie.prefab");
                    if (piePrefab != null)
                    {
                        var field = controller.GetType().GetField("pieProjectilePrefab", 
                            System.Reflection.BindingFlags.NonPublic | 
                            System.Reflection.BindingFlags.Instance);
                        field?.SetValue(controller, piePrefab);
                        Debug.Log("✓ Pie prefab referência corrigida automaticamente");
                    }
                    #endif
                }
            }
        }
    }

    private void FixSpriteReferences()
    {
        var sr = GetComponent<SpriteRenderer>();
        if (sr != null && sr.sprite == null)
        {
            #if UNITY_EDITOR
            string spritePath = "";
            
            if (CompareTag("Player"))
                spritePath = "Assets/Sprites/Player/Player.png";
            else if (name.Contains("Basic"))
                spritePath = "Assets/Sprites/Enemies/BasicEnemy.png";
            else if (name.Contains("Shooter"))
                spritePath = "Assets/Sprites/Enemies/ShooterEnemy.png";
            else if (name.Contains("Tank"))
                spritePath = "Assets/Sprites/Enemies/TankEnemy.png";
            else if (name.Contains("Pie"))
                spritePath = "Assets/Sprites/Projectiles/Pie.png";
            
            if (!string.IsNullOrEmpty(spritePath))
            {
                Sprite sprite = AssetDatabase.LoadAssetAtPath<Sprite>(spritePath);
                if (sprite != null)
                {
                    sr.sprite = sprite;
                    Debug.Log($"✓ Sprite de {name} carregado automaticamente");
                }
            }
            #else
            // Em runtime sem sprite, criar placeholder colorido
            CreatePlaceholderSprite();
            #endif
        }
    }

    private void CreatePlaceholderSprite()
    {
        var sr = GetComponent<SpriteRenderer>();
        if (sr == null || sr.sprite != null) return;

        // Criar sprite placeholder 16x16
        Texture2D tex = new Texture2D(16, 16);
        Color color = Color.white;

        if (CompareTag("Player")) color = new Color(0.2f, 0.6f, 1f); // Azul
        else if (CompareTag("Enemy")) color = new Color(1f, 0.2f, 0.2f); // Vermelho
        else if (CompareTag("Projectile")) color = new Color(1f, 1f, 0.8f); // Creme

        for (int x = 0; x < 16; x++)
            for (int y = 0; y < 16; y++)
                tex.SetPixel(x, y, color);
        
        tex.Apply();
        tex.filterMode = FilterMode.Point;

        Sprite sprite = Sprite.Create(tex, new Rect(0, 0, 16, 16), new Vector2(0.5f, 0.5f), 100);
        sr.sprite = sprite;
        
        Debug.Log($"✓ Placeholder sprite criado para {name}");
    }
}
