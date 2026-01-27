using UnityEngine;
using UnityEditor;

public class ProjectSetup : MonoBehaviour
{
    [MenuItem("PÁ PÁ PÁ/Setup Project Configuration")]
    public static void SetupProject()
    {
        SetupTagsAndLayers();
        SetupPhysics2DMatrix();
        Debug.Log("✓ Project configuration complete!");
    }

    static void SetupTagsAndLayers()
    {
        SerializedObject tagManager = new SerializedObject(
            AssetDatabase.LoadAllAssetsAtPath("ProjectSettings/TagManager.asset")[0]
        );

        // Setup Tags
        string[] tags = { "Player", "Enemy", "Pie", "Mask", "Arena", "Audience" };
        SerializedProperty tagsProp = tagManager.FindProperty("tags");
        
        foreach (string tag in tags)
        {
            bool found = false;
            for (int i = 0; i < tagsProp.arraySize; i++)
            {
                if (tagsProp.GetArrayElementAtIndex(i).stringValue == tag)
                {
                    found = true;
                    break;
                }
            }
            
            if (!found)
            {
                tagsProp.InsertArrayElementAtIndex(tagsProp.arraySize);
                tagsProp.GetArrayElementAtIndex(tagsProp.arraySize - 1).stringValue = tag;
                Debug.Log($"Added tag: {tag}");
            }
        }

        // Setup Layers (indices 8-13 are user-defined)
        string[] layers = { "Player", "Enemy", "Projectile", "Mask", "Arena", "UI" };
        SerializedProperty layersProp = tagManager.FindProperty("layers");
        
        for (int i = 0; i < layers.Length && (8 + i) < 31; i++)
        {
            SerializedProperty layerProp = layersProp.GetArrayElementAtIndex(8 + i);
            if (string.IsNullOrEmpty(layerProp.stringValue))
            {
                layerProp.stringValue = layers[i];
                Debug.Log($"Added layer {8 + i}: {layers[i]}");
            }
        }

        tagManager.ApplyModifiedProperties();
        Debug.Log("✓ Tags and Layers configured");
    }

    static void SetupPhysics2DMatrix()
    {
        // Layer indices
        int playerLayer = LayerMask.NameToLayer("Player");
        int enemyLayer = LayerMask.NameToLayer("Enemy");
        int projectileLayer = LayerMask.NameToLayer("Projectile");
        int maskLayer = LayerMask.NameToLayer("Mask");
        int arenaLayer = LayerMask.NameToLayer("Arena");

        // Configure collision matrix
        // Player collides with: Enemy, Mask, Arena
        if (playerLayer >= 0 && enemyLayer >= 0)
            Physics2D.IgnoreLayerCollision(playerLayer, enemyLayer, false);
        if (playerLayer >= 0 && projectileLayer >= 0)
            Physics2D.IgnoreLayerCollision(playerLayer, projectileLayer, true);
        if (playerLayer >= 0 && maskLayer >= 0)
            Physics2D.IgnoreLayerCollision(playerLayer, maskLayer, false);
        if (playerLayer >= 0 && arenaLayer >= 0)
            Physics2D.IgnoreLayerCollision(playerLayer, arenaLayer, false);

        // Enemy collides with: Player, Projectile, Arena
        if (enemyLayer >= 0 && projectileLayer >= 0)
            Physics2D.IgnoreLayerCollision(enemyLayer, projectileLayer, false);
        if (enemyLayer >= 0 && maskLayer >= 0)
            Physics2D.IgnoreLayerCollision(enemyLayer, maskLayer, true);
        if (enemyLayer >= 0 && arenaLayer >= 0)
            Physics2D.IgnoreLayerCollision(enemyLayer, arenaLayer, false);
        if (enemyLayer >= 0)
            Physics2D.IgnoreLayerCollision(enemyLayer, enemyLayer, true);

        // Projectile collides with: Enemy, Arena only
        if (projectileLayer >= 0 && maskLayer >= 0)
            Physics2D.IgnoreLayerCollision(projectileLayer, maskLayer, true);
        if (projectileLayer >= 0 && arenaLayer >= 0)
            Physics2D.IgnoreLayerCollision(projectileLayer, arenaLayer, false);
        if (projectileLayer >= 0)
            Physics2D.IgnoreLayerCollision(projectileLayer, projectileLayer, true);

        // Mask doesn't collide with anything (trigger only)
        if (maskLayer >= 0 && arenaLayer >= 0)
            Physics2D.IgnoreLayerCollision(maskLayer, arenaLayer, true);
        if (maskLayer >= 0)
            Physics2D.IgnoreLayerCollision(maskLayer, maskLayer, true);

        Debug.Log("✓ Physics2D collision matrix configured");
    }
}
