using UnityEngine;

/// <summary>
/// Bootstrap que garante que o GameManager existe antes de qualquer coisa
/// </summary>
[DefaultExecutionOrder(-100)]
public class GameBootstrap : MonoBehaviour
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void Bootstrap()
    {
        Debug.Log("🚀 GameBootstrap: Inicializando sistemas...");
        
        // Criar GameManager se não existir
        if (GameManager.Instance == null)
        {
            GameObject gameManagerObj = new GameObject("GameManager");
            gameManagerObj.AddComponent<GameManager>();
            Debug.Log("✅ GameManager criado automaticamente");
        }
        else
        {
            Debug.Log("✅ GameManager já existe");
        }
    }
}
