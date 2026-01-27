using UnityEngine;
using UnityEngine.SceneManagement;

// Script para garantir que SEMPRE inicia na MainMenu
[DefaultExecutionOrder(-1000)]
public class ForceMainMenu : MonoBehaviour
{
    [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.BeforeSceneLoad)]
    static void OnBeforeSceneLoadRuntimeMethod()
    {
        Debug.LogWarning("🎯 ForceMainMenu: Forçando load da MainMenu!");
        
        // Se não estiver na MainMenu, carrega ela
        Scene currentScene = SceneManager.GetActiveScene();
        Debug.LogWarning($"🎬 Cena atual: {currentScene.name}");
        
        if (currentScene.name != "MainMenu")
        {
            Debug.LogWarning("⚠️ Não está na MainMenu! Carregando...");
            SceneManager.LoadScene("MainMenu");
        }
        else
        {
            Debug.LogWarning("✅ Já está na MainMenu!");
        }
    }
}
